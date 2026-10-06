import { useEffect, useRef } from "react";

// A shared decorative layer stays behind every route without intercepting input.
export default function AuroraBackground() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame: number | null = null;

    // One passive listener and one animation frame keep scroll work bounded.
    const update = () => {
      frame = null;
      const availableScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      const progress = Math.min(
        Math.max(window.scrollY / availableScroll, 0),
        1,
      );
      layerRef.current?.style.setProperty(
        "--aurora-shift",
        `${motion.matches ? 0 : progress * 28}px`,
      );
    };
    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={layerRef} className="aurora-layer" aria-hidden="true">
      <div className="aurora-orb aurora-orb-one" />
      <div className="aurora-orb aurora-orb-two" />
      <div className="aurora-orb aurora-orb-three" />
      <div className="aurora-orb aurora-orb-four" />
      <div className="aurora-grid" />
    </div>
  );
}
