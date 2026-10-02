/**
 * Blendet Elemente mit der Klasse .reveal beim Scrollen ein.
 * Die Staffelung kommt aus --reveal-delay am Element, die Kette im
 * Abschnitt "Worum es geht" zeichnet ihre Verbindungen über CSS,
 * sobald sie .is-visible trägt.
 */
export function initReveal(): void {
  const $elements = document.querySelectorAll<HTMLElement>(".reveal");
  if (!$elements.length) return;

  const _reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (_reducedMotion || !("IntersectionObserver" in window)) {
    $elements.forEach(($element) => $element.classList.add("is-visible"));
    return;
  }

  const _observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          _observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );

  $elements.forEach(($element) => _observer.observe($element));
}
