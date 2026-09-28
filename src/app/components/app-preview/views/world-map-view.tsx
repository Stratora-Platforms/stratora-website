import { AppChrome } from "../app-chrome";
import { STATUS_BG, STATUS_TEXT, WORLD_PINS } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

/**
 * The app's world map is Leaflet over OpenStreetMap raster tiles, which DOM
 * cannot reproduce byte for byte. This renders the same view — header, pin
 * set, status legend, zoom control — over the dotted vector world in
 * public/worldmap.svg, the same artwork the hero dashboard uses. It is the one
 * recreation in the set that is a deliberate approximation rather than a
 * faithful copy; everything else matches the real markup.
 */

/** The map artwork's own coordinate space. */
const MAP_W = 1060;
const MAP_H = 340;

const legend = [
  { kind: "healthy", label: "Healthy" },
  { kind: "warning", label: "Degraded" },
  { kind: "critical", label: "Critical" },
  { kind: "maintenance", label: "Maintenance" },
] as const;

export function WorldMapView({ tick, ease }: ViewProps) {
  const counts = WORLD_PINS.reduce<Record<string, number>>((acc, pin) => {
    acc[pin.status] = (acc[pin.status] || 0) + 1;
    return acc;
  }, {});

  // The tooltip walks the sites that need attention.
  const attention = WORLD_PINS.filter((p) => p.status === "critical" || p.status === "warning");
  const focused = attention[tick % Math.max(1, attention.length)];

  return (
    <AppChrome active="Monitoring">
      <div className="ap-page ap-page-flush">
        <div className="ap-pagehead">
          <span className="ap-pagehead-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">World Map</div>
            <div className="ap-pagesub ap-worldsub">
              World map
              {legend.map((entry) =>
                counts[entry.kind] ? (
                  <span key={entry.kind} className="ap-worldcount">
                    <span className="ap-dot" style={{ background: STATUS_TEXT[entry.kind] }} />
                    {counts[entry.kind]}
                  </span>
                ) : null,
              )}
            </div>
          </div>
          <div className="ap-grow" />
          <span className="ap-btn">← Back</span>
          <span className="ap-btn ap-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
            </svg>
            Edit Map
          </span>
        </div>

        <div className="ap-worldwrap">
          <div className="ap-worldbg" />

          <svg className="ap-worldsvg" viewBox={`0 0 ${MAP_W} ${MAP_H}`} preserveAspectRatio="xMidYMid meet">
            {WORLD_PINS.map((pin) => {
              const color = STATUS_TEXT[pin.status];
              const radius = pin.hq ? 6 : 4.5;
              return (
                <g key={pin.label}>
                  {pin.status !== "healthy" ? (
                    <circle className="ap-pulse-ring" cx={pin.x} cy={pin.y} r={radius} fill={color} />
                  ) : null}
                  <circle cx={pin.x} cy={pin.y} r={radius} fill={color} stroke="#0c0c0f" strokeWidth="2" />
                  <text
                    className="ap-worldlabel"
                    x={pin.anchor === "end" ? pin.x - radius - 5 : pin.x + radius + 5}
                    y={pin.y + 3.5 + (pin.dy ?? 0)}
                    textAnchor={pin.anchor === "end" ? "end" : "start"}
                    fill="var(--ap-map-chip-muted)"
                  >
                    {pin.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {focused ? (
            <div
              className="ap-worldtip"
              style={{
                left: `${(focused.x / MAP_W) * 100}%`,
                top: `${(focused.y / MAP_H) * 100}%`,
              }}
            >
              <div className="ap-worldtip-head">
                <span className="ap-dot" style={{ background: STATUS_TEXT[focused.status] }} />
                {focused.label}
              </div>
              <div className="ap-worldtip-body">
                <span className="ap-mono">{Math.round(focused.nodes * ease).toLocaleString("en-US")}</span> nodes
                monitored
              </div>
            </div>
          ) : null}

          <div className="ap-worldlegend">
            {legend.map((entry) => (
              <span
                key={entry.kind}
                className="ap-chip"
                style={{ background: STATUS_BG[entry.kind], color: STATUS_TEXT[entry.kind] }}
              >
                <span className="ap-dot" style={{ background: "currentColor" }} />
                {counts[entry.kind] || 0} {entry.label}
              </span>
            ))}
          </div>

          <div className="ap-zoom">
            <span>+</span>
            <span>−</span>
            <span>⤢</span>
          </div>

          <div className="ap-attrib">Leaflet | © OpenStreetMap contributors</div>
        </div>
      </div>
    </AppChrome>
  );
}
