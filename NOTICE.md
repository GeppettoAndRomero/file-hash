# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).

This tool has no third-party components under a copyleft or other non-permissive
license. Its runtime dependencies are all distributed under the MIT License:

- [spark-md5](https://github.com/satazor/js-spark-md5) — incremental/chunked MD5
  (runs in the browser). Upstream dual-licenses it as "WTFPL OR MIT"; this project
  uses it under the MIT option.
- [Astro](https://astro.build/), [Preact](https://preactjs.com/) and
  [@astrojs/preact](https://github.com/withastro/astro/tree/main/packages/integrations/preact)
  — the site framework and rendering.

SHA-256 and SHA-1 use the browser's built-in Web Crypto API (`crypto.subtle`) —
not a third-party dependency.

Each dependency keeps its own license and copyright; see the respective packages in
`node_modules` for the full license text.
