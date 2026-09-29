import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ALERTING_BADGE,
  ALERTS,
  ALERTS_TOTAL,
  CALLOUT,
  CALLOUT_LEADER,
  CITY_LABELS,
  DESIGN_WIDTH,
  ESCALATION,
  ESCALATION_STEPS,
  ESTATE,
  FEED_AGES,
  FEED_EVENTS,
  FEED_ROWS,
  INTRO_MS,
  KPIS,
  MAP_ARCS,
  MAP_PINS,
  REGIONS,
  SITES,
  SITE_STATUS_CHIPS,
  STATUS_PILLS,
  TICK_MS,
  siteBarColor,
} from "./live-dashboard-data";

/**
 * The animated "live dashboard" that stands in for a product screenshot under
 * the hero. It is illustrative only: the whole frame is aria-hidden, nothing
 * inside it is focusable, and a single visually-hidden sentence describes it.
 *
 * Three things move:
 *   1. An intro count-up (~1.8s, cubic ease-out) on every number — KPIs, the
 *      health ring, the healthy-nodes line, and the per-site bars.
 *   2. A 2.6s tick that advances the escalation card's highlighted step and
 *      shifts the activity feed by one event.
 *   3. Continuous CSS loops — pin pulses, dashes flowing toward NYC, the scan
 *      line, the Frankfurt callout, the blinking live dots.
 *
 * Both JS-driven behaviours are gated on an IntersectionObserver and paused
 * when the tab is hidden, and all of it is skipped under prefers-reduced-
 * motion, which renders the finished state instead.
 */

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");

/** Same colour at 20% alpha — the glow ring on the active dot. */
const glow = (hex: string) => `${hex}33`;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const COMPACT_QUERY = "(max-width: 767.98px)";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

export function LiveDashboard() {
  const fitRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  const [reduced, setReduced] = useState(prefersReducedMotion);
  /** Intro progress, 0 to 1. */
  const [t, setT] = useState(() => (prefersReducedMotion() ? 1 : 0));
  /** Loop counter — drives the escalation step and the feed offset. */
  const [tick, setTick] = useState(0);

  /* -- fit ---------------------------------------------------------------
     The frame lays out at its 1240px design width and is scaled down to the
     container. Scaling from the top-left corner means the painted box is
     exactly `scale * 1240` wide, flush with the container — and the wrapper
     takes the scaled height so the transform leaves no gap below it. */
  const applyFit = useCallback(() => {
    const fit = fitRef.current;
    const inner = innerRef.current;
    if (!fit || !inner) return;

    if (window.matchMedia(COMPACT_QUERY).matches) {
      // Compact mode reflows instead of scaling; CSS owns the sizing.
      inner.style.width = "";
      inner.style.transform = "";
      fit.style.height = "";
      return;
    }

    inner.style.width = `${DESIGN_WIDTH}px`;
    const scale = Math.min(1, fit.clientWidth / DESIGN_WIDTH);
    inner.style.transform = scale === 1 ? "" : `scale(${scale})`;

    const height = `${Math.ceil(inner.offsetHeight * scale)}px`;
    if (fit.style.height !== height) fit.style.height = height;
  }, []);

  // useLayoutEffect so the frame is never painted unscaled, which would
  // briefly overflow narrow viewports.
  useLayoutEffect(() => {
    applyFit();

    const observer = new ResizeObserver(() => applyFit());
    if (fitRef.current) observer.observe(fitRef.current);
    if (innerRef.current) observer.observe(innerRef.current);
    window.addEventListener("resize", applyFit);

    // Swapping in Geist Mono changes the numeral metrics, and with them the
    // frame's height.
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        if (!cancelled) applyFit();
      });
    }

    return () => {
      cancelled = true;
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
     One interval and one rAF at most, both owned by refs and always cleared
     before being replaced, so scrolling away and back or switching tabs can
     never leave two running (which would show up as the feed jumping by two
     events per tick). */
  const intervalRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const introElapsed = useRef(0);
  const lastFrame = useRef(0);
  const visible = useRef(false);

  useEffect(() => {
    if (reduced) {
      // Render the finished state: full counts, first step highlighted,
      // static feed.
      setT(1);
      setTick(0);
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
      // Clamp so a long pause can't jump the intro to the end in one step.
      introElapsed.current += Math.min(100, now - lastFrame.current);
      lastFrame.current = now;

      const progress = Math.min(1, introElapsed.current / INTRO_MS);
      setT(progress);
      rafRef.current = progress < 1 ? window.requestAnimationFrame(frame) : null;
    };

    const sync = () => {
      const shouldRun = visible.current && !document.hidden;
      if (!shouldRun) {
        stop();
        return;
      }
      if (intervalRef.current === null) {
        intervalRef.current = window.setInterval(
          () => setTick((value) => value + 1),
          TICK_MS,
        );
      }
      if (rafRef.current === null && introElapsed.current < INTRO_MS) {
        lastFrame.current = 0;
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        visible.current = entries.some((entry) => entry.isIntersecting);
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
  }, [reduced]);

  /* -- derived values ----------------------------------------------------- */
  const ease = 1 - Math.pow(1 - t, 3);
  const activeStep = tick % ESCALATION_STEPS.length;
  const score = Math.round(ESTATE.healthScore * ease);
  const ringOffset = (ESTATE.ringLength * (1 - (ESTATE.healthScore / 100) * ease)).toFixed(1);

  const feed = Array.from({ length: FEED_ROWS }, (_, row) => {
    const count = FEED_EVENTS.length;
    const event = FEED_EVENTS[(count - (tick % count) + row) % count];
    return { ...event, ago: FEED_AGES[row], isNew: row === 0 };
  });

  return (
    <div className="sd-root">
      <span className="sr-only">
        Animated preview of the Stratora home dashboard monitoring {ESTATE.sites} sites
        across {ESTATE.countries} countries.
      </span>

      <div className="sd-fit" ref={fitRef} aria-hidden="true">
        <div className="sd-fit-inner" ref={innerRef}>
          <div className="sd-frame">
            {/* ---------------------------------------------------- top bar */}
            <div className="sd-topbar">
              <div className="sd-wordmark">STRATORA</div>
              <div className="sd-grow" />
              <div className="sd-pills sd-mono">
                {STATUS_PILLS.map((pill, index) => (
                  <span
                    key={pill.value}
                    className={`sd-pill${index >= 3 ? " sd-pill-optional" : ""}`}
                    style={{ background: pill.bg, color: pill.fg }}
                  >
                    <span className="sd-pill-dot" style={{ background: pill.dot }} />
                    {pill.value}
                  </span>
                ))}
              </div>
              <div className="sd-search">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <span>Search {ESTATE.nodesLabel} nodes…</span>
              </div>
              <div className="sd-org">
                <span className="sd-avatar">HG</span>
                <span className="sd-org-name">Halden Group</span>
              </div>
            </div>

            <div className="sd-body">
              {/* -------------------------------------------------- sidebar */}
              <div className="sd-sidebar">
                <div className="sd-nav sd-nav-active">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />
                  </svg>
                  <span>Home</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h4l3-8 4 16 3-8h4" />
                  </svg>
                  <span>Monitoring</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="18" height="7" rx="1.5" />
                    <rect x="3" y="13" width="18" height="7" rx="1.5" />
                  </svg>
                  <span>Infrastructure</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="2" />
                    <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" />
                  </svg>
                  <span>Collection</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
                    <path d="M10 21h4" />
                  </svg>
                  <span>Alerting</span>
                  <span className="sd-nav-badge sd-mono">{ALERTING_BADGE}</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
                  </svg>
                  <span>Administration</span>
                </div>
                <div className="sd-nav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />
                  </svg>
                  <span>Integrations</span>
                </div>
                <div className="sd-grow" />
                <div className="sd-sidebar-foot">
                  <div className="sd-sidebar-foot-row">
                    <span className="sd-live sd-pill-dot" style={{ background: "#22c55e" }} />
                    <span>{ESTATE.collectors} collectors online</span>
                  </div>
                  <div className="sd-mono" style={{ color: "#7e7e98" }}>
                    {ESTATE.sites} sites · {ESTATE.countries} countries
                  </div>
                </div>
              </div>

              <div className="sd-main">
                {/* ------------------------------------------------- map */}
                <div className="sd-map">
                  <div className="sd-map-viewport">
                    <div className="sd-map-bg" />
                    <div className="sd-sweep" />
                    <svg className="sd-map-svg" viewBox="0 0 1060 340" preserveAspectRatio="none">
                      {/* Faint static arcs from HQ out to every collector. */}
                      <g fill="none" stroke="var(--sd-accent)" strokeWidth="1" opacity=".22">
                        {MAP_ARCS.map((arc) => (
                          <path key={arc.base} d={arc.base} />
                        ))}
                      </g>
                      {/* The same arcs reversed, so the dashes march toward HQ. */}
                      <g fill="none" stroke="var(--sd-accent)" strokeWidth="1.6" strokeLinecap="round">
                        {MAP_ARCS.map((arc) => (
                          <path
                            key={arc.flow}
                            className="sd-flow"
                            style={{ animationDelay: arc.delay }}
                            d={arc.flow}
                          />
                        ))}
                      </g>
                      <g>
                        {MAP_PINS.map((pin) => {
                          const fill = pin.fill === "accent" ? "var(--sd-accent)" : pin.fill;
                          return (
                            <g key={`${pin.cx}-${pin.cy}`}>
                              <circle
                                className="sd-pulse"
                                style={{
                                  animationDelay: pin.delay,
                                  animationDuration: pin.duration,
                                }}
                                cx={pin.cx}
                                cy={pin.cy}
                                r={pin.r}
                                fill={fill}
                              />
                              <circle
                                cx={pin.cx}
                                cy={pin.cy}
                                r={pin.hq ? 5.5 : pin.r}
                                fill={fill}
                                stroke="#0a0a11"
                                strokeWidth={pin.hq ? 2 : 1.5}
                              />
                            </g>
                          );
                        })}
                      </g>
                      <g className="sd-map-labels" fontSize="9.5" fill="#8f8fa8">
                        {CITY_LABELS.map((label) => (
                          <text key={label.text} x={label.x} y={label.y} fill={label.fill}>
                            {label.text}
                          </text>
                        ))}
                      </g>
                      {/* Leader line out to the Frankfurt callout. */}
                      <path
                        d={CALLOUT_LEADER}
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="1"
                        strokeDasharray="2 3"
                        opacity=".8"
                      />
                    </svg>
                  </div>

                  <div className="sd-callout">
                    <div className="sd-callout-head">
                      <span className="sd-pill-dot" style={{ width: 7, height: 7, background: "#f97316" }} />
                      <span>{CALLOUT.site}</span>
                      <span className="sd-mono" style={{ marginLeft: "auto", fontSize: 11, color: "#fb923c" }}>
                        {CALLOUT.badge}
                      </span>
                    </div>
                    <div className="sd-callout-body">
                      {CALLOUT.body}
                      <span style={{ color: "#ececf3" }}>{CALLOUT.emphasis}</span>
                    </div>
                  </div>

                  <div className="sd-regions">
                    {REGIONS.map((region) => (
                      <span key={region.name} className="sd-region">
                        <b style={{ fontWeight: 600 }}>{region.name}</b>{" "}
                        <span style={{ color: "#9f9fb6" }}>{region.count}</span>
                      </span>
                    ))}
                  </div>

                  <div className="sd-health">
                    <div className="sd-ring">
                      <svg width="84" height="84" viewBox="0 0 84 84">
                        <circle cx="42" cy="42" r="34" fill="none" stroke="#23233a" strokeWidth="7" />
                        <circle
                          cx="42"
                          cy="42"
                          r="34"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="7"
                          strokeLinecap="round"
                          strokeDasharray={ESTATE.ringLength}
                          strokeDashoffset={ringOffset}
                          transform="rotate(-90 42 42)"
                        />
                      </svg>
                      <div className="sd-ring-label">
                        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
                          {score}%
                        </span>
                        <span style={{ fontSize: 9.5, color: "#9f9fb6" }}>Health</span>
                      </div>
                    </div>
                    <div className="sd-health-text">
                      <span style={{ fontWeight: 600 }}>
                        {fmt(ESTATE.healthy * ease)} of {ESTATE.healthyLabel} nodes healthy
                      </span>
                      <span style={{ color: "#9f9fb6" }}>Score reduced by 12 issues</span>
                      <span style={{ color: "#9f9fb6" }}>
                        {ESTATE.sites} sites · {ESTATE.countries} countries
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sd-content">
                  {/* ---------------------------------------------- KPIs */}
                  <div className="sd-kpis">
                    {KPIS.map((kpi) => (
                      <div key={kpi.label} className="sd-card sd-kpi">
                        <div className="sd-kpi-top">
                          <span className="sd-kpi-value" style={{ color: kpi.color }}>
                            {fmt(kpi.target * ease)}
                          </span>
                          {kpi.sub ? <span className="sd-kpi-sub">{kpi.sub}</span> : null}
                        </div>
                        <div className="sd-kpi-label">{kpi.label}</div>
                        <div className="sd-kpi-foot">
                          <span>{kpi.foot}</span>
                          <svg width="80" height="18" viewBox="0 0 80 18">
                            <path d={kpi.spark} fill="none" stroke={kpi.sparkColor} strokeWidth="1.5" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sd-two">
                    {/* ------------------------------ needs attention */}
                    <div className="sd-card">
                      <div className="sd-card-head">
                        <span className="sd-card-title">Needs attention</span>
                        <span className="sd-mono" style={{ fontSize: 12, color: "#8f8fa8" }}>
                          {ALERTS_TOTAL}
                        </span>
                        <span className="sd-pseudolink">View all alerts</span>
                      </div>
                      <div className="sd-alerts">
                        {ALERTS.map((alert) => (
                          <div key={alert.node} className="sd-alert">
                            <span className="sd-dot8" style={{ background: alert.color }} />
                            <span className="sd-alert-node sd-mono">{alert.node}</span>
                            <span className="sd-alert-msg">{alert.message}</span>
                            <span className="sd-alert-site">{alert.site}</span>
                            <span className="sd-alert-ago sd-mono">{alert.ago}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ---------------------------------- escalation */}
                    <div className="sd-card sd-escalation">
                      <div className="sd-card-head">
                        <span className="sd-card-title">Escalation</span>
                        <span className="sd-sev">{ESCALATION.severity}</span>
                        <span className="sd-team sd-mono">{ESCALATION.team}</span>
                      </div>
                      <div className="sd-escalation-title">
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{ESCALATION.title}</div>
                        <div style={{ fontSize: 12, color: "#9f9fb6" }}>{ESCALATION.meta}</div>
                      </div>
                      <div className="sd-steps">
                        {ESCALATION_STEPS.map((step, index) => (
                          <div
                            key={step.time}
                            className={`sd-step${index === activeStep ? " is-on" : ""}`}
                          >
                            <span className="sd-step-time sd-mono">{step.time}</span>
                            <span
                              className="sd-step-dot"
                              style={
                                {
                                  "--sd-c": step.color,
                                  "--sd-glow": glow(step.color),
                                } as React.CSSProperties
                              }
                            />
                            <div className="sd-step-body">
                              <span className="sd-step-text">
                                <span className="sd-mono" style={{ color: "#ececf3" }}>
                                  {step.action}
                                </span>{" "}
                                <span style={{ color: "#b4b4c8" }}>{step.detail}</span>
                              </span>
                            </div>
                            <span className="sd-step-stage">{step.stage}</span>
                          </div>
                        ))}
                      </div>
                      <div className="sd-maintenance">
                        <span style={{ color: "#c084fc", fontWeight: 600 }}>
                          {ESCALATION.maintenanceLabel}
                        </span>{" "}
                        · {ESCALATION.maintenance}
                      </div>
                    </div>
                  </div>

                  <div className="sd-bottom">
                    {/* ---------------------------------------- sites */}
                    <div className="sd-card">
                      <div className="sd-card-head">
                        <span className="sd-card-title">Sites</span>
                        <span style={{ fontSize: 12, color: "#8f8fa8" }}>Health by location</span>
                        <span className="sd-pseudolink">View all {ESTATE.sites} sites</span>
                      </div>
                      <div className="sd-sites-head">
                        <span>Site</span>
                        <span>Country</span>
                        <span>Nodes</span>
                        <span>Health</span>
                        <span>Deg</span>
                        <span>Crit</span>
                        <span>Status</span>
                      </div>
                      {SITES.map((site) => {
                        const chip = SITE_STATUS_CHIPS[site.status];
                        return (
                          <div key={site.name} className="sd-site">
                            <span style={{ fontWeight: 500 }}>{site.name}</span>
                            <span style={{ color: "#9f9fb6" }}>{site.country}</span>
                            <span className="sd-mono">{fmt(site.nodes)}</span>
                            <span className="sd-site-health">
                              <span className="sd-bar-track">
                                <span
                                  className="sd-bar-fill"
                                  style={
                                    {
                                      "--sd-w": `${Math.round(90 * (site.health / 100) * ease)}px`,
                                      "--sd-c": siteBarColor(site.health),
                                    } as React.CSSProperties
                                  }
                                />
                              </span>
                              <span className="sd-site-pct sd-mono">
                                {Math.round(site.health * ease * 10) / 10}%
                              </span>
                            </span>
                            <span className="sd-mono" style={{ color: "#facc15" }}>
                              {site.degraded}
                            </span>
                            <span className="sd-mono" style={{ color: "#fb923c" }}>
                              {site.critical}
                            </span>
                            <span>
                              <span
                                className="sd-site-chip"
                                style={{ background: chip.bg, color: chip.fg }}
                              >
                                {site.status}
                              </span>
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* --------------------------------- live activity */}
                    <div className="sd-card">
                      <div className="sd-card-head">
                        <span
                          className="sd-live"
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#22c55e",
                            flexShrink: 0,
                          }}
                        />
                        <span className="sd-card-title">Live activity</span>
                        <span style={{ marginLeft: "auto", fontSize: 12, color: "#8f8fa8" }}>
                          all sites
                        </span>
                      </div>
                      {feed.map((event, index) => (
                        <div
                          key={`${index}-${event.text}`}
                          className={`sd-feed-row${event.isNew ? " is-new" : ""}`}
                        >
                          <span
                            className="sd-feed-dot"
                            style={
                              {
                                "--sd-c": event.color,
                                "--sd-glow": glow(event.color),
                              } as React.CSSProperties
                            }
                          />
                          <div className="sd-feed-body">
                            <span className="sd-feed-text">{event.text}</span>
                            <span className="sd-feed-site">{event.site}</span>
                          </div>
                          <span className="sd-feed-ago sd-mono">{event.ago}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
