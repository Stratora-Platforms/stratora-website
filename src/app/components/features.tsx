import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ScaledStage } from "./scaled-stage";
import { FEATURE_STAGES, STAGE } from "./features-stages";

/**
 * "Everything you need to monitor IT / OT infrastructure" as a one-feature-
 * at-a-time carousel, replacing the three-column card grid.
 *
 * All ten titles and descriptions stay in the DOM — inactive panels are
 * `hidden` rather than unmounted — so the copy check and search engines still
 * see every word.
 *
 * Auto-advance dwells longer on the denser slides and stops for good the
 * moment a reader picks one. It pauses while the section is off-screen or the
 * tab is hidden, and never starts under prefers-reduced-motion.
 *
 * ARIA tabs: the rail is the tablist, arrow keys move between tabs.
 */

type Feature = { title: string; body: string };

const FEATURES: Feature[] = [
  {
    title: "Distributed collectors for segmented networks",
    body: "Deploy Stratora collectors into segmented IT and OT zones with automatic config generation. Day-1 protocols: SNMP, ping, HTTP/HTTPS, and agent telemetry — protocol-agnostic monitoring of OT-zone infrastructure (managed switches, HMIs, historians). OT-specific protocols and vendor templates on the roadmap.",
  },
  {
    title: "Windows & Linux agents",
    body: "Lightweight Stratora agents for server monitoring, including auto-registration, admin approval, server role detection, and service monitoring.",
  },
  {
    title: "Template-driven monitoring",
    body: "Deploy consistent monitoring fast with device templates for switches, firewalls, APs, servers, NAS, hypervisors, ping checks, and web services / HTTP endpoints. Add custom templates for anything we don't ship out of the box.",
  },
  {
    title: "Visualization-first dashboards",
    body: "Interactive port grids, gauges, charts, tables, and status heatmaps — all driven by live metrics. Automatically generated dashboards provide consistent site-wide and infrastructure-specific views out of the box — now including your virtualization layer, so each site's dashboard folds in its hosts, VMs, and datastores alongside the physical infrastructure.",
  },
  {
    title: "Virtualization inventory & visibility",
    body: "See your entire virtualized footprint — VMware vSphere / vCenter, Hyper-V, and Proxmox VE — discovered and monitored as first-class infrastructure across every site. Hosts, VMs with run-state, datastores, and capacity roll up into per-platform dashboards and each site's inventory, so you know what you're running and where — automatically.",
  },
  {
    title: "Network diagrams",
    body: "Topology maps, rack diagrams, and geographic site maps with live health overlays. Drag devices onto a canvas, draw connections with live interface utilization, place equipment into rack U positions, or pin sites onto a world map. All three update in real-time as your environment changes.",
  },
  {
    title: "IPAM",
    body: "Track IP address space across supernets, subnets, and individual addresses. VLAN tags, gateway IPs, DHCP flags, and site-binding per subnet. Live utilization bars flag subnets approaching capacity. Address records sync from discovery scans and link to monitored nodes.",
  },
  {
    title: "Alerting + maintenance mode",
    body: "Notify the right people via email, Microsoft Teams, Slack, SMS, and phone call. Two-way acknowledgment on email, Teams, and SMS; voice calls deliver spoken alert details. Add escalation chains, mute, and maintenance-aware suppression.",
  },
  {
    title: "RBAC + LDAP/OIDC SSO authentication",
    body: "Built-in role-based access control with local accounts and identity provider pass-through (Active Directory, LDAP, Entra ID, and any OIDC-compliant provider), including group-to-role mapping. No credentials stored.",
  },
  {
    title: "Syslog Destinations",
    body: "Stream every Stratora event to your SIEM in real time. Supports Splunk, Elastic, Graylog, and any RFC-compliant syslog receiver.",
  },
];

const GROUPS: { label: string; items: number[] }[] = [
  { label: "Collect", items: [0, 1, 2] },
  { label: "See", items: [3, 4, 5, 6] },
  { label: "Act", items: [7] },
  { label: "Govern", items: [8, 9] },
];

/** Seconds each slide holds before auto-advance moves on. */
const DWELL_S = [8, 8, 11, 12, 12, 16, 12, 8, 8, 8];

const groupOf = (i: number) => GROUPS.find((g) => g.items.includes(i))?.label ?? "";

export function Features() {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pickerRef = useRef<HTMLButtonElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timerRef = useRef<number | null>(null);
  const onScreen = useRef(false);

  /* Opening and closing the list changes the height above the stage. Pin the
     picker button to the same viewport offset across the reflow so choosing a
     feature never yanks the page up or down under the reader's thumb. */
  const keepPickerAnchored = useCallback((mutate: () => void) => {
    const before = pickerRef.current?.getBoundingClientRect().top;
    mutate();
    if (before === undefined) return;
    requestAnimationFrame(() => {
      const after = pickerRef.current?.getBoundingClientRect().top;
      if (after === undefined) return;
      const drift = after - before;
      if (Math.abs(drift) > 1) window.scrollBy({ top: drift, behavior: "instant" as ScrollBehavior });
    });
  }, []);

  const togglePicker = useCallback(() => {
    keepPickerAnchored(() => setPickerOpen((open) => !open));
  }, [keepPickerAnchored]);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const select = useCallback(
    (next: number, viaPick: boolean) => {
      setIndex((current) => (next + FEATURES.length) % FEATURES.length);
      if (viaPick) setPicked(true);
    },
    [],
  );

  /* Auto-advance. One timer at most, always cleared before being replaced, so
     re-entering the viewport can never leave two running. */
  useEffect(() => {
    if (picked) {
      stop();
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const node = sectionRef.current;
    if (!node) return;

    const sync = () => {
      stop();
      if (!onScreen.current || document.hidden) return;
      timerRef.current = window.setTimeout(() => {
        setIndex((current) => (current + 1) % FEATURES.length);
      }, DWELL_S[index] * 1000);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        onScreen.current = entries.some((e) => e.isIntersecting);
        sync();
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    document.addEventListener("visibilitychange", sync);
    sync();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      stop();
    };
  }, [index, picked, stop]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + FEATURES.length) % FEATURES.length;
    select(next, true);
    tabRefs.current[next]?.focus();
  };

  const Stage = FEATURE_STAGES[index];
  const active = FEATURES[index];

  return (
    // ap-root carries the app's status tokens (--ap-healthy, --ap-critical …)
    // that STATUS_TEXT / STATUS_BG resolve against, so the app-like stages
    // match the carousel higher up the page.
    <section id="features" ref={sectionRef} className="st-scope ap-root relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">
            Everything you need to monitor IT / OT infrastructure
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-time metrics, template-driven onboarding, distributed collectors, and dashboards
            built for operators.
          </p>
        </motion.div>

        {/* An explicit minmax(0,1fr) base column, plus min-w-0 on both
            children: without them the implicit column sizes to the chip rail's
            max-content at mobile and pushes the page sideways. */}
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[300px_minmax(0,1fr)] lg:gap-14 lg:items-start">
          <div className="min-w-0">
            {/* Mobile: a disclosure that opens the full grouped list. A single
                scrolling chip row showed one of ten titles at 390px, with no
                cue the other nine existed. */}
            <button
              type="button"
              ref={pickerRef}
              className="ft-picker lg:hidden"
              aria-expanded={pickerOpen}
              aria-controls="feature-rail"
              onClick={togglePicker}
            >
              <span className="ft-picker-eyebrow">{groupOf(index)}</span>
              <span className="ft-picker-title">{active.title}</span>
              <span className="ft-picker-meta">
                {index + 1} / {FEATURES.length}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: pickerOpen ? "rotate(180deg)" : undefined, transition: "transform .2s" }}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>

            <div
              id="feature-rail"
              role="tablist"
              aria-label="Features"
              aria-orientation="vertical"
              onKeyDown={onKeyDown}
              className={`ft-rail min-w-0 flex-col gap-1 lg:flex lg:gap-6 ${pickerOpen ? "flex" : "hidden lg:flex"}`}
            >
              {GROUPS.map((group) => {
                const groupActive = group.items.includes(index);
                return (
                  <div key={group.label} className="flex flex-col gap-0.5">
                    <span
                      className="pb-1.5 pl-3.5 text-[12.5px] font-semibold transition-colors"
                      style={{ color: groupActive ? "#c4b5fd" : "#6b6b78" }}
                    >
                      {group.label}
                    </span>
                    {group.items.map((i) => {
                      const on = i === index;
                      return (
                        <button
                          key={i}
                          type="button"
                          role="tab"
                          id={`feature-tab-${i}`}
                          aria-controls={`feature-panel-${i}`}
                          aria-selected={on}
                          tabIndex={on ? 0 : -1}
                          ref={(el) => {
                            tabRefs.current[i] = el;
                          }}
                          onClick={() =>
                            keepPickerAnchored(() => {
                              select(i, true);
                              setPickerOpen(false);
                            })
                          }
                          className="ft-tab"
                          data-on={on ? "true" : "false"}
                        >
                          <span className="ft-tab-bar" />
                          {FEATURES[i].title}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-6">
            <ScaledStage
              width={STAGE.width}
              height={STAGE.height}
              minScale={0.42}
              cropAnchor="center"
              className="ft-stage"
            >
              <Stage key={index} />
            </ScaledStage>

            {/* Every panel stays in the DOM; only the active one is shown. */}
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                role="tabpanel"
                id={`feature-panel-${i}`}
                aria-labelledby={`feature-tab-${i}`}
                hidden={i !== index}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
                  <div className="min-w-0 flex-grow">
                    <h3 className="mb-3 text-xl md:text-2xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.body}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 sm:pt-1">
                    <span className="text-sm text-muted-foreground tabular-nums">{i + 1} / 10</span>
                    <button
                      type="button"
                      aria-label="Previous feature"
                      onClick={() => select(index - 1, true)}
                      className="ft-nav"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Next feature"
                      onClick={() => select(index + 1, true)}
                      className="ft-nav"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Dwell progress. Hidden once the reader takes over. */}
            <div className="ft-progress" aria-hidden="true">
              {!picked ? (
                <span
                  key={index}
                  className="ft-progress-fill"
                  style={{ animationDuration: `${(DWELL_S[index] * 0.9).toFixed(1)}s` }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
