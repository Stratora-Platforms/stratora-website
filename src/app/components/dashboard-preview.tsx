import { motion } from "motion/react";

/**
 * Standalone perspective-warp dashboard band (separate section below hero).
 *
 * The card foreshortens — narrow/receding at the TOP, full-width sharp front
 * edge at the BOTTOM — via rotateX from a bottom transform-origin under a
 * tight perspective. Keeps the important bottom rows crisp; only the far top
 * edge softens, reading as intentional depth.
 */
export function DashboardPreview() {
  return (
    <section className="relative -mb-[8%] md:-mb-[14%] px-6 pt-6 pb-0 overflow-hidden">
      <div className="container mx-auto">
        {/* EXISTING Framer Motion fade-up — kept as the outer wrapper. */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          // Tight perspective from the top edge = strong trapezoid foreshorten.
          // Lives on the card's immediate parent via .hero-3d-scene (in CSS, so
          // it can vary per breakpoint). (locked: 600px / 50% 0%)
          className="hero-3d-scene relative"
        >
          {/* Two-blob morphing glow — purple only, anchored LOW behind the
              wide bottom front edge of the card. */}
          <div className="hero-glow-a" aria-hidden="true" />
          <div className="hero-glow-b" aria-hidden="true" />

          {/* Warped card — rotateX from a bottom origin (.hero-3d-card).
              The transform lives here; the framed/masked image is a separate
              child node (Safari mask+transform safety). */}
          <div className="hero-3d-card">
            {/* Inner frame + crop. aspect-ratio crops the image to its TOP
                ~70% (3826×2166 → 3826×1516): the h-auto <img> overflows the
                shorter wrapper and overflow-hidden clips the bottom 30%.
                The mask fade is applied HERE (not on the <img>) so the side
                borders dissolve with the image — solid for the top third, then
                fading to nothing through the lower two-thirds (no hard edge,
                hides the crop line). */}
            <div
              className="overflow-hidden rounded-t-xl border border-b-0 border-purple-500/25"
              style={{
                aspectRatio: "3826 / 1516",
                WebkitMaskImage:
                  "linear-gradient(to bottom, black 35%, transparent 92%)",
                maskImage:
                  "linear-gradient(to bottom, black 35%, transparent 92%)",
              }}
            >
              <img
                src="/screenshots/dashboard-preview.png"
                alt="Stratora dashboard — Sites view showing network topology, health breakdown, device types, and performance metrics"
                className="block w-full h-auto"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
                // Keep crisp: native rendering, never upscaled beyond natural size.
                style={{ imageRendering: "auto" }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
