/**
 * The app's donut chart: a segmented ring over a dark track, with a radial
 * gradient plug in the middle carrying the total. Used by the NOC dashboard
 * and the site overview.
 *
 * Segments sweep in from twelve o'clock as `ease` runs 0 to 1, which is what
 * the real charts do when their data lands.
 */

export type Segment = { label: string; value: number; color: string };

export function Donut({
  segments,
  total,
  caption,
  size = 190,
  thickness = 26,
  ease = 1,
}: {
  segments: Segment[];
  total?: number;
  caption?: string;
  size?: number;
  thickness?: number;
  ease?: number;
}) {
  const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const centre = size / 2;

  let offset = 0;

  return (
    <div className="ap-donut" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={centre}
          cy={centre}
          r={radius}
          fill="none"
          stroke="var(--ap-donut-track)"
          strokeWidth={thickness}
        />
        {segments.map((segment) => {
          const fraction = (segment.value / sum) * ease;
          const length = fraction * circumference;
          const dash = `${length} ${circumference - length}`;
          const rotation = (offset / circumference) * 360 - 90;
          offset += length;
          return (
            <circle
              key={segment.label}
              cx={centre}
              cy={centre}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeDasharray={dash}
              transform={`rotate(${rotation} ${centre} ${centre})`}
            />
          );
        })}
      </svg>
      <div className="ap-donut-centre" style={{ inset: thickness + 4 }}>
        <span className="ap-donut-total">
          {Math.round((total ?? sum) * ease).toLocaleString("en-US")}
        </span>
        {caption ? <span className="ap-donut-caption">{caption}</span> : null}
      </div>
    </div>
  );
}

export function DonutLegend({
  segments,
  ease = 1,
  more,
}: {
  segments: Segment[];
  ease?: number;
  more?: string;
}) {
  return (
    <div className="ap-legend">
      {segments.map((segment) => (
        <div key={segment.label} className="ap-legend-row">
          <span className="ap-dot" style={{ background: segment.color }} />
          <span className="ap-legend-label">{segment.label}</span>
          <span className="ap-mono ap-legend-value">
            {Math.round(segment.value * ease).toLocaleString("en-US")}
          </span>
        </div>
      ))}
      {more ? <span className="ap-legend-more">{more}</span> : null}
    </div>
  );
}
