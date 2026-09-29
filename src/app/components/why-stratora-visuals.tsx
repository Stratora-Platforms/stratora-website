/**
 * The six visuals behind the "From detection to escalation to resolution"
 * story. Each is authored at 660 x 520 and scaled by <ScaledStage>.
 *
 * Every one shows a shipped capability and uses the Halden Group sample data
 * (see CLAIMS.md): the 2:07 SMS is the Monterrey uplink alert, and the audit
 * stream is the same 14:0x escalation the hero follows.
 */

const W = 660;
const H = 520;

const card: React.CSSProperties = {
  position: "absolute",
  borderRadius: 10,
  background: "#111118",
  border: "1px solid #23232e",
  padding: 14,
  opacity: 0.85,
};

const label: React.CSSProperties = { fontSize: 12, color: "var(--st-ink-3)" };

/** 0 — four tools that don't talk to each other. */
function Fragmented() {
  const ports = ["#22c55e", "#22c55e", "#22c55e", "#eab308", "#22c55e", "#22c55e", "#22c55e", "#22c55e", "#3a3a46", "#22c55e", "#22c55e", "#22c55e"];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0 }}>
      <div style={{ ...card, left: 40, top: 50, width: 250, transform: "rotate(-2deg)" }}>
        <div style={label}>Switch poller</div>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: 3 }}>
          {ports.map((c, i) => (
            <span key={i} style={{ height: 10, background: c }} />
          ))}
        </div>
      </div>
      <div style={{ ...card, left: 360, top: 36, width: 240, transform: "rotate(2.5deg)" }}>
        <div style={label}>Server monitor</div>
        <div style={{ marginTop: 10, fontSize: 13 }}>
          SRV-SQL-02 <span style={{ color: "#f97316" }}>CPU 94%</span>
        </div>
      </div>
      <div style={{ ...card, left: 70, top: 230, width: 230, transform: "rotate(1.5deg)" }}>
        <div style={label}>Alerting</div>
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--st-ink-3)" }}>No rules match this event</div>
      </div>
      <div style={{ ...card, left: 350, top: 250, width: 260, transform: "rotate(-3deg)" }}>
        <div style={label}>Dashboards</div>
        <svg width="230" height="60" viewBox="0 0 230 60" style={{ marginTop: 8 }}>
          <path d="M0 40 L30 36 L60 44 L90 20 L120 30 L150 12 L180 34 L230 26" fill="none" stroke="#6b6b78" strokeWidth="1.5" />
        </svg>
      </div>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <path
          d="M290 90 C320 120, 330 100, 360 70 M185 150 L180 230 M300 280 L350 290 M480 110 L480 250"
          fill="none"
          stroke="#ef4444"
          strokeOpacity=".45"
          strokeDasharray="3 5"
        />
      </svg>
    </div>
  );
}

/**
 * 1 — four tools that don't talk to each other, and the one screen that does.
 *
 * Three mismatched consoles across the top, each answering a different
 * question in its own idiom and none of them sharing state; underneath, the
 * single Stratora screen carrying the same ground in one place.
 */
function OnePlatform() {
  /** A monitor: bezel, screen, neck, base. */
  const Monitor = ({
    x,
    y,
    w,
    h,
    accent,
    dim,
    children,
  }: {
    x: number;
    y: number;
    w: number;
    h: number;
    accent: string;
    dim?: boolean;
    children: React.ReactNode;
  }) => (
    <div style={{ position: "absolute", left: x, top: y, width: w }}>
      <div
        style={{
          width: w,
          height: h,
          boxSizing: "border-box",
          borderRadius: 8,
          background: "#0d0d13",
          border: `1px solid ${accent}`,
          padding: 6,
          opacity: dim ? 0.72 : 1,
          boxShadow: dim ? "none" : "0 22px 55px rgba(0,0,0,.55)",
        }}
      >
        <div style={{ width: "100%", height: "100%", borderRadius: 4, background: "#111118", overflow: "hidden", position: "relative" }}>
          {children}
        </div>
      </div>
      {/* neck + base */}
      <div style={{ width: 12, height: 10, margin: "0 auto", background: "#1c1c26" }} />
      <div style={{ width: w * 0.36, height: 4, margin: "0 auto", borderRadius: 2, background: "#1c1c26" }} />
    </div>
  );

  const cap: React.CSSProperties = { fontSize: 9, color: "#6f6f7b", padding: "5px 7px 0 7px", display: "block" };

  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0 }}>
      {/* three consoles, none of them aware of the others */}
      <Monitor x={16} y={22} w={196} h={126} accent="#26263a" dim>
        <span style={cap}>SwitchPoller 7</span>
        <div style={{ padding: "6px 7px 0 7px", display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 2.5 }}>
          {Array.from({ length: 30 }, (_, i) => (
            <span key={i} style={{ height: 8, background: i === 13 ? "#eab308" : i === 22 ? "#3a3a46" : "#3f6b4d" }} />
          ))}
        </div>
        <span style={{ ...cap, paddingTop: 9 }}>port status only · no host data</span>
      </Monitor>

      <Monitor x={232} y={10} w={196} h={126} accent="#26263a" dim>
        <span style={cap}>SrvWatch</span>
        <svg width="100%" height="58" viewBox="0 0 180 58" preserveAspectRatio="none" style={{ display: "block", padding: "2px 6px" }}>
          <path d="M0 44 L20 40 L40 46 L60 30 L80 36 L100 12 L120 20 L140 16 L160 34 L180 28" fill="none" stroke="#6b6b78" strokeWidth="1.6" />
        </svg>
        <span style={{ ...cap, color: "#c0705a" }}>SRV-SQL-02 CPU 94%</span>
        <span style={cap}>no link to the switch alert</span>
      </Monitor>

      <Monitor x={448} y={22} w={196} h={126} accent="#26263a" dim>
        <span style={cap}>AlertManager</span>
        <div style={{ padding: "6px 7px 0 7px", display: "flex", flexDirection: "column", gap: 4 }}>
          {["rule: cpu_high", "rule: iface_err", "rule: ping_loss"].map((r) => (
            <span key={r} style={{ fontSize: 8.5, fontFamily: "var(--st-mono)", color: "#6f6f7b", display: "flex" }}>
              {r}
              <span style={{ marginLeft: "auto", color: "#5c5c68" }}>no match</span>
            </span>
          ))}
        </div>
        <span style={{ ...cap, paddingTop: 10 }}>fires on its own thresholds</span>
      </Monitor>

      {/* they do not talk to each other */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d="M214 84 L230 84 M430 78 L446 78" stroke="#ef4444" strokeOpacity=".5" strokeWidth="1.4" strokeDasharray="3 4" />
        {[222, 438].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={i === 0 ? 84 : 78} r="7" fill="#0d0d13" stroke="#ef4444" strokeOpacity=".6" strokeWidth="1.2" />
            <path
              d={`M${x - 3} ${(i === 0 ? 84 : 78) - 3} L${x + 3} ${(i === 0 ? 84 : 78) + 3} M${x + 3} ${(i === 0 ? 84 : 78) - 3} L${x - 3} ${(i === 0 ? 84 : 78) + 3}`}
              stroke="#ef4444"
              strokeOpacity=".7"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* everything converging into one screen */}
        {[114, 330, 546].map((x) => {
          const d = `M${x} 186 C${x} 220 330 214 330 248`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke="#26263a" strokeWidth="1.4" />
              <path className="st-flow" d={d} fill="none" stroke="#a78bfa" strokeWidth="1.4" />
            </g>
          );
        })}
      </svg>

      {/* one screen that carries all of it */}
      <Monitor x={108} y={250} w={444} h={196} accent="rgba(139,92,246,.6)">
        <div style={{ display: "flex", height: "100%" }}>
          <div style={{ width: 106, borderRight: "1px solid var(--st-line)", padding: "8px 7px", display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: ".22em", color: "var(--st-ink)", padding: "0 5px 7px 5px" }}>STRATORA</div>
            {["Dashboards", "Alerting", "Topology", "IPAM", "Audit forwarding"].map((item, i) => (
              <span
                key={item}
                className="st-row"
                style={{
                  animationDelay: `${0.1 + i * 0.06}s`,
                  fontSize: 9,
                  padding: "4px 5px",
                  borderRadius: 4,
                  background: i === 0 ? "rgba(139,92,246,.18)" : undefined,
                  color: i === 0 ? "var(--st-ink)" : "var(--st-ink-3)",
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div style={{ flexGrow: 1, padding: 9, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 7, alignContent: "start" }}>
            <div style={{ gridColumn: "span 2", height: 74, borderRadius: 6, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 7 }}>
              <div style={{ fontSize: 8.5, color: "var(--st-ink-3)" }}>Uplink throughput · SRV-SQL-02 · alert rules</div>
              <svg width="100%" height="46" viewBox="0 0 300 46" preserveAspectRatio="none">
                <path d="M0 34 L30 30 L60 32 L90 20 L120 25 L150 12 L180 18 L210 9 L240 16 L270 7 L300 12 L300 46 L0 46 Z" fill="rgba(139,92,246,.15)" />
                <path d="M0 34 L30 30 L60 32 L90 20 L120 25 L150 12 L180 18 L210 9 L240 16 L270 7 L300 12" fill="none" stroke="#8b5cf6" strokeWidth="1.6" />
              </svg>
            </div>
            <div style={{ height: 56, borderRadius: 6, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 7 }}>
              <div style={{ fontSize: 8.5, color: "var(--st-ink-3)" }}>Nodes online</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: "#4ade80" }}>4,809</div>
            </div>
            <div style={{ height: 56, borderRadius: 6, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 7 }}>
              <div style={{ fontSize: 8.5, color: "var(--st-ink-3)" }}>Active alerts</div>
              <div style={{ marginTop: 6, fontSize: 22, fontWeight: 600, color: "#fb923c" }}>41</div>
            </div>
          </div>
        </div>
      </Monitor>

      <div style={{ position: "absolute", left: 108, top: 472, width: 444, textAlign: "center", fontSize: 10.5, color: "var(--st-ink-3)" }}>
        one platform · one MSI
      </div>
    </div>
  );
}

/**
 * 2 — runs on your infrastructure, wherever that is.
 *
 * Deploy target on top (on-prem, your private cloud, your own public-cloud
 * tenancy), the Stratora server in the middle, and remote collectors at each
 * site reporting back — including one behind OT segmentation. The vendor SaaS
 * is struck through, which is what the paragraph beside this claims.
 */
function OnPrem() {
  const hosts: { x: number; label: string; sub: string; icon: "rack" | "cloud" }[] = [
    { x: 40, label: "On-prem", sub: "your datacentre", icon: "rack" },
    { x: 244, label: "Private cloud", sub: "your hypervisor", icon: "cloud" },
    { x: 448, label: "Public cloud", sub: "your tenancy", icon: "cloud" },
  ];
  const sites: { x: number; name: string; nodes: string; ot?: boolean }[] = [
    { x: 24, name: "New York HQ", nodes: "612 nodes" },
    { x: 245, name: "Monterrey Plant", nodes: "356 nodes", ot: true },
    { x: 466, name: "Frankfurt DC", nodes: "548 nodes" },
  ];

  const tile: React.CSSProperties = {
    position: "absolute",
    width: 172,
    boxSizing: "border-box",
    borderRadius: 10,
    background: "#13131c",
    border: "1px solid #26263a",
    padding: "9px 12px",
  };

  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {/* deploy target → server */}
        {[126, 330, 534].map((x) => {
          const d = `M${x} 92 C${x} 126 330 120 330 152`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke="#26263a" strokeWidth="1.4" />
              <path className="st-flow" d={d} fill="none" stroke="#a78bfa" strokeWidth="1.4" />
            </g>
          );
        })}

        {/* server → sites, telemetry flowing back up the link */}
        {[109, 330, 551].map((x, i) => {
          const d = `M330 214 C330 252 ${x} 246 ${x} 292`;
          return (
            <g key={x}>
              <path d={d} fill="none" stroke="#26263a" strokeWidth="1.4" />
              <path
                className="st-flow"
                d={`M${x} 292 C${x} 246 330 252 330 214`}
                fill="none"
                stroke="#22c55e"
                strokeWidth="1.4"
                style={{ animationDelay: `${-i * 0.5}s` }}
              />
            </g>
          );
        })}

        {/* vendor SaaS, struck out */}
        <path d="M566 172 L614 172" stroke="#ef4444" strokeWidth="1.4" strokeDasharray="3 5" />
        <circle cx="566" cy="172" r="9" fill="#0d0d13" stroke="#ef4444" strokeWidth="1.4" />
        <path d="M562 168 L570 176 M570 168 L562 176" stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M612 164 a13 13 0 0 1 20 -4 a10 10 0 0 1 14 11 a9 9 0 0 1 -4 16 h-29 a10 10 0 0 1 -1 -23z" fill="none" stroke="#5c5c68" strokeWidth="1.3" />
      </svg>

      {/* where it runs */}
      <div style={{ position: "absolute", left: 24, top: 14, fontSize: 11, letterSpacing: ".1em", color: "#6b6b78", fontWeight: 600 }}>
        RUNS ON
      </div>
      {hosts.map((h) => (
        <div key={h.label} style={{ ...tile, left: h.x, top: 34 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#c4b5fd", display: "flex" }}>
              {h.icon === "rack" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="7" rx="1.5" />
                  <rect x="3" y="13" width="18" height="7" rx="1.5" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                  <path d="M6.5 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.4 1.4A3.6 3.6 0 0 1 17.5 18z" />
                </svg>
              )}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600 }}>{h.label}</span>
          </div>
          <div style={{ marginTop: 3, fontSize: 10.5, color: "var(--st-ink-4)" }}>{h.sub}</div>
        </div>
      ))}

      {/* the one server */}
      <div
        style={{
          position: "absolute",
          left: 230,
          top: 152,
          width: 200,
          boxSizing: "border-box",
          borderRadius: 11,
          background: "var(--st-panel)",
          border: "1px solid rgba(139,92,246,.55)",
          padding: "11px 14px",
          boxShadow: "0 20px 50px rgba(0,0,0,.5)",
        }}
      >
        <div style={{ fontSize: 12.5, fontWeight: 600 }}>Stratora server</div>
        <div style={{ marginTop: 7, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 5, fontSize: 9.5, color: "var(--st-ink-2)" }}>
          {["PostgreSQL", "VictoriaMetrics", "NGINX", "Backend"].map((part) => (
            <span key={part} style={{ padding: "4px 6px", borderRadius: 5, background: "#15151e", textAlign: "center" }}>
              {part}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 556, top: 196, width: 96, fontSize: 10, color: "var(--st-ink-4)", textAlign: "center" }}>
        vendor SaaS
      </div>

      {/* remote sites */}
      <div style={{ position: "absolute", left: 24, top: 268, fontSize: 11, letterSpacing: ".1em", color: "#6b6b78", fontWeight: 600 }}>
        REMOTE SITES
      </div>
      {sites.map((s) => (
        <div key={s.name} style={{ ...tile, left: s.x, top: 292, width: 170 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>{s.name}</div>
          <div style={{ marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
            <span className="st-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ fontSize: 10.5, color: "#4ade80" }}>collector online</span>
          </div>
          <div style={{ marginTop: 2, fontSize: 10, color: "var(--st-ink-4)" }}>{s.nodes}</div>
        </div>
      ))}

      {/* OT segmentation behind one of them */}
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <path d="M330 372 L330 398" stroke="#ff9818" strokeOpacity=".6" strokeWidth="1.4" strokeDasharray="3 4" />
        <rect x="226" y="398" width="208" height="96" rx="12" fill="rgba(255,152,24,.04)" stroke="rgba(255,152,24,.5)" strokeDasharray="5 5" />
      </svg>
      <div style={{ position: "absolute", left: 238, top: 406, fontSize: 10, color: "#ffb04d" }}>OT segment · Levels 2–0</div>
      <div style={{ position: "absolute", left: 238, top: 428, display: "flex", flexWrap: "wrap", gap: 5 }}>
        {["HMI", "PLC", "Historian", "Drive"].map((d) => (
          <span key={d} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 6, background: "#15151f", border: "1px solid #2a2a3c", color: "var(--st-ink-2)" }}>
            {d}
          </span>
        ))}
      </div>
      <div style={{ position: "absolute", left: 238, top: 470, fontSize: 9.5, color: "var(--st-ink-4)" }}>
        collector polls inward · nothing routes out
      </div>
    </div>
  );
}

/** 3 — offline Ed25519 licence check. */
function OfflineLicense() {
  const rows = [
    ["Algorithm", "Ed25519"],
    ["Public key", "Embedded in binary"],
    ["Network calls", "None"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", left: 90, top: 90, right: 90, borderRadius: 12, background: "var(--st-panel)", border: "1px solid var(--st-line-2)", boxShadow: "0 30px 80px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--st-line)", fontSize: 14, fontWeight: 600 }}>License</div>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14, fontSize: 13.5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e" }} />
          <span>Signature valid</span>
          <span style={{ marginLeft: "auto", color: "var(--st-ink-3)" }}>Verified offline</span>
        </div>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", color: "var(--st-ink-3)" }}>
            <span>{k}</span>
            <span style={{ color: "var(--st-ink)" }}>{v}</span>
          </div>
        ))}
        <div className="st-mono" style={{ marginTop: 6, padding: 12, borderRadius: 8, background: "var(--st-panel-2)", fontSize: 11.5, lineHeight: 1.6, color: "var(--st-ink-4)", wordBreak: "break-all" }}>
          ed25519:7f3a9c02e14bd8a1c6f05e7d93b2a4c18e0f6d25b9a7c3e1
        </div>
      </div>
    </div>
  );
}

/**
 * 4 — the 2:07 SMS, acknowledged by reply, on a phone.
 *
 * SMS rather than a push notification: there is no Stratora mobile app, and
 * two-way ack over SMS is what ships (CLAIMS.md). The alert is the Monterrey
 * uplink, so it does not collide with the hero's 14:0x Frankfurt timeline.
 */
function SmsAck() {
  // A real iPhone is about 19.5:9 — roughly 2.17 tall for every 1 wide. The
  // stage is 520 high, so the body is sized from that and the width follows,
  // rather than the other way round, or the device reads as squashed.
  const PHONE_H = 494;
  const PHONE_W = Math.round(PHONE_H / 2.167); // 228

  const incoming: React.CSSProperties = {
    alignSelf: "flex-start",
    maxWidth: 168,
    borderRadius: "16px 16px 16px 5px",
    background: "#26262b",
    padding: "8px 11px",
    fontSize: 11,
    lineHeight: 1.4,
    color: "#e9e9ec",
  };
  const outgoing: React.CSSProperties = {
    alignSelf: "flex-end",
    borderRadius: "16px 16px 5px 16px",
    background: "#0a84ff",
    padding: "7px 14px",
    fontSize: 12,
    fontWeight: 600,
    color: "#fff",
    letterSpacing: ".02em",
  };

  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          borderRadius: 36,
          background: "#000",
          padding: 3,
          boxShadow: "0 30px 80px rgba(0,0,0,.6), 0 0 0 1px #2e2e38",
          boxSizing: "border-box",
        }}
      >
        {/* screen */}
        <div style={{ position: "relative", height: "100%", borderRadius: 33, background: "#0a0a0c", overflow: "hidden", display: "flex", flexDirection: "column" }}>
          {/* status bar */}
          <div style={{ display: "flex", alignItems: "center", padding: "11px 18px 0 18px", fontSize: 11, fontWeight: 600, color: "#fff" }}>
            <span>2:07</span>
            <span style={{ flexGrow: 1 }} />
            <svg width="17" height="11" viewBox="0 0 17 11" fill="#fff" aria-hidden="true">
              <rect x="0" y="7" width="3" height="4" rx="1" />
              <rect x="4.5" y="5" width="3" height="6" rx="1" />
              <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
              <rect x="13.5" y="0" width="3" height="11" rx="1" />
            </svg>
            <svg width="16" height="11" viewBox="0 0 16 12" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" style={{ marginLeft: 5 }} aria-hidden="true">
              <path d="M1 4.2a10 10 0 0 1 14 0M3.6 7a6.4 6.4 0 0 1 8.8 0" />
              <circle cx="8" cy="10" r="1" fill="#fff" stroke="none" />
            </svg>
            <span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
              <span style={{ width: 20, height: 10.5, borderRadius: 3, border: "1px solid rgba(255,255,255,.5)", padding: 1.5, boxSizing: "border-box", display: "inline-block" }}>
                <span style={{ display: "block", width: "72%", height: "100%", borderRadius: 1.5, background: "#fff" }} />
              </span>
              <span style={{ width: 1.5, height: 4, borderRadius: 1, background: "rgba(255,255,255,.5)", marginLeft: 1 }} />
            </span>
          </div>

          {/* dynamic island */}
          <div style={{ position: "absolute", left: "50%", top: 8, transform: "translateX(-50%)", width: 74, height: 22, borderRadius: 12, background: "#000" }} />

          {/* messages header */}
          <div style={{ marginTop: 12, padding: "7px 12px 9px 12px", borderBottom: "1px solid #1d1d22", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "rgba(18,18,22,.9)" }}>
            <span style={{ width: 30, height: 30, borderRadius: "50%", background: "#1f6f5c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
              ST
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>Stratora Alerts</span>
            <span style={{ fontSize: 9, color: "#7c7c86" }}>SMS · on-call rotation</span>
          </div>

          {/* thread */}
          <div style={{ flexGrow: 1, padding: "10px 10px 0 10px", display: "flex", flexDirection: "column", gap: 6, minHeight: 0 }}>
            <div style={{ textAlign: "center", fontSize: 9, color: "#6f6f79", paddingBottom: 2 }}>Today 2:07 AM</div>

            <div className="st-fade" style={incoming}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#ff9f6b" }}>
                <span className="st-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#f97316" }} />
                CRITICAL
              </span>
              <br />
              MTY-CORE-SW01 uplink Gi1/0/48 down — Monterrey Plant.
            </div>

            {/* Shipped syntax is `ACK <token>` / `ESCALATE <token>` — single-use,
                24-hour TTL, case-insensitive. 7f3k is sample data. */}
            <div className="st-fade" style={{ ...incoming, animationDelay: ".35s" }}>
              Reply <b style={{ color: "#fff" }}>ACK 7f3k</b> to acknowledge or{" "}
              <b style={{ color: "#fff" }}>ESCALATE 7f3k</b> to escalate.
            </div>

            <div className="st-fade" style={{ ...outgoing, animationDelay: ".9s" }}>ACK 7f3k</div>

            {/* iOS puts the receipt under the message you sent, not the reply. */}
            <div className="st-fade" style={{ animationDelay: "1.05s", alignSelf: "flex-end", fontSize: 9, color: "#6f6f79", paddingRight: 5, marginTop: -3 }}>
              Delivered
            </div>

            <div className="st-fade" style={{ ...incoming, animationDelay: "1.35s" }}>
              Acknowledged 02:07. Escalation stopped.
            </div>
          </div>

          {/* input bar */}
          <div style={{ padding: "7px 10px 10px 10px", display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ flexGrow: 1, height: 25, borderRadius: 13, border: "1px solid #2a2a31", display: "flex", alignItems: "center", padding: "0 11px", fontSize: 10, color: "#5f5f69" }}>
              Text Message
            </span>
            <span style={{ width: 23, height: 23, borderRadius: "50%", background: "#0a84ff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M6 11l6-6 6 6" />
              </svg>
            </span>
          </div>

          {/* home indicator */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6 }}>
            <span style={{ width: 84, height: 4, borderRadius: 2, background: "rgba(255,255,255,.32)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 5 — every Stratora event, streaming to the SIEM. */
function AuditStream() {
  const events: [string, string, string][] = [
    ["14:08:10", "Alert acknowledged — FRA-SAN-02", "j.moreau"],
    ["14:07:41", "Escalated — SMS and phone call", "system"],
    ["14:02:40", "Alert raised — FRA-SAN-02 read latency", "system"],
    ["14:01:52", "Sign-in via OIDC", "j.moreau"],
    ["13:58:20", "Configuration changed — escalation team", "a.lindqvist"],
    ["13:44:05", "Device discovered — 10.10.4.31", "system"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", left: 40, top: 60, right: 40, borderRadius: 12, background: "var(--st-panel)", border: "1px solid var(--st-line-2)", boxShadow: "0 30px 80px rgba(0,0,0,.5)", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", padding: "14px 18px", borderBottom: "1px solid var(--st-line)", fontSize: 14, fontWeight: 600 }}>
        <span>All Stratora events</span>
        <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 400, color: "#4ade80" }}>Streaming to SIEM</span>
      </div>
      <div style={{ fontSize: 12.5 }}>
        {events.map(([time, text, who], i) => (
          <div
            key={time}
            className="st-row"
            style={{
              animationDelay: `${i * 0.05}s`,
              display: "grid",
              gridTemplateColumns: "76px 1fr 110px",
              gap: 10,
              padding: "11px 18px",
              borderBottom: i < events.length - 1 ? "1px solid #191922" : undefined,
            }}
          >
            <span className="st-mono" style={{ color: "var(--st-ink-4)" }}>{time}</span>
            <span>{text}</span>
            <span style={{ color: "var(--st-ink-3)" }}>{who}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderTop: "1px solid var(--st-line)", fontSize: 12, color: "var(--st-ink-3)" }}>
        <span>Splunk</span>
        <span style={{ color: "#4ade80" }}>healthy</span>
        <span style={{ marginLeft: 16 }}>Graylog</span>
        <span style={{ color: "#4ade80" }}>healthy</span>
      </div>
    </div>
  );
}

export const STORY_VISUALS = [Fragmented, OnePlatform, OnPrem, OfflineLicense, SmsAck, AuditStream];
export const STORY_STAGE = { width: W, height: H };
