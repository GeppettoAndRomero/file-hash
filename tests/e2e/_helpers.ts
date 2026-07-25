import { type Page } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

export const SAMPLE_B64 = readFileSync(
  fileURLToPath(new URL('../fixtures/sample.txt', import.meta.url))
).toString('base64');

/** Wait until the island has hydrated and the hashing subsystem is ready. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

/**
 * Feed the bundled sample file through the same path the drop zone uses, and
 * wait for the computed hashes to render. Unlike the image-conversion tools
 * this template was stamped from, there is no download — the result is shown
 * on the page — so this resolves once the SHA-256 value is visible rather
 * than on a `download` event. Used by generic (engine-independent)
 * covenant/i18n checks; conversion.spec.ts drives the real hashing/compare
 * behavior in more detail.
 */
export async function convert(page: Page): Promise<void> {
  await page.evaluate((b64) => {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const file = new File([bytes], 'sample.txt', { type: 'text/plain' });
    window.dispatchEvent(new CustomEvent('filesDropped', { detail: [file] }));
  }, SAMPLE_B64);
  await page.getByTestId('sha256-value').waitFor({ state: 'visible', timeout: 30_000 });
}
