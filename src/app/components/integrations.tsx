import { Send } from "lucide-react";
import { motion } from "motion/react";

type IntegrationEntry = {
  icon: typeof Send;
  title: string;
  chips: string[];
  description: string;
  href: string;
  ctaLabel: string;
};

const integrations: IntegrationEntry[] = [
  {
    icon: Send,
    title: "Syslog Destinations",
    chips: ["Splunk", "Elastic", "Graylog", "Any RFC-compliant syslog receiver"],
    description:
      "Real-time audit event streaming over UDP, TCP, or TCP+TLS. RFC 5424 modern + RFC 3164 legacy.",
    href: "https://docs.stratora.io/integrations/syslog-destinations/",
    ctaLabel: "Learn more",
  },
];

export function Integrations() {
  return (
    <section id="integrations" className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">Integrations</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stratora connects to the tools your team already uses.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {integrations.map((entry, i) => (
            <motion.div
              key={entry.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-8 hover:border-purple-500/30 transition-all flex flex-col"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <entry.icon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg mb-3">{entry.title}</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.chips.map((chip) => (
                  <span
                    key={chip}
                    className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20"
                  >
                    {chip}
                  </span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 flex-1">
                {entry.description}
              </p>
              <a
                href={entry.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors inline-flex items-center gap-1"
              >
                {entry.ctaLabel}
                <span aria-hidden="true">→</span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
