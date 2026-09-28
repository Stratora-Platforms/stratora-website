import type { ReactNode } from "react";
import { NAV_ITEMS, STATUS_PILLS, STATUS_BG, STATUS_TEXT, USER, type NavItem } from "./app-preview-data";

/**
 * The app shell every recreated view sits inside: the top bar and the left
 * navigation. Lifted from the running app — 220px sidebar, 48px top bar, the
 * active item marked by a 3px purple inset rule and a purple icon.
 */

const icon = (path: ReactNode, extra?: Record<string, string>) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...extra}>
    {path}
  </svg>
);

const NAV_ICONS: Record<NavItem, ReactNode> = {
  Home: icon(<path d="M3 11 12 4l9 7v9h-6v-6H9v6H3z" />),
  Monitoring: icon(<path d="M3 12h4l3-8 4 16 3-8h4" />),
  Infrastructure: icon(
    <>
      <rect x="3" y="4" width="18" height="7" rx="1.5" />
      <rect x="3" y="13" width="18" height="7" rx="1.5" />
    </>,
  ),
  Collection: icon(
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14" />
    </>,
  ),
  Alerting: icon(
    <>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z" />
      <path d="M10 21h4" />
    </>,
  ),
  Administration: icon(<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />),
  Integrations: icon(<path d="M9 3v5M15 3v5M6 8h12v3a6 6 0 0 1-12 0zM12 17v4" />),
};

const PILL_ICONS: Record<string, ReactNode> = {
  critical: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v6M12 16.5v.01" />
    </svg>
  ),
  warning: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round">
      <path d="M12 4 2.5 20h19z" />
      <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
    </svg>
  ),
  offline: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <path d="M3 3l18 18M10.6 5.1A9.6 9.6 0 0 1 12 5c5 0 9 4.5 10 7-.4 1-1.4 2.5-2.9 3.8M6.3 7.4C4.2 8.8 2.6 10.8 2 12c1 2.5 5 7 10 7 1.4 0 2.7-.3 3.9-.9" />
    </svg>
  ),
  maintenance: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15.5 4.5a4.5 4.5 0 0 0-5.9 5.9L4 16l4 4 5.6-5.6a4.5 4.5 0 0 0 5.9-5.9L17 11l-3-1-1-3z" />
    </svg>
  ),
  healthy: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  ),
};

export function AppChrome({ active, children }: { active: NavItem; children: ReactNode }) {
  return (
    <div className="ap-app">
      <div className="ap-topbar">
        <div className="ap-wordmark">STRATORA</div>
        <div className="ap-grow" />

        <div className="ap-statuspills">
          {STATUS_PILLS.map((pill) => (
            <span
              key={pill.kind}
              className="ap-statuspill"
              style={{ background: STATUS_BG[pill.kind], color: STATUS_TEXT[pill.kind] }}
            >
              {PILL_ICONS[pill.kind]}
              {pill.value}
            </span>
          ))}
        </div>

        <div className="ap-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span>Search…</span>
        </div>

        <span className="ap-help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M9.6 9.3a2.5 2.5 0 0 1 4.8.8c0 1.7-2.4 2.2-2.4 3.7M12 17.2v.01" />
          </svg>
        </span>

        <span className="ap-user">
          <span className="ap-avatar">{USER.initial}</span>
          <span>{USER.name}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

      <div className="ap-body">
        <div className="ap-sidebar">
          {NAV_ITEMS.map((item) => (
            <div key={item} className={`ap-nav${item === active ? " is-active" : ""}`}>
              <span className="ap-nav-icon">{NAV_ICONS[item]}</span>
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="ap-main">{children}</div>
      </div>
    </div>
  );
}
