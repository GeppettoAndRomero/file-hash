import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Comprobador de hash de archivos — SHA-256, SHA-1 y MD5 en tu navegador | runlocally',
    description:
      'Calcula el hash SHA-256, SHA-1 y MD5 de un archivo directamente en tu navegador y compáralo con un valor esperado para verificar una descarga. El archivo nunca se sube. Código abierto, funciona sin conexión.',
    ogTitle: 'Comprobador de hash de archivos — SHA-256, SHA-1 y MD5 en tu navegador',
    ogDescription: 'Calcula y verifica la suma de comprobación de un archivo localmente. Sin subidas. Código abierto, funciona sin conexión.',
  },

  hero: {
    h1: 'Comprobador de hash de archivos',
    tagline:
      'Calcula el hash SHA-256, SHA-1 y MD5 de un archivo en tu navegador y compáralo con un valor esperado. No se sube nada.',
  },

  intro: {
    h2: 'Comprueba el hash de un archivo en tu navegador',
    paras: [
      'Esta herramienta lee un archivo que elijas o sueltes y calcula sus sumas de comprobación SHA-256, SHA-1 y MD5. Las tres se muestran a la vez, sin tener que elegir un algoritmo primero.',
      'El motivo más habitual para hacerlo es verificar una descarga: una página de lanzamiento publica un hash, y quieres confirmar que el archivo descargado coincide byte a byte, sin fiarte solo de la descarga en sí. Pega el hash publicado en el campo de comparación y la herramienta te dice si coincide.',
    ],
  },

  privacy: {
    h2: 'Por qué tu archivo se queda en tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay paso de subida porque no hay ningún servidor al que enviar el archivo:',
    points: [
      'El archivo se lee y se procesa por completo en tu navegador, usando la API Web Crypto y una pequeña implementación de MD5 de código abierto.',
      'La página se sirve como archivos estáticos y no hace ninguna petición que transporte tus datos.',
      'El código fuente es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale de tu dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de red de tu navegador mientras calculas el hash de un archivo: ninguna petición transporta su contenido.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Elige un archivo',
        p: 'Haz clic para elegir un archivo, o suéltalo en cualquier parte de la página. El archivo se lee localmente.',
      },
      {
        h3: 'Consulta los hashes',
        p: 'SHA-256, SHA-1 y MD5 se calculan y se muestran juntos, cada uno con un botón para copiar.',
      },
      {
        h3: 'Compara con un hash esperado (opcional)',
        p: 'Pega un hash publicado en el campo de comparación. Se identifica como MD5 o SHA-256 según su longitud, y se muestra si coincide o no.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi archivo a algún sitio?',
      a: 'No. Se lee y se procesa por completo en tu navegador. No hay ningún componente de servidor, así que su contenido no tiene forma de salir de tu dispositivo. El código fuente es abierto y puedes comprobarlo tú mismo en el panel de red de tu navegador.',
    },
    {
      q: '¿Qué algoritmos de hash admite?',
      a: 'SHA-256 y SHA-1 mediante la API Web Crypto integrada del navegador, y MD5 mediante una pequeña implementación de JavaScript de código abierto (Web Crypto no admite MD5). Los tres se calculan y se muestran para cualquier archivo.',
    },
    {
      q: '¿Cómo funciona la comparación?',
      a: 'Pega un hash que ya tengas, por ejemplo de una página de descarga, en el campo de comparación. Su longitud le indica a la herramienta de qué algoritmo se trata (32 caracteres hexadecimales para MD5, 64 para SHA-256), y se compara con el valor calculado correspondiente, mostrando claramente si coincide o no.',
    },
    {
      q: '¿Puede con archivos grandes?',
      a: 'Sí, dentro de los límites de memoria de tu dispositivo. SHA-256 y SHA-1 necesitan tener todo el archivo en memoria a la vez, porque la API criptográfica del navegador no admite cálculo en flujo, así que los archivos de más de 200 MB muestran un aviso de que esto puede tardar un poco y usar más memoria. El MD5 se calcula en bloques pequeños y no tiene esta limitación.',
    },
    {
      q: '¿Es seguro usar MD5 o SHA-1?',
      a: 'Para confirmar que una descarga no se ha corrompido, cualquiera de los tres sirve. Si alguien pudiera manipular un archivo deliberadamente, MD5 y SHA-1 se consideran inseguros: usa SHA-256, o sigue lo que recomiende quien publica el archivo.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Después de la primera visita queda en caché, así que se abre sin conexión a internet. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones son del responsable del proyecto.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
