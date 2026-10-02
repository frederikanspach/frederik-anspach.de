const _THRESHOLD = 12;

/** Header wird nach den ersten Pixeln Scrollweg kompakt und bekommt Hintergrund. */
export function initHeader(): void {
  const $header = document.querySelector<HTMLElement>("[data-header]");
  if (!$header) return;

  let _ticking = false;

  const _update = (): void => {
    $header.classList.toggle("is-scrolled", window.scrollY > _THRESHOLD);
    _ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (_ticking) return;
      _ticking = true;
      window.requestAnimationFrame(_update);
    },
    { passive: true },
  );

  _update();
}
