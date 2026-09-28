import { AppChrome } from "../app-chrome";
import { RACK, STATUS_TEXT } from "../app-preview-data";
import type { ViewProps } from "../app-preview";

/** Height of one rack unit, in px, at the 1920x1080 design size. */
const U_HEIGHT = 21;

const FILL: Record<string, string> = {
  healthy: "#0d2d1a",
  warning: "#3d2e05",
  critical: "#3d1f0d",
  maintenance: "#2d1a3d",
};

export function RackView({ tick, ease }: ViewProps) {
  const usedU = RACK.devices.reduce((sum, d) => sum + d.heightU, 0);
  const freeU = RACK.heightU - usedU;
  const alerting = RACK.devices.filter((d) => d.status === "critical");
  // The selection marker walks the devices that need attention.
  const focused = alerting[tick % Math.max(1, alerting.length)]?.name;

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
            <div className="ap-pagetitle">{RACK.name}</div>
            <div className="ap-pagesub">
              {RACK.heightU}U · {RACK.site}
            </div>
          </div>
          <div className="ap-grow" />
          <span className="ap-segment">
            <span className="is-active">Front</span>
            <span>Rear</span>
          </span>
          <span className="ap-btn ap-btn-primary">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17z" />
            </svg>
            Edit Rack
          </span>
        </div>

        <div className="ap-rack-layout">
          <div className="ap-rack-shell">
            <div className="ap-rack-title">{RACK.name}</div>
            <div className="ap-rack-body" style={{ height: RACK.heightU * U_HEIGHT }}>
              <div className="ap-rack-rails">
                {Array.from({ length: RACK.heightU }, (_, i) => (
                  <div key={i} className="ap-rack-u">
                    <span className="ap-rack-unum">{RACK.heightU - i}</span>
                  </div>
                ))}
              </div>
              {RACK.devices.map((device) => (
                <div
                  key={device.name}
                  className={`ap-rack-device${device.name === focused ? " is-focused" : ""}`}
                  style={{
                    bottom: (device.startU - 1) * U_HEIGHT,
                    height: device.heightU * U_HEIGHT - 2,
                    background: FILL[device.status],
                    borderLeftColor: STATUS_TEXT[device.status],
                  }}
                >
                  <span className="ap-rack-dev-icon" style={{ color: STATUS_TEXT[device.status] }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
                      <rect x="3" y="5" width="18" height="6" rx="1" />
                      <rect x="3" y="13" width="18" height="6" rx="1" />
                    </svg>
                  </span>
                  <span className="ap-rack-dev-name">{device.name}</span>
                  <span className="ap-mono ap-rack-dev-u">{device.heightU}U</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ap-rack-side">
            <div className="ap-rack-sect">Rack Details</div>
            <dl className="ap-kv">
              <dt>Height</dt>
              <dd>{RACK.heightU}U</dd>
              <dt>Devices</dt>
              <dd>{Math.round(RACK.devices.length * ease)}</dd>
              <dt>Used</dt>
              <dd>
                {Math.round(usedU * ease)}U / {RACK.heightU}U
              </dd>
              <dt>Free</dt>
              <dd>
                {freeU}U ({Math.round((freeU / RACK.heightU) * 100)}%)
              </dd>
            </dl>

            <div className="ap-rack-capacity">
              <div className="ap-bar-track" style={{ height: 8 }}>
                <span
                  className="ap-bar-fill"
                  style={
                    {
                      "--ap-w": `${(usedU / RACK.heightU) * 100 * ease}%`,
                      "--ap-c": "var(--ap-accent-purple)",
                      height: 8,
                    } as React.CSSProperties
                  }
                />
              </div>
              <span className="ap-dim">Capacity used</span>
            </div>

            <div className="ap-rack-sect">Device Breakdown</div>
            <dl className="ap-kv">
              <dt>Front</dt>
              <dd>
                {RACK.devices.length} devices · {usedU}U
              </dd>
              <dt>Rear</dt>
              <dd>0 devices · 0U</dd>
            </dl>

            <div className="ap-rack-sect">Needs Attention</div>
            {alerting.map((device) => (
              <div key={device.name} className="ap-rack-alert">
                <span className="ap-dot ap-blink" style={{ background: STATUS_TEXT[device.status] }} />
                <span className="ap-mono">{device.name}</span>
                <span className="ap-dim">U{device.startU}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppChrome>
  );
}
