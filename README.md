# frederik-anspach.de

Persönliche Webseite von Frederik Anspach, Gründer von Frederik Anspach IT & Softwaresysteme und Entwickler von MyTid.

🚀 **Live:** https://frederik-anspach.de/

## Tech-Stack

- **Framework:** Astro 7, vollständig statischer Build nach `dist/`
- **Styling:** Tailwind CSS 4 mit eigenem Design-Token-System (`src/styles/global.css`)
- **Typografie:** Archivo Variable (Breitenachse für Headlines) und IBM Plex Mono, beide self-hosted über Fontsource (DSGVO-konform, kein externes CDN)
- **Interaktion:** Vanilla TypeScript, modulare Skripte in `src/scripts/`
- **Backend:** PHP-Mailversand (`public/send-email.php`) mit Honeypot-Spamschutz, läuft auf All-Inkl
- **Deployment:** Bash-Skript mit lftp (`npm run deploy`)

## Konventionen

- DOM-Referenzen tragen das Präfix `$` (z. B. `$form`), private interne Werte das Präfix `_` (z. B. `_observer`)
- Deutsche Texte verwenden echte Umlaute und verzichten auf Gedankenstriche
- Der Rechtstext der Datenschutzerklärung liegt unverändert in `src/content/datenschutz.html` und wird als Raw-HTML eingebunden

## Struktur

```
src/
  components/   Header, Hero, Principles, Products, About, Contact, Footer
  content/      Rechtstexte (Raw-HTML)
  layouts/      Base.astro (SEO, Open Graph, Structured Data, Fonts)
  pages/        index, impressum, datenschutz
  scripts/      main, nav, reveal, clock, contact
  styles/       global.css (Design-Tokens, Utilities, Komponenten)
public/         Favicons, Bilder, PHP-Endpunkte
```

## Entwicklung

```bash
npm install     # Abhängigkeiten installieren
npm run dev     # Dev-Server (localhost:4321)
npm run build   # Statischer Build nach dist/
npm run preview # Build lokal testen
npm run deploy  # Build und FTP-Upload zu All-Inkl
```
