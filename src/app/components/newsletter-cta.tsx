import { ArrowRight, BellRing } from "lucide-react";
import { motion } from "motion/react";
import { navigate } from "../lib/navigate";
import { subscribeHref } from "../lib/hubspot";

/**
 * Newsletter CTA — the last landing section, just above the footer.
 *
 * A compact banner that links to /subscribe rather than embedding the HubSpot
 * form here: the full form (its own heading, consent text and reCAPTCHA) is
 * tall enough to dominate the page's closing section, and keeping it off the
 * landing page means homepage visitors make no requests to HubSpot at all.
 */
export function NewsletterCta() {
  const href = subscribeHref("website");

  return (
    <section id="newsletter" className="relative px-6 pb-24 pt-4">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-purple-500/30 bg-card/50 px-6 py-10 shadow-2xl shadow-purple-500/10 sm:px-10"
        >
          {/* Soft glow behind the copy, in the same purple as the CTAs. */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div className="flex flex-col items-center gap-4 md:flex-row md:items-start">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10">
                <BellRing className="h-5 w-5 text-purple-300" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-2xl tracking-tight md:text-3xl">Stay in the Loop</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">
                  Get Stratora release announcements, new features, and occasional product updates.
                </p>
              </div>
            </div>

            <a
              href={href}
              onClick={(e) => {
                e.preventDefault();
                navigate(href);
              }}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-2.5 text-sm text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-700 hover:to-purple-800"
            >
              Subscribe to Updates
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
