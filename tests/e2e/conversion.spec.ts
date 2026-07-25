import { test, expect, type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { waitReady } from './_helpers';

const SAMPLE_PATH = fileURLToPath(new URL('../fixtures/sample.txt', import.meta.url));
const SAMPLE_BYTES = readFileSync(SAMPLE_PATH);
const SAMPLE_B64 = SAMPLE_BYTES.toString('base64');

// Independently computed from tests/fixtures/sample.txt with `shasum -a 256|1`,
// `md5`/`openssl dgst`, and Node's own crypto — all three agreed. This is the
// "real input, independently verified" hash-value check, not just "it runs".
const EXPECTED = {
  sha256: '37281b0c7c7ed41acbfac3dbed0c625313aafbc4dd929313fa9dc1e1c1bef6a4',
  sha1: '5eed8ff8ea06d2a259f34241b8feec386a0f8caf',
  md5: 'ec26218e128f91122108d430fd67fc2d',
};

/** Tracks every request that leaves the local origin (the no-upload covenant, #1). */
function trackExternal(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  return external;
}

async function dropSample(page: Page) {
  await page.evaluate((b64) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const file = new File([bytes], 'sample.txt', { type: 'text/plain' });
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
  }, SAMPLE_B64);
  await page.getByTestId('sha256-value').waitFor({ state: 'visible', timeout: 30_000 });
}

test.describe('hashing a real file', () => {
  test('computes correct SHA-256, SHA-1 and MD5 for a real file, with no upload', async ({ page }) => {
    const external = trackExternal(page);

    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await expect(page.getByTestId('file-name')).toHaveText('sample.txt');
    await expect(page.getByTestId('sha256-value')).toHaveText(EXPECTED.sha256);
    await expect(page.getByTestId('sha1-value')).toHaveText(EXPECTED.sha1);
    await expect(page.getByTestId('md5-value')).toHaveText(EXPECTED.md5);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('computes the well-known hashes of an empty file', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await page.evaluate(() => {
      const file = new File([], 'empty.bin');
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    });
    await page.getByTestId('sha256-value').waitFor({ state: 'visible' });

    await expect(page.getByTestId('sha256-value')).toHaveText(
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    );
    await expect(page.getByTestId('sha1-value')).toHaveText('da39a3ee5e6b4b0d3255bfef95601890afd80709');
    await expect(page.getByTestId('md5-value')).toHaveText('d41d8cd98f00b204e9800998ecf8427e');
  });

  test('"Hash another file" resets to the empty state', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.getByTestId('hash-another').click();
    await expect(page.getByTestId('sha256-value')).toHaveCount(0);
    await expect(page.getByTestId('file-name')).toHaveCount(0);
  });
});

test.describe('compare against an expected hash', () => {
  test('shows a match badge for the correct MD5', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.fill('#compare-input', EXPECTED.md5);
    const badge = page.getByTestId('compare-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('MD5');
  });

  test('shows a match badge for the correct SHA-256, case-insensitively', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.fill('#compare-input', EXPECTED.sha256.toUpperCase());
    const badge = page.getByTestId('compare-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('SHA-256');
  });

  test('shows a mismatch badge for a wrong hash of a recognized length', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.fill('#compare-input', '0'.repeat(64));
    const badge = page.getByTestId('compare-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("doesn't match");
  });

  test('shows a neutral hint for a string that is not 32 or 64 hex characters', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.fill('#compare-input', 'not-a-hash');
    const badge = page.getByTestId('compare-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("isn't 32 or 64 hex characters");
  });

  test('shows no badge when the field is empty', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);
    await expect(page.getByTestId('compare-badge')).toHaveCount(0);
  });
});

test.describe('large file (>200MB) warning', () => {
  test('shows the warning and still computes correct hashes for a file just over the threshold', async ({
    page,
  }) => {
    test.slow(); // hashing 205MB in-browser (chunked MD5 + native SHA) takes a bit longer than the default timeout budget

    const SIZE = 205 * 1024 * 1024; // comfortably over the 200MB threshold
    const expectedSha256 = createHash('sha256').update(Buffer.alloc(SIZE)).digest('hex');
    const expectedMd5 = createHash('md5').update(Buffer.alloc(SIZE)).digest('hex');

    await page.goto('/file-hash/');
    await waitReady(page);

    await page.evaluate((size) => {
      const file = new File([new Uint8Array(size)], 'big.bin');
      window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
    }, SIZE);

    await expect(page.getByTestId('large-file-warning')).toBeVisible();
    await page.getByTestId('sha256-value').waitFor({ state: 'visible', timeout: 60_000 });
    await expect(page.getByTestId('sha256-value')).toHaveText(expectedSha256);
    await expect(page.getByTestId('md5-value')).toHaveText(expectedMd5);
  });

  test('does not show the warning for a file at or under the threshold', async ({ page }) => {
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page); // tiny fixture file, well under 200MB
    await expect(page.getByTestId('large-file-warning')).toHaveCount(0);
  });
});

test.describe('copy to clipboard', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'chromium', 'clipboard permissions grant is chromium-only in Playwright');
  });

  test('copying SHA-256 puts the exact hash on the clipboard', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/file-hash/');
    await waitReady(page);
    await dropSample(page);

    await page.getByTestId('copy-sha256').click();
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(EXPECTED.sha256);
  });
});
