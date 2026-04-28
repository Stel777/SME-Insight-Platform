// Transcript Brain — 3 viz modes + quote drawer

const BRAIN_NODES = [
  // themes
  { id: 'trust',      label: 'Trust',           type: 'theme',   n: 28, x: 0.42, y: 0.42 },
  { id: 'referrals',  label: 'Referrals',       type: 'theme',   n: 22, x: 0.28, y: 0.30 },
  { id: 'cost',       label: 'Cost / ROI',      type: 'theme',   n: 19, x: 0.58, y: 0.60 },
  { id: 'jargon',     label: 'Jargon fatigue',  type: 'theme',   n: 17, x: 0.58, y: 0.28 },
  { id: 'compfat',    label: 'Compliance fatigue', type: 'theme', n: 15, x: 0.70, y: 0.45 },
  { id: 'speed',      label: 'Speed',           type: 'theme',   n: 11, x: 0.48, y: 0.70 },
  { id: 'sectorfit',  label: 'Sector fit',      type: 'theme',   n: 13, x: 0.22, y: 0.55 },
  { id: 'digital',    label: 'Digital readiness', type: 'theme', n: 10, x: 0.80, y: 0.28 },
  // barriers
  { id: 'b-expensive', label: '"Too expensive"', type: 'barrier', n: 14, x: 0.15, y: 0.75 },
  { id: 'b-notforus',  label: '"Not for firms like us"', type: 'barrier', n: 9, x: 0.08, y: 0.40 },
  { id: 'b-salesfear', label: 'Fear of being sold to', type: 'barrier', n: 12, x: 0.38, y: 0.82 },
  // triggers
  { id: 't-bank',      label: 'Bank requirement', type: 'trigger', n: 10, x: 0.88, y: 0.62 },
  { id: 't-reg',       label: 'New regulation',   type: 'trigger', n: 11, x: 0.90, y: 0.40 },
  { id: 't-crisis',    label: 'Crisis',           type: 'trigger', n: 6,  x: 0.72, y: 0.78 },
  // proof
  { id: 'p-peer',      label: 'Peer endorsement', type: 'proof',   n: 16, x: 0.18, y: 0.15 },
  { id: 'p-pilot',     label: 'Pilot results',    type: 'proof',   n: 13, x: 0.42, y: 0.10 },
  { id: 'p-scope',     label: 'Clear scope/price',type: 'proof',   n: 15, x: 0.62, y: 0.10 },
  { id: 'p-sector',    label: 'Sector expertise', type: 'proof',   n: 9,  x: 0.82, y: 0.12 },
];

const BRAIN_EDGES = [
  ['trust', 'referrals', 18], ['trust', 'cost', 9], ['trust', 'sectorfit', 11],
  ['trust', 'p-peer', 14], ['trust', 'p-pilot', 8], ['referrals', 'p-peer', 12],
  ['cost', 'b-expensive', 11], ['cost', 'p-scope', 10], ['cost', 'speed', 6],
  ['jargon', 'trust', 7], ['jargon', 'b-notforus', 5],
  ['compfat', 't-reg', 9], ['compfat', 't-bank', 7], ['compfat', 'digital', 4],
  ['speed', 'p-pilot', 7], ['sectorfit', 'p-sector', 8],
  ['b-salesfear', 'trust', 6], ['b-salesfear', 'p-scope', 5],
  ['b-expensive', 'p-scope', 6], ['b-notforus', 'p-sector', 4],
  ['t-crisis', 'cost', 5], ['digital', 'jargon', 5],
];

const TYPE_COLOR = {
  theme:   { fill: '#f6d43a', stroke: '#1d1d1b' },
  barrier: { fill: '#fff',    stroke: '#1d1d1b' },
  trigger: { fill: '#c7c4b8', stroke: '#1d1d1b' },
  proof:   { fill: '#fbe98a', stroke: '#1d1d1b' },
};

const QUOTES = {
  trust: [
    { t: 'Before we signed anything, I called two people I know in the sector. That\'s how we decide.', tags: ['Retail', 'Small', 'Consideration', 'I-04'] },
    { t: 'The proposal was fine, but we didn\'t know them. Trust came later, after a short pilot.', tags: ['Services', 'Medium', 'Engagement', 'I-09'] },
  ],
  referrals: [
    { t: 'Our accountant mentioned them. That\'s the only reason we opened the door.', tags: ['Manufacturing', 'Small', 'Awareness', 'I-02'] },
  ],
  cost: [
    { t: 'Open-ended scope kills it for us. Just tell me the number.', tags: ['Retail', 'Micro', 'Consideration', 'I-11'] },
  ],
  compfat: [
    { t: 'We only engaged when our bank asked for it — and even then, we wanted someone who wouldn\'t overcomplicate it.', tags: ['Retail', 'Small', 'Trigger', 'I-07'] },
  ],
};

const BrainView = ({ state }) => {
  const [mode, setMode] = useState(state.brainViz || 'force');
  useEffect(() => { setMode(state.brainViz); }, [state.brainViz]);
  const [selected, setSelected] = useState('trust');

  return (
    <div className="col">
      <div className="panel">
        <div className="panel-title">
          <h2>Transcript Brain</h2>
          <span className="meta">interview-derived knowledge graph · fictional coding</span>
        </div>

        <div className="row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'center', marginBottom: 12 }}>
          <div className="seg" style={{ width: 'auto' }}>
            <button className={mode === 'force' ? 'active' : ''} onClick={() => setMode('force')}>Force graph</button>
            <button className={mode === 'constellation' ? 'active' : ''} onClick={() => setMode('constellation')}>Constellation</button>
            <button className={mode === 'sankey' ? 'active' : ''} onClick={() => setMode('sankey')}>Barrier → Trigger → Proof</button>
          </div>
          <span className="hand-note" style={{ fontSize: 13, color: 'var(--pencil)' }}>
            modes apply the same data — this is where examiners see method transparency.
          </span>
          <div style={{ marginLeft: 'auto' }}>
            <span className="tag">Sector: All</span>
            <span className="tag">Size: All</span>
            <span className="tag">Stage: All</span>
          </div>
        </div>

        <div className={'brain-wrap ' + (mode === 'constellation' ? 'constellation' : '')} style={{ minHeight: 540 }}>
          {mode === 'force' && <ForceGraph onSelect={setSelected} selected={selected} />}
          {mode === 'constellation' && <Constellation onSelect={setSelected} selected={selected} />}
          {mode === 'sankey' && <Sankey onSelect={setSelected} selected={selected} />}

          <QuoteDrawer selected={selected} />

          <div className="legend">
            <div className="row"><span className="sw" style={{ background: TYPE_COLOR.theme.fill }}/> Theme</div>
            <div className="row"><span className="sw" style={{ background: TYPE_COLOR.barrier.fill }}/> Barrier</div>
            <div className="row"><span className="sw" style={{ background: TYPE_COLOR.trigger.fill }}/> Trigger</div>
            <div className="row"><span className="sw" style={{ background: TYPE_COLOR.proof.fill }}/> Proof</div>
            <div className="hand-note" style={{ fontSize: 11, color: 'var(--pencil)', marginTop: 4 }}>node size = frequency · edge width = co-occurrence</div>
          </div>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="panel">
          <div className="panel-title"><h2>Strongest edges</h2><span className="meta">top 5</span></div>
          <ul className="bullets">
            <li><b>Trust ↔ Referrals</b> — 18<span className="citation">[I-02,04,07,…]</span></li>
            <li><b>Trust ↔ Peer endorsement</b> — 14</li>
            <li><b>Referrals ↔ Peer endorsement</b> — 12</li>
            <li><b>Cost ↔ "Too expensive"</b> — 11</li>
            <li><b>Compliance fatigue ↔ New regulation</b> — 9</li>
          </ul>
        </div>
        <div className="panel">
          <div className="panel-title"><h2>Persona clusters</h2><span className="meta">by mindset, not size</span></div>
          <ul className="bullets">
            <li>🟡 Cost-pressured pragmatists <span className="tag">n=6</span></li>
            <li>🟡 Growth-oriented, bandwidth-limited <span className="tag">n=4</span></li>
            <li>🟡 Compliance- / bank-driven <span className="tag">n=5</span></li>
            <li>🟡 Digitally curious, unsure <span className="tag">n=3</span></li>
          </ul>
        </div>
        <div className="panel">
          <div className="panel-title"><h2>Method transparency</h2><span className="meta">for examiners</span></div>
          <ul className="bullets">
            <li>Nodes come from the codebook (18 themes, 4 types).</li>
            <li>Edges = co-occurrence in same answer unit.</li>
            <li>All quotes anonymised [PERSON_A], [COMPANY_n].</li>
            <li>Edge weights normalised by theme frequency.</li>
          </ul>
          <span className="evidence-link" style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 12, borderBottom: '1px dashed var(--pencil)', cursor: 'pointer' }}>open full method note →</span>
        </div>
      </div>

      <div className="viewfoot">
        <span>View 02 · Transcript Brain — fictional coding; replace with real transcripts when uploaded.</span>
        <span>→ swipe to 03 · Evidence → Action</span>
      </div>
    </div>
  );
};

// ---------- Force-directed (pseudo — positions are hand-placed) ----------
const ForceGraph = ({ onSelect, selected }) => {
  const w = 1000, h = 540;
  const byId = Object.fromEntries(BRAIN_NODES.map(n => [n.id, n]));
  const pos = (n) => ({ x: n.x * w, y: n.y * h });
  const radius = (n) => 10 + n.n * 0.8;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 540 }}>
      <defs>
        <pattern id="paper" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 0 L20 0" stroke="rgba(29,29,27,.03)" strokeWidth="1"/>
        </pattern>
      </defs>
      {/* edges */}
      {BRAIN_EDGES.map(([a, b, w_], i) => {
        const A = pos(byId[a]), B = pos(byId[b]);
        const active = selected === a || selected === b;
        return (
          <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke={active ? '#8a6b00' : '#6b6b66'}
                strokeOpacity={active ? 0.9 : 0.4}
                strokeWidth={Math.max(1, w_ * 0.3)} />
        );
      })}
      {/* nodes */}
      {BRAIN_NODES.map(n => {
        const { x, y } = pos(n);
        const r = radius(n);
        const c = TYPE_COLOR[n.type];
        const active = selected === n.id;
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
            <circle cx={x} cy={y} r={r}
                    fill={c.fill} stroke={c.stroke}
                    strokeWidth={active ? 3 : 1.8} />
            <text x={x} y={y + r + 12} textAnchor="middle"
                  fontFamily="'Architects Daughter', cursive" fontSize={12}
                  fill="#1d1d1b">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Constellation / starfield ----------
const Constellation = ({ onSelect, selected }) => {
  const w = 1000, h = 540;
  const byId = Object.fromEntries(BRAIN_NODES.map(n => [n.id, n]));
  const pos = (n) => ({ x: n.x * w, y: n.y * h });

  // scatter little stars
  const stars = Array.from({ length: 80 }, (_, i) => {
    const r = (i * 37 + 13) % 997;
    return { x: (r * 17 % w), y: ((r * 29 + i * 41) % h), s: ((r % 3) + 0.5) };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 540 }}>
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.s * 0.6} fill="#1d1d1b" opacity="0.18"/>
      ))}
      {/* constellation lines — drawn as faint, dotted */}
      {BRAIN_EDGES.map(([a, b, w_], i) => {
        const A = pos(byId[a]), B = pos(byId[b]);
        const active = selected === a || selected === b;
        return (
          <line key={i} x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                stroke={active ? '#8a6b00' : '#1d1d1b'}
                strokeOpacity={active ? 0.7 : 0.22}
                strokeDasharray="1,4"
                strokeWidth={Math.max(0.8, w_ * 0.2)} />
        );
      })}
      {/* stars-as-nodes */}
      {BRAIN_NODES.map(n => {
        const { x, y } = pos(n);
        const size = 6 + n.n * 0.4;
        const active = selected === n.id;
        // 4-point star
        const pts = [
          [x, y - size], [x + size*0.35, y - size*0.35],
          [x + size, y], [x + size*0.35, y + size*0.35],
          [x, y + size], [x - size*0.35, y + size*0.35],
          [x - size, y], [x - size*0.35, y - size*0.35],
        ].map(p => p.join(',')).join(' ');
        const c = TYPE_COLOR[n.type];
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
            {active && <circle cx={x} cy={y} r={size + 8} fill={c.fill} opacity="0.35" />}
            <polygon points={pts} fill={c.fill} stroke={c.stroke} strokeWidth={active ? 2 : 1.4} />
            <text x={x} y={y + size + 14} textAnchor="middle"
                  fontFamily="'Caveat', cursive" fontSize={15}
                  fill="#1d1d1b" fontWeight={active ? 700 : 400}>{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Sankey: Barrier → Trigger → Proof ----------
const Sankey = ({ onSelect, selected }) => {
  const w = 1000, h = 540;
  const barriers = BRAIN_NODES.filter(n => n.type === 'barrier');
  const triggers = BRAIN_NODES.filter(n => n.type === 'trigger');
  const proofs   = BRAIN_NODES.filter(n => n.type === 'proof');
  const themes   = BRAIN_NODES.filter(n => n.type === 'theme').slice(0, 4);

  const colX = [80, 360, 640, 920];
  const layCol = (arr, x) => arr.map((n, i) => ({ ...n, cx: x, cy: 60 + (i * (h - 120)) / Math.max(1, arr.length - 1) }));

  const cols = [layCol(barriers, colX[0]), layCol(themes, colX[1]), layCol(triggers, colX[2]), layCol(proofs, colX[3])];
  const byId = Object.fromEntries(cols.flat().map(n => [n.id, n]));

  // fabricated flow paths
  const flows = [
    ['b-expensive', 'cost', 11], ['cost', 'p-scope', 10],
    ['b-expensive', 'trust', 4], ['trust', 'p-peer', 14],
    ['b-salesfear', 'trust', 6], ['trust', 'p-pilot', 8],
    ['b-notforus', 'sectorfit', 4], ['sectorfit', 'p-sector', 8],
    ['compfat', 't-reg', 9], ['t-reg', 'p-scope', 5],
    ['compfat', 't-bank', 7], ['t-bank', 'p-pilot', 4],
  ];
  // connect themes middle column to trigger col flows indirectly — simplified

  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: 540 }}>
      {/* column labels */}
      {['Barrier', 'Theme', 'Trigger', 'Proof'].map((l, i) => (
        <text key={l} x={colX[i]} y={28} textAnchor="middle"
              fontFamily="'Architects Daughter', cursive" fontSize={13} fill="#6b6b66">
          {l.toUpperCase()}
        </text>
      ))}
      {/* flow curves */}
      {flows.map(([a, b, w_], i) => {
        const A = byId[a], B = byId[b];
        if (!A || !B) return null;
        const mid = (A.cx + B.cx) / 2;
        const d = `M${A.cx + 14},${A.cy} C${mid},${A.cy} ${mid},${B.cy} ${B.cx - 14},${B.cy}`;
        const active = selected === a || selected === b;
        return (
          <path key={i} d={d}
                stroke={active ? '#8a6b00' : '#6b6b66'}
                strokeOpacity={active ? 0.8 : 0.35}
                strokeWidth={Math.max(2, w_ * 0.9)}
                fill="none" strokeLinecap="round" />
        );
      })}
      {/* nodes */}
      {cols.flat().map(n => {
        const c = TYPE_COLOR[n.type];
        const r = 10 + n.n * 0.5;
        const active = selected === n.id;
        return (
          <g key={n.id} onClick={() => onSelect(n.id)} style={{ cursor: 'pointer' }}>
            <rect x={n.cx - 14} y={n.cy - r/2} width={28} height={r}
                  rx={3} fill={c.fill} stroke={c.stroke}
                  strokeWidth={active ? 2.5 : 1.5} />
            <text x={n.cx} y={n.cy + r/2 + 14} textAnchor="middle"
                  fontFamily="'Architects Daughter', cursive" fontSize={11}
                  fill="#1d1d1b">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Quote drawer ----------
const QuoteDrawer = ({ selected }) => {
  const node = BRAIN_NODES.find(n => n.id === selected);
  const qs = QUOTES[selected] || [
    { t: '[placeholder] anonymised excerpt linked to this node — drawer will fill in once transcripts are uploaded.', tags: ['placeholder'] }
  ];
  if (!node) return null;
  return (
    <div className="quote-drawer">
      <h4>{node.label}</h4>
      <div className="mono" style={{ color: 'var(--pencil)', marginBottom: 6 }}>
        {node.type} · n={node.n} quotes
      </div>
      <div className="tags">
        {node.type === 'theme' && <><span className="tag sector">All sectors</span><span className="tag size">All sizes</span></>}
      </div>
      {qs.map((q, i) => (
        <blockquote key={i}>
          "{q.t}"
          <div style={{ fontSize: 10, color: 'var(--pencil)', marginTop: 4 }}>
            {q.tags.map((t, j) => <span key={j} className="tag">{t}</span>)}
          </div>
        </blockquote>
      ))}
      <div className="evidence-link" style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 11, borderBottom: '1px dashed var(--pencil)', cursor: 'pointer' }}>
        use this cluster in Evidence → Action →
      </div>
    </div>
  );
};

window.BrainView = BrainView;
