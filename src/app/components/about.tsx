import { motion } from "motion/react";

/**
 * About — restyle only, same five paragraphs and the same heading and
 * subheading. The approved look sets the heading and subheading against the
 * prose in two columns rather than centring everything.
 */

const PARAGRAPHS = [
  "Stratora was built by engineers who have lived through the pain of fragmented monitoring stacks, noisy alerts, and dashboards that look impressive but answer nothing when things break.",
  "Modern infrastructure moves fast — faster than legacy tools were ever designed to handle. Metrics, alerts, topology, and inventory shouldn't live in silos, and neither should the teams responsible for uptime.",
  "Stratora brings infrastructure monitoring together into a single, cohesive platform. One place to see what's happening, understand why it's happening, and act before users ever notice.",
  "We focus on clarity over clutter, signal over noise, and speed over complexity — so teams can spend less time fighting tools and more time building reliable systems.",
  "Whether you're monitoring a single environment or a global, mission-critical platform, Stratora scales with you — without the friction.",
];

export function About() {
  return (
    <section id="about" className="relative overflow-hidden py-24">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-purple-950/5 to-background" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <h2 className="mb-4 text-3xl md:text-5xl tracking-tight">About Stratora</h2>
            <p className="text-lg text-purple-200/70">
              Monitoring that works out of the box — no specialists required.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col gap-6 text-muted-foreground leading-relaxed"
          >
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
