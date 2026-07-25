import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import {
  bufferToHex,
  computeShaDigests,
  computeMd5Chunked,
  isLargeFile,
  detectExpectedAlgorithm,
  compareHash,
  LARGE_FILE_THRESHOLD_BYTES,
} from '@/utils/hashEngine';

const FIXTURE_PATH = fileURLToPath(new URL('../fixtures/sample.txt', import.meta.url));
const FIXTURE_BYTES = readFileSync(FIXTURE_PATH);

// Node has a global `File` (since v20) backed by the same Blob machinery the
// browser uses, so these tests exercise the real `arrayBuffer()`/`slice()`
// code paths — not a hand-rolled stub.
function fixtureFile(): File {
  return new File([FIXTURE_BYTES], 'sample.txt');
}

// Values below were independently computed from tests/fixtures/sample.txt with
// three separate tools — `shasum -a 256|1`, `md5`/`openssl dgst`, and Node's
// own `crypto.createHash` — which all agreed. This is the "real input,
// independently verified" check, not just "the code runs without throwing".
const EXPECTED = {
  sha256: '37281b0c7c7ed41acbfac3dbed0c625313aafbc4dd929313fa9dc1e1c1bef6a4',
  sha1: '5eed8ff8ea06d2a259f34241b8feec386a0f8caf',
  md5: 'ec26218e128f91122108d430fd67fc2d',
};

describe('computeShaDigests', () => {
  it('computes the correct SHA-256 and SHA-1 for a real file', async () => {
    const digests = await computeShaDigests(fixtureFile());
    expect(digests.sha256).toBe(EXPECTED.sha256);
    expect(digests.sha1).toBe(EXPECTED.sha1);
  });

  it('computes the well-known SHA-256 of an empty file', async () => {
    const digests = await computeShaDigests(new File([], 'empty.bin'));
    expect(digests.sha256).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
  });
});

describe('computeMd5Chunked', () => {
  it('computes the correct MD5 for a real file', async () => {
    const md5 = await computeMd5Chunked(fixtureFile());
    expect(md5).toBe(EXPECTED.md5);
  });

  it('computes the well-known MD5 of an empty file', async () => {
    const md5 = await computeMd5Chunked(new File([], 'empty.bin'));
    expect(md5).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('produces the same digest regardless of chunk size (chunking is an implementation detail)', async () => {
    const big = 'x'.repeat(10_000);
    const file = new File([big], 'repeat.txt');
    const a = await computeMd5Chunked(file, undefined, 64);
    const b = await computeMd5Chunked(file, undefined, 4096);
    expect(a).toBe(b);
  });

  it('reports monotonic progress from >0 up to exactly 1', async () => {
    const file = new File(['x'.repeat(10_000)], 'repeat.txt');
    const seen: number[] = [];
    await computeMd5Chunked(file, (ratio) => seen.push(ratio), 1000);
    expect(seen.length).toBeGreaterThan(1);
    expect(seen[seen.length - 1]).toBe(1);
    for (let i = 1; i < seen.length; i++) expect(seen[i]).toBeGreaterThanOrEqual(seen[i - 1]);
  });
});

describe('bufferToHex', () => {
  it('renders bytes as lowercase, zero-padded hex', () => {
    expect(bufferToHex(new Uint8Array([0, 1, 15, 16, 255]).buffer)).toBe('00010f10ff');
  });
});

describe('isLargeFile', () => {
  it('is false at and below the threshold', () => {
    expect(isLargeFile(LARGE_FILE_THRESHOLD_BYTES)).toBe(false);
    expect(isLargeFile(LARGE_FILE_THRESHOLD_BYTES - 1)).toBe(false);
  });

  it('is true just above the threshold', () => {
    expect(isLargeFile(LARGE_FILE_THRESHOLD_BYTES + 1)).toBe(true);
  });
});

describe('detectExpectedAlgorithm', () => {
  it('detects MD5 by 32 hex chars', () => {
    expect(detectExpectedAlgorithm(EXPECTED.md5)).toBe('md5');
  });

  it('detects SHA-256 by 64 hex chars', () => {
    expect(detectExpectedAlgorithm(EXPECTED.sha256)).toBe('sha256');
  });

  it('is case-insensitive and tolerates surrounding whitespace', () => {
    expect(detectExpectedAlgorithm(`  ${EXPECTED.md5.toUpperCase()}  `)).toBe('md5');
  });

  it('returns null for a length that matches neither (e.g. SHA-1, 40 chars)', () => {
    expect(detectExpectedAlgorithm(EXPECTED.sha1)).toBeNull();
  });

  it('returns null for non-hex characters', () => {
    expect(detectExpectedAlgorithm('z'.repeat(32))).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(detectExpectedAlgorithm('')).toBeNull();
  });
});

describe('compareHash', () => {
  const digests = { md5: EXPECTED.md5, sha256: EXPECTED.sha256 };

  it('reports a match for the correct MD5', () => {
    expect(compareHash(EXPECTED.md5, digests)).toEqual({ algorithm: 'md5', match: true });
  });

  it('reports a match for the correct SHA-256, case-insensitively', () => {
    expect(compareHash(EXPECTED.sha256.toUpperCase(), digests)).toEqual({
      algorithm: 'sha256',
      match: true,
    });
  });

  it('reports a mismatch for a wrong hash of a recognized length', () => {
    const wrongMd5 = '0'.repeat(32);
    expect(compareHash(wrongMd5, digests)).toEqual({ algorithm: 'md5', match: false });
  });

  it('reports nothing to compare for an empty or unrecognized-length string', () => {
    expect(compareHash('', digests)).toEqual({ algorithm: null, match: null });
    expect(compareHash('not-a-hash', digests)).toEqual({ algorithm: null, match: null });
  });
});
