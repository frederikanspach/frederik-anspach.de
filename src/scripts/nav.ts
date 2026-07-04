/** Mobiles Navigationsmenü im Header. */
export function initNav(): void {
  const $toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const $menu = document.querySelector<HTMLElement>("[data-nav-menu]");
  if (!$toggle || !$menu) return;

  const _setOpen = (open: boolean): void => {
    $toggle.setAttribute("aria-expanded", String(open));
    $toggle.textContent = open ? "Schließen" : "Menü";
    $menu.classList.toggle("hidden", !open);
  };

  $toggle.addEventListener("click", () => {
    const _isOpen = $toggle.getAttribute("aria-expanded") === "true";
    _setOpen(!_isOpen);
  });

  // Menü schließen, sobald ein Link gewählt wurde
  $menu.querySelectorAll("a").forEach(($link) => {
    $link.addEventListener("click", () => _setOpen(false));
  });
}
