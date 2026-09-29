import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * The four proof stats. Same four values and labels as before; the refresh
 * adds a count-up on "30+", a single shine sweep across the numerals and a
 * light that travels the connecting rule once, all triggered when the row
 * scrolls into view.
 *
 * Under prefers-reduced-motion nothing animates: the count starts at its
 * final value and the shine resolves to flat orange.
 */

const COUNT_TARGET = 30;
const COUNT_MS = 900;

export function Stats() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(COUNT_TARGET);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (startedRef.current || !entries.some((e) => e.isIntersecting)) return;
        startedRef.current = true;
        setStarted(true);
        observer.disconnect();

        const t0 = performance.now();
        const frame = (now: number) => {
          const k = Math.min(1, (now - t0) / COUNT_MS);
          setCount(Math.round(COUNT_TARGET * (1 - Math.pow(1 - k, 3))));
          rafRef.current = k < 1 ? window.requestAnimationFrame(frame) : null;
        };
        rafRef.current = window.requestAnimationFrame(frame);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const stats: { value: React.ReactNode; label: string }[] = [
    { value: "IT + OT Zones", label: "Remote collectors, on-prem, no cloud dependency" },
    { value: <span className="tabular-nums">{count}+</span>, label: "Device templates and growing" },
    { value: "Template-driven", label: "Automated dashboards & config creation" },
    // <wbr/> adds a wrap opportunity after the slash so the long token doesn't
    // overflow its narrow column on mobile (desktop still renders on one line).
    { value: <>Agent/<wbr />Collector</>, label: "Distributed agent & collector-based monitoring" },
  ];

  return (
    <section className="stat-scope relative px-6 py-12">
      <div className="container mx-auto">
        <div ref={rowRef} className="relative grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Connecting rule with a single travelling light. Desktop only —
              on a two-column grid it would cut through the middle. */}
          <div className="stat-rule hidden md:block" aria-hidden="true">
            {started ? <span className="stat-travel" /> : null}
          </div>

          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="relative space-y-2"
            >
              {/* The size step is at lg, not md. Between 768 and 1023 the
                  container is 768 wide, so a four-column row gives each stat
                  156px — and "Collector" sets 189px at text-5xl, overflowing
                  the row and the page by 33px. Pre-existing; it was masked by
                  the nav's larger overflow at the same width. 30px fits. */}
              <div className={`text-3xl lg:text-5xl leading-tight${started ? " stat-shine" : " stat-flat"}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <span className="stat-node" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
