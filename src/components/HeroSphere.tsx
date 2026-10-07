import { useEffect, useRef } from "react";

export default function HeroSphere() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const mql = window.matchMedia("(min-width: 768px)");
    if (!mql.matches) return;

    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const tick = () => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      wrapper.style.setProperty("--tx", `${currentX}px`);
      wrapper.style.setProperty("--ty", `${currentY}px`);
      if (
        Math.abs(targetX - currentX) > 0.1 ||
        Math.abs(targetY - currentY) > 0.1
      ) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 24;
      targetY = (e.clientY / window.innerHeight - 0.5) * 24;
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      style={{
        transform: "translate3d(var(--tx, 0), var(--ty, 0), 0)",
        transition: "transform 80ms linear",
      }}
    >
      <div className="animate-[sphere-pulse_4s_ease-in-out_infinite]">
        <div className="animate-[sphere-rotate_60s_linear_infinite]">
          <svg
            width="600"
            height="600"
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] opacity-60 md:opacity-80"
          >
            <circle cx="300" cy="300" r="280" stroke="rgb(124 131 253 / 0.18)" strokeWidth="1" />
            <circle cx="300" cy="300" r="240" stroke="rgb(124 131 253 / 0.22)" strokeWidth="1" />
            <circle cx="300" cy="300" r="190" stroke="rgb(124 131 253 / 0.26)" strokeWidth="1" />
            <circle cx="300" cy="300" r="130" stroke="rgb(124 131 253 / 0.30)" strokeWidth="1" />
            <circle cx="300" cy="300" r="60" stroke="rgb(124 131 253 / 0.32)" strokeWidth="1" />

            <ellipse cx="300" cy="300" rx="280" ry="90" stroke="rgb(124 131 253 / 0.16)" strokeWidth="1" />
            <ellipse cx="300" cy="300" rx="280" ry="180" stroke="rgb(124 131 253 / 0.12)" strokeWidth="1" />
            <ellipse cx="300" cy="300" rx="90" ry="280" stroke="rgb(124 131 253 / 0.16)" strokeWidth="1" />
            <ellipse cx="300" cy="300" rx="180" ry="280" stroke="rgb(124 131 253 / 0.12)" strokeWidth="1" />

            <path
              d="M 60 300 A 240 240 0 0 1 540 300"
              stroke="rgb(124 131 253 / 0.28)"
              strokeWidth="1.2"
              strokeDasharray="4 8"
            />
            <path
              d="M 540 300 A 240 240 0 0 1 60 300"
              stroke="rgb(124 131 253 / 0.20)"
              strokeWidth="1"
              strokeDasharray="2 10"
            />

            <circle cx="300" cy="20" r="3" fill="rgb(124 131 253 / 0.7)" />
            <circle cx="300" cy="580" r="2" fill="rgb(124 131 253 / 0.5)" />
            <circle cx="20" cy="300" r="2.5" fill="rgb(124 131 253 / 0.6)" />
            <circle cx="580" cy="300" r="2" fill="rgb(124 131 253 / 0.5)" />
          </svg>
        </div>
      </div>
    </div>
  );
}