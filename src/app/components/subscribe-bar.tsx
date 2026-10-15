import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./ui/dialog";
import { HubSpotForm } from "./hubspot-form";
import { dismissNewsletterPrompt, shouldPromptNewsletter } from "../lib/hubspot";

/**
 * Bottom subscribe bar for the landing page.
 *
 * A slim, full-width bar that follows the visitor down the page and opens the
 * HubSpot form in a modal. HubSpot's form can't be restyled into one row (it
 * is a frame with its own heading, consent text, reCAPTCHA and branding), so
 * the bar is our own markup and the real form only appears on request — which
 * also means HubSpot's script is never loaded unless someone clicks Subscribe.
 *
 * To keep it from feeling pushy it:
 *  - waits until the visitor has scrolled past the hero,
 *  - steps aside once the page's own "Stay in the Loop" section is reached,
 *    so the two never show at once and the footer is never covered,
 *  - goes away for 30 days on dismiss, and for good after a subscription
 *    (from here or /subscribe) in this browser.
 */
export function SubscribeBar() {
  // Read once: a dismissal or subscription made during this visit is handled
  // by the local state below.
  const [eligible, setEligible] = useState(shouldPromptNewsletter);
  const [inRange, setInRange] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!eligible) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const pastHero = window.scrollY > vh * 0.9;
      const cta = document.getElementById("newsletter");
      const reachedCta = !!cta && cta.getBoundingClientRect().top < vh;
      setInRange(pastHero && !reachedCta);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [eligible]);

  const dismiss = () => {
    dismissNewsletterPrompt();
    setEligible(false);
  };

  return (
    <>
      <AnimatePresence>
        {eligible && inRange && (
          <motion.aside
            key="subscribe-bar"
            aria-label="Subscribe to Stratora updates"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-purple-500/20 bg-[#0b0a12]/85 shadow-[0_-12px_40px_-12px_rgba(139,92,246,0.25)] backdrop-blur-xl"
          >
            {/* Purple-to-orange hairline, the same pairing as the site's CTAs
                and accents. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/80 to-orange-accent/70" />
            <div className="pointer-events-none absolute -top-10 left-1/4 h-20 w-1/2 rounded-full bg-purple-600/10 blur-2xl" />

            <div className="container relative mx-auto flex items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
              <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-accent/30 bg-orange-accent/10 sm:flex">
                <BellRing className="h-[18px] w-[18px] text-orange-accent" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium sm:text-base">
                  <span className="sm:hidden">Get Stratora updates</span>
                  <span className="hidden sm:inline">Stay in the Loop</span>
                </p>
                <p className="hidden truncate text-sm text-muted-foreground sm:block">
                  Release announcements, new features, and occasional product updates.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="shrink-0 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-2 text-sm text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-700 hover:to-purple-800 sm:px-6"
              >
                Subscribe
              </button>

              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss for now"
                title="Dismiss"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        {/* The dialog portals to <body>, outside App's .dark wrapper, so it
            opts into the dark tokens itself. */}
        <DialogContent
          // Focus the dialog itself rather than its close button, so opening
          // it doesn't land a focus ring on the X before anyone has tabbed.
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            document.querySelector<HTMLElement>('[data-slot="dialog-content"]')?.focus();
          }}
          className="dark max-h-[calc(100dvh-2rem)] overflow-y-auto outline-none [color-scheme:dark] border-purple-500/30 max-w-[calc(100%-1rem)] bg-background p-1.5 pt-12 text-foreground shadow-2xl shadow-purple-500/20 sm:max-w-xl sm:p-4 sm:pt-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/80 to-orange-accent/70" />
          <div className="absolute left-4 top-3.5 inline-flex items-center gap-2 text-xs text-purple-200">
            <BellRing className="h-3.5 w-3.5 text-orange-accent" aria-hidden="true" />
            Product updates
          </div>
          <DialogTitle className="sr-only">Subscribe to Stratora updates</DialogTitle>
          <DialogDescription className="sr-only">
            Release announcements, new features, and occasional product updates by email.
          </DialogDescription>
          <HubSpotForm onSubmitted={() => setEligible(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
