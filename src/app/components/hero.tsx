import { motion } from "motion/react";
import { MSI_DOWNLOAD_URL } from "../constants";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Vertical light streaks (subtle) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.4, 0.25, 0.4], y: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-purple-500/40 via-purple-500/15 to-transparent"
        />
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.35, 0.15, 0.35], y: 0 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute top-0 left-[70%] w-px h-full bg-gradient-to-b from-purple-500/35 via-purple-500/12 to-transparent"
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-6 text-5xl md:text-7xl tracking-tight"
          >
            Infrastructure monitoring, alerting, and visibility{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              deployed in minutes — not days.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Automatically discover your environment, generate dashboards, and start monitoring immediately — with built-in alerting, topology maps, and documentation for IT and OT systems.
          </motion.p>

          {/* Proof line */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="mb-10 text-sm md:text-base text-muted-foreground"
          >
            ⚡ From install → discovery → full visibility in ~5 minutes. No consultants. No tuning.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={MSI_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50"
            >
              Download & Try in 5 Minutes
            </a>
          </motion.div>

          {/* Proof strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="border-t border-border/30 pt-12 mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center"
          >
            {[
              { label: '5-minute deployment', desc: 'Windows Server 2022, no prerequisites' },
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

        </div>
      </div>
    </section>
  );
}