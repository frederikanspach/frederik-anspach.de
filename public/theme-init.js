/* Setzt das Farbschema vor dem ersten Rendern, damit nichts aufblitzt.
   Eigene Datei statt Inline-Skript, weil die CSP nur script-src 'self' erlaubt. */
(function () {
  var root = document.documentElement;
  root.classList.add("js");
  try {
    var stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      root.setAttribute("data-theme", stored);
    }
  } catch (e) {
    /* Speicher gesperrt: Systemvorgabe gilt */
  }
})();
