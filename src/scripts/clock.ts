/** Live tickende Lokalzeit im Hero. Läuft ausschließlich im Browser des Besuchers. */
export function initClock(): void {
  const $clock = document.querySelector<HTMLElement>("[data-clock]");
  if (!$clock) return;

  const _formatter = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const _tick = (): void => {
    $clock.textContent = _formatter.format(new Date());
  };

  _tick();
  window.setInterval(_tick, 1000);
}
