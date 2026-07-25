# file-hash

Compute a file's SHA-256, SHA-1 and MD5 hash, entirely in your browser, and compare it
against an expected value. Files are processed on your device and never uploaded. Open
source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

SHA-256 and SHA-1 are computed with the browser's native `crypto.subtle.digest`, on the
file's full `arrayBuffer()`. SubtleCrypto has no incremental/streaming digest API, so this
reads the whole file into memory first; files over 200MB show a non-blocking warning about
that instead of hanging or crashing silently. MD5 is not supported by SubtleCrypto, so it is
computed with [spark-md5](https://github.com/satazor/js-spark-md5) (MIT) instead, using its
incremental/chunked API — the file is read in bounded `file.slice()` chunks, so MD5 stays
memory-safe on very large files even though the SHA path above does not. See
`src/utils/hashEngine.ts` for the full implementation.

Pasting an expected hash into the compare field auto-detects which algorithm it is by
length (32 hex characters = MD5, 64 = SHA-256) and shows a match/mismatch result — the
concrete "verify a download" use case.

No Web Worker: a Node benchmark of the spark-md5 chunked loop (a proxy for desktop V8
performance) showed the longest synchronous block staying in the low tens of milliseconds
even for gigabyte-scale files, with a genuine task-queue yield between chunks. Combined with
SubtleCrypto's own digest work already running off the observable main thread, a worker
would add complexity without a measurable responsiveness gain here.

## Features

- SHA-256, SHA-1 and MD5 computed together for any file — no algorithm to pick
- File picker or drag-and-drop, single file
- Compare against a pasted expected hash, with algorithm auto-detected by length
- Non-blocking warning for files over 200MB (the SHA-256/SHA-1 memory requirement)
- Works offline (PWA), installable

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. No Web Worker (see above); the only third-party
runtime dependency is `spark-md5` (MIT) for MD5.

## Browser support

Works in any current browser with the Web Crypto API (`crypto.subtle`) — all current
Chrome, Edge, Firefox and Safari. MD5 (via spark-md5) has no special browser requirement
beyond standard `Blob`/`File` support.

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
