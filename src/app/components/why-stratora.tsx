import {
  Boxes,
  Server,
  KeyRound,
  BellRing,
  ScrollText,
} from "lucide-react";
import { motion } from "motion/react";

export function WhyStratora() {
  const bullets = [
    {
      icon: Boxes,
      lead: "Stop paying for four tools that don't talk to each other.",
      body: "Stratora ships dashboards, alerting, topology, IPAM, and SIEM-bound audit forwarding as one platform — installed from a single MSI.",
    },
    {
      icon: Server,
      lead: "Runs entirely on your infrastructure.",
      body: "No SaaS tenant, no metric data leaving your network, no vendor outage that takes your monitoring with it.",
    },
    {
      icon: KeyRound,
      lead: "License validation is fully offline.",
      body: "The Ed25519-signed license file is verified against a public key embedded in the binary — no internet connection, no version-check, no telemetry.",
    },
    {
      icon: BellRing,
      lead: "Alerting with on-call rotation built in.",
      body: "Reach the right person on the right channel — email, Microsoft Teams, Slack, SMS, or voice — with escalation, active-hours scheduling, and maintenance suppression.",
    },
    {
      icon: ScrollText,
      lead: "Every audit event streamed to your SIEM in real time",
      body: "over UDP, TCP, or TLS — multi-destination fan-out with per-destination health monitoring. Compatible with Splunk, Elastic, Graylog, and any RFC-compliant receiver.",
    },
  ];

  return (
    <section id="why-stratora" className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl mb-4">
            From detection to escalation to resolution — in one system.
          </h2>
          <p className="text-lg text-muted-foreground">
            Monitoring, alerting, escalation, topology, and audit forwarding —
            built as a single platform, deployed on your network.
          </p>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16 border-l-2 border-purple-500/60 pl-6 text-base md:text-lg italic text-muted-foreground"
        >
          If your monitoring stack is a thing that polls switches, another
          thing that watches servers, a separate alerting layer that's never
          quite tuned, and dashboards that need a meeting to interpret —
          that's the stack Stratora was built to replace.
        </motion.blockquote>

        <div className="max-w-3xl mx-auto space-y-6">
          {bullets.map((b, i) => (
            <motion.div
              key={b.lead}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="flex gap-4 rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                <b.icon className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{b.lead}</span>{" "}
                {b.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
