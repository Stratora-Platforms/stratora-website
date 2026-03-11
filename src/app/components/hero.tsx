import { ExternalLink } from "lucide-react";
import { motion } from "motion/react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden">
      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Vertical light streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.5, 0.3, 0.5], y: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-[20%] w-px h-full bg-gradient-to-b from-purple-500/50 via-purple-500/20 to-transparent"
        />
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.3, 0.1, 0.3], y: 0 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 0.5 }}
          className="absolute top-0 left-[40%] w-px h-full bg-gradient-to-b from-purple-500/30 via-purple-500/10 to-transparent"
        />
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.4, 0.15, 0.4], y: 0 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear", delay: 1 }}
          className="absolute top-0 left-[60%] w-px h-full bg-gradient-to-b from-purple-500/40 via-purple-500/15 to-transparent"
        />
        <motion.div 
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: [0.35, 0.12, 0.35], y: 0 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: 1.5 }}
          className="absolute top-0 left-[80%] w-px h-full bg-gradient-to-b from-purple-500/35 via-purple-500/12 to-transparent"
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
            Observability at{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Light Speed
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-10 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Monitor hundreds of devices in minutes with immediate, real-time visibility, automated dashboards, and built-in alert escalation across chat, email, SMS, and phone.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="https://github.com/Stratora-Platforms/stratora/releases/download/v2.1.0/Stratora-Server-2.1.0.msi" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-3 text-white hover:from-purple-700 hover:to-purple-800 transition-all shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50">
              Download Free
            </a>
            <a href="https://docs.stratora.io" target="_blank" rel="noopener noreferrer" className="rounded-full border border-border px-8 py-3 text-foreground hover:bg-secondary transition-all flex items-center gap-2">
              <ExternalLink className="h-4 w-4" />
              View Documentation
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
