import { AppChrome } from "../app-chrome";
import { IPAM_STATS, IPAM_SUBNETS, STATUS_BG, STATUS_TEXT } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

const STAT_ICONS: JSX.Element[] = [
  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="3" width="6" height="5" rx="1" />
    <rect x="2" y="16" width="6" height="5" rx="1" />
    <rect x="16" y="16" width="6" height="5" rx="1" />
    <path d="M12 8v4M5 16v-2h14v2" />
  </svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="12" rx="2" />
    <path d="M8 21h8" strokeLinecap="round" />
  </svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="m12 3 9 5-9 5-9-5z" />
    <path d="m3 13 9 5 9-5" />
  </svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
    <path d="M12 4 2.5 20h19z" />
    <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
  </svg>,
  <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </svg>,
];

const utilColor = (pct: number) =>
  pct >= 85 ? "var(--ap-critical)" : pct >= 65 ? "var(--ap-warning)" : "var(--ap-healthy)";

export function IpamView({ tick, ease }: ViewProps) {
  // Discovery keeps finding addresses: one subnet's usage ticks up each cycle.
  const bump = (index: number) => ((tick + index) % 7 === 0 ? 3 : 0);

  return (
    <AppChrome active="Infrastructure">
      <div className="ap-page">
        <div className="ap-pagehead">
          <span className="ap-pagehead-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">IPAM</div>
            <div className="ap-pagesub">IP Address Management</div>
          </div>
        </div>

        <div className="ap-stats" style={{ gridTemplateColumns: "repeat(6, minmax(0, 1fr))" }}>
          {IPAM_STATS.map((stat, i) => (
            <div key={stat.label} className="ap-stat">
              <span className="ap-stat-icon" style={{ background: STATUS_BG[stat.kind], color: STATUS_TEXT[stat.kind] }}>
                {STAT_ICONS[i]}
              </span>
              <span>
                <span className="ap-stat-value">{stat.value}</span>
                <span className="ap-stat-label" style={{ display: "block" }}>
                  {stat.label}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="ap-tabs">
          <span className="ap-tab">Supernets</span>
          <span className="ap-tab is-active">Subnets</span>
          <span className="ap-tab">Addresses</span>
          <div className="ap-grow" />
          <span className="ap-select">All Sites ▾</span>
        </div>

        <div className="ap-esc-toolbar">
          <span className="ap-btn ap-btn-primary">+ Add Subnet</span>
          <div className="ap-grow" />
          <span className="ap-search" style={{ width: 300 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search subnets…</span>
          </span>
        </div>

        <div className="ap-panel">
          <div className="ap-th ap-ipam-grid">
            <span>CIDR</span>
            <span>Name</span>
            <span>Site</span>
            <span>VLAN</span>
            <span>Gateway</span>
            <span>Utilization</span>
            <span>Free</span>
          </div>
          {IPAM_SUBNETS.map((subnet, i) => {
            const used = Math.min(subnet.total, subnet.used + bump(i));
            const pct = (used / subnet.total) * 100;
            return (
              <div key={subnet.cidr} className="ap-tr ap-ipam-grid">
                <span className="ap-mono ap-cidr">{subnet.cidr}</span>
                <span>{subnet.name}</span>
                <span className="ap-dim">{subnet.site}</span>
                <span className="ap-mono ap-dim">{subnet.vlan}</span>
                <span className="ap-mono ap-dim">{subnet.gateway}</span>
                <span className="ap-util">
                  <span className="ap-bar-track" style={{ width: 150 }}>
                    <span
                      className="ap-bar-fill"
                      style={
                        { "--ap-w": `${pct * ease}%`, "--ap-c": utilColor(pct) } as React.CSSProperties
                      }
                    />
                  </span>
                  <span className="ap-mono ap-util-pct">{(pct * ease).toFixed(1)}%</span>
                  <span className="ap-mono ap-dim ap-util-abs">
                    {Math.round(used * ease)} / {subnet.total}
                  </span>
                </span>
                <span className="ap-mono ap-dim">{subnet.total - used}</span>
              </div>
            );
          })}
          <div className="ap-tablefoot">Showing {IPAM_SUBNETS.length} of 42 subnets</div>
        </div>
      </div>
    </AppChrome>
  );
}
