# frederik-anspach.de

Firmen- und Personenseite von Frederik Anspach IT & Softwaresysteme, Entwickler von MyTid.

**Live:** https://frederik-anspach.de/

## Tech-Stack

- **Framework:** Astro 7, vollständig statischer Build nach `dist/`
- **Styling:** Tailwind CSS 4 mit Design-Tokens als CSS-Custom-Properties (`src/styles/global.css`), Bewegung getrennt in `src/styles/motion.css`
- **Typografie:** Newsreader (Überschriften) und Public Sans (Fließtext), beide als Variable Fonts self-hosted über Fontsource, kein externes CDN
- **Farbschema:** Hell und Dunkel, Vorgabe über `prefers-color-scheme`, Umschalter im Header, Wahl in `localStorage`. `public/theme-init.js` setzt `data-theme` im `<head>` vor dem CSS (externe Datei, weil die CSP keine Inline-Skripte erlaubt)
- **Interaktion:** Vanilla TypeScript, modulare Skripte in `src/scripts/`
- **Bewegung:** Scroll-Reveal per IntersectionObserver, Hero-Einblendung, kompakter Header, schematische Kette im Abschnitt "Worum es geht". Alles aus bei `prefers-reduced-motion: reduce`, ohne JavaScript ist der Inhalt vollständig sichtbar
- **SEO:** Title, Description, Open Graph und JSON-LD (Person, Organization) in `src/layouts/Base.astro`, statische `public/robots.txt` und `public/sitemap.xml`
- **Backend:** PHP-Mailversand (`public/send-email.php`) mit Honeypot-Spamschutz, läuft auf All-Inkl
- **Deployment:** Bash-Skript mit lftp (`npm run deploy`)

## Konventionen

- DOM-Referenzen tragen das Präfix `$` (z. B. `$form`), private interne Werte das Präfix `_` (z. B. `_observer`)
- Deutsche Texte verwenden echte Umlaute und verzichten auf Gedankenstriche
- Verbindliche Seitentexte: `../docs/texte-entwurf-2026-10-02.md`
- Der Rechtstext der Datenschutzerklärung liegt unverändert in `src/content/datenschutz.html` und wird als Raw-HTML eingebunden
- Kontraste mindestens 4,5:1 in beiden Farbschemata, Touch-Ziele mindestens 44 px

## Struktur

```
src/
  components/   Header, Hero, Approach (Worum es geht), Principles, Products, About, Contact, Footer
  content/      Rechtstexte (Raw-HTML)
  layouts/      Base.astro (SEO, Open Graph, Structured Data, Fonts, Theme-Init)
  pages/        index, impressum, datenschutz
  scripts/      main, nav, header, theme, reveal, contact
  styles/       global.css (Tokens, Layout, Komponenten), motion.css (Animationen)
public/         Favicons, Bilder, theme-init.js, robots.txt, sitemap.xml, PHP-Endpunkte
```

## Entwicklung

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Dev-Server (localhost:4321)
npm run build   # Statischer Build nach dist/
npm run preview # Build lokal testen
npm run deploy  # Build und FTP-Upload zu All-Inkl
```
