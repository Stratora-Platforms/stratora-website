import { useEffect } from "react";
import { BellRing } from "lucide-react";
import { motion } from "motion/react";
import { HubSpotForm } from "../components/hubspot-form";
import { navigate } from "../lib/navigate";

/**
 * /subscribe — the newsletter sign-up page every entry point links to.
 *
 * Entry points pass ?source=website|downloads|documentation|community. The
 * page doesn't forward it anywhere itself: it stays in the URL (404.html keeps
 * the query string across GitHub Pages' deep-link redirect), the HubSpot embed
 * hands the page's query string to its frame, and HubSpot records the page
 * URL on each submission. To store it on the contact, add a hidden field to
 * the form in HubSpot backed by a contact property whose internal name is
 * `source` (HubSpot pre-fills fields from matching query parameters) and
 * confirm the value lands on a test submission.
 *
 * The form carries its own heading, description and consent text, so the page
 * only titles and frames it rather than repeating any of that.
 */

const TITLE = "Subscribe to Updates — Stratora";

export function SubscribePage() {
  useEffect(() => {
    const previous = document.title;
    document.title = TITLE;
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32 md:pt-36">
      {/* Same faint purple wash the landing sections sit on, plus a glow
          behind the form card. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background via-purple-950/10 to-background" />
      <div className="pointer-events-none absolute left-1/2 top-48 h-96 w-[min(44rem,90vw)] -translate-x-1/2 rounded-full bg-purple-600/15 blur-3xl" />

      <div className="container relative z-10 mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">
            <BellRing className="h-3.5 w-3.5" aria-hidden="true" />
            Product updates
          </span>
          <h1 className="mt-5 text-3xl tracking-tight md:text-5xl">Stay in the Loop</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: "easeOut", delay: 0.08 }}
          className="rounded-2xl border border-purple-500/30 bg-card/60 p-2 shadow-2xl shadow-purple-500/15 backdrop-blur-sm sm:p-3"
        >
          <HubSpotForm />
        </motion.div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Subscribing is optional — Community Edition downloads never require it. See our{" "}
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              navigate("/privacy-policy");
            }}
            className="text-purple-400 underline transition-colors hover:text-purple-300"
          >
            Privacy Policy
          </a>{" "}
          for how subscriber details are handled.
        </p>
      </div>
    </section>
  );
}
