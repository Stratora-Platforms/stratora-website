import { motion } from "motion/react";

/**
 * The four-up proof row: deployment time, discovery, dashboards, alerting.
 *
 * Lifted out of <Hero /> and placed below <DashboardPreview />. It used to sit
 * between the CTAs and the dashboard, where it pushed the animated Home page
 * most of the way below the fold. Below the dashboard it costs the hero
 * nothing and still reads as part of the opening pitch.
 *
 * Copy is unchanged. `whileInView` rather than `animate` now that it starts
 * off screen — an `animate` entrance would have already played by the time
 * anyone scrolled to it.
 */
export function ProofStrip() {
  return (
    <section className="relative px-6 pt-12 pb-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px 15% 0px" }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="border-t border-border/30 pt-7 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-6 max-w-6xl mx-auto text-center"
      >
        {[
          { label: '10-minute deployment', desc: 'Single MSI on Windows Server' },
          { label: 'Auto-discovery — no config', desc: 'SNMP, agents, and ping' },
          { label: 'Dashboards instantly generated', desc: 'Built automatically from live data' },
          { label: 'Alerting from day one', desc: 'Email, Teams, Slack, SMS, and voice' },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-1">
            <span className="text-sm font-semibold text-foreground">{item.label}</span>
            <span className="text-xs text-muted-foreground">{item.desc}</span>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
