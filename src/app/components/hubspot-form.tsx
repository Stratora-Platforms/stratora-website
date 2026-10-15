import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import {
  HUBSPOT_NEWSLETTER_FORM_ID,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_REGION,
  loadHubSpotFormsScript,
} from "../lib/hubspot";

/**
 * Renders HubSpot's newsletter form through the official frame embed.
 *
 * HubSpot owns everything inside the frame — fields, the marketing-consent
 * checkbox, reCAPTCHA, the submit and thank-you states — and none of it is
 * touched here. This component only loads the script once, gives HubSpot an
 * empty container, and shows a placeholder until the form reports ready.
 *
 * The container is keyed so a retry hands HubSpot a fresh element rather than
 * one it has already claimed, which is also what keeps a remount (leaving
 * /subscribe and coming back) from rendering the form twice.
 *
 * The frame is transparent and HubSpot's default form theme uses dark slate
 * text, as does the white "free forms" branding bar on the Free plan, so the
 * form sits on a light panel rather than straight on the site's dark surface.
 */

type Status = "loading" | "ready" | "error";

// A form that hasn't reported ready by now is treated as blocked (an ad or
// privacy extension, a network policy) rather than left spinning forever.
const READY_TIMEOUT_MS = 20_000;

export function HubSpotForm({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Registered before HubSpot can see the container, so the ready event can't
  // fire ahead of the listener.
  useLayoutEffect(() => {
    const onReady = (e: Event) => {
      const detail = (e as CustomEvent<{ formId?: string }>).detail;
      if (detail?.formId && detail.formId !== HUBSPOT_NEWSLETTER_FORM_ID) return;
      setStatus("ready");
    };
    document.addEventListener("hs-form-event:on-ready", onReady);
    return () => document.removeEventListener("hs-form-event:on-ready", onReady);
  }, [attempt]);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    loadHubSpotFormsScript().catch(() => {
      if (!cancelled) setStatus("error");
    });

    const timer = window.setTimeout(() => {
      if (cancelled) return;
      // The ready event is the signal; a rendered frame is accepted as a
      // fallback in case a future embed version stops emitting it.
      const frame = containerRef.current?.querySelector("iframe");
      setStatus((s) => (s === "loading" ? (frame ? "ready" : "error") : s));
    }, READY_TIMEOUT_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return (
    <div className={`relative rounded-xl bg-white p-2 text-slate-700 sm:p-4 ${className}`}>
      {status !== "error" && (
        <div
          key={attempt}
          ref={containerRef}
          className="hs-form-frame"
          data-region={HUBSPOT_REGION}
          data-form-id={HUBSPOT_NEWSLETTER_FORM_ID}
          data-portal-id={HUBSPOT_PORTAL_ID}
          aria-busy={status === "loading"}
          style={{
            // Kept in the layout (not display:none) while loading so the frame
            // can measure itself; only hidden visually until it is ready.
            minHeight: status === "loading" ? 360 : undefined,
            opacity: status === "ready" ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {status === "loading" && (
        <div
          role="status"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm text-slate-500"
        >
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" aria-hidden="true" />
          Loading subscription form…
        </div>
      )}

      {status === "error" && (
        <div
          role="alert"
          className="flex min-h-[360px] flex-col items-center justify-center gap-4 px-4 text-center"
        >
          <AlertTriangle className="h-7 w-7 text-orange-500" aria-hidden="true" />
          <div>
            <p className="font-medium text-slate-900">The subscription form couldn't load.</p>
            <p className="mt-2 text-sm text-slate-500">
              A browser extension or network policy may be blocking HubSpot forms. Try again, or
              let us know at{" "}
              <a
                href="mailto:support@stratora.io"
                className="text-purple-700 underline transition-colors hover:text-purple-800"
              >
                support@stratora.io
              </a>{" "}
              if it keeps happening.
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-5 py-2 text-sm text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-700 hover:to-purple-800"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
