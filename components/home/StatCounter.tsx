"use client";
import { useEffect, useRef, useState } from "react";

export default function StatCounter({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const match = value.match(/^(\d+)(.*)/);
  const isNumeric = !!match;
  const targetNum = isNumeric ? parseInt(match![1], 10) : 0;
  const suffix = isNumeric ? match![2] : "";

  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!isNumeric) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 1400;
          const start = Date.now();
          const step = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * targetNum));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isNumeric, targetNum]);

  const displayValue = isNumeric ? `${count}${suffix}` : value;

  return (
    <div
      ref={ref}
      className="flex flex-col items-center p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <p className="font-heading text-3xl sm:text-4xl text-warm-900">{displayValue}</p>
      <p className="text-warm-500 text-xs mt-2 uppercase tracking-widest">{label}</p>
    </div>
  );
}
