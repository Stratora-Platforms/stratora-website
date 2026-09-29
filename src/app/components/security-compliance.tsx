import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";

/**
 * "Designed for sensitive environments" as an annotated architecture diagram.
 *
 * Replaces the six cards. The six statements keep their exact wording and are
 * laid out fluidly at full size either side of the diagram; leader lines are
 * drawn between them at runtime.
 *
 * The lines are MEASURED, not hard-coded: each statement's inner edge and each
 * diagram anchor are read from the live layout and re-read on resize, so the
 * lines land on the right thing at every desktop width rather than only at the
 * 1440px the mockup was drawn at. Below lg the lines are dropped entirely and
 * the diagram sits above a plain list.
 */

/** The diagram's own coordinate space. */
const VB = { x: 340, y: 0, w: 520, h: 820 };

type Statement = {
  lead: string;
  body: string;
  side: "left" | "right";
  /** Where this statement's line lands, in diagram viewBox coordinates. */
  anchor: [number, number];
};

const STATEMENTS: Statement[] = [
  {
    lead: "On-prem deployment with no cloud dependency.",
    body: "Runs on your hardware in your network. PostgreSQL, VictoriaMetrics, NGINX, and the Stratora backend ship in a single Windows MSI — no SaaS tenant, no external metric sink, no cloud control plane.",
    side: "left",
    // Stratora server, Level 4
    anchor: [472, 250],
  },
  {
    lead: "Offline Ed25519 license validation.",
    body: "License verification is fully offline. The license file is signed with an Ed25519 private key held outside the Stratora codebase and verified against a public key embedded in the binary at build time. The Stratora server never calls home to validate a license.",
    side: "left",
    // licence key on the server
    anchor: [409, 232],
  },
  {
    lead: "No telemetry, no version-check, no auto-update.",
    body: "No analytics SDK, no telemetry endpoint, no auto-update check. The platform does not initiate outbound connections except to the integrations you explicitly configure (Twilio, Slack/Teams webhooks, OIDC IdP, SMTP relay).",
    side: "right",
    // the blocked link up to the vendor cloud
    anchor: [600, 128],
  },
  {
    lead: "Audit trail with SIEM export.",
    body: "Every user and system action — sign-ins, configuration changes, alert acknowledgments, license operations — is recorded in an audit log. Events stream in real time to your SIEM over UDP, TCP, or TLS, with multi-destination fan-out and per-destination health monitoring. Compatible with Splunk, Elastic, Graylog, and any RFC-compliant syslog receiver.",
    side: "right",
    // SIEM, Level 4
    anchor: [730, 244],
  },
  {
    lead: "RBAC + SSO.",
    body: "Three-role RBAC (Admin / Operator / Viewer) with local accounts, LDAP/Active Directory pass-through, and OIDC single sign-on. Identity provider passwords are never stored in Stratora.",
    side: "left",
    // directory / users, Level 4
    anchor: [409, 284],
  },
  {
    lead: "Air-gap capable.",
    body: "Core monitoring, alerting via on-prem SMTP, and LDAP/AD authentication run fully disconnected. Optional cloud-dependent channels (Twilio SMS/voice, Slack, Teams webhooks, cloud OIDC) can be enabled at your discretion when external network access is available.",
    side: "right",
    // the OT cell, Levels 2-0
    anchor: [760, 630],
  },
];

const LEFT = STATEMENTS.filter((s) => s.side === "left");
const RIGHT = STATEMENTS.filter((s) => s.side === "right");

/**
 * Device glyphs for the Purdue stack, drawn in a 24x24 box and placed by
 * transform. Hand-rolled rather than an icon set so the OT devices (PLC on a
 * DIN rail, RTU with an antenna, an HMI panel on a stand) actually look like
 * the equipment rather than like generic boxes.
 */
function Glyph({ name, x, y, colour = "#c9c9d4", size = 22 }: { name: string; x: number; y: number; colour?: string; size?: number }) {
  const s = size / 24;
  const common = { fill: "none", stroke: colour, strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, JSX.Element> = {
    // rack-mount server
    server: (
      <>
        <rect x="2" y="4" width="20" height="6.5" rx="1.5" {...common} />
        <rect x="2" y="13.5" width="20" height="6.5" rx="1.5" {...common} />
        <path d="M5.5 7.2h.01M5.5 16.7h.01" {...common} strokeWidth="2.4" />
        <path d="M18 7.2h2M18 16.7h2" {...common} />
      </>
    ),
    // managed switch: ports along the bottom, uplink arrows
    switch: (
      <>
        <rect x="1.5" y="8" width="21" height="9" rx="1.6" {...common} />
        <path d="M4.5 14.2h1.4M7.6 14.2H9M10.7 14.2h1.4M13.8 14.2h1.4M16.9 14.2h1.4" {...common} strokeWidth="1.5" />
        <path d="M8 11.2 6 11.2m0 0 1.1-1.1M6 11.2l1.1 1.1M16 11.2h2m0 0-1.1-1.1M18 11.2l-1.1 1.1" {...common} strokeWidth="1.3" />
      </>
    ),
    // firewall: brick courses
    firewall: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="1.6" {...common} />
        <path d="M2 9.7h20M2 14.3h20M9 5v4.7M15 9.7v4.6M9 14.3V19" {...common} strokeWidth="1.3" />
      </>
    ),
    // PLC on a DIN rail: terminal block on top, status LEDs
    plc: (
      <>
        <rect x="3.5" y="6" width="17" height="13" rx="1.4" {...common} />
        <path d="M5.8 6V3.4M8.6 6V3.4M11.4 6V3.4M14.2 6V3.4M17 6V3.4" {...common} strokeWidth="1.4" />
        <path d="M6.4 10h.01M8.8 10h.01M11.2 10h.01" {...common} strokeWidth="2.2" />
        <path d="M6.2 15.2h8.4" {...common} strokeWidth="1.3" />
      </>
    ),
    // RTU: enclosure with an antenna
    rtu: (
      <>
        <rect x="3.5" y="9" width="17" height="11" rx="1.5" {...common} />
        <path d="M12 9V5.2M12 5.2 9.4 2.8M12 5.2l2.6-2.4" {...common} strokeWidth="1.4" />
        <path d="M6.6 13.4h5.2M6.6 16.6h8.6" {...common} strokeWidth="1.3" />
      </>
    ),
    // HMI: panel on a stand
    hmi: (
      <>
        <rect x="2.5" y="4" width="19" height="13" rx="1.6" {...common} />
        <path d="M12 17v3.2M8.4 20.4h7.2" {...common} strokeWidth="1.4" />
        <path d="M6 8.2h6M6 11.4h9" {...common} strokeWidth="1.3" />
      </>
    ),
    // historian / database
    database: (
      <>
        <ellipse cx="12" cy="6" rx="8" ry="3" {...common} />
        <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" {...common} />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" {...common} strokeWidth="1.3" />
      </>
    ),
    // collector: broadcast
    collector: (
      <>
        <circle cx="12" cy="12" r="2.2" {...common} />
        <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.8 4.8a10 10 0 0 0 0 14.4M19.2 4.8a10 10 0 0 1 0 14.4" {...common} strokeWidth="1.4" />
      </>
    ),
    // sensor / field device
    sensor: (
      <>
        <circle cx="12" cy="9" r="4.4" {...common} />
        <path d="M12 13.4V20M9 20h6" {...common} strokeWidth="1.4" />
        <path d="M12 6.8v2.4" {...common} strokeWidth="1.3" />
      </>
    ),
    // motor / actuator
    motor: (
      <>
        <rect x="3" y="7" width="13" height="10" rx="1.5" {...common} />
        <path d="M16 10.2h3.4a1.6 1.6 0 0 1 1.6 1.6v.4a1.6 1.6 0 0 1-1.6 1.6H16" {...common} strokeWidth="1.4" />
        <path d="M6.6 12h5.8" {...common} strokeWidth="1.3" />
      </>
    ),
    // users / directory
    users: (
      <>
        <circle cx="9.4" cy="8" r="3.4" {...common} />
        <path d="M3.4 19a6 6 0 0 1 12 0" {...common} />
        <path d="M16.4 5.2a3 3 0 0 1 0 5.8M17.2 19h3.4a5 5 0 0 0-3.6-4.6" {...common} strokeWidth="1.4" />
      </>
    ),
    // SIEM: shielded log
    siem: (
      <>
        <path d="M12 2.6 4.6 5.4v6.2c0 4.6 3.2 7.4 7.4 8.4 4.2-1 7.4-3.8 7.4-8.4V5.4z" {...common} />
        <path d="M8.6 9.4h6.8M8.6 12.4h5.2M8.6 15.4h6.8" {...common} strokeWidth="1.3" />
      </>
    ),
    // licence key
    key: (
      <>
        <circle cx="15.4" cy="8.6" r="4.2" {...common} />
        <path d="M12.4 11.6 4.6 19.4M6.8 17.2l2 2M8.8 15.2l2 2" {...common} strokeWidth="1.5" />
      </>
    ),
  };

  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} aria-hidden="true">
      {shapes[name]}
    </g>
  );
}

function Diagram() {
  return (
    <svg
      viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="sc-glow" cx="50%" cy="45%" r="55%">
          <stop offset="0" stopColor="#8b5cf6" stopOpacity=".10" />
          <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ---- Vendor cloud, above the boundary and blocked ---- */}
      <path d="M575 46 a17 17 0 0 1 27 -7 a13 13 0 0 1 20 15 a11 11 0 0 1 -5 21 h-40 a13 13 0 0 1 -2 -29z" fill="none" stroke="#6b6b78" strokeWidth="1.5" />
      <text x="600" y="30" fontSize="11.5" fill="#7b7b88" textAnchor="middle">Vendor cloud</text>
      <path d="M600 128 L600 82" stroke="#ef4444" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="3 5" />
      <circle cx="600" cy="128" r="10" fill="#0b0b10" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M595.5 123.5 L604.5 132.5 M604.5 123.5 L595.5 132.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      {/* a probe that leaves the estate and dies at the boundary */}
      <circle className="sc-probe" cx="600" cy="212" r="3.5" fill="#fca5a5" />

      {/* ---- Your network: the Purdue stack ---- */}
      <rect x="352" y="148" width="496" height="584" rx="26" fill="url(#sc-glow)" />
      <rect className="sc-ants" x="352" y="148" width="496" height="584" rx="26" fill="none" stroke="rgba(167,139,250,.6)" strokeWidth="1.3" strokeDasharray="7 7" />
      <text x="372" y="170" fontSize="12" fill="#c4b5fd">Your network</text>

      {/* Level 4/5 — Enterprise IT */}
      <rect x="372" y="186" width="456" height="150" rx="12" fill="rgba(139,92,246,.05)" stroke="#2f2f42" />
      <text x="386" y="206" fontSize="10" fill="#8b8b98" className="sc-level">LEVEL 4 / 5 — ENTERPRISE</text>

      {/* Offline licence key */}
      <Glyph name="key" x={398} y={220} colour="#c4b5fd" size={22} />
      <text x="409" y="256" fontSize="9" fill="#8b8b98" textAnchor="middle">Ed25519</text>
      <path d="M424 232 L468 244" stroke="#2a2a38" strokeWidth="1.2" />

      {/* Directory / users */}
      <Glyph name="users" x={398} y={272} colour="#c4b5fd" size={22} />
      <text x="409" y="308" fontSize="9" fill="#8b8b98" textAnchor="middle">AD / OIDC</text>
      <path d="M424 282 L468 266" stroke="#2a2a38" strokeWidth="1.2" />

      {/* Stratora server */}
      <rect x="470" y="218" width="120" height="66" rx="8" fill="#14141d" stroke="#8b5cf6" strokeWidth="1.3" />
      <Glyph name="server" x={517} y={228} colour="#c4b5fd" size={26} />
      <text x="530" y="272" fontSize="10.5" fill="#c9c9d4" textAnchor="middle">Stratora server</text>
      <text x="530" y="302" fontSize="9" fill="#7b7b88" textAnchor="middle">single Windows MSI</text>

      {/* SIEM, with the audit stream flowing into it */}
      <path d="M590 248 L708 244" stroke="#2a2a38" strokeWidth="2" />
      <path className="sc-flow" d="M590 248 L708 244" stroke="#c4b5fd" strokeWidth="2" fill="none" />
      <Glyph name="siem" x={716} y={222} colour="#c9c9d4" size={28} />
      <text x="730" y="272" fontSize="10.5" fill="#c9c9d4" textAnchor="middle">Your SIEM</text>

      {/* Level 3.5 — the DMZ / conduit */}
      <path d="M600 336 L600 352" stroke="#2a2a38" strokeWidth="1.5" />
      <rect x="372" y="352" width="456" height="52" rx="10" fill="rgba(255,152,24,.04)" stroke="rgba(255,152,24,.4)" strokeDasharray="5 5" />
      <text x="386" y="372" fontSize="10" fill="#ffb04d" className="sc-level">LEVEL 3.5 — DMZ</text>
      <Glyph name="firewall" x={528} y={366} colour="#ffb04d" size={20} />
      <text x="556" y="384" fontSize="9.5" fill="#9d9da8">one-way conduit · collector polls upward</text>

      {/* Level 3 — Site operations, where the collector lives */}
      <rect x="372" y="420" width="456" height="92" rx="12" fill="rgba(139,92,246,.05)" stroke="#2f2f42" />
      <text x="386" y="440" fontSize="10" fill="#8b8b98" className="sc-level">LEVEL 3 — SITE OPERATIONS</text>
      <rect x="512" y="450" width="176" height="48" rx="9" fill="#14141d" stroke="#22c55e" strokeWidth="1.3" />
      <Glyph name="collector" x={524} y={462} colour="#4ade80" size={24} />
      <text x="556" y="470" fontSize="10.5" fill="#c9c9d4">Stratora collector</text>
      <text x="556" y="486" fontSize="8.5" fill="#4ade80">SNMP · ping · agent telemetry</text>
      <path className="sc-flow" d="M600 450 L600 404" stroke="#22c55e" strokeWidth="1.6" fill="none" />

      {/* Levels 2-0 — the OT cell */}
      <path d="M600 498 L600 528" stroke="#2a2a38" strokeWidth="1.5" />
      <path className="sc-flow" d="M600 528 L600 498" stroke="#22c55e" strokeWidth="1.4" fill="none" />
      <rect x="372" y="528" width="456" height="184" rx="12" fill="rgba(34,197,94,.03)" stroke="#2f2f42" />
      <text x="386" y="548" fontSize="10" fill="#8b8b98" className="sc-level">LEVELS 2 — 0 — CONTROL &amp; FIELD</text>

      {/* Level 2 supervisory */}
      {(
        [
          [390, "hmi", "HMI / SCADA"],
          [536, "database", "Historian"],
          [682, "switch", "Switch"],
        ] as [number, string, string][]
      ).map(([x, icon, label]) => (
        <g key={label}>
          <rect x={x} y="558" width="126" height="42" rx="8" fill="#15151f" stroke="#2a2a3c" />
          <Glyph name={icon} x={x + 9} y={568} size={22} />
          <text x={x + 38} y="584" fontSize="9.5" fill="#c9c9d4">{label}</text>
        </g>
      ))}
      <text x="822" y="584" fontSize="9" fill="#6b6b78" textAnchor="end">L2</text>

      {/* Level 1 control */}
      {(
        [
          [390, "plc", "PLC"],
          [536, "rtu", "RTU"],
          [682, "plc", "Safety PLC"],
        ] as [number, string, string][]
      ).map(([x, icon, label], i) => (
        <g key={`${label}-${i}`}>
          <rect x={x} y="612" width="126" height="42" rx="8" fill="#15151f" stroke="#2a2a3c" />
          <Glyph name={icon} x={x + 9} y={622} size={22} />
          <text x={x + 38} y="638" fontSize="9.5" fill="#c9c9d4">{label}</text>
        </g>
      ))}
      <text x="822" y="638" fontSize="9" fill="#6b6b78" textAnchor="end">L1</text>

      {/* Level 0 field */}
      {[
        [398, "sensor"],
        [452, "motor"],
        [506, "sensor"],
        [560, "motor"],
        [614, "sensor"],
        [668, "motor"],
        [722, "sensor"],
      ].map(([x, icon], i) => (
        <Glyph key={i} name={icon as string} x={x as number} y={666} colour="#8b8b98" size={20} />
      ))}
      <text x="600" y="702" fontSize="9" fill="#7b7b88" textAnchor="middle">sensors &amp; actuators</text>
      <text x="822" y="682" fontSize="9" fill="#6b6b78" textAnchor="end">L0</text>

      {/* ---- Optional outbound integrations, below the boundary ---- */}
      <path d="M600 732 L600 756" stroke="#ff9818" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 5" />
      <rect x="440" y="756" width="320" height="50" rx="13" fill="rgba(255,152,24,.04)" stroke="rgba(255,152,24,.55)" strokeDasharray="4 5" />
      <text x="600" y="777" fontSize="11.5" fill="#ffb04d" textAnchor="middle">Twilio, Slack, Teams, cloud OIDC</text>
      <text x="600" y="794" fontSize="10.5" fill="#9d9da8" textAnchor="middle">only if you enable them</text>
    </svg>
  );
}

export function SecurityCompliance() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [paths, setPaths] = useState<string[]>([]);

  /* Measure: map each statement's inner edge to its diagram anchor, in the
     wrapper's coordinate space. Re-run on any resize, so a 1024px window and a
     1440px one both land correctly. */
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const diagram = diagramRef.current;
    if (!wrap || !diagram) return;

    if (window.innerWidth < 1024) {
      setPaths([]);
      return;
    }

    const wrapBox = wrap.getBoundingClientRect();
    const box = diagram.getBoundingClientRect();
    const toLocal = (vx: number, vy: number): [number, number] => [
      box.left - wrapBox.left + ((vx - VB.x) / VB.w) * box.width,
      box.top - wrapBox.top + ((vy - VB.y) / VB.h) * box.height,
    ];

    const next = STATEMENTS.map((statement) => {
      const node = noteRefs.current.get(statement.lead);
      if (!node) return "";
      const noteBox = node.getBoundingClientRect();
      const y = noteBox.top - wrapBox.top + 22;
      const x = statement.side === "left" ? noteBox.right - wrapBox.left + 12 : noteBox.left - wrapBox.left - 12;
      const [ax, ay] = toLocal(statement.anchor[0], statement.anchor[1]);
      // An elbow: out from the statement, then in to the anchor.
      const mid = statement.side === "left" ? x + (ax - x) * 0.45 : x - (x - ax) * 0.45;
      return `M${x.toFixed(1)} ${y.toFixed(1)} H${mid.toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)}`;
    });

    setPaths(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const observer = new ResizeObserver(() => measure());
    if (wrapRef.current) observer.observe(wrapRef.current);
    if (diagramRef.current) observer.observe(diagramRef.current);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  // Long statements reflow as webfonts settle; re-measure once they have.
  useEffect(() => {
    if (typeof document === "undefined" || !document.fonts) return;
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [measure]);

  const note = (statement: Statement) => (
    <p
      key={statement.lead}
      ref={(el) => {
        if (el) noteRefs.current.set(statement.lead, el);
        else noteRefs.current.delete(statement.lead);
      }}
      className="m-0 text-sm leading-relaxed text-muted-foreground"
    >
      <span className="mb-1.5 block text-[15px] font-semibold text-foreground">{statement.lead}</span>
      {statement.body}
    </p>
  );

  return (
    <section id="security-compliance" className="st-scope relative px-6 py-20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px 15% 0px" }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl md:text-5xl tracking-tight">Designed for sensitive environments</h2>
          <p className="text-lg text-muted-foreground">
            On-prem deployment, offline licensing, full audit forwarding — for teams who need to know
            exactly where their monitoring data lives and who can see it.
          </p>
        </motion.div>

        <div ref={wrapRef} className="relative">
          {/* Measured leader lines. Desktop only. */}
          {paths.length ? (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
              <g fill="none" stroke="#4a4a58" strokeWidth="1">
                {paths.map((d, i) =>
                  d ? <path key={i} className="sc-draw" style={{ animationDelay: `${0.1 + i * 0.05}s` }} d={d} /> : null,
                )}
              </g>
              <g fill="#8b8b98">
                {paths.map((d, i) => {
                  if (!d) return null;
                  const m = /^M([\d.]+) ([\d.]+)/.exec(d);
                  return m ? <circle key={i} cx={m[1]} cy={m[2]} r="2.5" /> : null;
                })}
              </g>
            </svg>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[minmax(0,290px)_minmax(0,1fr)_minmax(0,290px)] lg:gap-14">
            {/* Diagram first in the DOM so mobile gets it on top. */}
            <div ref={diagramRef} className="order-first lg:order-2 mx-auto w-full max-w-[520px]" style={{ aspectRatio: `${VB.w} / ${VB.h}` }}>
              <Diagram />
            </div>

            <div className="lg:order-1 flex flex-col justify-between gap-10 lg:py-6">{LEFT.map(note)}</div>
            <div className="lg:order-3 flex flex-col justify-between gap-10 lg:py-6">{RIGHT.map(note)}</div>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-3xl text-center text-sm text-muted-foreground">
          Stratora's audit pipeline supports SOC 2, HIPAA, and PCI-DSS retention requirements as part
          of a broader compliance program.
        </p>
      </div>
    </section>
  );
}
