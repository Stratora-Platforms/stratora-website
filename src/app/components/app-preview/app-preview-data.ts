/**
 * Fake data for the live app-view recreations in the homepage carousel.
 *
 * The estate below is invented — "Halden Group", the same fictional customer
 * the hero dashboard uses — so nothing here leaks a real node name, address or
 * IP from a customer or from the dev box.
 *
 * Shapes and wording mirror the real app so the recreations read 1:1 against
 * the reference screenshots in tools/screenshots/reference/.
 */

/* ------------------------------------------------------------------ shell -- */

/** Counts in the top-bar status pills. Shared by every view. */
export const STATUS_PILLS = [
  { kind: "critical" as const, value: 4 },
  { kind: "warning" as const, value: 4 },
  { kind: "offline" as const, value: 1 },
  { kind: "maintenance" as const, value: 1 },
  { kind: "healthy" as const, value: 36 },
];

export const NAV_ITEMS = [
  "Home",
  "Monitoring",
  "Infrastructure",
  "Collection",
  "Alerting",
  "Administration",
  "Integrations",
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];

export const USER = { initial: "A", name: "Administrator" };

/* ----------------------------------------------------------------- alerts -- */

export const ALERT_STATS = [
  { value: "41", label: "Active", kind: "offline" as const },
  { value: "18", label: "Acknowledged", kind: "discovering" as const },
  { value: "1", label: "Muted", kind: "unknown" as const },
  { value: "984", label: "Resolved", kind: "healthy" as const },
];

export type AlertRow = {
  severity: "warning" | "critical";
  alert: string;
  node: string;
  triggered: string;
  duration: string;
  status: "Resolved" | "Active";
  team?: string;
};

export const ALERT_ROWS: AlertRow[] = [
  { severity: "critical", alert: "Storage Read Latency High", node: "FRA-SAN-02", triggered: "Sep 28, 2026, 2:02 PM", duration: "2h 32m", status: "Active", team: "Storage On-Call" },
  { severity: "warning", alert: "High Packet Loss", node: "MTY-CORE-SW01", triggered: "Sep 28, 2026, 2:42 PM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "High Packet Loss", node: "LON-FW-01", triggered: "Sep 28, 2026, 2:42 PM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "High Interface Errors", node: "SIN-POS-114", triggered: "Sep 28, 2026, 2:30 PM", duration: "5m", status: "Resolved" },
  { severity: "critical", alert: "vSphere Host CPU High", node: "FRA-ESX-04", triggered: "Sep 28, 2026, 2:25 PM", duration: "4h 33m", status: "Active", team: "Storage On-Call" },
  { severity: "warning", alert: "High Packet Loss", node: "TYO-AP-12", triggered: "Sep 28, 2026, 2:22 PM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "Host Memory High", node: "JNB-ESX-02", triggered: "Sep 28, 2026, 2:19 PM", duration: "22m", status: "Active" },
  { severity: "warning", alert: "High Memory Usage", node: "BLR-ESX-04", triggered: "Sep 28, 2026, 2:17 PM", duration: "5m", status: "Resolved" },
  { severity: "critical", alert: "PSU Redundancy Lost", node: "TYO-ILO-07", triggered: "Sep 28, 2026, 2:10 PM", duration: "1h 04m", status: "Active", team: "NOC Team 1" },
  { severity: "warning", alert: "High Packet Loss", node: "SYD-HV-02", triggered: "Sep 28, 2026, 1:10 PM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "High Interface Errors", node: "STO-SW-03", triggered: "Sep 28, 2026, 1:06 PM", duration: "5m", status: "Resolved" },
  { severity: "warning", alert: "High Packet Loss", node: "DXB-COL-01", triggered: "Sep 28, 2026, 1:01 PM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "Network Device CPU High", node: "MTY-CORE-SW01", triggered: "Sep 28, 2026, 12:20 PM", duration: "5m", status: "Resolved" },
  { severity: "warning", alert: "High Memory Usage", node: "LON-ESX-01", triggered: "Sep 28, 2026, 12:11 PM", duration: "5m", status: "Resolved" },
  { severity: "warning", alert: "High Packet Loss", node: "SAO-SW-02", triggered: "Sep 28, 2026, 11:10 AM", duration: "1m", status: "Resolved" },
  { severity: "warning", alert: "High Interface Errors", node: "FRA-AP-09", triggered: "Sep 28, 2026, 10:41 AM", duration: "5m", status: "Resolved" },
];

export const ALERT_GROUPS = "986 alert groups";

/* ------------------------------------------------------------- escalation -- */

export type EscalationTeam = {
  name: string;
  description: string;
  schedule: string;
  steps: number;
  channels: string[];
  status: "Active" | "Disabled";
  usage: string;
};

export const ESCALATION_TEAMS: EscalationTeam[] = [
  { name: "NOC Team 1", description: "First response, 24/7 follow-the-sun", schedule: "Rotation", steps: 3, channels: ["Email", "Teams", "SMS"], status: "Active", usage: "12 alerts" },
  { name: "Storage On-Call", description: "SAN and vSAN escalations", schedule: "Rotation", steps: 2, channels: ["Email", "Teams", "SMS", "Voice"], status: "Active", usage: "3 alerts" },
  { name: "Network Engineering", description: "Core, edge and WAN circuits", schedule: "Business hours", steps: 3, channels: ["Email", "Slack"], status: "Active", usage: "7 alerts" },
  { name: "EMEA Field Ops", description: "Frankfurt, London, Stockholm sites", schedule: "Rotation", steps: 2, channels: ["Email", "SMS"], status: "Active", usage: "4 alerts" },
  { name: "APAC Field Ops", description: "Singapore, Tokyo, Bengaluru sites", schedule: "Rotation", steps: 2, channels: ["Teams", "SMS"], status: "Active", usage: "2 alerts" },
  { name: "Security Response", description: "Firewall and IDS events", schedule: "24/7", steps: 4, channels: ["Email", "Voice", "Slack"], status: "Active", usage: "1 alert" },
  { name: "Facilities", description: "Power, cooling and environmental", schedule: "Business hours", steps: 1, channels: ["Email"], status: "Disabled", usage: "0 alerts" },
];

/**
 * The expanded policy for the selected team. The real page shows this when a
 * team is opened; the carousel slide keeps it on screen because it is the part
 * that actually demonstrates time-based escalation.
 */
export const ESCALATION_POLICY = {
  team: "NOC Team 1",
  rotation: "Weekly · hand-over Mondays 09:00 CET",
  steps: [
    { after: "Immediately", who: "Primary on-call", channels: ["Teams", "SMS"], people: "L. Okonkwo" },
    { after: "After 5 min", who: "Secondary on-call", channels: ["SMS", "Voice"], people: "M. Halvorsen" },
    { after: "After 15 min", who: "Shift lead + manager", channels: ["Voice", "Email"], people: "A. Duarte, R. Singh" },
  ],
};

/* ------------------------------------------------------------------- ipam -- */

export const IPAM_STATS = [
  { value: "42", label: "Subnets", kind: "healthy" as const },
  { value: "4,812", label: "IPs Tracked", kind: "discovering" as const },
  { value: "3,204", label: "Active IPs", kind: "healthy" as const },
  { value: "66.6%", label: "Utilization", kind: "maintenance" as const },
  { value: "6", label: ">85% Utilized", kind: "warning" as const },
  { value: "4m ago", label: "Last Discovery", kind: "unknown" as const },
];

export type SubnetRow = {
  cidr: string;
  name: string;
  site: string;
  vlan: number;
  gateway: string;
  used: number;
  total: number;
};

export const IPAM_SUBNETS: SubnetRow[] = [
  { cidr: "10.10.0.0/24", name: "Servers and OOBM", site: "New York HQ", vlan: 10, gateway: "10.10.0.1", used: 218, total: 254 },
  { cidr: "10.10.1.0/24", name: "Wired Access", site: "New York HQ", vlan: 11, gateway: "10.10.1.1", used: 164, total: 254 },
  { cidr: "10.20.0.0/24", name: "Servers and OOBM", site: "Frankfurt DC", vlan: 10, gateway: "10.20.0.1", used: 241, total: 254 },
  { cidr: "10.20.2.0/24", name: "Wi-Fi Access", site: "Frankfurt DC", vlan: 12, gateway: "10.20.2.1", used: 88, total: 254 },
  { cidr: "10.30.0.0/24", name: "Plant Floor OT", site: "Monterrey Plant", vlan: 20, gateway: "10.30.0.1", used: 197, total: 254 },
  { cidr: "10.41.0.0/24", name: "Servers and OOBM", site: "Singapore Hub", vlan: 10, gateway: "10.41.0.1", used: 131, total: 254 },
  { cidr: "10.50.1.0/24", name: "Wired Access", site: "London Office", vlan: 11, gateway: "10.50.1.1", used: 97, total: 254 },
  { cidr: "10.60.3.0/24", name: "Dev and Lab", site: "Bengaluru Dev Centre", vlan: 30, gateway: "10.60.3.1", used: 52, total: 254 },
  { cidr: "192.168.8.0/24", name: "Guest Wi-Fi", site: "São Paulo Plant", vlan: 40, gateway: "192.168.8.1", used: 34, total: 254 },
  { cidr: "10.20.3.0/24", name: "vSAN Replication", site: "Frankfurt DC", vlan: 13, gateway: "10.20.3.1", used: 42, total: 254 },
  { cidr: "10.70.0.0/24", name: "Servers and OOBM", site: "Tokyo Office", vlan: 10, gateway: "10.70.0.1", used: 172, total: 254 },
  { cidr: "10.80.1.0/24", name: "Wired Access", site: "Stockholm Office", vlan: 11, gateway: "10.80.1.1", used: 61, total: 254 },
  { cidr: "10.90.2.0/24", name: "Wi-Fi Access", site: "Sydney Office", vlan: 12, gateway: "10.90.2.1", used: 118, total: 254 },
  { cidr: "10.10.9.0/24", name: "Out-of-band", site: "New York HQ", vlan: 99, gateway: "10.10.9.1", used: 229, total: 254 },
  { cidr: "10.30.4.0/24", name: "SCADA Historians", site: "Monterrey Plant", vlan: 24, gateway: "10.30.4.1", used: 76, total: 254 },
];

/* ------------------------------------------------------------------- rack -- */

export type RackDevice = {
  name: string;
  /** Lowest U the device occupies. */
  startU: number;
  heightU: number;
  status: "healthy" | "warning" | "critical" | "maintenance";
};

export const RACK = {
  name: "FRA-MDF-01",
  site: "Frankfurt DC",
  heightU: 42,
  devices: [
    { name: "FRA-CORE-SW01", startU: 41, heightU: 1, status: "healthy" },
    { name: "FRA-CORE-SW02", startU: 40, heightU: 1, status: "warning" },
    { name: "FRA-EDGE-RTR01", startU: 38, heightU: 1, status: "healthy" },
    { name: "FRA-FW-01", startU: 36, heightU: 2, status: "healthy" },
    { name: "FRA-FW-02", startU: 34, heightU: 2, status: "healthy" },
    { name: "FRA-ESX-01", startU: 31, heightU: 2, status: "healthy" },
    { name: "FRA-ESX-02", startU: 29, heightU: 2, status: "healthy" },
    { name: "FRA-ESX-03", startU: 27, heightU: 2, status: "healthy" },
    { name: "FRA-ESX-04", startU: 25, heightU: 2, status: "critical" },
    { name: "FRA-SAN-01", startU: 21, heightU: 3, status: "healthy" },
    { name: "FRA-SAN-02", startU: 18, heightU: 3, status: "critical" },
    { name: "FRA-BKP-01", startU: 15, heightU: 2, status: "healthy" },
    { name: "FRA-ILO-01", startU: 13, heightU: 1, status: "healthy" },
    { name: "FRA-KVM-01", startU: 11, heightU: 1, status: "maintenance" },
    { name: "FRA-UPS-02", startU: 5, heightU: 4, status: "healthy" },
    { name: "FRA-PDU-A", startU: 1, heightU: 2, status: "healthy" },
  ] satisfies RackDevice[],
};

/* --------------------------------------------------------- site overview -- */

export const SITE = {
  name: "Frankfurt DC",
  address: "Musterstraße 1, 60000 Frankfurt am Main, Germany",
  collector: "FRA-COL-01",
  nodes: 548,
  networks: 5,
  healthPct: 95.8,
  healthLabel: "Critical",
  counts: { healthy: 537, degraded: 6, critical: 3, offline: 2 },
  tabs: ["Overview", "Dashboard", "Nodes", "Topology", "Racks", "Alerts", "Reports", "Photos"],
  alertsBadge: 12,
  chips: [
    { label: "3 nodes critical", kind: "critical" as const },
    { label: "6 nodes degraded", kind: "warning" as const },
    { label: "2 nodes offline", kind: "unknown" as const },
    { label: "12 active alerts", kind: "warning" as const },
  ],
  networksList: [
    { cidr: "10.20.0.0/24", name: "Servers and OOBM", gateway: "10.20.0.1", vlan: 10, ips: 241 },
    { cidr: "10.20.1.0/24", name: "Wired Access", gateway: "10.20.1.1", vlan: 11, ips: 156 },
    { cidr: "10.20.2.0/24", name: "Wi-Fi Access", gateway: "10.20.2.1", vlan: 12, ips: 88 },
    { cidr: "10.20.3.0/24", name: "vSAN Replication", gateway: "10.20.3.1", vlan: 13, ips: 42 },
    { cidr: "10.20.9.0/24", name: "Out-of-band", gateway: "10.20.9.1", vlan: 99, ips: 31 },
  ],
  deviceTypes: [
    { label: "VMware Host", value: 186, color: "#8b5cf6" },
    { label: "Windows Server", value: 142, color: "#58a6ff" },
    { label: "Linux Server", value: 96, color: "#22c55e" },
    { label: "Network Switch", value: 54, color: "#eab308" },
    { label: "Wi-Fi Access Point", value: 38, color: "#06b6d4" },
    { label: "Storage SAN/NAS", value: 32, color: "#f97316" },
  ],
  /** 24 hourly buckets for the health-history strip. */
  healthHistory: [
    "healthy", "healthy", "healthy", "healthy", "healthy", "healthy",
    "healthy", "healthy", "warning", "warning", "healthy", "healthy",
    "healthy", "healthy", "healthy", "warning", "critical", "critical",
    "critical", "warning", "warning", "critical", "critical", "critical",
  ] as const,
};

/* ------------------------------------------------------------- noc board -- */

export const NOC = {
  title: "Global NOC Dashboard",
  range: "Last 1 hour",
  healthStatus: [
    { label: "Healthy", value: 4770, color: "#22c55e" },
    { label: "Degraded", value: 18, color: "#eab308" },
    { label: "Critical", value: 9, color: "#f97316" },
    { label: "Offline", value: 3, color: "#ef4444" },
    { label: "Maintenance", value: 12, color: "#a855f7" },
  ],
  osDistribution: [
    { label: "Windows Server", value: 1840, color: "#58a6ff" },
    { label: "VMware ESXi", value: 1290, color: "#8b5cf6" },
    { label: "Linux", value: 980, color: "#22c55e" },
    { label: "Network OS", value: 480, color: "#eab308" },
    { label: "Other", value: 222, color: "#6b7280" },
  ],
  deviceTypes: [
    { label: "Virtual Machine", value: 2140, color: "#8b5cf6" },
    { label: "Physical Server", value: 960, color: "#58a6ff" },
    { label: "Network Switch", value: 742, color: "#22c55e" },
    { label: "Access Point", value: 520, color: "#06b6d4" },
    { label: "Firewall", value: 268, color: "#f97316" },
    { label: "Storage", value: 182, color: "#eab308" },
  ],
  nodesBySite: [
    { site: "New York HQ", healthy: 609, degraded: 3, critical: 0, offline: 0, maint: 0, total: 612 },
    { site: "Frankfurt DC", healthy: 537, degraded: 6, critical: 3, offline: 2, maint: 0, total: 548 },
    { site: "Singapore Hub", healthy: 428, degraded: 2, critical: 0, offline: 1, maint: 0, total: 431 },
    { site: "Monterrey Plant", healthy: 350, degraded: 4, critical: 2, offline: 0, maint: 0, total: 356 },
    { site: "London Office", healthy: 284, degraded: 3, critical: 0, offline: 0, maint: 0, total: 287 },
    { site: "Bengaluru Dev Centre", healthy: 251, degraded: 0, critical: 0, offline: 0, maint: 12, total: 263 },
    { site: "São Paulo Plant", healthy: 244, degraded: 0, critical: 0, offline: 0, maint: 0, total: 244 },
  ],
};

/* ------------------------------------------------------------- world map -- */

/**
 * Site pins in the 1060x340 coordinate space of public/worldmap.svg — the same
 * geometry the hero dashboard uses, so the two stay consistent.
 */
export type WorldPin = {
  x: number;
  y: number;
  label: string;
  status: "healthy" | "warning" | "critical" | "maintenance";
  nodes: number;
  hq?: boolean;
  /** "end" puts the label to the left of the pin; default is to the right. */
  anchor?: "start" | "end";
  /** Vertical nudge, for the crowded European cluster. */
  dy?: number;
};

export const WORLD_PINS: WorldPin[] = [
  { x: 312, y: 91, label: "New York HQ", status: "healthy", nodes: 612, hq: true },
  { x: 235, y: 130, label: "Monterrey Plant", status: "critical", nodes: 356, anchor: "end" },
  { x: 393, y: 256, label: "São Paulo Plant", status: "healthy", nodes: 244 },
  { x: 530, y: 63, label: "London Office", status: "warning", nodes: 287, anchor: "end", dy: -7 },
  { x: 556, y: 67, label: "Frankfurt DC", status: "critical", nodes: 548, dy: 11 },
  { x: 583, y: 43, label: "Stockholm Office", status: "healthy", nodes: 96, dy: -6 },
  { x: 613, y: 263, label: "Johannesburg", status: "warning", nodes: 74 },
  { x: 693, y: 131, label: "Dubai Office", status: "healthy", nodes: 118 },
  { x: 758, y: 162, label: "Bengaluru Dev Centre", status: "maintenance", nodes: 263, dy: 11 },
  { x: 836, y: 192, label: "Singapore Hub", status: "healthy", nodes: 431 },
  { x: 941, y: 104, label: "Tokyo Office", status: "healthy", nodes: 209 },
  { x: 975, y: 283, label: "Sydney Office", status: "healthy", nodes: 142, anchor: "end" },
];

/* -------------------------------------------------------------- topology -- */

export type TopologyNode = {
  id: string;
  label: string;
  kind: "firewall" | "router" | "switch" | "server" | "storage" | "ap" | "cloud";
  x: number;
  y: number;
  status: "healthy" | "warning" | "critical";
};

/** Laid out in a 1300x620 canvas, drawn as a real tiered topology. */
export const TOPOLOGY: { nodes: TopologyNode[]; links: [string, string][] } = {
  nodes: [
    { id: "wan", label: "WAN · MPLS", kind: "cloud", x: 650, y: 40, status: "healthy" },
    { id: "rtr1", label: "FRA-EDGE-RTR01", kind: "router", x: 470, y: 150, status: "healthy" },
    { id: "rtr2", label: "FRA-EDGE-RTR02", kind: "router", x: 830, y: 150, status: "healthy" },
    { id: "fw1", label: "FRA-FW-01", kind: "firewall", x: 470, y: 265, status: "healthy" },
    { id: "fw2", label: "FRA-FW-02", kind: "firewall", x: 830, y: 265, status: "healthy" },
    { id: "sw1", label: "FRA-CORE-SW01", kind: "switch", x: 470, y: 380, status: "healthy" },
    { id: "sw2", label: "FRA-CORE-SW02", kind: "switch", x: 830, y: 380, status: "warning" },
    { id: "esx1", label: "FRA-ESX-01", kind: "server", x: 190, y: 510, status: "healthy" },
    { id: "esx2", label: "FRA-ESX-02", kind: "server", x: 370, y: 510, status: "healthy" },
    { id: "esx4", label: "FRA-ESX-04", kind: "server", x: 550, y: 510, status: "critical" },
    { id: "san2", label: "FRA-SAN-02", kind: "storage", x: 750, y: 510, status: "critical" },
    { id: "ap09", label: "FRA-AP-09", kind: "ap", x: 930, y: 510, status: "warning" },
    { id: "ap10", label: "FRA-AP-10", kind: "ap", x: 1100, y: 510, status: "healthy" },
  ],
  links: [
    ["wan", "rtr1"], ["wan", "rtr2"],
    ["rtr1", "fw1"], ["rtr2", "fw2"], ["rtr1", "rtr2"],
    ["fw1", "sw1"], ["fw2", "sw2"], ["fw1", "fw2"],
    ["sw1", "sw2"],
    ["sw1", "esx1"], ["sw1", "esx2"], ["sw1", "esx4"],
    ["sw2", "san2"], ["sw2", "ap09"], ["sw2", "ap10"],
    ["sw2", "esx4"],
  ],
};

/* --------------------------------------------------------------- helpers -- */

export const STATUS_TEXT: Record<string, string> = {
  healthy: "var(--ap-healthy)",
  warning: "var(--ap-warning)",
  critical: "var(--ap-critical)",
  offline: "var(--ap-offline)",
  maintenance: "var(--ap-maintenance)",
  discovering: "var(--ap-discovering)",
  unknown: "var(--ap-unknown)",
};

export const STATUS_BG: Record<string, string> = {
  healthy: "var(--ap-healthy-bg)",
  warning: "var(--ap-warning-bg)",
  critical: "var(--ap-critical-bg)",
  offline: "var(--ap-offline-bg)",
  maintenance: "var(--ap-maintenance-bg)",
  discovering: "var(--ap-discovering-bg)",
  unknown: "var(--ap-unknown-bg)",
};

/** Loop period for the per-view animation, in ms. */
export const TICK_MS = 2600;

/** The app view is authored at this size and scaled to fit. */
export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;
