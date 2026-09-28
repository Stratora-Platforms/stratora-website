import { AppChrome } from "../app-chrome";
import { STATUS_TEXT, TOPOLOGY } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

/** The topology canvas' own coordinate space. */
const CANVAS_W = 1300;
const CANVAS_H = 620;
/** Wide enough that a full node name fits without truncating. */
const NODE_W = 176;
const NODE_H = 62;

const KIND_ICONS: Record<string, JSX.Element> = {
  cloud: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M6.5 18a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.4 1.4A3.6 3.6 0 0 1 17.5 18z" />
    </svg>
  ),
  router: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2.5" y="13" width="19" height="7" rx="1.5" />
      <path d="M6 16.5h.01M9.5 16.5h.01M12 10V6M12 6l-3 2.5M12 6l3 2.5" />
    </svg>
  ),
  firewall: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
    </svg>
  ),
  switch: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <rect x="2.5" y="8" width="19" height="8" rx="1.5" />
      <path d="M6 12h.01M9.5 12h.01M13 12h.01M16.5 12h.01" strokeLinecap="round" />
    </svg>
  ),
  server: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
      <path d="M6.5 7.5h.01M6.5 16.5h.01" strokeLinecap="round" />
    </svg>
  ),
  storage: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </svg>
  ),
  ap: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
      <path d="M5 12.5a9 9 0 0 1 14 0M8 15.5a5 5 0 0 1 8 0M12 19v.01" />
    </svg>
  ),
};

export function TopologyView({ tick }: ViewProps) {
  const byId = Object.fromEntries(TOPOLOGY.nodes.map((n) => [n.id, n]));

  // Traffic flows down one branch at a time, so the map reads as live rather
  // than as a static diagram.
  const litLink = tick % TOPOLOGY.links.length;

  return (
    <AppChrome active="Monitoring">
      <div className="ap-page ap-page-flush">
        <div className="ap-pagehead">
          <span className="ap-back">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">Frankfurt DC — Network Overview</div>
            <div className="ap-pagesub">Auto-discovered by Stratora. Edit in the Map Editor to reflect your real network layout.</div>
          </div>
          <div className="ap-grow" />
          <span className="ap-btn ap-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
            </svg>
            Edit Map
          </span>
        </div>

        <div className="ap-topowrap">
          <svg className="ap-toposvg" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`} preserveAspectRatio="xMidYMid meet">
            <g>
              {TOPOLOGY.links.map(([from, to], i) => {
                const a = byId[from];
                const b = byId[to];
                if (!a || !b) return null;
                const x1 = a.x;
                const y1 = a.y + NODE_H / 2;
                const x2 = b.x;
                const y2 = b.y - NODE_H / 2;
                const mid = (y1 + y2) / 2;
                const d = `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
                const degraded = a.status !== "healthy" || b.status !== "healthy";
                return (
                  <g key={`${from}-${to}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={degraded ? "var(--ap-critical)" : "var(--ap-border-light)"}
                      strokeWidth={degraded ? 1.8 : 1.4}
                      opacity={degraded ? 0.55 : 0.75}
                    />
                    {i === litLink ? (
                      <path className="ap-topoflow" d={d} fill="none" stroke="var(--ap-accent-purple)" strokeWidth="2.4" strokeLinecap="round" />
                    ) : null}
                  </g>
                );
              })}
            </g>

            {TOPOLOGY.nodes.map((node) => {
              const color = STATUS_TEXT[node.status];
              return (
                <g key={node.id} transform={`translate(${node.x - NODE_W / 2} ${node.y - NODE_H / 2})`}>
                  <rect
                    width={NODE_W}
                    height={NODE_H}
                    rx="9"
                    fill="var(--ap-map-device-chip-bg)"
                    stroke={node.status === "healthy" ? "var(--ap-border)" : color}
                    strokeWidth={node.status === "healthy" ? 1 : 1.6}
                  />
                  <foreignObject x="0" y="0" width={NODE_W} height={NODE_H}>
                    <div className="ap-toponode">
                      <span className="ap-toponode-icon" style={{ color }}>
                        {KIND_ICONS[node.kind]}
                      </span>
                      <span className="ap-toponode-label">{node.label}</span>
                      <span className="ap-toponode-dot" style={{ background: color }} />
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>

          <div className="ap-topolegend">
            <span className="ap-dim">Auto-generated · 13 of 548 nodes shown</span>
          </div>

          <div className="ap-zoom">
            <span>+</span>
            <span>−</span>
            <span>⤢</span>
          </div>

          <div className="ap-minimap">
            <div className="ap-minimap-inner">
              {TOPOLOGY.nodes.map((node) => (
                <span
                  key={node.id}
                  style={{
                    left: `${(node.x / CANVAS_W) * 100}%`,
                    top: `${(node.y / CANVAS_H) * 100}%`,
                    background: STATUS_TEXT[node.status],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
