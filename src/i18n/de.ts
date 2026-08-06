import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Datei-Hash-Prüfer — SHA-256, SHA-1 und MD5 im Browser | runlocally',
    description:
      'Berechne den SHA-256-, SHA-1- und MD5-Hash einer Datei direkt im Browser und vergleiche ihn mit einem erwarteten Wert, um einen Download zu überprüfen. Die Datei wird nie hochgeladen. Open Source, funktioniert offline.',
    ogTitle: 'Datei-Hash-Prüfer — SHA-256, SHA-1 und MD5 im Browser',
    ogDescription: 'Prüfsumme einer Datei lokal berechnen und überprüfen. Kein Upload. Open Source, funktioniert offline.',
  },

  hero: {
    h1: 'Datei-Hash-Prüfer',
    tagline:
      'Berechne SHA-256-, SHA-1- und MD5-Hash einer Datei im Browser und vergleiche ihn mit einem erwarteten Wert. Es wird nichts hochgeladen.',
  },

  intro: {
    h2: 'Den Hash einer Datei im Browser prüfen',
    paras: [
      'Dieses Tool liest eine ausgewählte oder abgelegte Datei und berechnet ihre SHA-256-, SHA-1- und MD5-Prüfsummen. Alle drei werden gleichzeitig angezeigt — es muss vorher kein Algorithmus ausgewählt werden.',
      'Der häufigste Grund dafür ist, einen Download zu überprüfen: Eine Release-Seite veröffentlicht eine Prüfsumme, und du willst bestätigen, dass die heruntergeladene Datei byteweise damit übereinstimmt, statt dem Download einfach zu vertrauen. Füge die veröffentlichte Prüfsumme in das Vergleichsfeld ein, und das Tool zeigt, ob sie übereinstimmt.',
    ],
  },

  privacy: {
    h2: 'Warum deine Datei auf deinem Gerät bleibt',
    lead: 'Datenschutz ist hier strukturell garantiert, kein bloßes Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den die Datei geschickt werden könnte:',
    points: [
      'Die Datei wird vollständig im Browser gelesen und gehasht — mit der Web-Crypto-API und einer kleinen Open-Source-MD5-Implementierung.',
      'Die Seite wird als statische Datei ausgeliefert und sendet keine Anfrage, die deine Daten enthält.',
      'Der Quellcode ist offen einsehbar (MIT).',
      'Es funktioniert offline — was nur möglich ist, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst: Öffne beim Hashen einer Datei das Netzwerk-Panel deines Browsers — keine Anfrage überträgt ihren Inhalt.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Datei auswählen',
        p: 'Klicke, um eine Datei auszuwählen, oder lege sie irgendwo auf der Seite ab. Die Datei wird lokal gelesen.',
      },
      {
        h3: 'Hashes ablesen',
        p: 'SHA-256, SHA-1 und MD5 werden berechnet und gemeinsam angezeigt, jeweils mit einer Kopieren-Schaltfläche.',
      },
      {
        h3: 'Mit einem erwarteten Hash vergleichen (optional)',
        p: 'Füge einen veröffentlichten Hash in das Vergleichsfeld ein. Er wird anhand seiner Länge MD5 oder SHA-256 zugeordnet und als Übereinstimmung oder Abweichung angezeigt.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird meine Datei irgendwohin hochgeladen?',
      a: 'Nein. Sie wird vollständig im Browser gelesen und gehasht. Es gibt keine Serverkomponente, daher hat der Inhalt keinen Weg, das Gerät zu verlassen. Der Quellcode ist offen, und du kannst das im Netzwerk-Panel deines Browsers selbst nachprüfen.',
    },
    {
      q: 'Welche Hash-Algorithmen werden unterstützt?',
      a: 'SHA-256 und SHA-1 über die im Browser eingebaute Web-Crypto-API sowie MD5 über eine kleine Open-Source-JavaScript-Implementierung (Web Crypto unterstützt kein MD5). Für jede Datei werden alle drei berechnet und angezeigt.',
    },
    {
      q: 'Wie funktioniert der Vergleich?',
      a: 'Füge einen bereits vorhandenen Hash — zum Beispiel von einer Download-Seite — in das Vergleichsfeld ein. Seine Länge verrät dem Tool den Algorithmus (32 Hex-Zeichen für MD5, 64 für SHA-256), und er wird mit dem passenden berechneten Wert abgeglichen, mit einem klaren Ergebnis: Übereinstimmung oder Abweichung.',
    },
    {
      q: 'Funktioniert es auch mit großen Dateien?',
      a: 'Ja, im Rahmen des Arbeitsspeichers deines Geräts. SHA-256 und SHA-1 benötigen die gesamte Datei auf einmal im Speicher, da die Krypto-API des Browsers kein Streaming unterstützt. Daher erscheint bei Dateien über 200 MB ein Hinweis, dass dies etwas dauern und mehr Speicher benötigen kann. MD5 wird in kleinen Blöcken berechnet und hat diese Einschränkung nicht.',
    },
    {
      q: 'Sind MD5 oder SHA-1 sicher genug?',
      a: 'Um zu prüfen, ob ein Download nicht beschädigt wurde, reicht jeder der drei Werte. Wenn jemand eine Datei absichtlich manipulieren könnte, gelten MD5 und SHA-1 als unsicher — verwende dann SHA-256 oder folge der Empfehlung des Anbieters.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert und lässt sich ohne Netzwerkverbindung öffnen. Du kannst sie auch auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },

  related: {
    h2: 'Ähnliche Tools',
    blogLinkText: 'Technische Hintergründe lesen',
  },
};
