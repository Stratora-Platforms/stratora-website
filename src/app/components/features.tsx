import {
  Network,
  LayoutGrid,
  Radar,
  Cpu,
  Bell,
  ShieldCheck,
  Send,
  Map,
  Globe,
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
        "Deploy consistent monitoring fast with device templates for switches, firewalls, APs, servers, NAS, ping checks, and web services / HTTP endpoints. Add custom templates for anything we don't ship out of the box.",
    },
    {
      icon: Network,
      title: "Distributed collectors for segmented networks",
      description:
        "Deploy Stratora collectors into segmented IT and OT zones with automatic config generation. Day-1 protocols: SNMP, ping, HTTP/HTTPS, and agent telemetry — protocol-agnostic monitoring of OT-zone infrastructure (managed switches, HMIs, historians). OT-specific protocols and vendor templates on the roadmap.",
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
        "Notify the right people via email, Microsoft Teams, Slack, SMS, and phone call. Two-way acknowledgment on email, Teams, and SMS; voice calls deliver spoken alert details. Add escalation chains, mute, and maintenance-aware suppression.",
    },
    {
      icon: ShieldCheck,
      title: "RBAC + LDAP/OIDC SSO authentication",
      description:
        "Built-in role-based access control with local accounts and identity provider pass-through (Active Directory, LDAP, Entra ID, and any OIDC-compliant provider), including group-to-role mapping. No credentials stored.",
    },
    {
      icon: Send,
      title: "Syslog Destinations",
      description:
        "Stream every audit event to your SIEM in real time. Supports Splunk, Elastic, Graylog, and any RFC-compliant syslog receiver.",
    },
    {
      icon: Map,
      title: "Network diagrams",
      description:
        "Topology maps, rack diagrams, and geographic site maps with live health overlays. Drag devices onto a canvas, draw connections with live interface utilization, place equipment into rack U positions, or pin sites onto a world map. All three update in real-time as your environment changes.",
    },
    {
      icon: Globe,
      title: "IPAM",
      description:
        "Track IP address space across supernets, subnets, and individual addresses. VLAN tags, gateway IPs, DHCP flags, and site-binding per subnet. Live utilization bars flag subnets approaching capacity. Address records sync from discovery scans and link to monitored nodes.",
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
              className="rounded-2xl border border-border/50 bg-card/50 p-8 hover:border-orange-accent/30 transition-all"
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
