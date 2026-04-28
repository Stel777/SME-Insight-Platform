// Dashboard — Hero layout (locked)

const { useState: useStateD } = React;

// ── SVG helpers ───────────────────────────────────────────────────
const polarToXY = (cx, cy, r, deg) => {
  const rad = (deg - 90) * Math.PI / 180;
  return { x: +(cx + r * Math.cos(rad)).toFixed(2), y: +(cy + r * Math.sin(rad)).toFixed(2) };
};
const arcPath = (cx, cy, r, innerR, startDeg, endDeg) => {
  const s  = polarToXY(cx, cy, r,      startDeg);
  const e  = polarToXY(cx, cy, r,      endDeg);
  const si = polarToXY(cx, cy, innerR, endDeg);
  const ei = polarToXY(cx, cy, innerR, startDeg);
  const lg = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y} L ${si.x} ${si.y} A ${innerR} ${innerR} 0 ${lg} 0 ${ei.x} ${ei.y} Z`;
};

// ── Shared ────────────────────────────────────────────────────────
const Cite = ({ src }) => (
  <span className="small" style={{ color: 'var(--ink-3)', marginLeft: 6 }}>{src}</span>
);
const StatTile = ({ eyebrow, value, unit, delta, dir, source }) => (
  <div className="stat fade-in">
    <span className="eyebrow">{eyebrow}</span>
    <div className="value num">{value}{unit && <sup>{unit}</sup>}</div>
    {delta && (
      <div className={'delta ' + (dir || '')}>
        {dir === 'up' ? '↑' : dir === 'down' ? '↓' : '·'} {delta}
        {source && <Cite src={source} />}
      </div>
    )}
  </div>
);

const HoverDetail = ({ text }) => (
  <div style={{
    marginTop: 10, padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 8, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.6, minHeight: 36,
    transition: 'opacity .2s', opacity: text ? 1 : 0,
  }}>
    {text || ' '}
  </div>
);

// ── 1. KPI Tiles ──────────────────────────────────────────────────
const MacroStats = () => (
  <div className="grid grid-4">
    <StatTile eyebrow="SME Value Added"     value="€42.8" unit="B"  delta="+0.6% real · micro +6.8%"    dir="up"   source="EC 2025" />
    <StatTile eyebrow="SME Employment"      value="2.21"  unit="M"  delta="+2.9% YoY · 86.4% of total"  dir="up"   source="EC 2025" />
    <StatTile eyebrow="Productivity Gap"    value="40"    unit="%"  delta="Below OECD average (2023)"   dir="down" source="OECD 2024" />
    <StatTile eyebrow="Basic Digital Level" value="53"    unit="%"  delta="EU avg 73% · 2nd from bottom" dir="down" source="Eurostat 2025" />
  </div>
);

// ── 2. SME Confidence (interactive) ──────────────────────────────
const ConfidenceChart = () => {
  const [hov, setHov] = useStateD(null);
  const bars = [
    { label: '10-yr Avg',  val: 10, color: '#d2d2d7',
      detail: 'Historical 10-year average: 10 pts. The baseline from which current sentiment is measured. "Well above" per NBG H2 2025 report.' },
    { label: 'H1 2025',   val: 16, color: '#f4a27b',
      detail: 'H1 2025: 16 pts. 54% of SMEs pursuing growth strategies. Global Uncertainty Index at 600% above long-term average. NBG, June 2025.' },
    { label: 'H2 2025',   val: 17, color: '#F85519',
      detail: 'H2 2025: 17 pts — record. 58% on growth strategies (↑ from 54%). Liquidity constraints near 10-yr low (~10%). NBG, February 2026.' },
  ];
  const MAX = 22, W = 520, H = 180, PADT = 20, PADB = 50, barW = 80, gap = 60;
  const chartH = H - PADT - PADB;
  const totalW = bars.length * barW + (bars.length - 1) * gap;
  const startX = (W - totalW) / 2;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">SME Confidence Index · NBG Survey</div>
          <div className="h3" style={{ marginTop: 4 }}>17 pts — above 10-yr average</div>
        </div>
        <span className="pill accent">Hover bars ↓</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {bars.map((b, i) => {
          const x  = startX + i * (barW + gap);
          const bh = (b.val / MAX) * chartH;
          const y  = PADT + chartH - bh;
          const active = hov === null || hov === i;
          return (
            <g key={b.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <rect x={x} y={y} width={barW} height={bh} rx="6"
                fill={b.color} opacity={active ? 1 : 0.35}
                style={{ transition: 'opacity .2s' }} />
              <text x={x + barW/2} y={y - 7} textAnchor="middle" fontSize="13" fontWeight="700"
                fill={hov === i ? '#F85519' : '#1d1d1f'} fontFamily="Inter">{b.val} pts</text>
              <text x={x + barW/2} y={PADT + chartH + 16} textAnchor="middle" fontSize="11"
                fill="#444" fontFamily="Inter">{b.label}</text>
            </g>
          );
        })}
        <text x={W/2} y={H - 4} textAnchor="middle" fontSize="10" fill="#86868b" fontFamily="Inter">
          58% of SMEs pursuing growth strategies · NBG H2 2025
        </text>
      </svg>
      <HoverDetail text={hov !== null ? bars[hov].detail : null} />
    </div>
  );
};

// ── 3. Digital Intensity Gap (interactive) ────────────────────────
const DigitalGapChart = () => {
  const [hov, setHov] = useStateD(null);
  const rows = [
    { label: 'Greece',      val: 53, color: '#F85519',
      detail: 'Greece ranks 2nd from bottom in the EU — only Bulgaria (50%) scores lower. Gap to EU average: 20pp. Gap to 2030 target: 37pp. Source: Eurostat 2025.' },
    { label: 'EU Average',  val: 73, color: '#6e6e73',
      detail: 'EU average for SMEs at basic digital intensity (2024). Large enterprises average 91%. At 2030 target of 90%, most EU countries need ~17pp improvement; Greece needs 37pp.' },
    { label: '2030 Target', val: 90, color: '#059669',
      detail: 'EU Digital Decade 2030 target. At current trajectory Greece will not meet this without significant structural intervention — regulatory pressure is mounting.' },
  ];
  const MAX = 100, W = 520, H = 180, PADL = 100, PADR = 70, PADT = 24, ROW_H = 36, GAP = 14;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">SME Digital Intensity · Basic level or above</div>
          <div className="h3" style={{ marginTop: 4 }}>37 pp gap to 2030 target</div>
          <div style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 4 }}>pp = percentage points</div>
        </div>
        <span className="pill" style={{ background: '#F8551915', color: '#F85519' }}>2nd from bottom EU</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {rows.map((r, i) => {
          const y   = PADT + i * (ROW_H + GAP);
          const bw  = ((W - PADL - PADR) * r.val) / MAX;
          const active = hov === null || hov === i;
          return (
            <g key={r.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <text x={PADL - 8} y={y + ROW_H/2 + 4} textAnchor="end" fontSize="11"
                fill={hov === i ? '#1d1d1f' : '#444'} fontWeight={hov === i ? '600' : '400'} fontFamily="Inter">{r.label}</text>
              <rect x={PADL} y={y} width={W - PADL - PADR} height={ROW_H} rx="4" fill="#f0efe9" />
              <rect x={PADL} y={y} width={bw} height={ROW_H} rx="4" fill={r.color}
                opacity={active ? 1 : 0.35} style={{ transition: 'opacity .2s' }} />
              <text x={PADL + bw + 6} y={y + ROW_H/2 + 4} fontSize="12" fontWeight="700"
                fill={r.color} fontFamily="Inter">{r.val}%</text>
            </g>
          );
        })}
      </svg>
      <HoverDetail text={hov !== null ? rows[hov].detail : null} />
    </div>
  );
};

// ── 4. ESG Funnel (interactive) ───────────────────────────────────
const ESGFunnel = () => {
  const [hov, setHov] = useStateD(null);
  const steps = [
    { label: 'Active ESG interest',         pct: 66, color: '#F85519',
      detail: 'Over two-thirds of Greek SMEs express active ESG interest. The information gap: 44pp below the interest level — most know they should act, but don\'t know how.' },
    { label: 'Received substantial info',   pct: 22, color: '#f4a27b',
      detail: 'Only 22% have received substantial ESG information. Main barrier: lack of knowledge (~33% cite this). Complex procedures and high costs cited by the majority.' },
    { label: 'Implementing ESG actions',    pct: 12, color: '#d2d2d7',
      detail: '12% are implementing ESG. Of these, almost all start with Environmental (E) actions. Social (S): 7% only. Very small enterprises: just 4% implementing anything.' },
    { label: 'Holistic strategy (incl. G)', pct:  3, color: '#b0b0b8',
      detail: 'Only 3% have a holistic ESG strategy including the Governance (G) dimension. Profitability is the most persuasive adoption argument — ~50% of very small ESG adopters report measurable profit gains.' },
  ];
  const MAX_PCT = 66, W = 520, H = 210, MAX_W = 380, BAR_H = 28, GAP = 10, PADT = 28;
  const cx = W / 2;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">ESG Adoption Pipeline · 600 Greek SMEs</div>
          <div className="h3" style={{ marginTop: 4 }}>66% interested → only 3% holistic</div>
        </div>
        <span className="small" style={{ color: '#86868b' }}>NBG · May 2025</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {steps.map((s, i) => {
          const bw = (s.pct / MAX_PCT) * MAX_W;
          const x  = cx - bw / 2;
          const y  = PADT + i * (BAR_H + GAP);
          const active = hov === null || hov === i;
          return (
            <g key={s.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <rect x={x} y={y} width={bw} height={BAR_H} rx="4" fill={s.color}
                opacity={active ? 1 : 0.35} style={{ transition: 'opacity .2s, transform .15s' }} />
              <text x={cx} y={y + BAR_H/2 + 4} textAnchor="middle" fontSize="11" fontWeight="600"
                fill={i < 2 ? '#fff' : '#444'} fontFamily="Inter">{s.pct}%</text>
              <text x={cx - bw/2 - 8} y={y + BAR_H/2 + 4} textAnchor="end" fontSize="11"
                fill={hov === i ? '#1d1d1f' : '#6e6e73'} fontFamily="Inter">{s.label}</text>
            </g>
          );
        })}
        <text x={cx} y={H - 6} textAnchor="middle" fontSize="10" fill="#86868b" fontFamily="Inter">
          93% say no mandatory regulation needed to act · NBG ESG 2025
        </text>
      </svg>
      <HoverDetail text={hov !== null ? steps[hov].detail : null} />
    </div>
  );
};

// ── 5. SME Structure Donut (interactive) ──────────────────────────
const StructureDonut = () => {
  const [hov, setHov] = useStateD(null);
  const cx = 95, cy = 95, r = 72, innerR = 44;
  const segments = [
    { label: 'Micro (0–9 staff)',   pct: 96.4, color: '#F85519', startDeg: 0,      endDeg: 347.04,
      detail: '96.4% of all Greek enterprises are micro-firms (0–9 employees). Highest share in the EU. Total: ~712,000 micro-enterprises. They account for 47% of business employment.' },
    { label: 'Small (10–49 staff)', pct:  2.6, color: '#6e6e73', startDeg: 347.04, endDeg: 356.4,
      detail: '2.6% of enterprises are small firms (10–49 employees). Though a small share by count, they contribute disproportionately to stable employment and export activity.' },
    { label: 'Med + Large',         pct:  1.0, color: '#d2d2d7', startDeg: 356.4,  endDeg: 359.5,
      detail: 'Medium (50–249 staff): 0.8% of enterprises. Large (250+): 0.2%. The near-absence of mid-sized firms is a structural weakness — the "missing middle" problem in Greece.' },
  ];
  const legend = [
    { label: 'Micro',        pct: '96.4%', color: '#F85519' },
    { label: 'Small',        pct: '2.6%',  color: '#6e6e73' },
    { label: 'Medium',       pct: '0.8%',  color: '#d2d2d7' },
    { label: 'Large',        pct: '0.2%',  color: '#e8e8e8' },
  ];
  const hovSeg = hov !== null ? segments[hov] : null;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">Enterprise Structure · Greece 2024</div>
          <div className="h3" style={{ marginTop: 4 }}>96.4% are micro-enterprises</div>
        </div>
        <span className="small" style={{ color: '#86868b' }}>EC Fact Sheet · 2025</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '8px 0' }}>
        <svg viewBox="0 0 190 190" style={{ width: 155, flexShrink: 0, cursor: 'pointer' }}>
          {segments.map((s, i) => (
            <path key={s.label} d={arcPath(cx, cy, r, innerR, s.startDeg, s.endDeg)}
              fill={s.color}
              opacity={hov === null || hov === i ? 1 : 0.3}
              style={{ transition: 'opacity .2s' }}
              onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} />
          ))}
          <text x={cx} y={cy - 7}  textAnchor="middle" fontSize={hovSeg ? 14 : 18} fontWeight="700"
            fill="#1d1d1f" fontFamily="Inter">{hovSeg ? hovSeg.pct + '%' : '96.4%'}</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fontSize="10" fill="#6e6e73" fontFamily="Inter">
            {hovSeg ? hovSeg.label.split(' ')[0] : 'micro'}
          </text>
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
          {legend.map((l, i) => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 8,
              opacity: hov === null || hov === (i < 2 ? i : 2) ? 1 : 0.4,
              transition: 'opacity .2s', cursor: 'default' }}>
              <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: '#444', fontFamily: 'Inter' }}>{l.label}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1d1d1f', marginLeft: 4 }}>{l.pct}</span>
            </div>
          ))}
          <p style={{ fontSize: 11, color: '#86868b', marginTop: 4, fontFamily: 'Inter' }}>Highest micro share in EU</p>
        </div>
      </div>
      <HoverDetail text={hovSeg ? hovSeg.detail : null} />
    </div>
  );
};

// ── 6. Crisis Resilience (interactive) ───────────────────────────
const ResilienceChart = () => {
  const [hov, setHov] = useStateD(null);
  const crises = [
    { label: '2021 — Energy Crisis',          pct: 82, color: '#dc2626',
      detail: '2021 energy crisis: 82% significantly impacted. Fuel and gas cost spikes over 30% for most affected SMEs. Many absorbed costs via margin compression or price pass-through.' },
    { label: '2020–24 — Supply Chain Shocks', pct: 55, color: '#d97706',
      detail: '2020–24 supply chain disruptions: 50–60% significantly impacted. Input shortages, logistics delays, and inventory cost increases. Multi-year pressure that compressed capex.' },
    { label: '2025 — US Tariff Pressure',     pct: 33, color: '#059669',
      detail: '2025 US tariff pressure: only 33% significantly impacted — lowest of any recent crisis. Of those affected: 83% via supply chain cost increases, 17% via demand impact. 66% absorbed via margin compression.' },
  ];
  const MAX = 100, W = 660, H = 170, PADL = 230, PADR = 100, PADT = 18, BAR_H = 30, GAP = 14;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">Resilience Signal — % SMEs reporting significant external impact</div>
          <div className="h3" style={{ marginTop: 4 }}>Greek SMEs absorbing shocks better over time</div>
        </div>
        <span className="small" style={{ color: '#86868b' }}>NBG · H2 2025</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {crises.map((c, i) => {
          const y  = PADT + i * (BAR_H + GAP);
          const bw = ((W - PADL - PADR) * c.pct) / MAX;
          const active = hov === null || hov === i;
          return (
            <g key={c.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <text x={PADL - 10} y={y + BAR_H/2 + 4} textAnchor="end" fontSize="11"
                fill={hov === i ? '#1d1d1f' : '#444'} fontWeight={hov === i ? '600' : '400'} fontFamily="Inter">{c.label}</text>
              <rect x={PADL} y={y} width={W - PADL - PADR} height={BAR_H} rx="4" fill="#f0efe9" />
              <rect x={PADL} y={y} width={bw} height={BAR_H} rx="4" fill={c.color}
                opacity={active ? 0.85 : 0.25} style={{ transition: 'opacity .2s' }} />
              <text x={PADL + bw + 8} y={y + BAR_H/2 + 4} fontSize="13" fontWeight="700"
                fill={c.color} fontFamily="Inter">{c.pct}%</text>
            </g>
          );
        })}
        <text x={PADL} y={H - 4} fontSize="10" fill="#86868b" fontFamily="Inter">
          Of 2025 affected SMEs: 66% absorbed via margin compression · 15% passed to customers
        </text>
      </svg>
      <HoverDetail text={hov !== null ? crises[hov].detail : null} />
    </div>
  );
};

// ── 7. Minimum Wage Progression (NEW — from Market Insights research) ──
const MinimumWageChart = () => {
  const [hov, setHov] = useStateD(null);
  const wages = [
    { label: '2019', val: 650, pct: null,    color: '#d2d2d7',
      detail: '€650/month — pre-crisis baseline. Reference point for wage progression over the subsequent 7 years.' },
    { label: '2022', val: 713, pct: '+9.7%', color: '#c8c8ce',
      detail: '€713/month (+9.7%). Post-pandemic recovery. First significant increase following the freeze during COVID-19 period.' },
    { label: '2023', val: 780, pct: '+9.4%', color: '#b0b0b8',
      detail: '€780/month (+9.4%). Inflation catch-up. Continued government commitment to raise real wages toward EU convergence levels.' },
    { label: '2024', val: 830, pct: '+6.4%', color: '#f4a27b',
      detail: '€830/month (+6.4%). Annual scheduled increase. For SMEs with minimum-wage staff, each 6% increase translates directly to payroll cost pressure.' },
    { label: 'Apr 2025', val: 880, pct: '+6.0%', color: '#F85519',
      detail: '€880/month (+6.0%) from April 2025. ~575,000 private-sector workers. Knock-on: unemployment benefit €509→€540, marriage allowance lifted to €88. Source: GTP Headlines, Mar 2025.' },
    { label: 'Mar 2026', val: 920, pct: '+4.5%', color: '#c73a00',
      detail: '€920/month (+4.5%) from March 2026. ~700,000 workers. Two consecutive hikes in 12 months = +€90/month cumulative increase. Major payroll cost event for micro-firms. Source: GTP Headlines, Mar 2026.' },
  ];
  const W = 560, H = 200, PADL = 40, PADR = 10, PADT = 28, PADB = 52;
  const barW = 50, chartH = H - PADT - PADB;
  const totalW = wages.length * barW;
  const gapW   = (W - PADL - PADR - totalW) / (wages.length - 1);
  const MIN_V = 600, MAX_V = 960, range = MAX_V - MIN_V;
  const BOTTOM = PADT + chartH;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">Minimum Wage Progression · Greece 2019–2026</div>
          <div className="h3" style={{ marginTop: 4 }}>€650 → €920 — a 41% rise in 7 years</div>
        </div>
        <span className="small" style={{ color: '#86868b' }}>GTP Headlines · Eurofound</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {wages.map((w, i) => {
          const x  = PADL + i * (barW + gapW);
          const bh = ((w.val - MIN_V) / range) * chartH;
          const y  = BOTTOM - bh;
          const active = hov === null || hov === i;
          return (
            <g key={w.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <rect x={x} y={y} width={barW} height={bh} rx="5" fill={w.color}
                opacity={active ? 1 : 0.3} style={{ transition: 'opacity .2s' }} />
              {/* Value label */}
              <text x={x + barW/2} y={y - 6} textAnchor="middle" fontSize="11" fontWeight="700"
                fill={hov === i ? '#F85519' : '#1d1d1f'} fontFamily="Inter">€{w.val}</text>
              {/* % change badge */}
              {w.pct && (
                <text x={x + barW/2} y={y - 18} textAnchor="middle" fontSize="9"
                  fill={hov === i ? '#059669' : '#6e6e73'} fontFamily="Inter">{w.pct}</text>
              )}
              {/* X label */}
              <text x={x + barW/2} y={BOTTOM + 14} textAnchor="middle" fontSize="10"
                fill={hov === i ? '#1d1d1f' : '#6e6e73'} fontFamily="Inter">{w.label}</text>
            </g>
          );
        })}
        {/* Baseline reference */}
        <line x1={PADL} y1={BOTTOM} x2={W - PADR} y2={BOTTOM} stroke="#e8e8e8" strokeWidth="1" />
      </svg>
      <HoverDetail text={hov !== null ? wages[hov].detail : null} />
    </div>
  );
};

// ── 8. Greece 2.0 / RRF Progress (NEW — from Market Insights research) ──
const RRFProgress = () => {
  const [hov, setHov] = useStateD(null);
  const bars = [
    { label: 'Milestones completed',  pct: 53,   val: '53% of targets',   color: '#F85519', suffix: '',
      detail: '53% of all milestones and targets under Greece 2.0 fulfilled as of February 2026. August 2026 is the hard implementation deadline — the final 47% must be completed in months.' },
    { label: 'Funds disbursed',        pct: 68.5, val: '€24.6B of €35.95B', color: '#059669', suffix: '%',
      detail: '€24.6B disbursed (68.5% of total €35.95B allocation). Seventh payment: €1.18B in grants and loans approved by EC in March 2026. SME loans: €2.9B approved in 2025, 90% to firms under 50 employees.' },
  ];
  const W = 560, H = 160, PADL = 180, PADR = 100, PADT = 24, BAR_H = 34, GAP = 20;

  return (
    <div className="chart tinted">
      <div className="chart-head">
        <div>
          <div className="eyebrow">Greece 2.0 — NextGenerationEU Recovery Fund</div>
          <div className="h3" style={{ marginTop: 4 }}>August 2026 deadline approaching</div>
        </div>
        <span className="small" style={{ color: '#86868b' }}>EC / GreekReporter · Feb–Mar 2026</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: H, width: '100%', cursor: 'pointer' }}>
        {bars.map((b, i) => {
          const y  = PADT + i * (BAR_H + GAP);
          const bw = ((W - PADL - PADR) * b.pct) / 100;
          const active = hov === null || hov === i;
          return (
            <g key={b.label} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}>
              <text x={PADL - 10} y={y + BAR_H/2 + 4} textAnchor="end" fontSize="11"
                fill={hov === i ? '#1d1d1f' : '#444'} fontWeight={hov === i ? '600' : '400'} fontFamily="Inter">{b.label}</text>
              <rect x={PADL} y={y} width={W - PADL - PADR} height={BAR_H} rx="5" fill="#f0efe9" />
              <rect x={PADL} y={y} width={bw} height={BAR_H} rx="5" fill={b.color}
                opacity={active ? 1 : 0.3} style={{ transition: 'opacity .2s' }} />
              <text x={PADL + bw + 8} y={y + BAR_H/2 + 5} fontSize="12" fontWeight="700"
                fill={b.color} fontFamily="Inter">{b.val}</text>
            </g>
          );
        })}
        {/* SME stat */}
        <text x={PADL} y={H - 18} fontSize="11" fill="#444" fontFamily="Inter" fontWeight="500">
          SME loans approved 2025: €2.9B — 90% to firms with &lt;50 employees
        </text>
        <text x={PADL} y={H - 4} fontSize="10" fill="#86868b" fontFamily="Inter">
          Hellenic Development Bank · Greece 2.0 programme
        </text>
      </svg>
      <HoverDetail text={hov !== null ? bars[hov].detail : null} />
    </div>
  );
};

// ── 9. Sector Lens ────────────────────────────────────────────────
const SectorLens = () => {
  const [active, setActive] = useStateD('Tourism');
  const SECTORS = ['Tourism', 'Retail', 'Manufacturing', 'Agri-food', 'Services'];
  const DATA = {
    Tourism: {
      signals:      ['Tourism revenue €23.6B in 2025 (+9.4%) — but operating margins remain squeezed.', 'Labour shortages persisting in seasonal and hospitality roles.', 'Off-season cashflow remains the sector\'s structural weak point.'],
      implications: ['Cashflow squeeze intensifies into the off-season.', 'Investment appetite cautious with a short time horizon.', 'Compliance anxiety rising without internal capacity to respond.'],
      needs:        ['Cashflow and working capital planning tools.', 'Fixed-fee operational diagnostic → staged pilot pathway.', 'Peer workshops and sector-specific clinics.'],
    },
    Retail: {
      signals:      ['Sustained margin compression from cost inflation.', 'Minimum wage hike to €920 (Mar 2026) adds to payroll costs directly.', 'Shift to online channels accelerating among competitors.'],
      implications: ['Cashflow management is the primary operational concern.', 'Digital adoption seen as a margin lever — but where to start?', 'Price sensitivity highest — open-ended engagements rejected.'],
      needs:        ['Fixed-fee, scoped digital quick wins.', 'Peer benchmarking — "what are similar firms doing?".', 'Short pilot → results → decision gate approach.'],
    },
    Manufacturing: {
      signals:      ['Equipment modernisation driven by EU product compliance.', 'US tariff deal at 15% — export-oriented firms re-assessing routes.', 'R&D super-deduction (215%) now available under Law 5193/2025.'],
      implications: ['Investment appetite highest of all sectors.', 'Regulatory compliance on EU product standards is a real pain.', 'Tax incentive awareness is low — most firms don\'t know they qualify.'],
      needs:        ['Compliance diagnostic for EU product standards.', 'R&D and funding eligibility check.', 'Export market diversification — practical, scoped.'],
    },
    'Agri-food': {
      signals:      ['US tariff at 15% — olive oil, feta, wine, olives most exposed.', 'EU farm-to-fork creating new documentation and traceability obligations.', 'ESG and traceability requirements increasing from retail buyers.'],
      implications: ['Export uncertainty creating cashflow planning anxiety.', 'Compliance load rising with no dedicated resource.', 'Buyer-driven ESG pressure is creating urgency.'],
      needs:        ['Tariff impact assessment and export route review.', 'Traceability and ESG readiness check.', 'Plain-language EU policy translation.'],
    },
    Services: {
      signals:      ['Talent acquisition increasingly competitive vs larger firms.', 'Minimum wage increases reducing the wage differentiation advantage.', 'Digital service delivery expectations rising from clients.'],
      implications: ['HR costs rising; retention is a live concern.', 'Digital capability gap vs client expectations widening.', 'Business development almost entirely via referrals.'],
      needs:        ['HR structure and retention diagnostic.', 'Digital service delivery quick wins.', 'Client diversification strategy — practical, not theoretical.'],
    },
  };
  const d = DATA[active] || DATA['Tourism'];
  return (
    <div>
      <div className="sectortabs">
        {SECTORS.map(s => (
          <button key={s} className={active === s ? 'active' : ''} onClick={() => setActive(s)}>{s}</button>
        ))}
      </div>
      <div className="triplet">
        <div><span className="eyebrow">Sector signals</span><ul>{d.signals.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        <div><span className="eyebrow">Implications for SMEs</span><ul>{d.implications.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
        <div><span className="eyebrow">Likely needs</span><ul>{d.needs.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
      </div>
    </div>
  );
};

// ── 10. Opportunity Radar ─────────────────────────────────────────
const Radar = () => (
  <table className="table">
    <thead>
      <tr>
        <th>External signal</th>
        <th>SME pain point</th>
        <th>Low-friction entry offer</th>
        <th style={{ textAlign: 'right' }}>Evidence</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>myDATA e-invoicing mandatory Oct 2026</td>
        <td>"We haven't started — is it really mandatory?"</td>
        <td className="offer">Compliance readiness check</td>
        <td style={{ textAlign: 'right' }}><span className="small">AADE · KPMG</span></td>
      </tr>
      <tr>
        <td>EU Omnibus + supply chain ESG buyer pressure</td>
        <td>"Customers ask — we don't know what to say"</td>
        <td className="offer">ESG readiness one-pager + clinic</td>
        <td style={{ textAlign: 'right' }}><span className="small">NBG · EC</span></td>
      </tr>
      <tr>
        <td>Digital adoption gap vs EU (53% vs 73%)</td>
        <td>Skills and bandwidth gap — "where to start?"</td>
        <td className="offer">Sector clinic or peer workshop</td>
        <td style={{ textAlign: 'right' }}><span className="small">Eurostat · OECD</span></td>
      </tr>
      <tr>
        <td>Greece 2.0 / RRF — Aug 2026 deadline</td>
        <td>"We don't know if we qualify for EU funding"</td>
        <td className="offer">Funding readiness diagnostic</td>
        <td style={{ textAlign: 'right' }}><span className="small">EC · HDB</span></td>
      </tr>
      <tr>
        <td>R&D super-deduction up to 215% (Law 5193/2025)</td>
        <td>"We had no idea this tax incentive existed"</td>
        <td className="offer">Tax incentive eligibility scan</td>
        <td style={{ textAlign: 'right' }}><span className="small">KPMG Greece</span></td>
      </tr>
      <tr>
        <td>Minimum wage €920 — 2nd hike in 12 months</td>
        <td>Payroll cost pressure squeezing micro-firm margins</td>
        <td className="offer">Cost structure and efficiency audit</td>
        <td style={{ textAlign: 'right' }}><span className="small">GTP · Eurofound</span></td>
      </tr>
    </tbody>
  </table>
);

// ── Main layout ───────────────────────────────────────────────────
const DashboardView = () => (
  <div className="view-inner">

    <div className="hero fade-in">
      <span className="eyebrow">April 2026 · Greek <span style={{ textTransform: 'none' }}>SMEs</span></span>
      <h1 className="display">One view.<br />Signals, voice, action.</h1>
      <p className="lead">
        Numbers from the institutions. Evidence from the field. Signals for advisors.
      </p>
      <div className="actions">
        <button className="btn btn-primary" onClick={() => window.sipNavigate?.(2)}>Open today's briefing</button>
      </div>
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Macro snapshot</span>
        <h2 className="h1">The market, at a glance.</h2>
        <p className="lead">Four numbers that set the context for every engagement decision below.</p>
      </div>
      <MacroStats />
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Sentiment & digital</span>
        <h2 className="h1">Confidence rising. Digital lagging.</h2>
      </div>
      <div className="grid grid-2">
        <ConfidenceChart />
        <DigitalGapChart />
      </div>
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">ESG & structure</span>
        <h2 className="h1">Interested, uninformed, under-implemented.</h2>
      </div>
      <div className="grid grid-2">
        <ESGFunnel />
        <StructureDonut />
      </div>
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Resilience signal</span>
        <h2 className="h1">Absorbing shocks better over time.</h2>
        <p className="lead">Share of Greek SMEs reporting significant external impact — across three consecutive crises. Hover each bar for detail.</p>
      </div>
      <ResilienceChart />
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Labour costs & public funding</span>
        <h2 className="h1">Two signals every SME should track.</h2>
      </div>
      <div className="grid grid-2">
        <MinimumWageChart />
        <RRFProgress />
      </div>
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Sector lens</span>
        <h2 className="h1">Per sector. Always actionable.</h2>
        <p className="lead">Select a sector to see signals, implications, and typical SME needs — grounded in OECD, EC, and survey data.</p>
      </div>
      <SectorLens />
    </div>

    <div className="section">
      <div className="section-head">
        <span className="eyebrow">Opportunity radar</span>
        <h2 className="h1">Signal, pain, entry offer.</h2>
        <p className="lead">Each row maps an external market signal to what SMEs feel, and the lowest-friction advisory entry point that matches.</p>
      </div>
      <Radar />
    </div>

  </div>
);

window.DashboardView = DashboardView;
