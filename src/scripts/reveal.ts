/** Blendet Elemente mit der Klasse .reveal beim Scrollen ein. */
export function initReveal(): void {
  const $elements = document.querySelectorAll<HTMLElement>(".reveal");
  if (!$elements.length) return;

  const _observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          _observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
  );

  $elements.forEach(($element) => _observer.observe($element));
}
