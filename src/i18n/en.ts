import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'File Hash Checker — SHA-256, SHA-1 and MD5 in Your Browser | runlocally',
    description:
      "Compute a file's SHA-256, SHA-1 and MD5 hash entirely in your browser and compare it against an expected value to verify a download. The file is never uploaded. Open source, works offline.",
    ogTitle: 'File Hash Checker — SHA-256, SHA-1 and MD5 in Your Browser',
    ogDescription:
      'Compute and verify a file checksum locally. Nothing is uploaded. Open source, works offline.',
  },

  hero: {
    h1: 'File Hash Checker',
    tagline:
      "Compute a file's SHA-256, SHA-1 and MD5 hash in your browser, and compare it against an expected value. Nothing is uploaded.",
  },

  intro: {
    h2: "Check a file's hash in your browser",
    paras: [
      "This tool reads a file you choose or drop and computes its SHA-256, SHA-1 and MD5 checksums. All three are shown at once — there is no algorithm to pick first.",
      "The most common reason to do this is verifying a download: a release page publishes a checksum, and you want to confirm the file you downloaded matches it byte for byte, without just trusting the download. Paste the published hash into the compare field and the tool reports whether it matches.",
    ],
  },

  privacy: {
    h2: 'Why your file stays on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to send the file to:',
    points: [
      'The file is read and hashed entirely in your browser, using the Web Crypto API and a small open-source MD5 implementation.',
      'The page is served as static files and makes no request that carries your data.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while you hash a file — no request carries its contents.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Choose a file',
        p: 'Click to choose a file, or drop it anywhere on the page. The file is read locally.',
      },
      {
        h3: 'Read the hashes',
        p: 'SHA-256, SHA-1 and MD5 are computed and shown together, each with a Copy button.',
      },
      {
        h3: 'Compare against an expected hash (optional)',
        p: "Paste a published hash into the compare field. It's matched to MD5 or SHA-256 by length, and shown as a match or a mismatch.",
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is my file uploaded anywhere?',
      a: "No. It is read and hashed entirely in your browser. There is no server component, so its contents have no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: 'Which hash algorithms does it support?',
      a: "SHA-256 and SHA-1, computed with the browser's built-in Web Crypto API, and MD5, computed with a small open-source JavaScript implementation (Web Crypto does not support MD5). All three are computed and shown for every file.",
    },
    {
      q: 'How does the "compare" feature work?',
      a: "Paste a hash you already have — from a download page, for example — into the compare field. Its length tells the tool which algorithm it is (32 hex characters for MD5, 64 for SHA-256), and it's checked against the matching computed value with a clear match/mismatch result.",
    },
    {
      q: 'Can it handle large files?',
      a: "Yes, within your device's memory. SHA-256 and SHA-1 need the whole file in memory at once, because the browser's crypto API has no streaming option, so files over 200MB show a warning that this may take a moment and use more memory. MD5 is computed in small chunks and does not have this limitation.",
    },
    {
      q: 'Is MD5 or SHA-1 safe to use?',
      a: "For confirming a download wasn't corrupted, any of the three works fine. For security purposes where someone might deliberately tamper with a file, MD5 and SHA-1 are considered broken; SHA-256 is the safer choice — check what the publisher recommends.",
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so it opens without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },
};
