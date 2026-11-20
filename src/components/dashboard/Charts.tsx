// Lightweight SVG charts (no extra dependencies). Swap for a chart library later if needed.
const BRAND = "#c9971c";
const BRAND_LIGHT = "#f1d27a";
const GRID = "#ece7db";
const AXIS = "#8a8577";

interface BarSeries { month: string; proforma: number; invoices: number }

export function GroupedBarChart({ data }: { data: BarSeries[] }) {
  const W = 520, H = 230, pad = { l: 32, r: 8, t: 12, b: 28 };
  const max = Math.ceil(Math.max(...data.flatMap((d) => [d.proforma, d.invoices])) / 10) * 10;
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;
  const group = innerW / data.length, bar = Math.min(18, group / 3);
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly invoice statistics">
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(max * t)} y2={y(max * t)} stroke={GRID} />
          <text x={pad.l - 6} y={y(max * t) + 4} textAnchor="end" fontSize="10" fill={AXIS}>{Math.round(max * t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = pad.l + group * i + group / 2;
        return (
          <g key={d.month}>
            <rect className="chart-grow" x={cx - bar - 2} y={y(d.proforma)} width={bar} height={pad.t + innerH - y(d.proforma)} rx="3" fill={BRAND} style={{ animationDelay: `${i * 70}ms` }} />
            <rect className="chart-grow" x={cx + 2} y={y(d.invoices)} width={bar} height={pad.t + innerH - y(d.invoices)} rx="3" fill={BRAND_LIGHT} style={{ animationDelay: `${i * 70 + 40}ms` }} />
            <text x={cx} y={H - 8} textAnchor="middle" fontSize="11" fill={AXIS}>{d.month}</text>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({ data }: { data: { month: string; value: number }[] }) {
  const W = 520, H = 230, pad = { l: 44, r: 12, t: 12, b: 28 };
  const max = Math.ceil(Math.max(...data.map((d) => d.value)) / 20000) * 20000;
  const innerW = W - pad.l - pad.r, innerH = H - pad.t - pad.b;
  const x = (i: number) => pad.l + (innerW / (data.length - 1)) * i;
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.value)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${pad.t + innerH} L${x(0)},${pad.t + innerH} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly invoice value">
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BRAND} stopOpacity="0.28" />
          <stop offset="100%" stopColor={BRAND} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(max * t)} y2={y(max * t)} stroke={GRID} />
          <text x={pad.l - 6} y={y(max * t) + 4} textAnchor="end" fontSize="10" fill={AXIS}>{`$${Math.round((max * t) / 1000)}k`}</text>
        </g>
      ))}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke={BRAND} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((d, i) => (
        <g key={d.month}>
          <circle cx={x(i)} cy={y(d.value)} r="3.5" fill="#fff" stroke={BRAND} strokeWidth="2" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={AXIS}>{d.month}</text>
        </g>
      ))}
    </svg>
  );
}

const DONUT_COLORS = ["#c9971c", "#8a6508", "#f1d27a", "#6b7a5a", "#b9b3a3"];

export function DonutChart({ data }: { data: { label: string; value: number }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 52, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <svg viewBox="0 0 140 140" className="h-36 w-36 shrink-0" role="img" aria-label="Share of invoices by region">
        <g transform="rotate(-90 70 70)">
          {data.map((d, i) => {
            const len = (d.value / total) * c;
            const el = (
              <circle key={d.label} cx="70" cy="70" r={r} fill="none" stroke={DONUT_COLORS[i % DONUT_COLORS.length]}
                strokeWidth="18" strokeDasharray={`${len - 2} ${c - len + 2}`} strokeDashoffset={-offset} />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x="70" y="68" textAnchor="middle" fontSize="20" fontWeight="600" fill="#1a1a1a">{total}%</text>
        <text x="70" y="84" textAnchor="middle" fontSize="9" fill={AXIS}>by region</text>
      </svg>
      <ul className="m-0 list-none space-y-1 p-0 text-sm">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
            <span className="text-gray-600">{d.label}</span>
            <span className="ml-auto pl-3 font-medium">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
