import type { ReactNode } from "react";
import { AppChrome } from "../app-chrome";
import { FACILITY, STATUS_TEXT, type FacilityMarker, type FacilityStatus } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

/**
 * A site's Facility tab: Halden Group's New York HQ, Level 1. The floor plan
 * is drawn here in SVG (the real tab shows an uploaded PNG, JPEG or PDF page),
 * with the spaces outlined in their live status, racks drawn as small racks,
 * node markers in status rings, a scale bar, a hover card, and the side panel
 * for the selected network closet open on its Environment tab.
 *
 * Plan space is 1040x650 and is rendered 1:1, so the hover card can be placed
 * in the same coordinates as the markers.
 */

const PLAN_W = 1040;
const PLAN_H = 650;

/* Plan palette, read off the reference shots of the real tab. */
const PLAN_BG = "#0e1729";
const PLAN_GRID = "#15213a";
const ROOM_FILL = "#101a2d";
const WALL = "#a3b3cf";
const FURNITURE = "#5b6b8c";

const glyph = (d: ReactNode) => d;

/** Device glyphs on a 24-unit grid, the same shapes as the topology icons. */
const GLYPHS: Record<FacilityMarker["icon"], ReactNode> = {
  switch: glyph(
    <>
      <rect x="9" y="3" width="6" height="5" rx="1" />
      <rect x="2" y="16" width="6" height="5" rx="1" />
      <rect x="16" y="16" width="6" height="5" rx="1" />
      <path d="M12 8v4M5 16v-2h14v2" />
    </>,
  ),
  sensor: glyph(<path d="M14 14.8V5a2 2 0 0 0-4 0v9.8a4 4 0 1 0 4 0zM12 9v8" />),
  ap: glyph(
    <>
      <rect x="4" y="13" width="16" height="6" rx="2" />
      <path d="M8.5 9.5a5 5 0 0 1 7 0M6 7a8.5 8.5 0 0 1 12 0M8 16h.01" />
    </>,
  ),
  pdu: glyph(<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5" />),
  ups: glyph(
    <>
      <rect x="3" y="6" width="16" height="12" rx="2" />
      <path d="M21 10v4M11 8.5l-2.5 4h4l-2.5 4" />
    </>,
  ),
  server: glyph(<path d="M4 5.5 11 4.5v7H4zM13 4.2 20 3v8.5h-7zM4 12.5h7v7L4 18.5zM13 12.5h7V21l-7-1.2z" />),
  device: glyph(<rect x="5" y="5" width="14" height="14" rx="2" strokeDasharray="2.5 2.5" />),
  camera: glyph(<path d="M6 21h12M8 21V8h8v13M10 4h4v4h-4zM10.5 12h3M10.5 15.5h3" />),
};

const ringColour = (status: FacilityStatus) => STATUS_TEXT[status];

/** The warning triangle a marker carries while it has active alerts. */
function AlertBadge({ x, y, blink }: { x: number; y: number; blink: boolean }) {
  return (
    <path
      className={blink ? "ap-blink" : undefined}
      d={`M${x} ${y - 6} L${x + 6} ${y + 5} L${x - 6} ${y + 5} Z`}
      fill="var(--ap-critical)"
      stroke={PLAN_BG}
      strokeWidth="1.5"
    />
  );
}

function Marker({ m, hot, label }: { m: FacilityMarker; hot: boolean; label: boolean }) {
  const colour = ringColour(m.status);
  const unknown = m.status === "unknown";
  return (
    <g>
      {m.status === "critical" ? <circle className="ap-pulse-ring" cx={m.x} cy={m.y} r="6" fill={colour} opacity=".35" /> : null}
      {hot ? <circle cx={m.x} cy={m.y} r="19" fill="none" stroke="var(--ap-accent-purple)" strokeWidth="2.5" /> : null}
      <circle
        cx={m.x}
        cy={m.y}
        r="14"
        fill="#141418"
        stroke={colour}
        strokeWidth="2.4"
        strokeDasharray={unknown ? "4 3" : undefined}
      />
      <g
        transform={`translate(${m.x - 8} ${m.y - 8}) scale(${16 / 24})`}
        fill="none"
        stroke={unknown ? "#d4d4d8" : "#ededf0"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {GLYPHS[m.icon]}
      </g>
      {m.alert ? <AlertBadge x={m.x + 13} y={m.y - 13} blink /> : null}
      {label ? (
        <g>
          <rect x={m.x - 38} y={m.y + 19} width="76" height="17" rx="4" fill="#141418" stroke="#2a2a31" />
          <text x={m.x} y={m.y + 31} textAnchor="middle" fontSize="10.5" fontWeight="600" fill="#ededf0">
            {m.id}
          </text>
        </g>
      ) : null}
    </g>
  );
}

/** A rack on the plan: a small rack with a status bar and device bands. */
function Rack({ x, y, status }: { x: number; y: number; status: FacilityStatus }) {
  const colour = ringColour(status);
  return (
    <g>
      <rect x={x - 12} y={y - 19} width="24" height="38" rx="4" fill="#141418" stroke={colour} strokeWidth="2.2" />
      <rect x={x - 7} y={y - 14} width="14" height="28" rx="1.5" fill="none" stroke={colour} strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={x - 5} y={y - 12 + i * 5.2} width="10" height="3" rx=".6" fill={i === 0 && status === "critical" ? "var(--ap-warning)" : colour} />
      ))}
    </g>
  );
}

/* -- plan furniture ------------------------------------------------------- */
function Furniture() {
  const s = { fill: "none", stroke: FURNITURE, strokeWidth: 1.4 };
  const desks = (x0: number, y0: number, cols: number, rows: number, dx: number, dy: number, w: number, h: number) =>
    Array.from({ length: cols * rows }, (_, i) => (
      <rect key={`${x0}-${y0}-${i}`} x={x0 + (i % cols) * dx} y={y0 + Math.floor(i / cols) * dy} width={w} height={h} {...s} />
    ));
  return (
    <g>
      {/* loading bay: pallet lanes */}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`l${i}`} x={50 + i * 25} y={100} width="11" height="98" {...s} />
      ))}
      {/* reception desk, meeting table */}
      <rect x="392" y="155" width="96" height="22" rx="11" {...s} />
      <rect x="570" y="104" width="108" height="56" rx="6" {...s} />
      {/* comms room rack row */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={`c${i}`} x={734 + i * 34} y="108" width="24" height="62" fill="#1a2440" stroke={FURNITURE} strokeWidth="1.2" />
      ))}
      {/* production benches */}
      {[0, 1, 2].map((r) =>
        Array.from({ length: 10 }, (_, i) => (
          <rect key={`p${r}-${i}`} x={62 + i * 40} y={256 + r * 52} width="40" height="16" {...s} />
        )),
      )}
      {/* IDF-B second rack position */}
      <rect x="508" y="250" width="24" height="54" fill="#1a2440" stroke={FURNITURE} strokeWidth="1.2" />
      {/* open office desks */}
      {desks(668, 248, 8, 4, 40.5, 36, 30, 18)}
      {/* office, NOC desks */}
      {desks(62, 446, 3, 3, 42, 46, 32, 20)}
      {desks(222, 446, 2, 3, 46, 46, 36, 20)}
      {/* kitchen counter */}
      <rect x="488" y="552" width="124" height="24" {...s} />
      {/* shipping racking */}
      {Array.from({ length: 11 }, (_, i) => (
        <rect key={`s${i}`} x={660 + i * 30} y="450" width="10" height="114" {...s} />
      ))}
    </g>
  );
}

/** Door openings: short gaps cut into the walls. */
const DOORS: [number, number, number, number][] = [
  [100, 210, 30, 4], [250, 210, 30, 4], [420, 210, 30, 4], [600, 210, 30, 4], [700, 210, 26, 4],
  [100, 406, 30, 4], [250, 406, 30, 4], [400, 406, 30, 4], [540, 406, 30, 4], [700, 406, 30, 4], [860, 406, 30, 4],
  [632, 300, 4, 30],
];

/* -- small UI bits --------------------------------------------------------- */
const chevron = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function PanelIcon({ icon, status, size = 18 }: { icon: FacilityMarker["icon"] | "closet"; status: FacilityStatus; size?: number }) {
  const path =
    icon === "closet" ? (
      <path d="M9 4v4M15 4v4M7 8h10v3a5 5 0 0 1-10 0zM12 16v4M4 20h16" />
    ) : (
      GLYPHS[icon]
    );
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={ringColour(status)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {path}
    </svg>
  );
}

export function FacilityView({ tick, ease }: ViewProps) {
  const f = FACILITY;
  const step = tick % 4;
  // The hover card alternates between a rack and a node, as a pointer would.
  const hoverRack = tick % 2 === 0;
  const rack = f.racks[1];
  const ap = f.markers.find((m) => m.id === f.hover.node.name)!;

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
            <div className="ap-pagetitle">{f.site}</div>
            <div className="ap-pagesub ap-site-address">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                <path d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {f.address}
            </div>
          </div>
        </div>

        <div className="ap-sitetabs">
          {f.tabs.map((tab) => (
            <span key={tab} className={`ap-tab${tab === "Facility" ? " is-active" : ""}`}>
              {tab}
              {tab === "Alerts" ? <span className="ap-tabbadge">{f.alertsBadge}</span> : null}
            </span>
          ))}
        </div>

        <div className="ap-fac-layout">
          <div className="ap-fac-left">
            <div className="ap-fac-toolbar">
              <span className="ap-fac-floor">
                {f.floor}
                <span className="ap-grow" />
                {chevron}
              </span>
              <span className="ap-dim ap-fac-edited">{f.edited}</span>
              <span className="ap-grow" />
              <span className="ap-dim ap-fac-edited">Labels</span>
              <span className="ap-fac-seg">
                <span className="is-active">Auto</span>
                <span>On</span>
                <span>Off</span>
              </span>
              <span className="ap-fac-btn">Plan {chevron}</span>
              <span className="ap-fac-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
                </svg>
                Edit layout
              </span>
            </div>

            <div className="ap-fac-canvas">
              <div className="ap-fac-zoom">
                <span>+</span>
                <span>−</span>
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
                  </svg>
                </span>
                <span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
                  </svg>
                </span>
              </div>

              <div className="ap-fac-plan" style={{ width: PLAN_W, height: PLAN_H, opacity: 0.4 + 0.6 * ease }}>
                <svg width={PLAN_W} height={PLAN_H} viewBox={`0 0 ${PLAN_W} ${PLAN_H}`}>
                  <defs>
                    <pattern id="ap-fac-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M20 0H0V20" fill="none" stroke={PLAN_GRID} strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width={PLAN_W} height={PLAN_H} fill={PLAN_BG} />
                  <rect width={PLAN_W} height={PLAN_H} fill="url(#ap-fac-grid)" />

                  <text x="30" y="38" fontSize="21" fontWeight="700" fill="#ededf0">
                    Halden Group · {f.site}
                  </text>
                  <text x="424" y="38" fontSize="13" fill="#cbd5e1">
                    {f.floor}
                  </text>

                  {f.rooms.map((r) => (
                    <g key={r.name}>
                      <rect x={r.x} y={r.y} width={r.w} height={r.h} fill={ROOM_FILL} stroke={WALL} strokeWidth="3.5" />
                      <text x={r.x + 7} y={r.y + 17} fontSize="13" fill="#dbe3f0">
                        {r.name}
                      </text>
                    </g>
                  ))}

                  {f.spaces
                    .filter((s) => !s.selected)
                    .map((s) => (
                      <g key={s.name}>
                        <rect x={s.x} y={s.y} width={s.w} height={s.h} fill={ROOM_FILL} stroke={WALL} strokeWidth="3.5" />
                        <rect
                          x={s.x + 3}
                          y={s.y + 3}
                          width={s.w - 6}
                          height={s.h - 6}
                          fill={ringColour(s.status)}
                          fillOpacity={s.status === "healthy" ? 0.1 : 0.05}
                          stroke={ringColour(s.status)}
                          strokeWidth="2"
                        />
                        <text x={s.x + 7} y={s.y + 17} fontSize="13" fill="#dbe3f0">
                          {s.name}
                        </text>
                      </g>
                    ))}

                  {DOORS.map(([x, y, w, h]) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width={w} height={h} fill="#7d8db0" />
                  ))}

                  <Furniture />

                  {/* the selected space, drawn last so its outline sits on top */}
                  {f.spaces
                    .filter((s) => s.selected)
                    .map((s) => (
                      <g key={s.name}>
                        <rect x={s.x} y={s.y} width={s.w} height={s.h} fill="none" stroke={WALL} strokeWidth="3.5" />
                        <rect x={s.x + 3} y={s.y + 3} width={s.w - 6} height={s.h - 6} fill="var(--ap-accent-purple)" fillOpacity=".14" stroke="var(--ap-accent-purple)" strokeWidth="2.5" />
                        <rect x={s.x + 6} y={s.y + 6} width={s.w - 12} height={s.h - 12} fill="none" stroke={ringColour(s.status)} strokeWidth="1.6" />
                        <text x={s.x + 9} y={s.y + 21} fontSize="13" fill="#dbe3f0">
                          {s.name}
                        </text>
                      </g>
                    ))}

                  {f.racks.map((r) => (
                    <g key={r.name}>
                      <Rack x={r.x} y={r.y} status={r.status} />
                      {r.status === "critical" ? <AlertBadge x={r.x + 12} y={r.y - 19} blink /> : null}
                    </g>
                  ))}
                  {hoverRack ? (
                    <rect x={rack.x - 17} y={rack.y - 24} width="34" height="48" rx="6" fill="none" stroke="var(--ap-accent-purple)" strokeWidth="2.5" />
                  ) : null}

                  {f.markers.map((m) => (
                    <Marker key={m.id} m={m} hot={!hoverRack && m.id === ap.id} label={!hoverRack && m.id === ap.id} />
                  ))}

                  <text x="30" y="626" fontSize="11" fill="#7d8db0">
                    Halden Group (fictional) · Grid 1 m
                  </text>
                </svg>

                {/* Hover summary card, in plan coordinates. */}
                {hoverRack ? (
                  <div className="ap-fac-hover" style={{ left: rack.x - 110, top: rack.y + 30, width: 220 }}>
                    <div className="ap-fac-hover-head">
                      <span className="ap-fac-hover-icon" style={{ borderColor: ringColour("healthy") }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ringColour("healthy")} strokeWidth="2" strokeLinecap="round">
                          <rect x="6" y="3" width="12" height="18" rx="1.5" />
                          <path d="M9 7h6M9 11h6M9 15h6" />
                        </svg>
                      </span>
                      <div>
                        <div className="ap-fac-hover-name">{f.hover.rack.name}</div>
                        <div className="ap-fac-hover-kind">
                          Rack <span className="ap-dot" style={{ background: STATUS_TEXT.healthy }} />
                          <span style={{ color: STATUS_TEXT.healthy }}>Online</span>
                        </div>
                      </div>
                    </div>
                    <dl className="ap-fac-hover-kv">
                      {f.hover.rack.rows.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd style={k === "Worst" ? { color: STATUS_TEXT.healthy } : undefined}>{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ) : (
                  <div className="ap-fac-hover" style={{ left: ap.x - 300, top: ap.y - 236, width: 270 }}>
                    <div className="ap-fac-hover-head">
                      <span className="ap-fac-hover-icon" style={{ borderColor: ringColour("healthy") }}>
                        <PanelIcon icon="ap" status="healthy" size={16} />
                      </span>
                      <div>
                        <div className="ap-fac-hover-name">{f.hover.node.name}</div>
                        <div className="ap-fac-hover-kind">
                          {f.hover.node.kind} <span className="ap-dot" style={{ background: STATUS_TEXT.healthy }} />
                          <span style={{ color: STATUS_TEXT.healthy }}>Online</span>
                        </div>
                      </div>
                    </div>
                    <dl className="ap-fac-hover-kv">
                      {f.hover.node.rows.map(([k, v]) => (
                        <div key={k}>
                          <dt>{k}</dt>
                          <dd>{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="ap-fac-hover-grid">
                      <span className="ap-dim">IP Address</span>
                      <span className="ap-dim">Site</span>
                      <span className="ap-mono">{f.hover.node.ip}</span>
                      <span>{f.site}</span>
                      <span className="ap-dim">Collector</span>
                      <span className="ap-dim">Floor</span>
                      <span>{f.hover.node.collector}</span>
                      <span>{f.floor}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="ap-fac-scale">
                <span>2 m</span>
                <span className="ap-fac-scale-bar" />
              </div>
            </div>
          </div>

          {/* Side panel for the selected space. */}
          <div className="ap-fac-side">
            <div className="ap-fac-side-head">
              <span className="ap-fac-side-icon">
                <PanelIcon icon="closet" status="critical" size={24} />
              </span>
              <div>
                <div className="ap-fac-side-title">{f.panel.name}</div>
                <div className="ap-dim ap-fac-side-sub">
                  {f.panel.kind} · {f.floor}
                </div>
              </div>
              <span className="ap-grow" />
              <span className="ap-dot ap-blink" style={{ background: STATUS_TEXT.critical, marginTop: 10 }} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ap-text-muted)" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 6 }}>
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </div>

            <div className="ap-fac-trail">
              {f.panel.trail.map((part, i) => (
                <span key={part} className={i === f.panel.trail.length - 1 ? "is-last" : undefined}>
                  {part}
                  {i < f.panel.trail.length - 1 ? <span className="ap-fac-trail-sep">›</span> : null}
                </span>
              ))}
            </div>

            <div className="ap-fac-sidetabs">
              {f.panel.tabs.map((tab) => (
                <span key={tab} className={`ap-tab${tab === "Environment" ? " is-active" : ""}`}>
                  {tab}
                </span>
              ))}
            </div>

            <div className="ap-fac-readings">
              {f.panel.devices.map((device) => (
                <div key={device.name} className="ap-fac-device">
                  <div className="ap-fac-device-head">
                    <PanelIcon icon={device.icon} status={device.status} size={16} />
                    <span className="ap-fac-device-name">{device.name}</span>
                    <span className="ap-grow" />
                    <span className={`ap-dot${device.status === "critical" ? " ap-blink" : ""}`} style={{ background: STATUS_TEXT[device.status] }} />
                    <span style={{ color: STATUS_TEXT[device.status], fontWeight: 600, fontSize: 13.5 }}>{device.label}</span>
                  </div>
                  <dl className="ap-fac-device-kv">
                    {device.readings.map(([label, values]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{values[step]}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
