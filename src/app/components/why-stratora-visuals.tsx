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

/** 1 — one platform. */
function OnePlatform() {
  const nav = ["Dashboards", "Alerting", "Topology", "IPAM", "Audit forwarding"];
  return (
    <div
      className="st-fade"
      style={{
        position: "absolute",
        left: 40,
        top: 40,
        right: 40,
        bottom: 40,
        borderRadius: 12,
        background: "var(--st-panel)",
        border: "1px solid var(--st-line-2)",
        boxShadow: "0 30px 80px rgba(0,0,0,.5)",
        display: "flex",
        overflow: "hidden",
      }}
    >
      <div style={{ width: 150, padding: "18px 12px", borderRight: "1px solid var(--st-line)", display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "var(--st-ink-3)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: ".28em", color: "var(--st-ink)", padding: "0 8px 12px 8px" }}>STRATORA</div>
        {nav.map((item, i) => (
          <span
            key={item}
            className="st-row"
            style={{
              animationDelay: `${i * 0.06}s`,
              padding: 8,
              borderRadius: i === 0 ? 7 : undefined,
              background: i === 0 ? "rgba(139,92,246,.16)" : undefined,
              color: i === 0 ? "var(--st-ink)" : undefined,
            }}
          >
            {item}
          </span>
        ))}
      </div>
      <div style={{ flexGrow: 1, padding: 20, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12, alignContent: "start" }}>
        <div style={{ gridColumn: "span 2", height: 130, borderRadius: 9, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 12 }}>
          <div style={label}>Uplink throughput</div>
          <svg width="100%" height="90" viewBox="0 0 400 90" preserveAspectRatio="none">
            <path d="M0 70 L40 62 L80 66 L120 44 L160 52 L200 30 L240 40 L280 22 L320 34 L360 18 L400 26 L400 90 L0 90 Z" fill="rgba(139,92,246,.15)" />
            <path d="M0 70 L40 62 L80 66 L120 44 L160 52 L200 30 L240 40 L280 22 L320 34 L360 18 L400 26" fill="none" stroke="#8b5cf6" strokeWidth="2" />
          </svg>
        </div>
        <div style={{ height: 120, borderRadius: 9, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 12 }}>
          <div style={label}>Nodes online</div>
          <div style={{ marginTop: 14, fontSize: 34, fontWeight: 600, color: "#4ade80" }}>4,809</div>
        </div>
        <div style={{ height: 120, borderRadius: 9, background: "var(--st-panel-2)", border: "1px solid #20202b", padding: 12 }}>
          <div style={label}>Active alerts</div>
          <div style={{ marginTop: 14, fontSize: 34, fontWeight: 600, color: "#fb923c" }}>41</div>
        </div>
      </div>
    </div>
  );
}

/** 2 — runs inside your network; no SaaS tenant. */
function OnPrem() {
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <rect x="60" y="60" width="440" height="400" rx="26" fill="rgba(139,92,246,.04)" stroke="rgba(167,139,250,.6)" strokeDasharray="7 7" />
        <path d="M500 260 L610 260" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 5" />
        <circle cx="500" cy="260" r="11" fill="#0d0d13" stroke="#ef4444" strokeWidth="1.5" />
        <path d="M495 255 L505 265 M505 255 L495 265" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M596 244 a18 18 0 0 1 28 -6 a14 14 0 0 1 20 16 a12 12 0 0 1 -6 22 h-40 a14 14 0 0 1 -2 -32z" fill="none" stroke="#6b6b78" strokeWidth="1.5" />
      </svg>
      <div style={{ position: "absolute", left: 110, top: 150, width: 340, borderRadius: 12, background: "var(--st-panel)", border: "1px solid #2a2a3c", padding: 18, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>Stratora server</div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 8, fontSize: 12.5, color: "var(--st-ink-2)" }}>
          {["PostgreSQL", "VictoriaMetrics", "NGINX", "Backend"].map((part) => (
            <span key={part} style={{ padding: "8px 10px", borderRadius: 7, background: "#15151e" }}>
              {part}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: "absolute", left: 84, top: 78, fontSize: 13, color: "#c4b5fd" }}>Your network</div>
      <div style={{ position: "absolute", left: 560, top: 290, fontSize: 12.5, color: "var(--st-ink-3)", width: 90, textAlign: "center" }}>SaaS tenant</div>
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

/** 4 — the 2:07 SMS, acknowledged by reply. */
function SmsAck() {
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 300, height: 440, borderRadius: 40, border: "1px solid #2a2a38", background: "#0a0a0f", boxShadow: "0 30px 80px rgba(0,0,0,.55)", padding: "56px 16px 16px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ textAlign: "center", fontSize: 44, fontWeight: 300, letterSpacing: "-1px" }}>2:07</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "0 2px" }}>
          <div style={{ fontSize: 11.5, color: "var(--st-ink-4)", textAlign: "center" }}>SMS · on-call</div>
          <div style={{ alignSelf: "flex-start", maxWidth: 230, borderRadius: "16px 16px 16px 4px", background: "#23232f", padding: "10px 12px", fontSize: 12.5, lineHeight: 1.45, color: "#e4e4e7" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span className="st-pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#f97316" }} />
              Stratora: CRITICAL
            </span>
            <br />
            MTY-CORE-SW01 uplink Gi1/0/48 down. Monterrey Plant.
            <br />
            Reply to acknowledge.
          </div>
          <div style={{ alignSelf: "flex-end", borderRadius: "16px 16px 4px 16px", background: "#8b5cf6", padding: "8px 14px", fontSize: 13, fontWeight: 600 }}>ack</div>
          <div style={{ alignSelf: "flex-start", maxWidth: 230, borderRadius: "16px 16px 16px 4px", background: "#23232f", padding: "10px 12px", fontSize: 12.5, lineHeight: 1.45, color: "#e4e4e7" }}>
            Alert acknowledged.
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
