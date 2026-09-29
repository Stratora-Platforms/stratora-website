import { STATUS_BG, STATUS_TEXT } from "./app-preview/app-preview-data";

/**
 * The ten feature stages, authored at 840 x 440 and scaled by <ScaledStage>.
 *
 * Slides 3-6 (dashboards, virtualization, network diagrams, IPAM) are drawn to
 * match the real app, reusing the app-preview status palette so they sit
 * consistently with the carousel higher up the page. Every capability shown is
 * in CLAIMS.md and the sample data is Halden Group's New York HQ.
 */

export const STAGE = { width: 840, height: 440 };

const W = STAGE.width;
const H = STAGE.height;

const panel: React.CSSProperties = {
  borderRadius: 10,
  background: "#11111a",
  border: "1px solid #1f1f33",
  boxShadow: "inset 0 1px 0 rgba(139,92,246,.35)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

const head: React.CSSProperties = {
  height: 30,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 12px",
  borderBottom: "1px solid #1c1c2e",
  fontSize: 12,
  fontWeight: 600,
};

const chip = (bg: string, fg: string): React.CSSProperties => ({
  fontSize: 10.5,
  padding: "2px 8px",
  borderRadius: 7,
  background: bg,
  color: fg,
  whiteSpace: "nowrap",
});

/* ---------------------------------------------------------- 0 collectors -- */
function Collectors() {
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        <rect x="36" y="50" width="330" height="340" rx="18" fill="none" stroke="#33334a" strokeDasharray="6 6" />
        <rect x="474" y="50" width="330" height="340" rx="18" fill="rgba(255,152,24,.03)" stroke="rgba(255,152,24,.5)" strokeDasharray="6 6" />
        <path d="M420 60 V380" stroke="#ff9818" strokeOpacity=".5" strokeWidth="2" strokeDasharray="2 6" />
        <path d="M250 220 L540 220" stroke="#24242f" strokeWidth="2" />
        <path className="st-flow" d="M540 220 L250 220" stroke="#c4b5fd" strokeWidth="2" fill="none" />
        <path d="M670 120 L602 206 M670 220 L610 220 M670 320 L602 234" stroke="#24242f" strokeWidth="1.5" />
        <path className="st-flow" d="M670 120 L602 206 M670 220 L610 220 M670 320 L602 234" stroke="#22c55e" strokeWidth="1.5" fill="none" />
      </svg>
      <span style={{ position: "absolute", left: 58, top: 66, fontSize: 13, color: "#9d9da8" }}>IT zone</span>
      <span style={{ position: "absolute", left: 496, top: 66, fontSize: 13, color: "#ffb04d" }}>OT zone</span>
      <div style={{ position: "absolute", left: 90, top: 194, width: 160, height: 52, boxSizing: "border-box", borderRadius: 12, background: "#14141e", border: "1px solid rgba(139,92,246,.55)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13.5, fontWeight: 600 }}>
        Stratora server
      </div>
      <div style={{ position: "absolute", left: 510, top: 194, width: 100, height: 52, boxSizing: "border-box", borderRadius: 12, background: "#14141e", border: "1px solid rgba(34,197,94,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Collector</span>
        <span style={{ fontSize: 10.5, color: "#4ade80" }}>config generated</span>
      </div>
      {[["Managed switch", 106], ["HMI", 206], ["Historian", 306]].map(([text, top]) => (
        <span key={text as string} style={{ position: "absolute", left: 672, top: top as number, fontSize: 12.5, padding: "6px 10px", borderRadius: 8, background: "#15151f", border: "1px solid #262634" }}>
          {text as string}
        </span>
      ))}
      <span style={{ position: "absolute", left: 496, top: 262, fontSize: 11.5, color: "#9d9da8" }}>
        SNMP · ping · HTTP/HTTPS · agent telemetry
      </span>
    </div>
  );
}

/* -------------------------------------------------------------- 1 agents -- */
function Agents() {
  const rows: [string, string, string, string, "Approved" | "Pending"][] = [
    ["NYC-DC-01", "Windows Server", "Domain controller", "DNS · NTDS · KDC", "Approved"],
    ["NYC-SQL-02", "Windows Server", "SQL Server", "MSSQLSERVER · Agent", "Approved"],
    ["NYC-APP-04", "Ubuntu 24.04", "App server", "nginx · docker", "Approved"],
    ["MTY-HIST-01", "Windows Server", "Historian", "OPC · Archive", "Approved"],
    ["NYC-BLD-07", "Rocky 9", "Build agent", "buildkite", "Pending"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: "30px 34px", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr .8fr", fontSize: 12, color: "#8b8b98", paddingBottom: 12, borderBottom: "1px solid #1d1d28" }}>
        <span>Agent</span>
        <span>Server role</span>
        <span>Services</span>
        <span>Registration</span>
      </div>
      {rows.map(([host, os, role, svc, status]) => (
        <div key={host} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1.2fr .8fr", alignItems: "center", padding: "15px 0", borderBottom: "1px solid #181821", fontSize: 13.5 }}>
          <span className="st-mono">
            {host} <span style={{ color: "#7b7b88", fontSize: 12, fontFamily: "inherit" }}>{os}</span>
          </span>
          <span style={{ color: "#c9c9d4" }}>{role}</span>
          <span style={{ color: "#9d9da8" }}>{svc}</span>
          <span>
            <span style={chip(status === "Approved" ? STATUS_BG.healthy : STATUS_BG.maintenance, status === "Approved" ? STATUS_TEXT.healthy : STATUS_TEXT.maintenance)}>
              {status === "Approved" ? "Auto-registered" : "Awaiting approval"}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ----------------------------------------------------------- 2 templates -- */
function Templates() {
  const matches: [string, string, string][] = [
    ["NYC-CORE-SW01", "Cisco Catalyst", "Switch template"],
    ["NYC-FW-01", "Palo Alto PA-440", "Firewall template"],
    ["NYC-AP-11", "Ubiquiti U6", "Access point template"],
    ["NYC-NAS-01", "Synology DS", "NAS template"],
    ["NYC-ESX-01", "VMware ESXi", "Hypervisor template"],
    ["status.haldengroup.com", "HTTPS endpoint", "Web service check"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: "26px 34px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#9d9da8" }}>
        <span style={chip("rgba(139,92,246,.16)", "#c4b5fd")}>Discovery</span>
        matched 6 of 6 devices to templates
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 10 }}>
        {matches.map(([node, model, template], i) => (
          <div key={node} className="st-fade" style={{ animationDelay: `${i * 0.07}s`, display: "flex", flexDirection: "column", gap: 6, padding: "12px 14px", borderRadius: 10, background: "#13131c", border: "1px solid #20202b" }}>
            <span className="st-mono" style={{ fontSize: 12.5 }}>{node}</span>
            <span style={{ fontSize: 11.5, color: "#7b7b88" }}>{model}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={STATUS_TEXT.healthy} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
              <span style={{ color: "#c9c9d4" }}>{template}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------- 3 dashboards -- */
function Dashboards() {
  const tiles: [string, string, string, string, string][] = [
    ["Nodes Online", "611", "611 of 612 total", "rgba(34,197,94,.16)", STATUS_TEXT.healthy],
    ["Nodes Offline", "1", "NYC-FS-01", "rgba(239,68,68,.16)", STATUS_TEXT.offline],
    ["Hypervisors", "3", "vSphere 2 · Hyper-V 1", "#13131c", "#c4b5fd"],
    ["VMs", "62", "vSphere 49 · Hyper-V 13", "#13131c", "#c4b5fd"],
    ["Active Alerts", "13", "", "rgba(249,115,22,.18)", STATUS_TEXT.critical],
    ["Avg Response", "1.6 ms", "", "rgba(34,197,94,.16)", STATUS_TEXT.healthy],
  ];
  const ports = Array.from({ length: 48 }, (_, i) => (i === 27 ? "#b91c1c" : i >= 45 ? "#2a2a35" : "#22c55e"));
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
        Sites — New York HQ
        <span style={chip(STATUS_BG.healthy, STATUS_TEXT.healthy)}>Auto-Generated</span>
        <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 400, color: "#9d9da8", padding: "4px 10px", borderRadius: 7, border: "1px solid #262634" }}>
          Last 1 hour
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 8 }}>
        {tiles.map(([label, value, sub, bg, fg]) => (
          <div key={label} style={{ height: 78, boxSizing: "border-box", padding: "8px 10px", borderRadius: 9, background: bg, border: "1px solid #1f1f33", display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 10.5, color: fg }}>▽ {label}</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: fg, lineHeight: 1.1 }}>{value}</span>
            {sub ? <span style={{ fontSize: 9.5, color: "#9d9da8", lineHeight: 1.3 }}>{sub}</span> : null}
          </div>
        ))}
      </div>

      <div style={{ flexGrow: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1fr 1.5fr 1.1fr", gap: 8 }}>
        <div style={panel}>
          <div style={head}>Health Breakdown</div>
          <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, padding: 8 }}>
            <div style={{ position: "relative", width: 104, height: 104 }}>
              <svg width="104" height="104" viewBox="0 0 104 104">
                <circle cx="52" cy="52" r="42" fill="none" stroke="#1e2736" strokeWidth="13" />
                <circle cx="52" cy="52" r="42" fill="none" stroke={STATUS_TEXT.healthy} strokeWidth="13" strokeDasharray="262 264" transform="rotate(-90 52 52)" />
                <circle cx="52" cy="52" r="42" fill="none" stroke={STATUS_TEXT.degraded} strokeWidth="13" strokeDasharray="2 262" transform="rotate(272 52 52)" />
              </svg>
              <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700 }}>612</span>
            </div>
            <div style={{ width: "100%", padding: "0 12px", display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
              {[["Healthy", 608, STATUS_TEXT.healthy], ["Degraded", 3, STATUS_TEXT.degraded], ["Offline", 1, STATUS_TEXT.offline]].map(([l, v, c]) => (
                <span key={l as string} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: c as string }} />
                  <span style={{ color: "#9d9da8" }}>{l as string}</span>
                  <span className="st-mono" style={{ marginLeft: "auto" }}>{v as number}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div style={panel}>
          <div style={head}>
            Host Metrics (line)
            <span style={{ fontWeight: 400, color: "#8b8b98" }}>3 hosts</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 6, fontWeight: 400, color: "#8b8b98" }}>
              <span>CPU</span>
              <span style={chip("rgba(139,92,246,.16)", "#c4b5fd")}>Memory</span>
              <span>Network</span>
            </span>
          </div>
          <div style={{ flexGrow: 1, padding: 10 }}>
            <svg width="100%" height="100%" viewBox="0 0 340 130" preserveAspectRatio="none">
              <path className="st-draw" d="M0 70 L30 58 L60 74 L90 50 L120 38 L150 30 L180 44 L210 26 L240 40 L270 56 L300 48 L340 60" fill="none" stroke="#a78bfa" strokeWidth="2" />
              <path className="st-draw" style={{ animationDelay: ".1s" }} d="M0 96 L30 88 L60 78 L90 84 L120 64 L150 58 L180 70 L210 62 L240 74 L270 66 L300 78 L340 70" fill="none" stroke="#22d3ee" strokeWidth="2" />
              <path className="st-draw" style={{ animationDelay: ".2s" }} d="M0 110 L30 104 L60 112 L90 96 L120 106 L150 92 L180 100 L210 88 L240 96 L270 84 L300 92 L340 86" fill="none" stroke="#22c55e" strokeWidth="2" />
            </svg>
          </div>
          <div style={{ display: "flex", gap: 12, padding: "0 12px 10px 12px", fontSize: 10, color: "#9d9da8" }}>
            {[["NYC-ESX-01", "#a78bfa"], ["NYC-ESX-02", "#22d3ee"], ["NYC-HV-01", "#22c55e"]].map(([n, c]) => (
              <span key={n} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: 2, background: c }} />
                {n}
              </span>
            ))}
          </div>
        </div>

        <div style={panel}>
          <div style={head}>
            Port grid
            <span style={{ fontWeight: 400, color: "#8b8b98" }}>NYC-CORE-SW01</span>
          </div>
          <div style={{ flexGrow: 1, padding: 10, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridAutoRows: 14, gap: 4, alignContent: "start" }}>
            {ports.map((c, i) => (
              <span key={i} style={{ borderRadius: 2, background: c }} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, padding: "0 12px 10px 12px", fontSize: 10 }}>
            <span style={{ color: STATUS_TEXT.healthy }}>44 up</span>
            <span style={{ color: STATUS_TEXT.offline }}>1 down</span>
            <span style={{ color: "#7b7b88" }}>3 unused</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ 4 virtualization -- */
function Virtualization() {
  const platforms: [string, number, number, string][] = [
    ["VMware vSphere / vCenter", 1290, 2140, "#a78bfa"],
    ["Microsoft Hyper-V", 84, 612, "#22d3ee"],
    ["Proxmox VE", 38, 196, "#22c55e"],
  ];
  const vms: [string, string, string][] = [
    ["haldn-sql-01", "Running", "NYC-ESX-01"],
    ["haldn-app-04", "Running", "NYC-ESX-02"],
    ["haldn-bld-02", "Stopped", "NYC-HV-01"],
    ["haldn-dc-01", "Running", "NYC-ESX-01"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 600 }}>Virtualization Summary</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>
        {platforms.map(([name, hosts, guests, colour]) => (
          <div key={name} style={{ ...panel, padding: 12, gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: colour }}>{name}</span>
            <div style={{ display: "flex", gap: 18 }}>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span className="st-mono" style={{ fontSize: 20, fontWeight: 700 }}>{hosts.toLocaleString("en-US")}</span>
                <span style={{ fontSize: 10.5, color: "#9d9da8" }}>hosts</span>
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <span className="st-mono" style={{ fontSize: 20, fontWeight: 700 }}>{guests.toLocaleString("en-US")}</span>
                <span style={{ fontSize: 10.5, color: "#9d9da8" }}>VMs</span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ flexGrow: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 8 }}>
        <div style={panel}>
          <div style={head}>Virtual machines</div>
          {vms.map(([name, state, host]) => (
            <div key={name} style={{ display: "grid", gridTemplateColumns: "1.4fr .8fr 1fr", alignItems: "center", height: 34, padding: "0 12px", borderBottom: "1px solid #17172a", fontSize: 12 }}>
              <span className="st-mono">{name}</span>
              <span>
                <span style={chip(state === "Running" ? STATUS_BG.healthy : STATUS_BG.unknown, state === "Running" ? STATUS_TEXT.healthy : STATUS_TEXT.unknown)}>{state}</span>
              </span>
              <span className="st-mono" style={{ color: "#9d9da8" }}>{host}</span>
            </div>
          ))}
        </div>
        <div style={panel}>
          <div style={head}>Datastores</div>
          <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12 }}>
            {[["NYC-VSAN-01", 78], ["NYC-NFS-02", 41], ["NYC-LOCAL-03", 92]].map(([name, pct]) => (
              <div key={name as string} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <span style={{ display: "flex", fontSize: 11.5 }}>
                  <span className="st-mono">{name as string}</span>
                  <span className="st-mono" style={{ marginLeft: "auto", color: "#9d9da8" }}>{pct as number}%</span>
                </span>
                <span style={{ height: 5, borderRadius: 3, background: "#23233a", overflow: "hidden" }}>
                  <span style={{ display: "block", height: 5, width: `${pct as number}%`, background: (pct as number) >= 85 ? STATUS_TEXT.critical : STATUS_TEXT.healthy }} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------- 5 network diagrams -- */
function NetworkDiagrams() {
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: 20, display: "grid", gridTemplateColumns: "1.2fr .7fr 1.1fr", gap: 10 }}>
      <div style={panel}>
        <div style={head}>Topology</div>
        <svg width="100%" height="100%" viewBox="0 0 260 300" style={{ flexGrow: 1 }}>
          <path className="st-draw" d="M130 44 L70 120 M130 44 L190 120 M70 120 L40 200 M70 120 L100 200 M190 120 L160 200 M190 120 L220 200" stroke="#2f2f42" strokeWidth="1.6" fill="none" />
          <path className="st-flow" d="M130 44 L70 120 M70 120 L40 200" stroke="#a78bfa" strokeWidth="1.6" fill="none" />
          {/* live interface utilization on the two lit links */}
          <text x="96" y="80" fontSize="6.5" fill="#a78bfa" textAnchor="middle" className="st-mono">1.8 Gb/s</text>
          <text x="48" y="164" fontSize="6.5" fill="#a78bfa" textAnchor="middle" className="st-mono">640 Mb/s</text>
          {/* `short` is explicit rather than derived: NYC-CORE-SW01 trimmed to
              "CORE-SW01" overran the node box, while the others fitted. */}
          {(
            [
              [130, 44, "#a78bfa", "NYC-CORE-SW01", "SW01"],
              [70, 120, "#22c55e", "NYC-FW-01", "FW-01"],
              [190, 120, "#22c55e", "NYC-EDGE-01", "EDGE-01"],
              [40, 200, "#22c55e", "NYC-ESX-01", "ESX-01"],
              [100, 200, "#eab308", "NYC-NAS-01", "NAS-01"],
              [160, 200, "#22c55e", "NYC-AP-11", "AP-11"],
              [220, 200, "#22c55e", "NYC-DC-01", "DC-01"],
            ] as [number, number, string, string, string][]
          ).map(([x, y, c, label, short]) => (
            <g key={label}>
              <rect x={x - 24} y={y - 11} width="48" height="22" rx="5" fill="#1a1a2e" stroke={c} strokeWidth="1.2" />
              <circle cx={x + 17} cy={y} r="2.4" fill={c} />
              <text x={x - 4} y={y + 2.4} fontSize="6" fill="#c9c9d4" textAnchor="middle" className="st-mono">
                {short}
              </text>
              <text x={x} y={y + 21} fontSize="6" fill="#7b7b88" textAnchor="middle" className="st-mono">
                {label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div style={panel}>
        <div style={head}>Rack</div>
        <div style={{ flexGrow: 1, padding: 8, display: "flex", flexDirection: "column-reverse", gap: 3 }}>
          {[
            ["", 0], ["", 0], ["NYC-PDU-A", 1], ["", 0], ["NYC-UPS-01", 1], ["", 0],
            ["NYC-SAN-01", 1], ["NYC-ESX-02", 1], ["NYC-ESX-01", 1], ["", 0],
            ["NYC-FW-01", 1], ["NYC-CORE-SW01", 2],
          ].map(([name, kind], i) => (
            <span key={i} style={{ height: 16, borderRadius: 3, display: "flex", alignItems: "center", paddingLeft: 6, fontSize: 8, fontFamily: "var(--st-mono)", background: kind ? (kind === 2 ? "#3d2e05" : "#0d2d1a") : "transparent", border: kind ? `1px solid ${kind === 2 ? STATUS_TEXT.degraded : STATUS_TEXT.healthy}33` : "1px solid #17172a", color: "#c9c9d4" }}>
              {name as string}
            </span>
          ))}
        </div>
      </div>

      <div style={panel}>
        <div style={head}>World map</div>
        <div style={{ position: "relative", flexGrow: 1, background: "#0a0a11" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url(/worldmap.svg)", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "contain", opacity: 0.5 }} />
          <svg width="100%" height="100%" viewBox="0 0 1060 340" preserveAspectRatio="xMidYMid meet" style={{ position: "absolute", inset: 0 }}>
            {(
              [
                [312, 91, "#22c55e", "NYC", "end"],
                [235, 130, "#f97316", "MTY", "end"],
                [556, 67, "#f97316", "FRA", "start"],
                [836, 192, "#22c55e", "SIN", "start"],
                [941, 104, "#22c55e", "TYO", "start"],
                [975, 283, "#22c55e", "SYD", "end"],
                [758, 162, "#a855f7", "BLR", "start"],
              ] as [number, number, string, string, "start" | "end"][]
            ).map(([x, y, c, label, anchor]) => (
              <g key={label}>
                {c !== "#22c55e" ? <circle className="st-pulse-ring" cx={x} cy={y} r="13" fill={c} /> : null}
                <circle cx={x} cy={y} r="13" fill={c} stroke="#0c0c0f" strokeWidth="5" />
                <text
                  x={anchor === "end" ? x - 22 : x + 22}
                  y={y + 8}
                  fontSize="21"
                  fill="#9ca3af"
                  textAnchor={anchor}
                  className="st-mono"
                >
                  {label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 6 ipam --
 * Discovery sweeping a /24: the address grid fills as the scan runs, the
 * utilization bars grow with it, and the subnet nearing capacity trips its
 * >85% flag. Everything here is address-space data the app tracks.
 */
function Ipam() {
  const subnets: [string, string, number, number, number, string][] = [
    ["10.10.0.0/24", "Servers and OOBM", 10, 218, 254, "0s"],
    ["10.10.1.0/24", "Wired Access", 11, 164, 254, "-0.4s"],
    ["10.10.2.0/24", "Wi-Fi Access", 12, 233, 254, "-0.8s"],
    ["10.30.0.0/24", "Plant Floor OT", 20, 197, 254, "-1.2s"],
  ];

  // A 16x8 slice of the /24 being scanned. Index order drives the fill sweep.
  const CELLS = 128;
  const cells = Array.from({ length: CELLS }, (_, i) => {
    const kind = i % 17 === 3 ? "gw" : i % 11 === 5 ? "dhcp" : i % 7 === 6 ? "free" : "used";
    return { i, kind };
  });
  const cellColour: Record<string, string> = {
    used: "#3b82f6",
    dhcp: "#22c55e",
    gw: "#a78bfa",
    free: "#23233a",
  };

  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, fontWeight: 600 }}>
        IPAM
        <span style={{ fontSize: 11.5, fontWeight: 400, color: "#9d9da8" }}>Supernets · Subnets · Addresses</span>
        <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 400, color: "#9d9da8" }}>
            <span className="st-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: "#58a6ff" }} />
            discovery sync
          </span>
          <span style={chip(STATUS_BG.warning, STATUS_TEXT.warning)}>6 over 85%</span>
        </span>
      </div>

      <div style={{ flexGrow: 1, minHeight: 0, display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 10 }}>
        {/* subnet list, bars growing as the scan lands */}
        <div style={panel}>
          <div style={{ display: "grid", gridTemplateColumns: "1.15fr 1.25fr .45fr 1.5fr", gap: 8, alignItems: "center", height: 28, padding: "0 12px", borderBottom: "1px solid #2a2a31", fontSize: 9.5, letterSpacing: ".07em", textTransform: "uppercase", color: "#7e7e98" }}>
            <span>CIDR</span>
            <span>Name</span>
            <span>VLAN</span>
            <span>Utilization</span>
          </div>
          {subnets.map(([cidr, name, vlan, used, total, delay]) => {
            const pct = (used / total) * 100;
            const colour = pct >= 85 ? STATUS_TEXT.critical : pct >= 65 ? STATUS_TEXT.degraded : STATUS_TEXT.healthy;
            return (
              <div key={cidr} style={{ display: "grid", gridTemplateColumns: "1.15fr 1.25fr .45fr 1.5fr", gap: 8, alignItems: "center", flexGrow: 1, padding: "0 12px", borderBottom: "1px solid #17172a", fontSize: 11.5 }}>
                <span className="st-mono" style={{ color: "#58a6ff" }}>{cidr}</span>
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
                <span className="st-mono" style={{ color: "#9d9da8" }}>{vlan}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ flexGrow: 1, height: 6, borderRadius: 3, background: "#26262c", overflow: "hidden" }}>
                    <span
                      className="ip-grow"
                      style={{ display: "block", height: 6, background: colour, ["--ip-w" as string]: `${pct}%`, animationDelay: delay }}
                    />
                  </span>
                  <span className="st-mono" style={{ width: 40, textAlign: "right", color: colour }}>{pct.toFixed(1)}%</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* the address grid being swept */}
        <div style={panel}>
          <div style={head}>
            Addresses
            <span className="st-mono" style={{ fontWeight: 400, color: "#8b8b98" }}>10.10.0.0/24</span>
          </div>
          <div style={{ position: "relative", flexGrow: 1, padding: 12, overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 3 }}>
              {cells.map((c) => (
                <span
                  key={c.i}
                  className="ip-cell"
                  style={{
                    height: 11,
                    borderRadius: 2,
                    background: cellColour[c.kind],
                    // stagger by row then column so the fill reads as a sweep
                    animationDelay: `${(Math.floor(c.i / 16) * 0.09 + (c.i % 16) * 0.012).toFixed(3)}s`,
                  }}
                />
              ))}
            </div>
            {/* scan line crossing the grid */}
            <span className="ip-scan" />
            <div style={{ display: "flex", gap: 12, marginTop: 12, fontSize: 9.5, color: "#7b7b88" }}>
              {[["In use", "#3b82f6"], ["DHCP", "#22c55e"], ["Gateway", "#a78bfa"], ["Free", "#3a3a46"]].map(([l, c]) => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 2, background: c }} />
                  {l}
                </span>
              ))}
            </div>
            <div className="st-mono" style={{ marginTop: 8, fontSize: 10.5, color: "#9d9da8" }}>
              218 of 254 in use · synced from discovery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ 7 alerting -- */
function Alerting() {
  const steps: [string, string, string, string][] = [
    ["14:02:40", "Alert raised", "NYC-ESX-01 host memory 91%", STATUS_TEXT.critical],
    ["14:02:41", "Notified", "Email · Microsoft Teams", "#ff9818"],
    ["14:07:41", "Escalated", "SMS · phone call", "#ff9818"],
    ["14:08:10", "Acknowledged", "Two-way ack by SMS reply", "#8b5cf6"],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: "26px 34px", display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 20 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Escalation chain</span>
        {steps.map(([time, action, detail, colour], i) => (
          <div key={time} className="st-fade" style={{ animationDelay: `${i * 0.1}s`, position: "relative", display: "flex", gap: 14, paddingLeft: 20, paddingBottom: 14 }}>
            {i < steps.length - 1 ? <span style={{ position: "absolute", left: 4, top: 16, bottom: 0, width: 1, background: "#2a2a35" }} /> : null}
            <span style={{ position: "absolute", left: 0, top: 5, width: 9, height: 9, borderRadius: "50%", background: colour }} />
            <span className="st-mono" style={{ fontSize: 11, color: "#8b8b98", width: 54, flexShrink: 0 }}>{time}</span>
            <span style={{ fontSize: 12.5 }}>
              <span style={{ fontWeight: 600 }}>{action}</span>{" "}
              <span style={{ color: "#9d9da8" }}>{detail}</span>
            </span>
          </div>
        ))}
      </div>
      <div style={{ ...panel, alignSelf: "start" }}>
        <div style={head}>Maintenance mode</div>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 10, fontSize: 12.5 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: STATUS_TEXT.maintenance }} />
            <span className="st-mono">BLR-ESX-04</span>
          </span>
          <span style={{ color: "#9d9da8", lineHeight: 1.5 }}>
            Alerts suppressed until 22:00 IST. Notifications muted, history still recorded.
          </span>
          <span style={chip(STATUS_BG.maintenance, STATUS_TEXT.maintenance)}>Window active</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- 8 rbac -- */
function Rbac() {
  const matrix: [string, boolean[]][] = [
    ["View dashboards", [true, true, true]],
    ["Acknowledge alerts", [true, true, false]],
    ["Edit templates", [true, true, false]],
    ["Manage users and roles", [true, false, false]],
    ["Apply licence", [true, false, false]],
  ];
  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: "26px 34px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3, .5fr)", fontSize: 11.5, color: "#8b8b98", paddingBottom: 10, borderBottom: "1px solid #1d1d28" }}>
          <span>Permission</span>
          <span style={{ textAlign: "center" }}>Admin</span>
          <span style={{ textAlign: "center" }}>Operator</span>
          <span style={{ textAlign: "center" }}>Viewer</span>
        </div>
        {matrix.map(([perm, roles]) => (
          <div key={perm} style={{ display: "grid", gridTemplateColumns: "1.6fr repeat(3, .5fr)", alignItems: "center", padding: "11px 0", borderBottom: "1px solid #181821", fontSize: 12.5 }}>
            <span style={{ color: "#c9c9d4" }}>{perm}</span>
            {roles.map((allowed, i) => (
              <span key={i} style={{ textAlign: "center", color: allowed ? STATUS_TEXT.healthy : "#3a3a46" }}>
                {allowed ? "✓" : "—"}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>Identity providers</span>
        {["Active Directory", "LDAP", "Microsoft Entra ID", "Any OIDC provider"].map((idp, i) => (
          <div key={idp} className="st-fade" style={{ animationDelay: `${i * 0.08}s`, display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 9, background: "#13131c", border: "1px solid #20202b", fontSize: 12.5 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#c4b5fd" }} />
            {idp}
          </div>
        ))}
        <span style={{ fontSize: 11.5, color: "#7b7b88", lineHeight: 1.5 }}>Group-to-role mapping · no credentials stored</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- 9 syslog --
 * Events leave the log, travel the wire and fan out to three receivers. The
 * packets are staggered per lane so the stream reads as continuous rather than
 * as three things blinking in time.
 */
function Syslog() {
  const events: [string, string][] = [
    ["14:08:10", "Alert acknowledged — FRA-SAN-02"],
    ["14:07:41", "Escalated — SMS and phone call"],
    ["14:02:40", "Alert raised — FRA-SAN-02 read latency"],
    ["14:01:52", "Sign-in via OIDC — j.moreau"],
    ["13:58:20", "Configuration changed — escalation team"],
    ["13:44:05", "Device discovered — 10.10.4.31"],
  ];

  // Lane endpoints in the 840x440 stage, drawn from the hub out to each target.
  const lanes: { to: [number, number]; name: string; proto: string; delay: string }[] = [
    { to: [700, 118], name: "Splunk", proto: "TLS 6514", delay: "0s" },
    { to: [700, 222], name: "Elastic", proto: "TCP 601", delay: "-0.9s" },
    { to: [700, 326], name: "Graylog", proto: "UDP 514", delay: "-1.8s" },
  ];
  const HUB: [number, number] = [452, 222];

  return (
    <div className="st-fade" style={{ position: "absolute", inset: 0, padding: 20 }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0 }}>
        {lanes.map((lane) => {
          const d = `M${HUB[0]} ${HUB[1]} C${HUB[0] + 90} ${HUB[1]} ${lane.to[0] - 90} ${lane.to[1]} ${lane.to[0]} ${lane.to[1]}`;
          return (
            <g key={lane.name}>
              <path d={d} fill="none" stroke="#24242f" strokeWidth="2" />
              <path className="st-flow" d={d} fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" style={{ animationDelay: lane.delay }} />
              {/* a packet riding the wire */}
              <circle r="4" fill="#c4b5fd">
                <animateMotion dur="2.7s" repeatCount="indefinite" path={d} begin={lane.delay} />
              </circle>
              <circle r="7" fill="#8b5cf6" opacity=".28">
                <animateMotion dur="2.7s" repeatCount="indefinite" path={d} begin={lane.delay} />
              </circle>
            </g>
          );
        })}
        {/* hub */}
        <circle cx={HUB[0]} cy={HUB[1]} r="13" fill="#14141e" stroke="#8b5cf6" strokeWidth="1.6" />
        <circle className="st-pulse-ring" cx={HUB[0]} cy={HUB[1]} r="13" fill="none" stroke="#8b5cf6" strokeWidth="1.2" />
      </svg>

      {/* the log the stream comes from */}
      <div style={{ position: "absolute", left: 20, top: 44, width: 400, ...panel }}>
        <div style={head}>
          All Stratora events
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 400, color: STATUS_TEXT.healthy }}>
            <span className="st-blink" style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_TEXT.healthy }} />
            streaming
          </span>
        </div>
        {events.map(([time, text], i) => (
          <div
            key={time}
            className="st-row"
            style={{
              animationDelay: `${i * 0.07}s`,
              display: "grid",
              gridTemplateColumns: "64px 1fr",
              gap: 10,
              padding: "9px 14px",
              borderBottom: i < events.length - 1 ? "1px solid #17172a" : undefined,
              fontSize: 11.5,
            }}
          >
            <span className="st-mono" style={{ color: "#8b8b98" }}>{time}</span>
            <span style={{ color: "#c9c9d4", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{text}</span>
          </div>
        ))}
      </div>

      <span style={{ position: "absolute", left: 404, top: 250, fontSize: 10.5, color: "#7b7b88" }}>fan-out</span>

      {/* the receivers */}
      {lanes.map((lane, i) => (
        <div
          key={lane.name}
          className="st-fade"
          style={{
            position: "absolute",
            left: lane.to[0] + 8,
            top: lane.to[1] - 27,
            width: 112,
            animationDelay: `${0.15 + i * 0.1}s`,
            padding: "9px 11px",
            borderRadius: 10,
            background: "#13131c",
            border: "1px solid #20202b",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 12.5, fontWeight: 600 }}>{lane.name}</span>
          <span className="st-mono" style={{ fontSize: 10, color: "#7b7b88" }}>{lane.proto}</span>
          <span style={chip(STATUS_BG.healthy, STATUS_TEXT.healthy)}>healthy</span>
        </div>
      ))}

      <span style={{ position: "absolute", left: 708, top: 384, width: 120, fontSize: 10.5, lineHeight: 1.45, color: "#7b7b88" }}>
        Multi-destination fan-out · per-destination health
      </span>
    </div>
  );
}

export const FEATURE_STAGES = [
  Collectors,
  Agents,
  Templates,
  Dashboards,
  Virtualization,
  NetworkDiagrams,
  Ipam,
  Alerting,
  Rbac,
  Syslog,
];
