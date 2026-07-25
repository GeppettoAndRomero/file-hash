import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
  integrations: [preact()],
  output: 'static',
  // slug-first 名前空間: ツールを runlocally.app/file-hash/ 配下に「物理配置」する
  // （src/pages/file-hash/ + public/file-hash/）。base は使わない（base は URL に
  // prefix を付けるが dist を入れ子化せず、ルート配信の Pages と不整合になるため）。
  // バンドルアセットも /file-hash/_assets/ に隔離し hub/他ツールと無衝突にする。
  build: {
    inlineStylesheets: 'auto',
    assets: 'file-hash/_assets',
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      }
    },
    // No Web Worker: SHA-256/SHA-1 run through the browser's native
    // crypto.subtle.digest (itself off the observable main thread), and the
    // spark-md5 chunked loop keeps its longest synchronous block in the
    // low-tens-of-milliseconds range even for gigabyte-scale files (measured;
    // see src/utils/hashEngine.ts) — not the kind of long, synchronous,
    // WASM-bound work this template's worker infra exists for.
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Shared across every island (ThemeToggle, GlobalDropZone,
            // InstallPrompt, FileHashTool), so this actually splits out as its
            // own chunk. spark-md5 has only one consumer (FileHashTool, loaded
            // with client:load), so Rollup inlines it into that island's own
            // chunk regardless of manualChunks — there is no separate entry
            // for it here, since a manualChunks bucket used by a single
            // client:load island wouldn't defer anything real.
            'vendor': ['preact', 'preact/hooks']
          }
        }
      }
    }
  },
  compressHTML: true,
  scopedStyleStrategy: 'class'
});
