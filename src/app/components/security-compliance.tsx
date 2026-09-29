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

/** The diagram's own coordinate space, cropped from the mockup's canvas. */
const VB = { x: 340, y: 0, w: 520, h: 780 };

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
    anchor: [528, 334],
  },
  {
    lead: "Offline Ed25519 license validation.",
    body: "License verification is fully offline. The license file is signed with an Ed25519 private key held outside the Stratora codebase and verified against a public key embedded in the binary at build time. The Stratora server never calls home to validate a license.",
    side: "left",
    anchor: [462, 214],
  },
  {
    lead: "No telemetry, no version-check, no auto-update.",
    body: "No analytics SDK, no telemetry endpoint, no auto-update check. The platform does not initiate outbound connections except to the integrations you explicitly configure (Twilio, Slack/Teams webhooks, OIDC IdP, SMTP relay).",
    side: "right",
    anchor: [612, 140],
  },
  {
    lead: "Audit trail with SIEM export.",
    body: "Every user and system action — sign-ins, configuration changes, alert acknowledgments, license operations — is recorded in an audit log. Events stream in real time to your SIEM over UDP, TCP, or TLS, with multi-destination fan-out and per-destination health monitoring. Compatible with Splunk, Elastic, Graylog, and any RFC-compliant syslog receiver.",
    side: "right",
    anchor: [766, 500],
  },
  {
    lead: "RBAC + SSO.",
    body: "Three-role RBAC (Admin / Operator / Viewer) with local accounts, LDAP/Active Directory pass-through, and OIDC single sign-on. Identity provider passwords are never stored in Stratora.",
    side: "left",
    anchor: [448, 530],
  },
  {
    lead: "Air-gap capable.",
    body: "Core monitoring, alerting via on-prem SMTP, and LDAP/AD authentication run fully disconnected. Optional cloud-dependent channels (Twilio SMS/voice, Slack, Teams webhooks, cloud OIDC) can be enabled at your discretion when external network access is available.",
    side: "right",
    anchor: [742, 704],
  },
];

const LEFT = STATEMENTS.filter((s) => s.side === "left");
const RIGHT = STATEMENTS.filter((s) => s.side === "right");

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

      {/* Your network boundary */}
      <rect x="370" y="150" width="460" height="480" rx="30" fill="url(#sc-glow)" />
      <rect className="sc-ants" x="370" y="150" width="460" height="480" rx="30" fill="none" stroke="rgba(167,139,250,.6)" strokeWidth="1.3" strokeDasharray="7 7" />

      {/* Blocked vendor cloud above */}
      <path d="M600 300 L600 150" stroke="#2a2a38" strokeWidth="1.5" />
      <path d="M600 150 L600 86" stroke="#ef4444" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="3 5" />
      <circle cx="600" cy="150" r="10" fill="#0b0b10" stroke="#ef4444" strokeWidth="1.5" />
      <path d="M595.5 145.5 L604.5 154.5 M604.5 145.5 L595.5 154.5" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
      <circle className="sc-probe" cx="600" cy="298" r="3.5" fill="#fca5a5" />
      <path d="M575 70 a17 17 0 0 1 27 -7 a13 13 0 0 1 20 15 a11 11 0 0 1 -5 21 h-40 a13 13 0 0 1 -2 -29z" fill="none" stroke="#6b6b78" strokeWidth="1.5" />

      {/* Stratora server */}
      <rect x="530" y="300" width="140" height="24" rx="5" fill="#14141d" stroke="#3a3a4d" />
      <rect x="530" y="330" width="140" height="24" rx="5" fill="#14141d" stroke="#3a3a4d" />
      <rect x="530" y="360" width="140" height="24" rx="5" fill="#14141d" stroke="#3a3a4d" />
      <circle cx="546" cy="312" r="3" fill="#22c55e" />
      <circle cx="546" cy="342" r="3" fill="#22c55e" />
      <circle cx="546" cy="372" r="3" fill="#22c55e" />
      <path d="M600 312 H656 M600 342 H656 M600 372 H656" stroke="#2e2e3e" strokeWidth="2" />

      {/* Licence key */}
      <path d="M490 236 L528 312" stroke="#2a2a38" strokeWidth="1.5" />
      <circle cx="478" cy="224" r="13" fill="none" stroke="#c4b5fd" strokeWidth="1.6" />
      <path d="M468 234 L448 254 M452 250 L458 256 M456 246 L462 252" stroke="#c4b5fd" strokeWidth="1.6" strokeLinecap="round" />

      {/* Directory / users */}
      <path d="M530 384 L478 492" stroke="#2a2a38" strokeWidth="1.5" />
      <circle cx="466" cy="512" r="9" fill="none" stroke="#c4b5fd" strokeWidth="1.6" />
      <path d="M448 548 a18 18 0 0 1 36 0" fill="none" stroke="#c4b5fd" strokeWidth="1.6" />
      <circle cx="492" cy="506" r="7" fill="none" stroke="#8b8b98" strokeWidth="1.4" />
      <path d="M486 530 a14 14 0 0 1 24 12" fill="none" stroke="#8b8b98" strokeWidth="1.4" />

      {/* SIEM, with the stream flowing */}
      <path d="M670 384 L730 496" stroke="#2a2a38" strokeWidth="2" />
      <path className="sc-flow" d="M670 384 L730 496" stroke="#c4b5fd" strokeWidth="2" fill="none" />
      <rect x="712" y="498" width="58" height="68" rx="7" fill="#14141d" stroke="#3a3a4d" />
      <path d="M724 516 H758 M724 528 H752 M724 540 H758 M724 552 H746" stroke="#8b8b98" strokeWidth="1.6" strokeLinecap="round" />

      {/* Optional outbound integrations */}
      <path d="M600 384 L600 630" stroke="#2a2a38" strokeWidth="1.5" />
      <path d="M600 630 L600 690" stroke="#ff9818" strokeOpacity=".7" strokeWidth="1.5" strokeDasharray="3 5" />
      <rect x="460" y="690" width="280" height="58" rx="14" fill="rgba(255,152,24,.04)" stroke="rgba(255,152,24,.55)" strokeDasharray="4 5" />

      {/* labels */}
      <text x="394" y="178" fontSize="13" fill="#c4b5fd">Your network</text>
      <text x="600" y="404" fontSize="12.5" fill="#c9c9d4" textAnchor="middle">Stratora server</text>
      <text x="741" y="584" fontSize="12.5" fill="#c9c9d4" textAnchor="middle">Your SIEM</text>
      <text x="600" y="718" fontSize="12.5" fill="#ffb04d" textAnchor="middle">Twilio, Slack, Teams, cloud OIDC</text>
      <text x="600" y="736" fontSize="11.5" fill="#9d9da8" textAnchor="middle">only if you enable them</text>
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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
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
