/**
 * Demo data for <LiveDashboard />.
 *
 * The animated hero dashboard shows one fictional global customer — Halden
 * Group: 4,812 nodes, 38 sites, 14 countries — chosen to sell two things at a
 * glance: monitoring at scale (the world map of collector traffic into NYC HQ)
 * and context (nine alerts correlated into one incident with a probable cause).
 *
 * Everything the dashboard says lives in this module so the story can be edited
 * without touching layout or animation code.
 *
 * MAP GEOMETRY IS FIXED. Arc, pin and label coordinates are authored against
 * the 1060 x 340 viewBox of public/worldmap.svg; changing one without the other
 * desynchronises the overlay from the continents underneath.
 */

/** Status palette. Shared by pins, pills, chips, bars and feed dots. */
export const STATUS_COLORS = {
  offline: "#ef4444",
  critical: "#f97316",
  degraded: "#eab308",
  maintenance: "#a855f7",
  healthy: "#22c55e",
} as const;

/** Headline totals for the estate. */
export const ESTATE = {
  nodes: 4812,
  nodesLabel: "4,812",
  healthy: 4770,
  healthyLabel: "4,812",
  sites: 38,
  countries: 14,
  collectors: 21,
  /** Target for the health ring, in percent. */
  healthScore: 97,
  /** Circumference of the ring (r=34) — the dash array the offset animates against. */
  ringLength: 213.6,
};

/** Status pills in the top bar. Static — these do not count up. */
export const STATUS_PILLS = [
  { value: "3", dot: STATUS_COLORS.offline, fg: "#f87171", bg: "rgba(239,68,68,.12)" },
  { value: "9", dot: STATUS_COLORS.critical, fg: "#fb923c", bg: "rgba(249,115,22,.12)" },
  { value: "18", dot: STATUS_COLORS.degraded, fg: "#facc15", bg: "rgba(234,179,8,.12)" },
  { value: "12", dot: STATUS_COLORS.maintenance, fg: "#c084fc", bg: "rgba(168,85,247,.13)" },
  { value: "4,770", dot: STATUS_COLORS.healthy, fg: "#4ade80", bg: "rgba(34,197,94,.12)" },
];

/** Badge on the sidebar's Alerting item. */
export const ALERTING_BADGE = 41;

export type Kpi = {
  /** Value the intro counts up to. */
  target: number;
  color: string;
  label: string;
  /** Optional dimmed note beside the value. */
  sub?: string;
  /** Trend note under the value. */
  foot: string;
  /** Sparkline path, drawn in an 80 x 18 viewBox. */
  spark: string;
  sparkColor: string;
};

export const KPIS: Kpi[] = [
  {
    target: 4812,
    color: "#4ade80",
    label: "Active devices",
    foot: "↑ 64 since 24h",
    spark: "M0 14 L12 13 L24 13 L36 11 L48 11 L60 8 L72 7 L80 5",
    sparkColor: STATUS_COLORS.healthy,
  },
  {
    target: 3,
    color: "#f87171",
    label: "Nodes down",
    foot: "↓ 2 since 24h",
    spark: "M0 4 L20 4 L26 12 L50 12 L56 15 L80 15",
    sparkColor: STATUS_COLORS.offline,
  },
  {
    target: 27,
    color: "#fb923c",
    label: "Degraded / critical",
    sub: "9 crit · 18 deg",
    foot: "→ 0 since 24h",
    spark: "M0 10 L14 9 L22 6 L30 10 L48 10 L56 7 L64 11 L80 10",
    sparkColor: STATUS_COLORS.critical,
  },
  {
    target: 41,
    color: "#fb923c",
    label: "Active alerts, correlated",
    sub: "→ 7 incidents",
    foot: "↓ 11 since 24h",
    spark: "M0 5 L16 6 L28 8 L40 7 L52 10 L64 12 L80 13",
    sparkColor: STATUS_COLORS.critical,
  },
  {
    target: 12,
    color: "#c084fc",
    label: "Nodes in maintenance",
    foot: "BLR patch window",
    spark: "M0 15 L40 15 L44 5 L80 5",
    sparkColor: STATUS_COLORS.maintenance,
  },
];

/* ------------------------------------------------------------------ map --
 * Collector traffic flowing into NYC HQ at (312, 91).
 *
 * Each arc is stored twice: `base` is the faint static curve drawn outward
 * from HQ, `flow` is the same curve reversed so the marching dash travels
 * TOWARD HQ. `delay` is negative so every arc starts mid-cycle and the map
 * never looks like it began all at once.
 */

export const MAP_HQ = { x: 312, y: 91 };

export const MAP_ARCS = [
  { base: "M312 91 Q292 78 272 88", flow: "M272 88 Q292 78 312 91", delay: "-.2s" },
  { base: "M312 91 Q273 86 235 130", flow: "M235 130 Q273 86 312 91", delay: "-1.1s" },
  { base: "M312 91 Q352 122 393 256", flow: "M393 256 Q352 122 312 91", delay: "-.6s" },
  { base: "M312 91 Q421 16 530 63", flow: "M530 63 Q421 16 312 91", delay: "-1.8s" },
  { base: "M312 91 Q434 10 556 67", flow: "M556 67 Q434 10 312 91", delay: "-.4s" },
  { base: "M312 91 Q428 11 543 62", flow: "M543 62 Q428 11 312 91", delay: "-2.1s" },
  { base: "M312 91 Q448 6 583 43", flow: "M583 43 Q448 6 312 91", delay: "-1.4s" },
  { base: "M312 91 Q462 80 613 263", flow: "M613 263 Q462 80 312 91", delay: "-.9s" },
  { base: "M312 91 Q535 6 758 162", flow: "M758 162 Q535 6 312 91", delay: "-1.6s" },
  { base: "M312 91 Q574 6 836 192", flow: "M836 192 Q574 6 312 91", delay: "-.1s" },
  { base: "M312 91 Q627 8 941 104", flow: "M941 104 Q627 8 312 91", delay: "-2.3s" },
  { base: "M312 91 Q644 6 975 283", flow: "M975 283 Q644 6 312 91", delay: "-.7s" },
  { base: "M312 91 Q502 6 693 131", flow: "M693 131 Q502 6 312 91", delay: "-1.3s" },
];

export type MapPin = {
  cx: number;
  cy: number;
  r: number;
  /** Status colour, or "accent" for the HQ pin, which takes the brand accent. */
  fill: string;
  delay?: string;
  duration?: string;
  /** HQ renders a heavier ring and no stagger. */
  hq?: boolean;
};

export const MAP_PINS: MapPin[] = [
  { cx: 312, cy: 91, r: 5, fill: "accent", hq: true },
  { cx: 296, cy: 83, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-.5s" },
  { cx: 272, cy: 88, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-1.2s" },
  { cx: 235, cy: 130, r: 4, fill: STATUS_COLORS.critical, delay: "-.3s", duration: "1.6s" },
  { cx: 393, cy: 256, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-1.9s" },
  { cx: 530, cy: 63, r: 3.5, fill: STATUS_COLORS.degraded, delay: "-.8s", duration: "2s" },
  { cx: 556, cy: 67, r: 4.5, fill: STATUS_COLORS.critical, delay: "-.1s", duration: "1.6s" },
  { cx: 543, cy: 58, r: 3, fill: STATUS_COLORS.healthy, delay: "-1.5s" },
  { cx: 583, cy: 43, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-2.2s" },
  { cx: 613, cy: 263, r: 3.5, fill: STATUS_COLORS.degraded, delay: "-.6s", duration: "2s" },
  { cx: 693, cy: 131, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-1.1s" },
  { cx: 758, cy: 162, r: 3.5, fill: STATUS_COLORS.maintenance, delay: "-1.7s" },
  { cx: 836, cy: 192, r: 4.5, fill: STATUS_COLORS.healthy, delay: "-.4s" },
  { cx: 941, cy: 104, r: 4, fill: STATUS_COLORS.healthy, delay: "-2s" },
  { cx: 975, cy: 283, r: 3.5, fill: STATUS_COLORS.healthy, delay: "-1s" },
];

export const CITY_LABELS = [
  { x: 322, y: 104, text: "NYC · HQ", fill: "#ddd6fe" },
  { x: 215, y: 148, text: "MTY" },
  { x: 403, y: 260, text: "SAO" },
  { x: 503, y: 82, text: "LON" },
  { x: 590, y: 36, text: "STO" },
  { x: 623, y: 267, text: "JNB" },
  { x: 703, y: 135, text: "DXB" },
  { x: 768, y: 166, text: "BLR" },
  { x: 846, y: 196, text: "SIN" },
  { x: 951, y: 108, text: "TYO" },
  { x: 985, y: 287, text: "SYD" },
];

/** Leader line from the Frankfurt pin out to the callout card. */
export const CALLOUT_LEADER = "M560 64 L640 44";

export const CALLOUT = {
  site: "Frankfurt DC",
  badge: "1 incident",
  body: "FRA-SAN-02 latency traced to a flapping core-switch port · ",
  emphasis: "42 VMs affected",
};

export const REGIONS = [
  { name: "North America", count: "14 sites" },
  { name: "EMEA", count: "13 sites" },
  { name: "APAC", count: "8 sites" },
];

/* --------------------------------------------------------------- alerts -- */

export const ALERTS = [
  { color: STATUS_COLORS.critical, node: "FRA-SAN-02", message: "Read latency 28 ms (> 15 ms)", site: "Frankfurt DC", ago: "1m" },
  { color: STATUS_COLORS.offline, node: "SIN-POS-114", message: "Node is offline", site: "Singapore Hub", ago: "3m" },
  { color: STATUS_COLORS.critical, node: "MTY-CORE-SW01", message: "Uplink Gi1/0/48 down", site: "Monterrey Plant", ago: "6m" },
  { color: STATUS_COLORS.degraded, node: "LON-FW-01", message: "HA peer unreachable", site: "London Office", ago: "14m" },
  { color: STATUS_COLORS.degraded, node: "JNB-ESX-02", message: "Host memory 91% (> 90%)", site: "Johannesburg", ago: "22m" },
  { color: STATUS_COLORS.degraded, node: "TYO-ILO-07", message: "PSU redundancy lost", site: "Tokyo Office", ago: "31m" },
];

export const ALERTS_TOTAL = "41";

/* ------------------------------------------------------------- incident -- */

export const INCIDENT = {
  title: "Frankfurt DC · storage latency",
  meta: "Frankfurt, Germany · FRA-VSAN cluster · opened 14:02 CEST",
  severity: "Critical",
  correlation: "9 alerts → 1 incident",
  cause: "FRA-CORE-SW02 Te1/0/12 · owner: Frankfurt DC infra · 3 related alerts suppressed",
};

/** The correlation chain. The loop highlights one step at a time, wrapping. */
export const INCIDENT_STEPS = [
  { time: "14:02:11", node: "FRA-CORE-SW02", what: "Te1/0/12 flapping, 3× in 60 s", layer: "Network", color: STATUS_COLORS.degraded },
  { time: "14:02:14", node: "FRA-SAN-02", what: "iSCSI path failover to controller B", layer: "Storage", color: STATUS_COLORS.degraded },
  { time: "14:02:40", node: "FRA-SAN-02", what: "read latency 28 ms (threshold 15 ms)", layer: "Storage", color: STATUS_COLORS.critical },
  { time: "14:03:05", node: "FRA-VSAN", what: "42 VMs on 6 hosts see datastore latency", layer: "Virtualization", color: STATUS_COLORS.critical },
];

/* ---------------------------------------------------------------- sites -- */

export type SiteRow = {
  name: string;
  country: string;
  nodes: number;
  /** Health percentage — the intro counts the bar and the number up to this. */
  health: number;
  degraded: number;
  critical: number;
  status: "Online" | "Critical" | "Degraded" | "Maintenance";
};

export const SITES: SiteRow[] = [
  { name: "New York HQ", country: "United States", nodes: 612, health: 99.5, degraded: 3, critical: 0, status: "Online" },
  { name: "Frankfurt DC", country: "Germany", nodes: 548, health: 95.8, degraded: 6, critical: 3, status: "Critical" },
  { name: "Singapore Hub", country: "Singapore", nodes: 431, health: 99.1, degraded: 2, critical: 0, status: "Degraded" },
  { name: "Monterrey Plant", country: "Mexico", nodes: 356, health: 95.2, degraded: 4, critical: 2, status: "Critical" },
  { name: "London Office", country: "United Kingdom", nodes: 287, health: 98.6, degraded: 3, critical: 0, status: "Degraded" },
  { name: "Bengaluru Dev Centre", country: "India", nodes: 263, health: 100, degraded: 0, critical: 0, status: "Maintenance" },
  { name: "São Paulo Plant", country: "Brazil", nodes: 244, health: 100, degraded: 0, critical: 0, status: "Online" },
];

/** Background / foreground for each site status chip. */
export const SITE_STATUS_CHIPS: Record<SiteRow["status"], { bg: string; fg: string }> = {
  Online: { bg: "rgba(34,197,94,.12)", fg: "#4ade80" },
  Critical: { bg: "rgba(249,115,22,.14)", fg: "#fb923c" },
  Degraded: { bg: "rgba(234,179,8,.14)", fg: "#facc15" },
  Maintenance: { bg: "rgba(168,85,247,.14)", fg: "#c084fc" },
};

/** Health bar colour, by percentage. */
export function siteBarColor(health: number): string {
  if (health >= 99) return STATUS_COLORS.healthy;
  if (health >= 96) return STATUS_COLORS.degraded;
  return STATUS_COLORS.critical;
}

/* ----------------------------------------------------------------- feed -- */

/** Ten events rotate through six visible rows, newest first. */
export const FEED_EVENTS = [
  { color: STATUS_COLORS.critical, text: "FRA-SAN-02 read latency 28 ms", site: "Frankfurt DC" },
  { color: STATUS_COLORS.healthy, text: "Resolved: TYO-AP-12 interface errors", site: "Tokyo Office" },
  { color: "#60a5fa", text: "64 new devices discovered", site: "São Paulo Plant" },
  { color: STATUS_COLORS.degraded, text: "LON-FW-01 HA peer unreachable", site: "London Office" },
  { color: STATUS_COLORS.healthy, text: "Resolved: SYD-HV-02 CPU high", site: "Sydney Office" },
  { color: STATUS_COLORS.maintenance, text: "Maintenance started: BLR-ESX-04", site: "Bengaluru Dev Centre" },
  { color: STATUS_COLORS.critical, text: "MTY-CORE-SW01 uplink Gi1/0/48 down", site: "Monterrey Plant" },
  { color: STATUS_COLORS.healthy, text: "Collector DXB-COL-01 reconnected", site: "Dubai Office" },
  { color: STATUS_COLORS.degraded, text: "JNB-ESX-02 host memory 91%", site: "Johannesburg" },
  { color: STATUS_COLORS.healthy, text: "Resolved: STO-SW-03 packet loss", site: "Stockholm Office" },
];

/** Relative timestamp per visible row — fixed by position, not by event. */
export const FEED_AGES = ["just now", "9s", "34s", "1m", "2m", "4m"];

/** Number of feed rows on screen. */
export const FEED_ROWS = 6;

/** Loop period, in ms: one tick advances the incident step and the feed. */
export const TICK_MS = 2600;

/** Intro count-up duration, in ms. */
export const INTRO_MS = 1800;

/** The frame is designed at this width and scaled down to fit narrower slots. */
export const DESIGN_WIDTH = 1240;
