import { AppChrome } from "../app-chrome";
import { ESCALATION_POLICY, ESCALATION_TEAMS, STATUS_BG, STATUS_TEXT } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

const CHANNEL_ICONS: Record<string, JSX.Element> = {
  Email: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </svg>
  ),
  Teams: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0M16.5 11a2.5 2.5 0 1 0 0-5M17 20h4a5 5 0 0 0-4-4.9" />
    </svg>
  ),
  SMS: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      <path d="M21 12a8 8 0 0 1-8 8H4l2.5-3A8 8 0 1 1 21 12z" />
    </svg>
  ),
  Voice: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1.1 1A16 16 0 0 1 4 5.1 1 1 0 0 1 5 4z" />
    </svg>
  ),
  Slack: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 4v9M15 11v9M4 9h9M11 15h9" />
    </svg>
  ),
};

export function EscalationView({ tick, ease }: ViewProps) {
  // The live rotation marker walks the active teams, the way the on-call
  // handover moves through the day.
  const activeTeams = ESCALATION_TEAMS.filter((t) => t.status === "Active");
  const onCallIndex = tick % activeTeams.length;
  const onCallName = activeTeams[onCallIndex]?.name;

  return (
    <AppChrome active="Alerting">
      <div className="ap-page">
        <div className="ap-pagehead">
          <span className="ap-pagehead-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="8" r="3.2" />
              <path d="M2.5 20a6.5 6.5 0 0 1 13 0M17 11.2a2.8 2.8 0 1 0 0-5.6M18 20h3.5a5.5 5.5 0 0 0-4.2-5.3" />
            </svg>
          </span>
          <div>
            <div className="ap-pagetitle">Escalation Teams</div>
            <div className="ap-pagesub">Configure notification routing for alerts</div>
          </div>
        </div>

        <div className="ap-esc-toolbar">
          <span className="ap-btn ap-btn-primary">+ New Team</span>
          <div className="ap-grow" />
          <span className="ap-search" style={{ width: 260 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <span>Search teams…</span>
          </span>
        </div>

        <div className="ap-panel">
          <div className="ap-th ap-esc-grid">
            <span />
            <span>Name ↑</span>
            <span>Description</span>
            <span>Schedule</span>
            <span>Steps</span>
            <span>Channels</span>
            <span>Status</span>
            <span>Usage</span>
          </div>
          {ESCALATION_TEAMS.map((team) => {
            const onCall = team.name === onCallName;
            return (
              <div key={team.name} className="ap-tr ap-esc-grid">
                <span className="ap-checkbox" />
                <span className="ap-esc-name">
                  <b>{team.name}</b>
                  {team.status === "Disabled" ? <span className="ap-dim"> (disabled)</span> : null}
                  {onCall ? (
                    <span className="ap-oncall">
                      <span className="ap-dot ap-blink" style={{ background: "var(--ap-healthy)" }} />
                      on call
                    </span>
                  ) : null}
                </span>
                <span className="ap-dim">{team.description}</span>
                <span>
                  <span className="ap-chip" style={{ background: STATUS_BG.maintenance, color: STATUS_TEXT.maintenance }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                      <path d="M20 12a8 8 0 1 1-2.3-5.7M20 3v5h-5" />
                    </svg>
                    {team.schedule}
                  </span>
                </span>
                <span className="ap-mono">{Math.round(team.steps * ease)}</span>
                <span className="ap-esc-channels">
                  {team.channels.map((channel) => (
                    <span key={channel} className="ap-channel">
                      {CHANNEL_ICONS[channel]}
                      {channel}
                    </span>
                  ))}
                </span>
                <span>
                  <span
                    className="ap-chip"
                    style={{
                      background: team.status === "Active" ? STATUS_BG.healthy : STATUS_BG.unknown,
                      color: team.status === "Active" ? STATUS_TEXT.healthy : STATUS_TEXT.unknown,
                    }}
                  >
                    {team.status}
                  </span>
                </span>
                <span className="ap-dim">{team.usage}</span>
              </div>
            );
          })}
          <div className="ap-tablefoot">{ESCALATION_TEAMS.length} teams</div>
        </div>

        <div className="ap-panel ap-policy">
          <div className="ap-panel-head">
            Escalation policy
            <span className="ap-dim ap-panel-sub">· {ESCALATION_POLICY.team}</span>
            <div className="ap-grow" />
            <span className="ap-dim ap-panel-sub">{ESCALATION_POLICY.rotation}</span>
          </div>
          <div className="ap-policy-steps">
            {ESCALATION_POLICY.steps.map((step, i) => {
              // The walker shows the escalation climbing, one step per tick.
              const reached = tick % (ESCALATION_POLICY.steps.length + 1) > i;
              return (
                <div key={step.who} className={`ap-policy-step${reached ? " is-reached" : ""}`}>
                  <span className="ap-policy-rail">
                    <span className="ap-policy-node">{i + 1}</span>
                    {i < ESCALATION_POLICY.steps.length - 1 ? <span className="ap-policy-line" /> : null}
                  </span>
                  <span className="ap-policy-after">{step.after}</span>
                  <span className="ap-policy-who">
                    <b>{step.who}</b>
                    <span className="ap-dim">{step.people}</span>
                  </span>
                  <span className="ap-esc-channels">
                    {step.channels.map((channel) => (
                      <span key={channel} className="ap-channel">
                        {CHANNEL_ICONS[channel]}
                        {channel}
                      </span>
                    ))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
