/**
 * Interactive-island strings, per locale. Separate from page-level content
 * (`en.ts` / `ja.ts` …): this is the text the Preact islands render.
 *
 * IMPORTANT: islands receive `locale` as a PROP (present during SSR) and never
 * read it from `document`. SSR and client render the same string, so there is no
 * hydration mismatch.
 *
 * Interpolated strings carry `{name}` / `{algorithm}` templates; the island does
 * `.replace('{name}', x)`.
 */
export const ui = {
  en: {
    // FileHashTool — upload / dropzone
    uploadHeading: 'Hash a file',
    uploadSubtitle: 'Choose a file. It is read on your device and never uploaded.',
    dropClick: 'Click to choose a file',
    dropOr: 'or drop it anywhere on the page',
    dropSupported: 'Any file type — SHA-256, SHA-1 and MD5 are all computed',
    hashingLabel: 'Hashing…',

    // FileHashTool — results
    sha256Label: 'SHA-256',
    sha1Label: 'SHA-1',
    md5Label: 'MD5',
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
    hashAnother: 'Hash another file',
    largeFileWarning:
      "This file is over 200 MB. Computing SHA-256 and SHA-1 requires reading the whole file into memory first — the browser's built-in crypto has no streaming digest — so this may take a while and use significant memory. MD5 is computed in smaller chunks and is not affected.",

    // FileHashTool — compare against an expected hash
    compareHeading: 'Compare against an expected hash',
    comparePlaceholder: 'Paste an MD5 or SHA-256 hash',
    compareHelp: 'Detected automatically by length: 32 hex characters = MD5, 64 = SHA-256.',
    compareMatch: '{algorithm} matches',
    compareMismatch: "{algorithm} doesn't match",
    compareUnrecognized: "That isn't 32 or 64 hex characters, so it can't be matched to MD5 or SHA-256.",

    // FileHashTool — error states
    errUnreadable: 'The file {name} could not be read. Please try again.',

    // GlobalDropZone
    dzProcessing: 'Reading {count} file(s)…',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a file to hash',
    dzDropSub: 'Any file type can be hashed',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    required: 'Required',
    close: 'Close',
  },
  ja: {
    // FileHashTool — upload / dropzone
    uploadHeading: 'ファイルをハッシュ化',
    uploadSubtitle: 'ファイルを選んでください。ファイルは端末内で読み込まれ、アップロードされません。',
    dropClick: 'クリックしてファイルを選択',
    dropOr: 'またはページ上にドロップ',
    dropSupported: 'どんな形式でも対応 — SHA-256・SHA-1・MD5 をまとめて計算',
    hashingLabel: '計算中…',

    // FileHashTool — results
    sha256Label: 'SHA-256',
    sha1Label: 'SHA-1',
    md5Label: 'MD5',
    copyLabel: 'コピー',
    copiedLabel: 'コピーしました',
    hashAnother: '別のファイルをハッシュ化',
    largeFileWarning:
      'このファイルは 200MB を超えています。SHA-256 と SHA-1 の計算にはファイル全体を一度メモリに読み込む必要があります（ブラウザ標準の暗号 API にはストリーミング計算の仕組みがありません）。そのため時間がかかったり、メモリを多く使う場合があります。MD5 は小さな単位に分割して計算するため、この制約の影響を受けません。',

    // FileHashTool — compare against an expected hash
    compareHeading: '期待するハッシュ値と比較',
    comparePlaceholder: 'MD5 または SHA-256 のハッシュ値を貼り付け',
    compareHelp: '文字数から自動判定します：32桁の16進数 = MD5、64桁 = SHA-256。',
    compareMatch: '{algorithm} が一致しました',
    compareMismatch: '{algorithm} が一致しません',
    compareUnrecognized: '32桁または64桁の16進数ではないため、MD5 とも SHA-256 とも判定できません。',

    // FileHashTool — error states
    errUnreadable: 'ファイル {name} を読み込めませんでした。もう一度お試しください。',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを読み込んでいます…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'ドロップしてハッシュ計算',
    dzDropSub: 'どんな形式のファイルでも計算できます',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    required: '必須',
    close: '閉じる',
  },
  zh: {
    // FileHashTool — upload / dropzone
    uploadHeading: '计算文件哈希',
    uploadSubtitle: '选择一个文件。文件在你的设备上读取，不会被上传。',
    dropClick: '点击选择文件',
    dropOr: '或把文件拖到页面任意位置',
    dropSupported: '支持任意文件类型 — 同时计算 SHA-256、SHA-1 和 MD5',
    hashingLabel: '正在计算…',

    // FileHashTool — results
    sha256Label: 'SHA-256',
    sha1Label: 'SHA-1',
    md5Label: 'MD5',
    copyLabel: '复制',
    copiedLabel: '已复制',
    hashAnother: '计算另一个文件',
    largeFileWarning:
      '此文件超过 200MB。计算 SHA-256 和 SHA-1 需要先把整个文件读入内存（浏览器内置的加密接口没有流式计算功能），因此可能需要一些时间并占用较多内存。MD5 是分块计算的，不受此限制影响。',

    // FileHashTool — compare against an expected hash
    compareHeading: '与预期哈希值比对',
    comparePlaceholder: '粘贴 MD5 或 SHA-256 哈希值',
    compareHelp: '按字符长度自动判断：32 位十六进制 = MD5，64 位 = SHA-256。',
    compareMatch: '{algorithm} 一致',
    compareMismatch: '{algorithm} 不一致',
    compareUnrecognized: '该字符串不是 32 位或 64 位十六进制，无法匹配 MD5 或 SHA-256。',

    // FileHashTool — error states
    errUnreadable: '无法读取文件 {name}。请重试。',

    // GlobalDropZone
    dzProcessing: '正在读取 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放文件以计算哈希',
    dzDropSub: '可以计算任意类型的文件',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    required: '必填',
    close: '关闭',
  },
  de: {
    // FileHashTool — upload / dropzone
    uploadHeading: 'Datei-Hash berechnen',
    uploadSubtitle: 'Wähle eine Datei. Sie wird auf deinem Gerät gelesen und nie hochgeladen.',
    dropClick: 'Zum Auswählen klicken',
    dropOr: 'oder Datei irgendwo auf die Seite ziehen',
    dropSupported: 'Jeder Dateityp — SHA-256, SHA-1 und MD5 werden alle berechnet',
    hashingLabel: 'Wird berechnet…',

    // FileHashTool — results
    sha256Label: 'SHA-256',
    sha1Label: 'SHA-1',
    md5Label: 'MD5',
    copyLabel: 'Kopieren',
    copiedLabel: 'Kopiert',
    hashAnother: 'Weitere Datei hashen',
    largeFileWarning:
      'Diese Datei ist größer als 200 MB. Für SHA-256 und SHA-1 muss die gesamte Datei zuerst in den Speicher geladen werden — die integrierte Krypto-API des Browsers unterstützt kein Streaming-Hashing. Das kann etwas dauern und deutlich Speicher benötigen. MD5 wird in kleineren Blöcken berechnet und ist davon nicht betroffen.',

    // FileHashTool — compare against an expected hash
    compareHeading: 'Mit einem erwarteten Hash vergleichen',
    comparePlaceholder: 'MD5- oder SHA-256-Hash einfügen',
    compareHelp: 'Automatische Erkennung anhand der Länge: 32 Hex-Zeichen = MD5, 64 = SHA-256.',
    compareMatch: '{algorithm} stimmt überein',
    compareMismatch: '{algorithm} stimmt nicht überein',
    compareUnrecognized:
      'Das sind weder 32 noch 64 Hex-Zeichen, daher lässt es sich keinem MD5- oder SHA-256-Wert zuordnen.',

    // FileHashTool — error states
    errUnreadable: 'Die Datei {name} konnte nicht gelesen werden. Bitte versuche es erneut.',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden gelesen …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Datei zum Hashen ablegen',
    dzDropSub: 'Jeder Dateityp kann gehasht werden',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    required: 'Erforderlich',
    close: 'Schließen',
  },
  es: {
    // FileHashTool — upload / dropzone
    uploadHeading: 'Calcular el hash de un archivo',
    uploadSubtitle: 'Elige un archivo. Se lee en tu dispositivo y nunca se sube.',
    dropClick: 'Haz clic para elegir un archivo',
    dropOr: 'o suéltalo en cualquier parte de la página',
    dropSupported: 'Cualquier tipo de archivo — se calculan SHA-256, SHA-1 y MD5',
    hashingLabel: 'Calculando…',

    // FileHashTool — results
    sha256Label: 'SHA-256',
    sha1Label: 'SHA-1',
    md5Label: 'MD5',
    copyLabel: 'Copiar',
    copiedLabel: 'Copiado',
    hashAnother: 'Calcular otro archivo',
    largeFileWarning:
      'Este archivo supera los 200 MB. Calcular SHA-256 y SHA-1 requiere leer todo el archivo en memoria primero (la API criptográfica integrada del navegador no admite cálculo en flujo), así que puede tardar un poco y usar bastante memoria. El MD5 se calcula en bloques más pequeños y no tiene esta limitación.',

    // FileHashTool — compare against an expected hash
    compareHeading: 'Comparar con un hash esperado',
    comparePlaceholder: 'Pega un hash MD5 o SHA-256',
    compareHelp: 'Se detecta automáticamente por longitud: 32 caracteres hexadecimales = MD5, 64 = SHA-256.',
    compareMatch: '{algorithm} coincide',
    compareMismatch: '{algorithm} no coincide',
    compareUnrecognized:
      'Eso no son 32 ni 64 caracteres hexadecimales, así que no se puede comparar con MD5 ni SHA-256.',

    // FileHashTool — error states
    errUnreadable: 'No se pudo leer el archivo {name}. Inténtalo de nuevo.',

    // GlobalDropZone
    dzProcessing: 'Leyendo {count} archivo(s)…',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un archivo para calcular su hash',
    dzDropSub: 'Se puede calcular el hash de cualquier tipo de archivo',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    required: 'Obligatorio',
    close: 'Cerrar',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
