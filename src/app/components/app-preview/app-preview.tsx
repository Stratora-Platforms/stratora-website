import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { DESIGN_HEIGHT, DESIGN_WIDTH, TICK_MS } from "./app-preview-data";
import { AlertsView } from "./views/alerts-view";
import { EscalationView } from "./views/escalation-view";
import { IpamView } from "./views/ipam-view";
import { NocDashboardView } from "./views/noc-dashboard-view";
import { RackView } from "./views/rack-view";
import { SiteOverviewView } from "./views/site-overview-view";
import { TopologyView } from "./views/topology-view";
import { WorldMapView } from "./views/world-map-view";

/**
 * One recreated app view, scaled to fit its container.
 *
 * The views are authored at the app's real 1920x1080 layout — the same size
 * the PNG screenshots these replaced were captured at — and scaled from the
 * top-left, with the wrapper's height set to match so the transform leaves no
 * gap. See tools/screenshots/ for how to recapture reference shots to check
 * these against the real app.
 *
 * Animation is gated on `active`: the carousel lays every slide out in one
 * track, so without that gate all eight views would animate at once, off
 * screen, for the whole life of the page.
 */

export type ViewId =
  | "dashboard"
  | "world-map"
  | "topology"
  | "alerts"
  | "escalation"
  | "site-overview"
  | "ipam"
  | "rack";

export type ViewProps = {
  /** Increments once per TICK_MS while the view is on screen and active. */
  tick: number;
  /** Intro progress, 0 to 1, eased. Counters and bars animate against this. */
  ease: number;
  reduced: boolean;
};

const VIEWS: Record<ViewId, (props: ViewProps) => JSX.Element> = {
  dashboard: NocDashboardView,
  "world-map": WorldMapView,
  topology: TopologyView,
  alerts: AlertsView,
  escalation: EscalationView,
  "site-overview": SiteOverviewView,
  ipam: IpamView,
  rack: RackView,
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTRO_MS = 1400;

/* There used to be a MIN_SCALE floor of 0.45 here, with the view cropped and
   panned past the sidebar on anything under 768px. It kept the app's type
   legible, but it meant a phone saw roughly 760px of the 1920px layout and no
   way to reach the rest: .ap-fit clips, so swiping to find the missing half
   just advanced the carousel. Fitting the whole view is the lesser evil —
   you can see what each view IS, which is what the carousel is for. */

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function AppPreview({ view, active = true }: { view: ViewId; active?: boolean }) {
  const fitRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(prefersReducedMotion);
  const [tick, setTick] = useState(0);
  const [t, setT] = useState(() => (prefersReducedMotion() ? 1 : 0));

  /* -- fit ----------------------------------------------------------------
     The whole 1920x1080 view scales to the container's width, at every size.
     The wrapper's height is set to match so the transform leaves no gap. */
  const applyFit = useCallback(() => {
    const fit = fitRef.current;
    const inner = innerRef.current;
    if (!fit || !inner) return;

    const scale = fit.clientWidth / DESIGN_WIDTH;
    inner.style.transform = `scale(${scale})`;

    const height = `${Math.round(DESIGN_HEIGHT * scale)}px`;
    if (fit.style.height !== height) fit.style.height = height;
  }, []);

  useLayoutEffect(() => {
    applyFit();
    const observer = new ResizeObserver(() => applyFit());
    if (fitRef.current) observer.observe(fitRef.current);
    window.addEventListener("resize", applyFit);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyFit);
    };
  }, [applyFit]);

  /* -- reduced motion ----------------------------------------------------- */
  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION_QUERY);
    const sync = () => setReduced(query.matches);
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  /* -- intro + loop -------------------------------------------------------
     One interval and one rAF at most, both cleared before being replaced, so
     scrolling away and back or switching slides can never leave two running. */
  const intervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const elapsed = useRef(0);
  const lastFrame = useRef(0);
  const onScreen = useRef(false);

  useEffect(() => {
    if (reduced || !active) {
      // Inactive slides render their settled state and run nothing.
      setT(1);
      return;
    }

    const node = fitRef.current;
    if (!node) return;

    const stop = () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastFrame.current = 0;
    };

    const frame = (now: number) => {
      if (lastFrame.current === 0) lastFrame.current = now;
      elapsed.current += Math.min(100, now - lastFrame.current);
      lastFrame.current = now;
      const progress = Math.min(1, elapsed.current / INTRO_MS);
      setT(progress);
      rafRef.current = progress < 1 ? window.requestAnimationFrame(frame) : null;
    };

    const sync = () => {
      if (!onScreen.current || document.hidden) {
        stop();
        return;
      }
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(() => setTick((v) => v + 1), TICK_MS);
      }
      if (rafRef.current === null && elapsed.current < INTRO_MS) {
        lastFrame.current = 0;
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen.current = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.05 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [reduced, active]);

  const View = VIEWS[view];
  const ease = 1 - Math.pow(1 - t, 3);

  return (
    <div className="ap-root">
      <div className="ap-fit" ref={fitRef} aria-hidden="true">
        <div className="ap-fit-inner" ref={innerRef}>
          <View tick={tick} ease={ease} reduced={reduced} />
        </div>
      </div>
    </div>
  );
}
