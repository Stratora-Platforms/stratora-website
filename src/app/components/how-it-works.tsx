import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ScaledStage } from "./scaled-stage";

/**
 * "Up and running in three steps" — the three steps on a timeline rail that
 * fills as a miniature Stratora Home page plays the first ten minutes of a
 * deployment beside it.
 *
 * Lifted out of the inline block in App.tsx. Copy is unchanged apart from the
 * approved edit: step 01 now says "Run the MSI on Windows Server."
 *
 * The demo runs once when the section scrolls into view: install (empty
 * estate), discovery of 10.10.0.0/16 and 10.30.0.0/16 with devices arriving
 * and templates applying, then monitoring with dashboards generated and a
 * health score. Under prefers-reduced-motion it jumps straight to the final
 * frame. Everything shown is in CLAIMS.md and uses the Halden Group data.
 */

const STAGE = { width: 784, height: 540 };

/**
 * 35 ticks at 200ms = 7.0s end to end, inside the 6-8s target.
 *
 *   Phase 0  install   ticks 0-8   1.8s  — settles on the finished install
 *   Phase 1  discover  ticks 9-24  3.2s  — the longest: devices arrive one at
 *                                          a time and templates apply behind
 *   Phase 2  monitor   ticks 25-34 2.0s  — dashboards, health score, alerts
 *
 * Runs once on view and stops on the final frame. It never loops, and the
 * written steps beside it are never gated on it.
 */
const TICKS = 35;
const TICK_MS = 200;
const PHASE_1_AT = 9;
const PHASE_2_AT = 25;

const STEPS = [
  {
    n: "01",
    title: "Install",
    body:
      "Run the MSI on Windows Server. Stratora is fully operational in minutes — server, collector, and agent support included in a single installer.",
  },
  {
    n: "02",
    title: "Discover",
    body:
      "Point Stratora at your network. SNMP polling, agent registration, and ping monitoring begin automatically. Templates match your devices and apply configuration immediately.",
  },
  {
    n: "03",
    title: "Monitor",
    body:
      "Dashboards, network topology maps, and alert routing are live from the start. See what's happening, get notified when it matters, and act before users notice.",
  },
];

const DISCOVERED: [string, string, string][] = [
  ["NYC-CORE-SW01", "Switch", "10.10.0.2"],
  ["NYC-FW-01", "Firewall", "10.10.0.1"],
  ["NYC-DC-01", "Server · agent", "10.10.1.14"],
  ["NYC-ESX-01", "Hypervisor", "10.10.1.60"],
  ["NYC-NAS-01", "NAS", "10.10.1.40"],
  ["MTY-HMI-02", "HMI · OT zone", "10.30.3.12"],
];

const ATTENTION: [string, string, string, string][] = [
  ["NYC-FW-01", "Interface errors above threshold", "Warning", "#eab308"],
  ["NYC-NAS-01", "Volume usage 86%", "Warning", "#eab308"],
  ["NYC-ESX-01", "Host memory 91%", "Critical", "#f97316"],
];

const BANNERS = [
  {
    text: "Stratora Server 2.4.4 installed · server, collector and agent support running",
    right: "setup complete",
    style: { background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)", color: "#bbf7d0" },
    dot: "#22c55e",
  },
  {
    text: "Discovery running · 10.10.0.0/16, 10.30.0.0/16",
    right: "SNMP · agents · ping",
    style: { background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.3)", color: "#ddd6fe" },
    dot: "#8b5cf6",
  },
  {
    text: "Dashboards generated · topology maps live · alert routing active",
    right: "monitoring",
    style: { background: "rgba(34,197,94,.08)", border: "1px solid rgba(34,197,94,.25)", color: "#bbf7d0" },
    dot: "#22c55e",
  },
];

const ease = (k: number) => 1 - Math.pow(1 - Math.max(0, Math.min(1, k)), 3);

const SITE_CHIPS: Record<string, [string, string]> = {
  Online: ["rgba(34,197,94,.12)", "#4ade80"],
  Degraded: ["rgba(234,179,8,.14)", "#facc15"],
  Discovering: ["rgba(139,92,246,.16)", "#c4b5fd"],
  "No nodes": ["rgba(255,255,255,.05)", "#8b8b98"],
};

const panel: React.CSSProperties = {
  borderRadius: 9,
  background: "#11111a",
  border: "1px solid #1f1f33",
  boxShadow: "inset 0 1px 0 rgba(139,92,246,.35)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

export function HowItWorks() {
  const [t, setT] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setT(TICKS);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (startedRef.current || !entries.some((e) => e.isIntersecting)) return;
        startedRef.current = true;
        observer.disconnect();
        intervalRef.current = window.setInterval(() => {
          setT((prev) => {
            const next = prev + 1;
            if (next >= TICKS && intervalRef.current !== null) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return next;
          });
        }, TICK_MS);
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current);
    };
  }, []);

  const phase = t < PHASE_1_AT ? 0 : t < PHASE_2_AT ? 1 : 2;
  const devices = phase === 0 ? 0 : Math.round(62 * ease((t - PHASE_1_AT) / 15));
  const hq = phase === 0 ? 0 : Math.round(44 * ease((t - PHASE_1_AT) / 15));
  const mty = phase === 0 ? 0 : Math.round(18 * ease((t - PHASE_1_AT - 4) / 11));
  const score = phase === 2 ? Math.round(95 * ease((t - PHASE_2_AT) / 7)) : 0;
  const railPct = phase === 0 ? 18 : phase === 1 ? 18 + (t - PHASE_1_AT) * 3.4 : 100;
  const banner = BANNERS[phase];

  const rows =
    phase === 1
      ? DISCOVERED.slice(0, Math.max(0, Math.min(6, Math.floor((t - PHASE_1_AT) / 2.4) + 1))).map((x, k, arr) => {
          const applied = k < arr.length - 1 || t >= PHASE_2_AT - 3;
          return {
            name: x[0],
            text: `${x[1]} · ${x[2]}`,
            tag: applied ? "Template applied" : "Matching",
            dot: applied ? "#22c55e" : "#8b5cf6",
            tagBg: applied ? "rgba(34,197,94,.14)" : "rgba(139,92,246,.16)",
            tagFg: applied ? "#4ade80" : "#c4b5fd",
          };
        })
      : phase === 2
        ? ATTENTION.map((x) => ({
            name: x[0],
            text: x[1],
            tag: x[2],
            dot: x[3],
            tagBg: `${x[3]}22`,
            tagFg: x[3],
          }))
        : [];

  const sites =
    phase === 0
      ? [
          { name: "New York HQ", nodes: 0, status: "No nodes", health: 0 },
          { name: "Monterrey Plant", nodes: 0, status: "No nodes", health: 0 },
        ]
      : phase === 1
        ? [
            { name: "New York HQ", nodes: hq, status: "Discovering", health: 100 },
            { name: "Monterrey Plant", nodes: mty, status: "Discovering", health: 100 },
          ]
        : [
            { name: "New York HQ", nodes: 44, status: "Degraded", health: 95 },
            { name: "Monterrey Plant", nodes: 18, status: "Online", health: 100 },
          ];

  const pills: [string, number, string, string, string][] = [
    ["off", 0, "rgba(239,68,68,.12)", "#f87171", "#ef4444"],
    ["crit", phase === 2 ? 1 : 0, "rgba(249,115,22,.12)", "#fb923c", "#f97316"],
    ["deg", phase === 2 ? 2 : 0, "rgba(234,179,8,.12)", "#facc15", "#eab308"],
    ["ok", phase === 2 ? 59 : devices, "rgba(34,197,94,.12)", "#4ade80", "#22c55e"],
  ];

  const stage = (
    <div style={{ width: STAGE.width, height: STAGE.height, borderRadius: 14, border: "1px solid #25253b", background: "#0b0b12", overflow: "hidden", boxShadow: "0 40px 100px rgba(0,0,0,.55), 0 0 0 1px rgba(139,92,246,.08)", display: "flex", flexDirection: "column", boxSizing: "border-box", color: "#f5f5f7" }}>
      {/* top bar */}
      <div style={{ height: 40, flexShrink: 0, display: "flex", alignItems: "center", gap: 12, padding: "0 14px", borderBottom: "1px solid #1c1c2e", background: "#0d0d15" }}>
        <span style={{ width: 110, fontSize: 12, fontWeight: 600, letterSpacing: ".3em" }}>STRATORA</span>
        <span style={{ flexGrow: 1 }} />
        <span className="st-mono" style={{ display: "flex", gap: 5, fontSize: 10.5 }}>
          {pills.map(([key, value, bg, fg, dot]) => (
            <span key={key} style={{ display: "inline-flex", alignItems: "center", gap: 5, height: 20, padding: "0 8px", borderRadius: 10, background: bg, color: fg }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot }} />
              {value}
            </span>
          ))}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
          <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#1f6f5c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 600 }}>HG</span>
          Halden Group
        </span>
      </div>

      <div style={{ flexGrow: 1, display: "flex", minHeight: 0 }}>
        <div style={{ width: 118, flexShrink: 0, boxSizing: "border-box", padding: "10px 8px", borderRight: "1px solid #1c1c2e", background: "#0d0d15", display: "flex", flexDirection: "column", gap: 2, fontSize: 11.5, color: "#9f9fb6" }}>
          {["Home", "Monitoring", "Infrastructure", "Collection", "Alerting", "Administration"].map((item, i) => (
            <span key={item} style={{ height: 28, display: "flex", alignItems: "center", padding: "0 8px", borderRadius: i === 0 ? 6 : undefined, background: i === 0 ? "rgba(139,92,246,.14)" : undefined, color: i === 0 ? "#fff" : undefined, boxShadow: i === 0 ? "inset 2px 0 0 #8b5cf6" : undefined }}>
              {item}
            </span>
          ))}
          <span style={{ marginTop: "auto", padding: 8, fontSize: 10.5, color: "#7e7e98", lineHeight: 1.5 }}>
            {phase === 0 ? "Collector ready" : "2 collectors online"}
          </span>
        </div>

        <div style={{ flexGrow: 1, minWidth: 0, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          <div key={phase} className="st-fade" style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 10, height: 34, padding: "0 12px", borderRadius: 8, fontSize: 12, ...banner.style }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, background: banner.dot, boxShadow: phase === 2 ? "0 0 0 3px rgba(34,197,94,.2)" : undefined }} />
            <span>{banner.text}</span>
            <span className="st-mono" style={{ marginLeft: "auto", fontSize: 11, opacity: 0.8 }}>{banner.right}</span>
            {phase === 1 ? (
              <span className="hiw-scan" style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "25%", background: "linear-gradient(90deg, rgba(139,92,246,0), rgba(139,92,246,.18), rgba(139,92,246,0))" }} />
            ) : null}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 8 }}>
            {[
              [devices, "#4ade80", "Active devices"],
              [0, "#f87171", "Nodes down"],
              [phase === 2 ? 3 : 0, "#fb923c", "Degraded / critical"],
              [phase === 2 ? 3 : 0, "#fb923c", "Active alerts"],
            ].map(([value, color, label]) => (
              <div key={label as string} style={{ height: 70, boxSizing: "border-box", padding: "10px 12px", borderRadius: 9, background: "#11111a", border: "1px solid #1f1f33", boxShadow: "inset 0 1px 0 rgba(139,92,246,.35)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: color as string, fontVariantNumeric: "tabular-nums" }}>{value as number}</span>
                <span style={{ fontSize: 11, color: "#c9c9d9" }}>{label as string}</span>
              </div>
            ))}
          </div>

          <div style={{ flexGrow: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 8 }}>
            <div style={panel}>
              <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid #1c1c2e", fontSize: 12, fontWeight: 600 }}>
                {phase === 2 ? "Needs attention" : "Discovered devices"}
              </div>
              {phase === 0 ? (
                <div className="st-fade" style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, color: "#8b8b98" }}>
                  <span style={{ color: "#c9c9d4" }}>No devices yet</span>
                  <span>Point Stratora at your network to start discovery</span>
                </div>
              ) : null}
              {rows.map((row) => (
                <div key={row.name} className="st-fade" style={{ display: "flex", alignItems: "center", gap: 8, height: 30, padding: "0 12px", borderBottom: "1px solid #17172a", fontSize: 11.5 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: row.dot }} />
                  <span className="st-mono" style={{ width: 110, flexShrink: 0 }}>{row.name}</span>
                  <span style={{ flexGrow: 1, color: "#b4b4c8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{row.text}</span>
                  <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 7, background: row.tagBg, color: row.tagFg }}>{row.tag}</span>
                </div>
              ))}
            </div>

            <div style={panel}>
              <div style={{ height: 32, display: "flex", alignItems: "center", padding: "0 12px", borderBottom: "1px solid #1c1c2e", fontSize: 12, fontWeight: 600 }}>Sites</div>
              {sites.map((site) => {
                const [bg, fg] = SITE_CHIPS[site.status];
                return (
                  <div key={site.name} style={{ display: "grid", gridTemplateColumns: "1.3fr .5fr 1fr", gap: 8, alignItems: "center", height: 36, padding: "0 12px", borderBottom: "1px solid #17172a", fontSize: 11.5 }}>
                    <span>{site.name}</span>
                    <span className="st-mono" style={{ color: "#b4b4c8" }}>{site.nodes}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 60, height: 4, borderRadius: 2, background: "#23233a", overflow: "hidden" }}>
                        <span style={{ display: "block", height: 4, transition: "width .4s", background: site.health >= 99 ? "#22c55e" : "#eab308", width: `${site.nodes ? site.health : 0}%` }} />
                      </span>
                      <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 7, background: bg, color: fg }}>{site.status}</span>
                    </span>
                  </div>
                );
              })}
              <div style={{ marginTop: "auto", padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative", width: 56, height: 56, flexShrink: 0 }}>
                  <svg width="56" height="56" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#23233a" strokeWidth="5" />
                    <circle cx="28" cy="28" r="22" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" strokeDasharray="138.2" strokeDashoffset={(138.2 * (1 - score / 100)).toFixed(1)} transform="rotate(-90 28 28)" style={{ transition: "stroke-dashoffset .5s" }} />
                  </svg>
                  <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                    {phase === 2 ? `${score}%` : "—"}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, fontSize: 11, color: "#9f9fb6" }}>
                  <span style={{ color: "#f5f5f7", fontWeight: 600 }}>Health score</span>
                  <span>{phase === 2 ? "59 of 62 nodes healthy" : phase === 1 ? "Waiting for first poll" : "No nodes yet"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="st-scope relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="max-w-3xl mx-auto mb-14 text-center"
        >
          <h2 className="text-3xl md:text-5xl mb-4 tracking-tight">Up and running in three steps</h2>
          <p className="text-lg text-muted-foreground">
            No consultants. No weeks-long rollout. No cloud dependency.
          </p>
        </motion.div>

        <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-14 lg:items-stretch">
          {/* Steps on a rail that fills as the demo runs. */}
          <div className="relative flex flex-col justify-between gap-10 py-2 pl-7">
            <span className="absolute left-[5px] top-3.5 bottom-3.5 w-px bg-[#23232c]" />
            <span
              className="absolute left-[5px] top-3.5 w-px bg-[#8b5cf6] shadow-[0_0_8px_rgba(139,92,246,.7)] transition-[height] duration-500 ease-out"
              style={{ height: `calc((100% - 28px) * ${Math.min(100, railPct) / 100})` }}
            />
            {STEPS.map((step, i) => {
              const lit = i <= phase;
              return (
                <div key={step.n} className="relative flex flex-col gap-2">
                  <span
                    className="absolute -left-[27px] top-[9px] h-[9px] w-[9px] rounded-full transition-all duration-400"
                    style={{
                      background: lit ? (i === 2 && phase === 2 ? "#22c55e" : "#a78bfa") : "#2a2a35",
                      boxShadow: i === phase ? "0 0 0 5px rgba(139,92,246,.18)" : "none",
                    }}
                  />
                  <div className="flex items-baseline gap-3">
                    <span className="text-[15px] transition-colors duration-400" style={{ color: lit ? "#c4b5fd" : "#4a4a56" }}>
                      {step.n}
                    </span>
                    <span className="text-[22px] font-semibold transition-colors duration-400" style={{ color: lit ? "#ffffff" : "#7b7b88" }}>
                      {step.title}
                    </span>
                  </div>
                  <p className="m-0 text-[14.5px] leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              );
            })}
          </div>

          <ScaledStage width={STAGE.width} height={STAGE.height}>
            {stage}
          </ScaledStage>
        </div>
      </div>
    </section>
  );
}
