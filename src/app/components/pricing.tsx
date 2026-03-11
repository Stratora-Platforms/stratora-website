import { Check, Zap } from "lucide-react";
import { motion } from "motion/react";

export function Pricing() {
  const plans = [
    {
      name: "Community Edition",
      price: "Free",
      period: "forever",
      description: "Full-featured monitoring for labs and small environments",
      features: [
        "Full Stratora monitoring platform",
        "Metrics, logs, and events",
        "SNMP, ICMP, HTTP / HTTPS monitoring",
        "Windows Agent",
        "Linux Agent",
        "Dashboards, alerts, and templates",
        "Distributed collectors",
        "Role-based access control (RBAC)",
        "Local authentication",
        "LDAP / Active Directory authentication",
        "Up to 100 monitored nodes",
        "Community updates & documentation",
      ],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$250",
      period: "starting at / month",
      description: "Production-ready monitoring for real environments",
      features: [
        "Full Stratora platform (no feature restrictions)",
        "Up to 250 monitored nodes",
        "Expandable with 250 node add-on packs",
        "Higher ingestion limits",
        "Extended data retention",
        "Unlimited dashboards and alerts",
        "Advanced alerting & escalation",
        "OAuth / SSO with MFA support (Entra ID, OIDC)",
        "Priority support",
        "Additional node tiers available (contact sales)",
      ],
      cta: "Start Free Trial",
      highlighted: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Unlimited scale, security, and control",
      features: [
        "Unlimited monitored nodes",
        "Custom data retention policies",
        "Dedicated or isolated infrastructure",
        "Advanced security and compliance controls",
        "Enterprise SSO with enforced MFA",
        "White-labeling (optional)",
        "Custom integrations",
        "Architecture & onboarding assistance",
        "24×7 support with SLAs",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="relative px-6 py-20">
      <div className="container mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Same platform. Same features. Scale by node count.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <PricingCard {...plan} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
}

function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  highlighted,
}: PricingCardProps) {
  const isMonthly = price !== "Custom" && price !== "Free";

  return (
    <div
      className={`relative rounded-2xl border p-8 transition-all h-full flex flex-col ${
        highlighted
          ? "border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-card/50 shadow-2xl shadow-purple-500/20"
          : "border-border/50 bg-card/50 hover:border-purple-500/30"
      }`}
    >
      {/* Popular badge */}
      {highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-1 text-xs text-white shadow-lg">
            <Zap className="h-3 w-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Glow effect for highlighted */}
      {highlighted && (
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/20 to-purple-800/20 rounded-2xl blur-xl -z-10" />
      )}

      {/* Plan name */}
      <div className="mb-4">
        <h3 className="text-xl mb-2">{name}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            {price}
          </span>
          {isMonthly && (
            <span className="text-muted-foreground text-sm">/ month</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{period}</div>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        className={`w-full rounded-full py-3 transition-all ${
          highlighted
            ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30"
            : "border border-border text-foreground hover:bg-secondary"
        }`}
      >
        {cta}
      </button>
    </div>
  );
}
