import { AppChrome } from "../app-chrome";
import { ALERT_GROUPS, ALERT_ROWS, ALERT_STATS, STATUS_BG, STATUS_TEXT } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

/** Rows visible in the table at 1080p. */
const VISIBLE = 16;

const SeverityIcon = ({ severity }: { severity: "warning" | "critical" }) =>
  severity === "critical" ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ap-critical)" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.01" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--ap-warning)" strokeWidth="2" strokeLinejoin="round">
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
    </svg>
  );

const STAT_ICONS: Record<string, JSX.Element> = {
  Active: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.01" />
    </svg>
  ),
  Acknowledged: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  ),
  Muted: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H3v6h3l5 4zM17 9.5l4 5M21 9.5l-4 5" />
    </svg>
  ),
  Resolved: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  ),
};

export function AlertsView({ tick, ease }: ViewProps) {
  // The feed shifts by one on each tick, newest at the top — the same motion
  // the real console shows when alerts land.
  const rows = Array.from({ length: VISIBLE }, (_, i) => {
    const n = ALERT_ROWS.length;
    return ALERT_ROWS[((n - (tick % n)) + i) % n];
  });

  const count = (target: number) => Math.round(target * ease).toLocaleString("en-US");

  return (
    <AppChrome active="Alerting">
      <div className="ap-page">
        <div className="ap-pagehead">
          <span className="ap-pagehead-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
              <path d="M10 21h4" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">Alerts</div>
            <div className="ap-pagesub">Monitor and manage system alerts</div>
          </div>
          <div className="ap-grow" />
          <span className="ap-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" />
            </svg>
            Refresh
          </span>
        </div>

        <div className="ap-stats" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
          {ALERT_STATS.map((stat) => (
            <div key={stat.label} className="ap-stat">
              <span
                className="ap-stat-icon"
                style={{ background: STATUS_BG[stat.kind], color: STATUS_TEXT[stat.kind] }}
              >
                {STAT_ICONS[stat.label]}
              </span>
              <span>
                <span className="ap-stat-value">{count(Number(stat.value.replace(/,/g, "")))}</span>
                <span className="ap-stat-label" style={{ display: "block" }}>
                  {stat.label}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="ap-alerts-toolbar">
          <div className="ap-grow" />
          <span className="ap-search" style={{ width: 260 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search alerts…</span>
          </span>
          <span className="ap-alerts-count">{ALERT_GROUPS}</span>
        </div>

        <div className="ap-panel ap-alerts-panel">
          <div className="ap-th ap-alerts-grid">
            <span>Severity</span>
            <span>Alert</span>
            <span>Node</span>
            <span>Triggered ↓</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {rows.map((row, i) => (
            <div
              key={`${tick}-${i}`}
              className={`ap-tr ap-alerts-grid${row.status === "Active" ? " is-alerting" : ""}${i === 0 ? " ap-row-enter" : ""}`}
            >
              <span>
                <SeverityIcon severity={row.severity} />
              </span>
              <span className="ap-alert-name">
                {row.alert}
                {row.team ? <span className="ap-team-chip">{row.team}</span> : null}
              </span>
              <span className="ap-mono ap-dim">{row.node}</span>
              <span className="ap-dim">{row.triggered}</span>
              <span className="ap-mono ap-dim">{row.duration}</span>
              <span>
                <span
                  className="ap-chip"
                  style={{
                    background: row.status === "Active" ? STATUS_BG.offline : STATUS_BG.healthy,
                    color: row.status === "Active" ? STATUS_TEXT.offline : STATUS_TEXT.healthy,
                  }}
                >
                  {row.status === "Active" ? <span className="ap-dot ap-blink" style={{ background: "currentColor" }} /> : null}
                  {row.status}
                </span>
              </span>
              <span>
                {row.status === "Active" ? (
                  <span className="ap-actions">
                    <span className="ap-minibtn">Ack</span>
                    <span className="ap-minibtn">↗ Escalate</span>
                  </span>
                ) : null}
              </span>
            </div>
          ))}
        </div>
      </div>
    </AppChrome>
  );
}
