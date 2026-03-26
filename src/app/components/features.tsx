import {
  Network,
  LayoutGrid,
  Radar,
  Cpu,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { motion } from "motion/react";

export function Features() {
  const features = [
    {
      icon: LayoutGrid,
      title: "Visualization-first dashboards",
      description:
        "Interactive port grids, gauges, charts, tables, and status heatmaps — all driven by live metrics. Automatically generated dashboards provide consistent site-wide and infrastructure-specific views out of the box.",
    },
    {
      icon: Radar,
      title: "Template-driven monitoring",
      description:
        "Deploy consistent monitoring fast with device templates for switches, firewalls, APs, servers, SAN/NAS, Power/UPS/Environmental Monitoring, PING, and web services & HTTP endpoints, and more.",
    },
    {
      icon: Network,
      title: "Distributed collectors",
      description:
        "Easy to install Stratora collectors with automatic config generation for scalable, segmented environments.",
    },
    {
      icon: Cpu,
      title: "Windows & Linux agents",
      description:
        "Lightweight Stratora agents for server monitoring, including auto-registration, admin approval, server role detection, and service monitoring.",
    },
    {
      icon: Bell,
      title: "Alerting + maintenance mode",
      description:
        "Notify the right people via email, Microsoft Teams, Slack, SMS, and phone call — with two-way acknowledgment, escalation, mute, and maintenance-aware suppression.",
    },
    {
      icon: ShieldCheck,
      title: "RBAC + LDAP/OAUTH SSO authentication",
      description:
        "Built-in role-based access control with local accounts and identity provider pass-through (Active Directory, LDAP, Entra ID, Okta, OAuth/OIDC), including group-to-role mapping. No credentials stored.",
    },
  ];

  return (
    <section id="features" className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">
            Everything you need to monitor IT / OT infrastructure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time metrics, template-driven onboarding, distributed collectors,
            and dashboards built for operators.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border/50 bg-card/50 p-8 hover:border-purple-500/30 transition-all"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
                <f.icon className="h-5 w-5 text-purple-400" />
              </div>
              <h3 className="text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
