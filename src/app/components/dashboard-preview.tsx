import { motion } from "motion/react";
import { LiveDashboard } from "./live-dashboard";

/**
 * Dashboard band below the hero.
 *
 * This slot used to hold a static, perspective-tilted product screenshot. It
 * now holds <LiveDashboard />, which renders the same story as live DOM —
 * flat, because the approved design has no tilt.
 *
 * The section keeps its original `pt-6`, so the gap below the hero's four-up
 * feature row is unchanged. The old `-mb-[8%] md:-mb-[14%]` is gone with the
 * screenshot that needed it: that pulled the next section up under the
 * screenshot's masked, faded-out bottom edge. The dashboard frame ends on a
 * hard opaque border instead, so the same negative margin would slide "See
 * Stratora in action" on top of it.
 */
export function DashboardPreview() {
  return (
    <section className="relative px-6 pt-6 pb-0 overflow-hidden">
      <div className="container mx-auto">
        {/* EXISTING Framer Motion fade-up — kept as the outer wrapper. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="relative"
        >
          <LiveDashboard />
        </motion.div>
      </div>
    </section>
  );
}
