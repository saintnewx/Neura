import { useEffect, type RefObject } from "react";

// Stage-one motion is isolated from the existing lower landing sections.
export function useStageReveal(container: RefObject<HTMLElement>) {
  useEffect(() => {
    const elements =
      container.current?.querySelectorAll<HTMLElement>(".stage-one-reveal");
    if (!elements?.length) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const revealAll = () => {
      elements.forEach((element) => {
        element.classList.remove("stage-one-pending");
        element.classList.add("stage-one-visible");
      });
    };
    if (!("IntersectionObserver" in window) || motion.matches) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove("stage-one-pending");
          entry.target.classList.add("stage-one-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1 },
    );
    elements.forEach((element) => {
      const delay = Number(element.dataset.revealDelay ?? 0);
      element.style.setProperty(
        "--stage-one-delay",
        `${Number.isFinite(delay) ? Math.min(Math.max(delay, 0), 600) : 0}ms`,
      );
      element.classList.add("stage-one-pending");
      observer.observe(element);
    });
    const onMotionChange = () => {
      if (motion.matches) {
        observer.disconnect();
        revealAll();
      }
    };
    motion.addEventListener("change", onMotionChange);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", onMotionChange);
      elements.forEach((element) =>
        element.classList.remove("stage-one-pending"),
      );
    };
  }, [container]);
}
