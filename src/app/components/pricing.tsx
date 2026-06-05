import { Check, Zap, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import { MSI_DOWNLOAD_URL } from "../constants";
import { navigate } from "../lib/navigate";
import { cn } from "./ui/utils";

const PRO_ANNUAL_LINK =
  "https://buy.stripe.com/4gM3cx0jTe28gyC2OYefC04";

// Shared platform features — identical on all three tiers (green checks). Proves
// "Same platform. Same features. Scale by node count."
const PLATFORM_FEATURES = [
  "Full platform — dashboards, alerting, collectors & agents",
  "RBAC with local accounts",
  "LDAP / Active Directory authentication",
  "OIDC / Microsoft Entra ID SSO",
  "Email, Slack, Teams & webhook alerting",
  "SMS & Voice alerting via your own Twilio account (US-cell SMS requires A2P 10DLC registration)",
];

export function Pricing() {
  const plans = [
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
      deltas: [
        "250 nodes included",
        "Add 250-node packs for $3,000/yr each",
        "Priority email support",
      ],
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
      deltas: [
        "Unlimited nodes",
        "Dedicated onboarding",
        "SLA-backed support",
        "Volume pricing",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@stratora.io",
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

// A single feature row. Delta rows (per-tier value) get a purple icon + emphasized
// foreground text; base rows get a green check + muted text.
function FeatureRow({ label, isDelta }: { label: string; isDelta: boolean }) {
  const Icon = isDelta ? ArrowUpRight : Check;
  return (
    <li className="flex items-start gap-3">
      <Icon
        className={cn(
          "h-5 w-5 flex-shrink-0 mt-0.5",
          isDelta ? "text-purple-400" : "text-emerald-400",
        )}
      />
      <span
        className={cn(
          "text-sm",
          isDelta ? "font-semibold text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </li>
  );
}

interface PricingCardProps {
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
}

function PricingCard({
  name,
  price,
  priceSuffix,
  period,
  description,
  deltas,
  cta,
  href,
  highlighted,
  helperText,
}: PricingCardProps) {
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
          <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-accent to-orange-deep px-4 py-1 text-xs text-white shadow-lg">
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
          {priceSuffix && (
            <span className="text-muted-foreground text-sm">{priceSuffix}</span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-1">{period}</div>
      </div>

      {/* Features — shared platform list first (aligns across columns), then the
          per-tier deltas (emphasized) at the bottom, near the CTA */}
      <ul className="space-y-3">
        {PLATFORM_FEATURES.map((feature, i) => (
          <FeatureRow key={`feature-${i}`} label={feature} isDelta={false} />
        ))}
        {deltas.map((delta, i) => (
          <FeatureRow key={`delta-${i}`} label={delta} isDelta />
        ))}
      </ul>

      {/* CTA Button */}
      <div className="mt-auto pt-6">
        {helperText && (
          <p className="text-xs text-muted-foreground text-center mb-3">
            Need more nodes? Add 250 at a time at checkout or anytime via the{" "}
            <a
              href="/billing"
              onClick={(e) => {
                e.preventDefault();
                navigate("/billing");
              }}
              className="text-orange-accent hover:text-orange-bright transition-colors"
            >
              billing portal
            </a>
            .
          </p>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`w-full rounded-full py-3 transition-all text-center block ${
            highlighted
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-lg shadow-purple-500/30"
              : "border border-border text-foreground hover:bg-secondary"
          }`}
        >
          {cta}
        </a>
      </div>
    </div>
  );
}
