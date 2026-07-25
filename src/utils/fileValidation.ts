/**
 * File-picker validation for the hash tool.
 *
 * Any file type can be hashed — there is no extension/MIME accept-list, unlike
 * e.g. csv-viewer's delimited-text check. Validation returns a stable machine
 * `code` (not a message) so the UI renders the localized string for the
 * current locale, matching the rest of the fleet's pattern. The only thing
 * this actually guards is a degenerate `File`-like value whose `size` isn't a
 * sane non-negative finite number — real picker/drop paths never produce one,
 * but a defensive check here means a corrupt input fails loudly with a clear
 * error instead of hanging in the hashing step.
 */

export type ValidationCode = 'unreadable';

export interface ValidationResult {
  valid: boolean;
  code?: ValidationCode;
}

export function validateFile(file: File): ValidationResult {
  if (typeof file.size !== 'number' || !Number.isFinite(file.size) || file.size < 0) {
    return { valid: false, code: 'unreadable' };
  }
  return { valid: true };
}
