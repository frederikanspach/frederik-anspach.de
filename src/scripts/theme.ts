type Theme = "light" | "dark";

const _STORAGE_KEY = "theme";
const _TRANSITION_MS = 450;

function currentTheme(): Theme {
  const _attr = document.documentElement.getAttribute("data-theme");
  if (_attr === "light" || _attr === "dark") return _attr;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateLabel($button: HTMLButtonElement, theme: Theme): void {
  const _label = theme === "dark" ? "Helles Farbschema aktivieren" : "Dunkles Farbschema aktivieren";
  $button.setAttribute("aria-label", _label);
  $button.title = _label;
}

/** Umschalter Hell/Dunkel im Header, Wahl wird in localStorage gemerkt. */
export function initThemeToggle(): void {
  const $button = document.querySelector<HTMLButtonElement>("[data-theme-toggle]");
  if (!$button) return;

  const $root = document.documentElement;
  updateLabel($button, currentTheme());

  $button.addEventListener("click", () => {
    const _next: Theme = currentTheme() === "dark" ? "light" : "dark";

    // Weicher Farbübergang nur für die Dauer des Wechsels
    $root.classList.add("theme-transition");
    window.setTimeout(() => $root.classList.remove("theme-transition"), _TRANSITION_MS);

    $root.setAttribute("data-theme", _next);
    updateLabel($button, _next);

    try {
      window.localStorage.setItem(_STORAGE_KEY, _next);
    } catch {
      // Speicher gesperrt: Wahl gilt nur für diesen Seitenaufruf
    }
  });

  // Folgt der Systemvorgabe, solange keine eigene Wahl gespeichert ist
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (!$root.hasAttribute("data-theme")) updateLabel($button, currentTheme());
  });
}
