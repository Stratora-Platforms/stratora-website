import { motion } from "motion/react";
import { MSI_DOWNLOAD_URL } from "../constants";
import { navigate } from "../lib/navigate";

/**
 * Pricing — restyle only.
 *
 * Same three tiers, same prices, same deltas, same CTAs and the same wiring:
 * MSI_DOWNLOAD_URL, PRO_ANNUAL_LINK, mailto:sales@stratora.io, and the
 * /billing link through navigate() so Cloudflare Web Analytics still counts
 * one pageview per navigation.
 *
 * The approved look drops the cards from Community and Enterprise — they sit
 * flat on a rule that runs behind all three — and raises Pro as a bordered,
 * glowing card that breaks out above and below that rule.
 */

const PRO_ANNUAL_LINK = "https://buy.stripe.com/4gM3cx0jTe28gyC2OYefC04";

// Shared platform features — identical on all three tiers. Proves
// "Same platform. Same features. Scale by node count."
const PLATFORM_FEATURES = [
  "Full platform — dashboards, alerting, collectors & agents",
  "RBAC with local accounts",
  "LDAP / Active Directory authentication",
  "OIDC / Microsoft Entra ID SSO",
  "Email, Slack, Teams & webhook alerting",
  "SMS & Voice alerting via your own Twilio account (US-cell SMS requires A2P 10DLC registration)",
];

type Plan = {
  name: string;
  price: string;
  priceSuffix: string;
  period: string;
  description: string;
  deltas: string[];
  cta: string;
  href: string;
  highlighted: boolean;
  helperText?: boolean;
};

const PLANS: Plan[] = [
  {
    name: "Community Edition",
    price: "Free",
    priceSuffix: "",
    period: "forever",
    description: "Full-featured monitoring for labs and small environments",
    deltas: ["Up to 100 nodes", "Community support"],
    cta: "Download Free",
    href: MSI_DOWNLOAD_URL,
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$3,000",
    priceSuffix: "/ year",
    period: "billed annually",
    description: "Production-ready monitoring for real environments",
    deltas: ["250 nodes included", "Add 250-node packs for $3,000/yr each", "Priority email support"],
    cta: "Get Started with Pro",
    href: PRO_ANNUAL_LINK,
    highlighted: true,
    helperText: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    priceSuffix: "",
    period: "Volume discounts available",
    description: "Monitoring at any scale with dedicated support",
    deltas: ["Unlimited nodes", "Dedicated onboarding", "SLA-backed support", "Volume pricing"],
    cta: "Contact Sales",
    href: "mailto:sales@stratora.io",
    highlighted: false,
  },
];

function Tick({ strong }: { strong: boolean }) {
  return (
    <svg
      className="mt-[3px] h-3.5 w-3.5 flex-shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke={strong ? "#c4b5fd" : "#6b6b78"}
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

function PlanColumn({ plan }: { plan: Plan }) {
  const rows = [
    ...PLATFORM_FEATURES.map((label) => ({ label, delta: false })),
    ...plan.deltas.map((label) => ({ label, delta: true })),
  ];

  return (
    <div className={plan.highlighted ? "pr-card" : "pr-plain"}>
      {plan.highlighted ? <span className="pr-badge">Most Popular</span> : null}

      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className="mt-1.5 text-sm text-muted-foreground">{plan.description}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl md:text-5xl font-semibold tracking-tight">{plan.price}</span>
        {plan.priceSuffix ? (
          <span className="text-sm text-muted-foreground leading-tight">{plan.priceSuffix}</span>
        ) : null}
        <span className="text-xs text-muted-foreground leading-tight">{plan.period}</span>
      </div>

      <ul className="mt-7 flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.label} className="flex items-start gap-2.5">
            <Tick strong={row.delta} />
            <span className={`text-sm leading-snug ${row.delta ? "font-medium text-foreground" : "text-muted-foreground"}`}>
              {row.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-7">
        {plan.helperText ? (
          <p className="mb-3 text-xs text-muted-foreground">
            Need more nodes? Add 250 at a time at checkout or anytime via the{" "}
            <a
              href="/billing"
              onClick={(e) => {
                e.preventDefault();
                navigate("/billing");
              }}
              className="text-orange-accent transition-colors hover:text-orange-bright"
            >
              billing portal
            </a>
            .
          </p>
        ) : null}
        <a
          href={plan.href}
          target="_blank"
          rel="noopener noreferrer"
          className={plan.highlighted ? "pr-cta pr-cta-primary" : "pr-cta"}
        >
          {plan.cta}
        </a>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-3xl md:text-5xl tracking-tight">Simple, Transparent Pricing</h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Same platform. Same features. Scale by node count.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="pr-grid mx-auto max-w-6xl"
        >
          {/* The rule the flat tiers sit on; Pro breaks out of it. */}
          <span className="pr-rule" aria-hidden="true" />
          {PLANS.map((plan) => (
            <PlanColumn key={plan.name} plan={plan} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
