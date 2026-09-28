import { AppChrome } from "../app-chrome";
import { Donut, DonutLegend } from "../donut";
import { SITE, STATUS_BG, STATUS_TEXT } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

const HEALTH_SEGMENTS = [
  { label: "Healthy", value: SITE.counts.healthy, color: "#22c55e" },
  { label: "Degraded", value: SITE.counts.degraded, color: "#eab308" },
  { label: "Critical", value: SITE.counts.critical, color: "#f97316" },
  { label: "Offline", value: SITE.counts.offline, color: "#ef4444" },
];

export function SiteOverviewView({ tick, ease }: ViewProps) {
  // The health-history strip advances one bucket per tick, so the newest hour
  // keeps arriving on the right.
  const history = SITE.healthHistory;
  const shifted = history.map((_, i) => history[(i + tick) % history.length]);

  return (
    <AppChrome active="Infrastructure">
      <div className="ap-page">
        <div className="ap-pagehead">
          <span className="ap-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">{SITE.name}</div>
            <div className="ap-pagesub ap-site-address">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {SITE.address}
            </div>
          </div>
        </div>

        <div className="ap-sitetabs">
          {SITE.tabs.map((tab) => (
            <span key={tab} className={`ap-tab${tab === "Overview" ? " is-active" : ""}`}>
              {tab}
              {tab === "Alerts" ? <span className="ap-tabbadge">{SITE.alertsBadge}</span> : null}
            </span>
          ))}
        </div>

        <div className="ap-sitealerts">
          {SITE.chips.map((chip) => (
            <span
              key={chip.label}
              className="ap-chip"
              style={{ background: STATUS_BG[chip.kind], color: STATUS_TEXT[chip.kind] }}
            >
              <span className="ap-dot" style={{ background: "currentColor" }} />
              {chip.label}
            </span>
          ))}
          <div className="ap-grow" />
          <span className="ap-viewalerts">View Alerts →</span>
        </div>

        <div className="ap-panel ap-sitehealth">
          <span className="ap-dot" style={{ background: STATUS_TEXT.critical }} />
          <span className="ap-sitehealth-label">{SITE.healthLabel}</span>
          <span className="ap-sitehealth-pct">{(SITE.healthPct * ease).toFixed(1)}%</span>
          <div className="ap-grow" />
          {HEALTH_SEGMENTS.map((segment) => (
            <span key={segment.label} className="ap-sitecount">
              <span className="ap-dot" style={{ background: segment.color }} />
              <b>{Math.round(segment.value * ease)}</b> {segment.label}
            </span>
          ))}
          <span className="ap-dim ap-sitetotal">{SITE.nodes} total</span>
        </div>

        <div className="ap-panel ap-sitehistory">
          <div className="ap-panel-head">
            Health History
            <div className="ap-grow" />
            <span className="ap-segment ap-segment-sm">
              <span className="is-active">24h</span>
              <span>7d</span>
              <span>30d</span>
              <span>90d</span>
              <span>1y</span>
            </span>
          </div>
          <div className="ap-historystrip">
            {shifted.map((bucket, i) => (
              <span
                key={i}
                className="ap-historybar"
                style={{ background: STATUS_TEXT[bucket], opacity: ease }}
              />
            ))}
          </div>
        </div>

        <div className="ap-sitegrid">
          <div className="ap-panel">
            <div className="ap-panel-head">Site Details</div>
            <dl className="ap-kv ap-kv-wide">
              <dt>Address</dt>
              <dd>{SITE.address}</dd>
              <dt>Preferred Collector</dt>
              <dd className="ap-mono">{SITE.collector}</dd>
              <dt>Nodes</dt>
              <dd>{Math.round(SITE.nodes * ease)}</dd>
              <dt>Networks</dt>
              <dd>{SITE.networks}</dd>
            </dl>
          </div>

          <div className="ap-panel">
            <div className="ap-panel-head">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ap-text-muted)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="3" width="6" height="5" rx="1" />
                <rect x="2" y="16" width="6" height="5" rx="1" />
                <rect x="16" y="16" width="6" height="5" rx="1" />
                <path d="M12 8v4M5 16v-2h14v2" />
              </svg>
              Networks ({SITE.networks})
            </div>
            {SITE.networksList.map((network) => (
              <div key={network.cidr} className="ap-networkrow">
                <span className="ap-mono ap-cidr">{network.cidr}</span>
                <span>{network.name}</span>
                <div className="ap-grow" />
                <span className="ap-dim ap-mono">GW {network.gateway}</span>
                <span className="ap-dim">VLAN {network.vlan}</span>
                <span className="ap-networkips">{Math.round(network.ips * ease)} IPs</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ap-sitegrid">
          <div className="ap-panel">
            <div className="ap-panel-head">Node Health</div>
            <div className="ap-noc-chartbody">
              <Donut segments={HEALTH_SEGMENTS} total={SITE.nodes} caption="Nodes" ease={ease} size={176} thickness={26} />
              <DonutLegend segments={HEALTH_SEGMENTS} ease={ease} />
            </div>
          </div>

          <div className="ap-panel">
            <div className="ap-panel-head">Device Types</div>
            <div className="ap-noc-chartbody">
              <Donut segments={SITE.deviceTypes} total={SITE.nodes} caption="Nodes" ease={ease} size={176} thickness={26} />
              <DonutLegend segments={SITE.deviceTypes.slice(0, 4)} ease={ease} more="+ 2 more" />
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
