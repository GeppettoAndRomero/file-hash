/**
 * Hashing engine — pure functions, no DOM/Preact. This is the whole "conversion"
 * for this tool: read a file, produce SHA-256, SHA-1 and MD5 hex digests.
 *
 * SHA-256 / SHA-1: the browser's native `crypto.subtle.digest` over the file's
 * full `arrayBuffer()`. SubtleCrypto has no incremental/streaming digest API, so
 * this is NOT a true streaming implementation — the whole file is read into
 * memory first (confirmed design, issue #22). For files over
 * `LARGE_FILE_THRESHOLD_BYTES` the UI shows a non-blocking warning about this
 * instead of silently hanging or crashing.
 *
 * MD5: SubtleCrypto has no MD5 (it was dropped from the spec), so this uses
 * spark-md5 (MIT) instead, in its incremental/chunked mode: the file is read in
 * bounded `file.slice()` chunks fed to `SparkMD5.ArrayBuffer#append`, so MD5
 * specifically never holds the whole file in memory at once — unlike the
 * SHA-256/SHA-1 path above.
 *
 * No Web Worker: this was a deliberate, measured call, not a default. SubtleCrypto's
 * own digest work already runs off the observable main JS thread in real browsers
 * (the Promise resolves once the native crypto library finishes; JS execution isn't
 * blocked while it runs). For the MD5 loop, a Node benchmark of spark-md5 (a proxy
 * for desktop V8 performance) with 2MB chunks showed the longest *synchronous*
 * per-chunk `append()` call taking roughly 5-25ms even for gigabyte-scale input,
 * with a genuine task-queue yield (`await chunk.arrayBuffer()`, a real async file
 * read, not just a microtask) between every chunk. That is well under the ~50ms
 * jank budget, so a worker/postMessage protocol would add complexity without a
 * measurable responsiveness win here — unlike e.g. heic-to-jpg's WASM decode,
 * which is genuinely long-running synchronous work.
 */
import SparkMD5 from 'spark-md5';

/** Per the confirmed design: files over this size get a "reads the whole file
 * into memory" warning for the SHA-256/SHA-1 path. */
export const LARGE_FILE_THRESHOLD_BYTES = 200 * 1024 * 1024; // 200MB

/** Chunk size for the incremental MD5 read. Small enough to keep any single
 * main-thread block well under a frame budget, large enough to keep the chunk
 * count (and per-chunk overhead) reasonable for multi-GB files. */
const MD5_CHUNK_SIZE = 2 * 1024 * 1024; // 2MB

export function isLargeFile(size: number): boolean {
  return size > LARGE_FILE_THRESHOLD_BYTES;
}

/** Lowercase hex string for a digest buffer. */
export function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
  return hex;
}

export interface ShaDigests {
  sha256: string;
  sha1: string;
}

/**
 * Reads the whole file into memory once and computes SHA-256 + SHA-1 from the
 * same buffer — `SubtleCrypto.digest` reads its input without consuming or
 * transferring it, so one `arrayBuffer()` read safely serves both digests.
 */
export async function computeShaDigests(file: File): Promise<ShaDigests> {
  const buffer = await file.arrayBuffer();
  const [sha256, sha1] = await Promise.all([
    crypto.subtle.digest('SHA-256', buffer),
    crypto.subtle.digest('SHA-1', buffer),
  ]);
  return { sha256: bufferToHex(sha256), sha1: bufferToHex(sha1) };
}

/**
 * Computes MD5 incrementally via spark-md5, reading the file in bounded chunks
 * so peak memory stays near one chunk regardless of file size. `onProgress`
 * (0..1) is optional and lets the UI show progress for large files.
 */
export async function computeMd5Chunked(
  file: File,
  onProgress?: (ratio: number) => void,
  chunkSize: number = MD5_CHUNK_SIZE
): Promise<string> {
  const spark = new SparkMD5.ArrayBuffer();
  let offset = 0;
  // A zero-byte file: the loop body never runs; spark.end() below returns the
  // well-defined MD5 of an empty input, matching the SHA-256/SHA-1 path.
  while (offset < file.size) {
    const end = Math.min(offset + chunkSize, file.size);
    const chunk = await file.slice(offset, end).arrayBuffer();
    spark.append(chunk);
    offset = end;
    onProgress?.(offset / file.size);
  }
  onProgress?.(1);
  return spark.end();
}

export type ExpectedAlgorithm = 'md5' | 'sha256';

const HEX_RE = /^[0-9a-f]+$/i;

/**
 * Auto-detects which algorithm a pasted "expected hash" string matches, purely
 * by trimmed length — the two lengths named in the confirmed design: 32 hex
 * chars = MD5, 64 hex chars = SHA-256. Anything else (wrong length, or any
 * non-hex character) returns null so the UI can show a neutral hint instead of
 * a misleading match/mismatch.
 */
export function detectExpectedAlgorithm(expected: string): ExpectedAlgorithm | null {
  const trimmed = expected.trim();
  if (!HEX_RE.test(trimmed)) return null;
  if (trimmed.length === 32) return 'md5';
  if (trimmed.length === 64) return 'sha256';
  return null;
}

export interface CompareResult {
  algorithm: ExpectedAlgorithm | null;
  /** true = match, false = mismatch, null = nothing to compare (empty or unrecognized input). */
  match: boolean | null;
}

/** Compares a pasted expected-hash string against the computed MD5/SHA-256 digests. */
export function compareHash(
  expected: string,
  digests: { md5: string; sha256: string }
): CompareResult {
  const trimmed = expected.trim();
  if (trimmed === '') return { algorithm: null, match: null };
  const algorithm = detectExpectedAlgorithm(trimmed);
  if (!algorithm) return { algorithm: null, match: null };
  const actual = algorithm === 'md5' ? digests.md5 : digests.sha256;
  return { algorithm, match: actual.toLowerCase() === trimmed.toLowerCase() };
}
