import { describe, it, expect } from 'vitest';
import { validateFile } from '@/utils/fileValidation';

// Minimal File-like stub (only the field the validator reads).
const f = (size: number): File => ({ size }) as unknown as File;

describe('validateFile', () => {
  it('accepts a typical file of any type/extension (no accept-list for hashing)', () => {
    expect(validateFile(f(1024)).valid).toBe(true);
  });

  it('accepts a zero-byte file (MD5/SHA-256/SHA-1 of empty input are well-defined)', () => {
    expect(validateFile(f(0)).valid).toBe(true);
  });

  it('accepts a very large file (the size-based warning is a separate, non-blocking concern)', () => {
    expect(validateFile(f(5 * 1024 * 1024 * 1024)).valid).toBe(true);
  });

  it('rejects a degenerate File-like value with a non-finite size', () => {
    const result = validateFile(f(Number.NaN));
    expect(result.valid).toBe(false);
    expect(result.code).toBe('unreadable');
  });

  it('rejects a negative size', () => {
    const result = validateFile(f(-1));
    expect(result.valid).toBe(false);
    expect(result.code).toBe('unreadable');
  });
});
