// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://frederik-anspach.de",
  trailingSlash: "never",
  build: {
    // Flache HTML-Dateien (impressum.html statt impressum/index.html),
    // passend zum bestehenden All-Inkl-Hosting und Deploy-Skript
    format: "file",
    inlineStylesheets: "auto",
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Keine Inline-Skripte im HTML, damit die CSP ohne
      // 'unsafe-inline' für script-src auskommt
      assetsInlineLimit: 0,
    },
  },
});
