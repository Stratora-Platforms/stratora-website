import { AppChrome } from "../app-chrome";
import { Donut, DonutLegend } from "../donut";
import { NOC, STATUS_TEXT, WORLD_PINS } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

const MAP_W = 1060;
const MAP_H = 340;

export function NocDashboardView({ tick, ease }: ViewProps) {
  const totalNodes = NOC.healthStatus.reduce((sum, s) => sum + s.value, 0);
  // The site table highlights one row per tick, the way a NOC wall cycles.
  const highlighted = tick % NOC.nodesBySite.length;

  return (
    <AppChrome active="Monitoring">
      <div className="ap-page">
        <div className="ap-pagehead">
          <span className="ap-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">{NOC.title}</div>
          </div>
          <div className="ap-grow" />
          <span className="ap-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.5 2" />
            </svg>
            {NOC.range}
          </span>
          <span className="ap-btn">
            <span className="ap-dot ap-blink" style={{ background: "var(--ap-healthy)" }} />
            just now
          </span>
          <span className="ap-btn ap-btn-primary">Edit</span>
        </div>

        <div className="ap-panel ap-noc-map">
          <div className="ap-panel-head">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ap-text-muted)" strokeWidth="1.9" strokeLinejoin="round">
              <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
              <path d="M9 4v13.5M15 6.5V20" />
            </svg>
            World Map
          </div>
          <div className="ap-noc-mapbody">
            <div className="ap-worldbg" />
            <svg className="ap-worldsvg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet">
              {WORLD_PINS.map((pin) => {
                const color = STATUS_TEXT[pin.status];
                const radius = pin.hq ? 5.5 : 4;
                return (
                  <g key={pin.label}>
                    {pin.status !== "healthy" ? (
                      <circle className="ap-pulse-ring" cx={pin.x} cy={pin.y} r={radius} fill={color} />
                    ) : null}
                    <circle cx={pin.x} cy={pin.y} r={radius} fill={color} stroke="#0c0c0f" strokeWidth="1.8" />
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="ap-noc-grid">
          <div className="ap-panel ap-noc-chart">
            <div className="ap-panel-head">Health Status</div>
            <div className="ap-noc-chartbody">
              <Donut segments={NOC.healthStatus} total={totalNodes} caption="Nodes" ease={ease} size={168} thickness={24} />
              <DonutLegend segments={NOC.healthStatus} ease={ease} />
            </div>
          </div>

          <div className="ap-panel ap-noc-chart">
            <div className="ap-panel-head">OS Distribution</div>
            <div className="ap-noc-chartbody">
              <Donut segments={NOC.osDistribution} caption="Nodes" ease={ease} size={168} thickness={24} />
              <DonutLegend segments={NOC.osDistribution} ease={ease} />
            </div>
          </div>

          <div className="ap-panel ap-noc-chart">
            <div className="ap-panel-head">Device Types</div>
            <div className="ap-noc-chartbody">
              <Donut segments={NOC.deviceTypes} caption="Nodes" ease={ease} size={168} thickness={24} />
              <DonutLegend segments={NOC.deviceTypes.slice(0, 5)} ease={ease} more="+ 1 more" />
            </div>
          </div>

          <div className="ap-panel ap-noc-sites">
            <div className="ap-panel-head">
              Nodes by Site
              <span className="ap-dim ap-panel-sub">· {NOC.nodesBySite.length} sites</span>
            </div>
            <div className="ap-th ap-noc-sitegrid">
              <span>Site</span>
              <span>Healthy</span>
              <span>Degraded</span>
              <span>Critical</span>
              <span>Offline</span>
              <span>Maint.</span>
              <span>Total</span>
            </div>
            {NOC.nodesBySite.map((row, i) => (
              <div
                key={row.site}
                className={`ap-tr ap-noc-sitegrid${i === highlighted ? " is-highlighted" : ""}`}
              >
                <span className="ap-noc-sitename">{row.site}</span>
                <span className="ap-mono ap-count is-healthy">{Math.round(row.healthy * ease)}</span>
                <span className="ap-mono ap-count is-warning">{row.degraded || 0}</span>
                <span className="ap-mono ap-count is-critical">{row.critical || 0}</span>
                <span className="ap-mono ap-count is-offline">{row.offline || 0}</span>
                <span className="ap-mono ap-count is-maint">{row.maint || 0}</span>
                <span className="ap-mono">{Math.round(row.total * ease)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
