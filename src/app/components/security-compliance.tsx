import {
  Server,
  KeyRound,
  ShieldOff,
  FileSearch,
  Users,
  WifiOff,
} from "lucide-react";
import { motion } from "motion/react";

export function SecurityCompliance() {
  const statements = [
    {
      icon: Server,
      lead: "On-prem deployment with no cloud dependency.",
      body: "Runs on your hardware in your network. PostgreSQL, VictoriaMetrics, NGINX, and the Stratora backend ship in a single Windows MSI — no SaaS tenant, no external metric sink, no cloud control plane.",
    },
    {
      icon: KeyRound,
      lead: "Offline Ed25519 license validation.",
      body: "License verification is fully offline. The license file is signed with an Ed25519 private key held outside the Stratora codebase and verified against a public key embedded in the binary at build time. The Stratora server never calls home to validate a license.",
    },
    {
      icon: ShieldOff,
      lead: "No telemetry, no version-check, no auto-update.",
      body: "No analytics SDK, no telemetry endpoint, no auto-update check. The platform does not initiate outbound connections except to the integrations you explicitly configure (Twilio, Slack/Teams webhooks, OIDC IdP, SMTP relay).",
    },
    {
      icon: FileSearch,
      lead: "Audit trail with SIEM export.",
      body: "Every user and system action — sign-ins, configuration changes, alert acknowledgments, license operations — is recorded in an audit log. Events stream in real time to your SIEM over UDP, TCP, or TLS, with multi-destination fan-out and per-destination health monitoring. Compatible with Splunk, Elastic, Graylog, and any RFC-compliant syslog receiver.",
    },
    {
      icon: Users,
      lead: "RBAC + SSO.",
      body: "Three-role RBAC (Admin / Operator / Viewer) with local accounts, LDAP/Active Directory pass-through, and OIDC single sign-on. Identity provider passwords are never stored in Stratora.",
    },
    {
      icon: WifiOff,
      lead: "Air-gap capable.",
      body: "Core monitoring, alerting via on-prem SMTP, and LDAP/AD authentication run fully disconnected. Optional cloud-dependent channels (Twilio SMS/voice, Slack, Teams webhooks, cloud OIDC) can be enabled at your discretion when external network access is available.",
    },
  ];

  return (
    <section
      id="security-compliance"
      className="relative px-6 py-20"
    >
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl mb-4">
            Designed for sensitive environments
          </h2>
          <p className="text-lg text-muted-foreground">
            On-prem deployment, offline licensing, full audit forwarding — for
            teams who need to know exactly where their monitoring data lives
            and who can see it.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {statements.map((s, i) => (
            <motion.div
              key={s.lead}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="flex gap-4 rounded-2xl border border-border/50 bg-card/50 p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
                <s.icon className="h-5 w-5 text-purple-400" />
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">{s.lead}</span>{" "}
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 max-w-3xl mx-auto text-xs text-muted-foreground/70 text-center"
        >
          Stratora's audit pipeline supports SOC 2, HIPAA, and PCI-DSS
          retention requirements as part of a broader compliance program.
        </motion.p>
      </div>
    </section>
  );
}
