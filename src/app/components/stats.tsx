import { motion } from "motion/react";

export function Stats() {
  const stats = [
    { value: "IT & OT Ready", label: "Full-Stack Infrastructure Observability" },
    { value: "30+", label: "Device templates and growing" },
    { value: "Template-driven", label: "Automated dashboards & config creation" },
    { value: "Agent/Collector", label: "Distributed agent & collector-based monitoring" },
  ];

  return (
    <section className="relative px-6 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="space-y-2"
            >
              <div className="text-3xl md:text-5xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
