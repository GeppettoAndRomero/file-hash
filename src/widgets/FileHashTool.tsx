/**
 * FileHashTool — the tool's only non-frozen widget.
 *
 * Picks or drops a single file (the frozen GlobalDropZone's `filesDropped`
 * CustomEvent<File[]>) and computes SHA-256, SHA-1 and MD5, all shown at once
 * (confirmed design, issue #22 — no algorithm toggle). The heavy lifting lives
 * in `utils/hashEngine.ts`: SHA-256/SHA-1 via `crypto.subtle.digest` on the
 * file's full `arrayBuffer()`, MD5 via spark-md5's incremental/chunked API so
 * it alone stays memory-safe on very large files. Files over 200MB get a
 * non-blocking warning that the whole file must be read into memory for the
 * SHA path (native SubtleCrypto has no streaming digest).
 *
 * A pasted "expected hash" is auto-matched by length (32 hex = MD5, 64 hex =
 * SHA-256) against the computed digests and shown as a match/mismatch badge —
 * the concrete "verify a download" use case from the tool's issue.
 */
import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import { AppCard } from './AppCard';
import { AppField } from './AppField';
import { ui } from '@/i18n/ui';
import { validateFile } from '@/utils/fileValidation';
import {
  computeShaDigests,
  computeMd5Chunked,
  isLargeFile,
  compareHash,
} from '@/utils/hashEngine';

type Status = 'idle' | 'hashing' | 'ready';
type CopyField = 'sha256' | 'sha1' | 'md5';

interface Digests {
  sha256: string;
  sha1: string;
  md5: string;
}

interface ReadyState {
  fileName: string;
  fileSize: number;
  digests: Digests;
}

interface FileHashToolProps {
  locale?: string;
}

/** Human-readable size, e.g. "1.4 MB". Matches the fleet's plain, factual tone. */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exp;
  return `${exp === 0 ? value : value.toFixed(value < 10 ? 2 : 1)} ${units[exp]}`;
}

export function FileHashTool({ locale = 'en' }: FileHashToolProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState<ReadyState | null>(null);
  const [errorName, setErrorName] = useState('');
  const [hasError, setHasError] = useState(false);
  const [largeFile, setLargeFile] = useState(false);
  const [expected, setExpected] = useState('');
  const [copiedField, setCopiedField] = useState<CopyField | null>(null);

  const requestIdRef = useRef(0);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finish = useCallback(() => {
    window.dispatchEvent(new CustomEvent('filesProcessed'));
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current++; // supersede any in-flight hashing
    setStatus('idle');
    setProgress(0);
    setReady(null);
    setHasError(false);
    setErrorName('');
    setLargeFile(false);
    setExpected('');
    const input = document.getElementById('file-hash-input') as HTMLInputElement | null;
    if (input) input.value = '';
  }, []);

  const handleFile = useCallback(async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setReady(null);
      setErrorName(file.name);
      setHasError(true);
      return;
    }

    const requestId = ++requestIdRef.current;
    setReady(null);
    setHasError(false);
    setExpected('');
    setLargeFile(isLargeFile(file.size));
    setProgress(0);
    setStatus('hashing');

    try {
      const [shaDigests, md5] = await Promise.all([
        computeShaDigests(file),
        computeMd5Chunked(file, (ratio) => {
          if (requestId === requestIdRef.current) setProgress(ratio);
        }),
      ]);
      if (requestId !== requestIdRef.current) return; // superseded by a newer file
      setReady({
        fileName: file.name,
        fileSize: file.size,
        digests: { ...shaDigests, md5 },
      });
      setStatus('ready');
    } catch {
      if (requestId !== requestIdRef.current) return;
      setErrorName(file.name);
      setHasError(true);
      setStatus('idle');
    }
  }, []);

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length > 0) await handleFile(files[0]);
      finish();
    },
    [handleFile, finish]
  );

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<File[]>).detail;
      void handleFiles(detail ?? []);
    };
    window.addEventListener('filesDropped', handler);
    return () => window.removeEventListener('filesDropped', handler);
  }, [handleFiles]);

  const onPick = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    void handleFiles(files);
    input.value = '';
  };

  const handleCopy = async (field: CopyField, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Clipboard access can be denied/unavailable; the value is still
      // selectable text on screen, so this is a silent no-op, not an error.
    }
  };

  const compareResult = useMemo(
    () => (ready ? compareHash(expected, { md5: ready.digests.md5, sha256: ready.digests.sha256 }) : null),
    [expected, ready]
  );

  const compareBadge = () => {
    if (!ready || expected.trim() === '') return null;
    if (!compareResult || compareResult.algorithm === null) {
      return (
        <p class="hash-badge hash-badge--neutral" data-testid="compare-badge" role="status">
          {t.compareUnrecognized}
        </p>
      );
    }
    const algoLabel = compareResult.algorithm === 'md5' ? t.md5Label : t.sha256Label;
    return compareResult.match ? (
      <p class="hash-badge hash-badge--match" data-testid="compare-badge" role="status">
        <span aria-hidden="true">✓</span> {t.compareMatch.replace('{algorithm}', algoLabel)}
      </p>
    ) : (
      <p class="hash-badge hash-badge--mismatch" data-testid="compare-badge" role="status">
        <span aria-hidden="true">✗</span> {t.compareMismatch.replace('{algorithm}', algoLabel)}
      </p>
    );
  };

  const hashRow = (field: CopyField, label: string, value: string) => (
    <div class="hash-row">
      <span class="hash-row__label">{label}</span>
      <code class="hash-row__value" data-testid={`${field}-value`}>
        {value}
      </code>
      <button
        type="button"
        class="app-button app-button--ghost hash-row__copy"
        data-testid={`copy-${field}`}
        onClick={() => handleCopy(field, value)}
        aria-label={`${t.copyLabel} ${label}`}
      >
        {copiedField === field ? t.copiedLabel : t.copyLabel}
      </button>
    </div>
  );

  return (
    <div>
      <AppCard>
        <div style="margin-bottom: var(--space-4);">
          <h2 style="margin: 0 0 var(--space-1) 0; font-size: var(--fs-4); font-weight: 600;">
            {t.uploadHeading}
          </h2>
          <p style="margin: 0; font-size: var(--fs-2); color: var(--color-subtle);">
            {t.uploadSubtitle}
          </p>
        </div>

        <button
          type="button"
          class="hash-dropzone"
          onClick={() => document.getElementById('file-hash-input')?.click()}
          disabled={status === 'hashing'}
        >
          <span class="hash-dropzone__icon" aria-hidden="true">
            🔑
          </span>
          <span class="hash-dropzone__title">
            {status === 'hashing' ? t.hashingLabel : t.dropClick}
          </span>
          <span class="hash-dropzone__hint">{t.dropOr}</span>
          <span class="hash-dropzone__hint">{t.dropSupported}</span>
        </button>
        <input
          id="file-hash-input"
          type="file"
          onChange={onPick}
          disabled={status === 'hashing'}
          style="display: none;"
        />

        {status === 'hashing' && (
          <div class="app-progress" style="margin-top: var(--space-4);" data-testid="hashing-progress">
            <div class="app-progress__bar" style={`width: ${Math.round(progress * 100)}%`} />
          </div>
        )}
      </AppCard>

      {hasError && (
        <div class="hash-error" role="alert" data-testid="error">
          <span class="hash-error__icon" aria-hidden="true">
            ⚠
          </span>
          <span data-testid="error-message">{t.errUnreadable.replace('{name}', errorName)}</span>
        </div>
      )}

      {ready && (
        <AppCard className="mt-6">
          <div class="hash-meta">
            <span class="hash-meta__file" title={ready.fileName} data-testid="file-name">
              {ready.fileName}
            </span>
            <span class="hash-meta__size num" data-testid="file-size">
              {formatBytes(ready.fileSize)}
            </span>
          </div>

          {largeFile && (
            <p class="hash-warning" role="status" data-testid="large-file-warning">
              <span aria-hidden="true">ℹ</span> {t.largeFileWarning}
            </p>
          )}

          <div class="hash-results">
            {hashRow('sha256', t.sha256Label, ready.digests.sha256)}
            {hashRow('sha1', t.sha1Label, ready.digests.sha1)}
            {hashRow('md5', t.md5Label, ready.digests.md5)}
          </div>

          <div class="hash-compare">
            <AppField
              id="compare-input"
              label={t.compareHeading}
              type="text"
              value={expected}
              onChange={(v) => setExpected(String(v))}
              placeholder={t.comparePlaceholder}
              helpText={t.compareHelp}
              locale={locale}
            />
            {compareBadge()}
          </div>

          <div style="display: flex; justify-content: flex-end; margin-top: var(--space-4);">
            <button
              type="button"
              class="app-button app-button--secondary"
              data-testid="hash-another"
              onClick={() => {
                reset();
                document.getElementById('file-hash-input')?.click();
              }}
            >
              {t.hashAnother}
            </button>
          </div>
        </AppCard>
      )}

      <style>{`
        .hash-dropzone {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-1);
          width: 100%;
          min-height: 180px;
          padding: var(--space-6);
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          background-color: var(--color-bg);
          cursor: pointer;
          text-align: center;
          transition: all var(--dur-fast) var(--ease);
        }
        .hash-dropzone:hover:not(:disabled) {
          border-color: var(--color-primary);
          background-color: color-mix(in srgb, var(--color-primary) 5%, var(--color-bg));
        }
        .hash-dropzone:focus-visible {
          outline: 2px solid var(--color-focus);
          outline-offset: 2px;
        }
        .hash-dropzone:disabled {
          cursor: wait;
          opacity: 0.7;
        }
        .hash-dropzone__icon {
          font-size: 3rem;
          line-height: 1;
          margin-bottom: var(--space-2);
          opacity: 0.7;
        }
        .hash-dropzone__title {
          font-size: var(--fs-3);
          font-weight: 600;
          color: var(--color-text);
        }
        .hash-dropzone__hint {
          font-size: var(--fs-1);
          color: var(--color-subtle);
        }
        .hash-error {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          margin-top: var(--space-6);
          padding: var(--space-4);
          background-color: color-mix(in srgb, var(--color-danger) 8%, var(--color-bg));
          border: 1px solid var(--color-danger);
          border-left: 4px solid var(--color-danger);
          border-radius: var(--radius-md);
          color: var(--color-text);
          font-size: var(--fs-2);
        }
        .hash-error__icon {
          color: var(--color-danger);
          font-size: var(--fs-3);
          line-height: 1.3;
          flex-shrink: 0;
        }
        .hash-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: var(--space-2) var(--space-4);
          margin-bottom: var(--space-4);
        }
        .hash-meta__file {
          font-weight: 600;
          font-size: var(--fs-3);
          color: var(--color-text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 100%;
        }
        .hash-meta__size {
          font-size: var(--fs-2);
          color: var(--color-subtle);
        }
        .hash-warning {
          display: flex;
          align-items: flex-start;
          gap: var(--space-2);
          margin: 0 0 var(--space-4) 0;
          padding: var(--space-3) var(--space-4);
          background-color: color-mix(in srgb, var(--color-warning) 12%, var(--color-bg));
          border: 1px solid var(--color-warning);
          border-radius: var(--radius-sm);
          font-size: var(--fs-2);
          color: var(--color-text);
        }
        .hash-results {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .hash-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-sm);
          flex-wrap: wrap;
        }
        .hash-row__label {
          flex: 0 0 auto;
          min-width: 5.5em;
          font-weight: 600;
          font-size: var(--fs-2);
          color: var(--color-subtle);
        }
        .hash-row__value {
          flex: 1 1 auto;
          min-width: 0;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: var(--fs-2);
          word-break: break-all;
          color: var(--color-text);
        }
        .hash-row__copy {
          flex: 0 0 auto;
        }
        .hash-compare {
          margin-top: var(--space-5);
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-border);
        }
        .hash-badge {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          margin: var(--space-3) 0 0 0;
          padding: var(--space-3);
          border-radius: var(--radius-sm);
          font-size: var(--fs-2);
          font-weight: 500;
        }
        .hash-badge--match {
          background-color: color-mix(in srgb, var(--color-success) 10%, var(--color-bg));
          border: 1px solid var(--color-success);
          color: var(--color-success);
        }
        .hash-badge--mismatch {
          background-color: color-mix(in srgb, var(--color-danger) 8%, var(--color-bg));
          border: 1px solid var(--color-danger);
          color: var(--color-danger);
        }
        .hash-badge--neutral {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          color: var(--color-subtle);
        }
      `}</style>
    </div>
  );
}
