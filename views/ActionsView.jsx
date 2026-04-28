// Evidence → Action view — explores 3 interaction models side-by-side via sub-tabs

const THEMES = ['Trust', 'Referrals', 'Cost / ROI', 'Scope clarity', 'Jargon fatigue',
  'Compliance fatigue', 'Speed', 'Sector fit', 'Peer endorsement', 'Pilot results'];

const PERSONAS = [
  { id: 'cpp', label: 'Cost-pressured pragmatists', themes: ['Cost / ROI', 'Scope clarity', 'Speed'] },
  { id: 'gbl', label: 'Growth-oriented, bandwidth-limited', themes: ['Speed', 'Sector fit', 'Pilot results'] },
  { id: 'cbd', label: 'Compliance / bank-driven', themes: ['Compliance fatigue', 'Trust', 'Scope clarity'] },
  { id: 'dcu', label: 'Digitally curious, unsure', themes: ['Jargon fatigue', 'Pilot results', 'Peer endorsement'] },
];

const RECIPE = (cluster) => ({
  message: [
    'Plain language — avoid "transformation", "maturity", "roadmap"',
    'Outcome-first framing (what changes for the SME in 4–6 weeks)',
    'Specify scope and fee range on the first page',
  ],
  channels: [
    'Accountant / bank ecosystem referrals',
    'Sector associations & chamber events',
    'Peer roundtables (3–5 SMEs, same size band)',
  ],
  offer: [
    'Fixed-fee diagnostic (2 weeks, one deliverable)',
    'Clinic: 90-min group session on the specific regulation',
    'Staged pilot: diagnostic → 30-day pilot → decision gate',
  ],
  proof: [
    'Micro-case from same sector (1 page)',
    'Named peer endorsement (where permitted)',
    'Sample deliverable / template preview',
  ],
});

const ActionsView = ({ state }) => {
  const [mode, setMode] = useState('picker'); // picker | wizard | compare | canvas
  return (
    <div className="col">
      <div className="panel">
        <div className="panel-title">
          <h2>Evidence → Action builder</h2>
          <span className="meta">explore 4 interaction models · same rules engine underneath</span>
        </div>
        <div className="row" style={{ alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div className="seg" style={{ width: 'auto' }}>
            <button className={mode === 'picker' ? 'active' : ''} onClick={() => setMode('picker')}>① Cluster picker</button>
            <button className={mode === 'wizard' ? 'active' : ''} onClick={() => setMode('wizard')}>② Guided wizard</button>
            <button className={mode === 'canvas' ? 'active' : ''} onClick={() => setMode('canvas')}>③ Drag-on-canvas</button>
            <button className={mode === 'compare' ? 'active' : ''} onClick={() => setMode('compare')}>④ Compare personas</button>
          </div>
          <span className="hand-note" style={{ fontSize: 13, color: 'var(--pencil)' }}>
            all four feed the same 4-box output: message · channel · offer · proof.
          </span>
        </div>
      </div>

      {mode === 'picker' && <ModePicker />}
      {mode === 'wizard' && <ModeWizard />}
      {mode === 'canvas' && <ModeCanvas />}
      {mode === 'compare' && <ModeCompare />}

      <div className="viewfoot">
        <span>View 03 · Evidence → Action — explores 4 interaction models for the same output.</span>
        <span>→ swipe cycles back to 01 · Dashboard</span>
      </div>
    </div>
  );
};

// ① ------ Cluster picker: pick themes → 4-box ------
const ModePicker = () => {
  const [picked, setPicked] = useState(['Trust', 'Referrals', 'Sector fit']);
  const toggle = (t) => setPicked(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const rec = RECIPE(picked);
  return (
    <div className="panel">
      <div className="e2a-grid">
        <div className="cluster-picker">
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', marginBottom: 6 }}>1. Pick a theme cluster</div>
          <div>
            {THEMES.map(t => (
              <span key={t} className={'chip ' + (picked.includes(t) ? 'picked' : '')} onClick={() => toggle(t)}>
                {t}
              </span>
            ))}
          </div>
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', margin: '14px 0 6px' }}>or a persona</div>
          <div>
            {PERSONAS.map(p => (
              <div key={p.id} className="chip" style={{ display: 'block', marginBottom: 4, textAlign: 'left', borderRadius: 4 }}
                   onClick={() => setPicked(p.themes)}>
                🟡 {p.label}
              </div>
            ))}
          </div>
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', margin: '14px 0 6px' }}>constraints</div>
          <div>
            <span className="chip">Sector: Retail</span>
            <span className="chip">Size: Small</span>
            <span className="chip">Budget: medium</span>
          </div>

          <div className="hand-note" style={{ marginTop: 14, fontSize: 12, color: 'var(--pencil)' }}>
            Selected: <b>{picked.join(' ↔ ') || '—'}</b>
          </div>
        </div>

        <FourBox rec={rec} />
      </div>
    </div>
  );
};

// ② ------ Wizard: 4 steps ------
const ModeWizard = () => {
  const [step, setStep] = useState(0);
  const steps = ['What\'s the barrier?', 'Which SME profile?', 'Which journey stage?', 'Recommendation'];
  return (
    <div className="panel">
      <div className="wizard-steps">
        {steps.map((s, i) => (
          <div key={i} className={'wizard-step ' + (i === step ? 'active' : i < step ? 'done' : '')} onClick={() => setStep(i)}>
            <span className="step-num">STEP {i + 1}</span>
            {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div>
          <div className="hand" style={{ fontSize: 22, marginBottom: 10 }}>What's the barrier you're designing around?</div>
          <div className="grid grid-3">
            {['"Too expensive"', '"Not for firms like us"', 'Fear of being sold to',
              'Jargon fatigue', 'Scope anxiety', 'Compliance fatigue'].map(b => (
              <div key={b} className="rec-card" style={{ cursor: 'pointer' }} onClick={() => setStep(1)}>
                <div className="hand" style={{ fontSize: 20 }}>{b}</div>
                <div className="hand-note" style={{ fontSize: 12, color: 'var(--pencil)' }}>
                  linked to 3–6 themes in the Brain
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <div>
          <div className="hand" style={{ fontSize: 22, marginBottom: 10 }}>Which SME profile?</div>
          <div className="grid grid-2">
            {PERSONAS.map(p => (
              <div key={p.id} className="rec-card" style={{ cursor: 'pointer' }} onClick={() => setStep(2)}>
                <div className="hand" style={{ fontSize: 22 }}>🟡 {p.label}</div>
                <div className="hand-note" style={{ fontSize: 12, color: 'var(--pencil)' }}>
                  common themes: {p.themes.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 2 && (
        <div>
          <div className="hand" style={{ fontSize: 22, marginBottom: 10 }}>Which journey stage?</div>
          <div className="grid grid-3">
            {['Awareness', 'Consideration', 'Engagement'].map(s => (
              <div key={s} className="rec-card" style={{ cursor: 'pointer', background: s === 'Consideration' ? 'var(--accent-soft)' : '' }} onClick={() => setStep(3)}>
                <div className="hand" style={{ fontSize: 24 }}>{s}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {step === 3 && <FourBox rec={RECIPE(['Trust'])} />}
    </div>
  );
};

// ③ ------ Drag on canvas ------
const ModeCanvas = () => (
  <div className="panel">
    <div className="grid" style={{ gridTemplateColumns: '200px 1fr 380px', gap: 16 }}>
      <div>
        <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', marginBottom: 6 }}>theme palette</div>
        <div>
          {THEMES.map(t => (
            <span key={t} className="chip" style={{ display: 'block', marginBottom: 4, cursor: 'grab' }}>⋮⋮ {t}</span>
          ))}
        </div>
      </div>
      <div className="ph" style={{ minHeight: 420, position: 'relative' }}>
        <div className="ph-label">drop themes here · canvas</div>
        {/* fake dropped chips */}
        <span className="chip picked" style={{ position: 'absolute', top: 40, left: 40, background: 'var(--accent)', transform: 'rotate(-4deg)' }}>Trust</span>
        <span className="chip picked" style={{ position: 'absolute', top: 80, left: 140, background: 'var(--accent)', transform: 'rotate(2deg)' }}>Referrals</span>
        <span className="chip picked" style={{ position: 'absolute', top: 160, left: 80, background: 'var(--accent)', transform: 'rotate(-1deg)' }}>Sector fit</span>
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 500 300" preserveAspectRatio="none">
          <path d="M80,50 C120,70 150,80 170,95" stroke="#8a6b00" strokeDasharray="3,3" strokeWidth="2" fill="none"/>
          <path d="M110,100 C120,140 130,160 120,175" stroke="#8a6b00" strokeDasharray="3,3" strokeWidth="2" fill="none"/>
        </svg>
        <div className="anno" style={{ top: 20, right: 20 }}>live recs update →</div>
      </div>
      <div>
        <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', marginBottom: 6 }}>recommendations · live</div>
        <FourBox rec={RECIPE(['Trust'])} compact />
      </div>
    </div>
  </div>
);

// ④ ------ Compare two personas ------
const ModeCompare = () => {
  const [a, setA] = useState('cpp');
  const [b, setB] = useState('cbd');
  const pA = PERSONAS.find(p => p.id === a);
  const pB = PERSONAS.find(p => p.id === b);
  return (
    <div className="panel">
      <div className="row" style={{ gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <span className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase' }}>compare:</span>
        <select className="selectlike" style={{ width: 'auto' }} value={a} onChange={e => setA(e.target.value)}>
          {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <span className="hand" style={{ fontSize: 22 }}>vs</span>
        <select className="selectlike" style={{ width: 'auto' }} value={b} onChange={e => setB(e.target.value)}>
          {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>
      <div className="compare-cols">
        <div>
          <div className="col-head">🟡 {pA.label}</div>
          <FourBox rec={RECIPE(pA.themes)} compact />
        </div>
        <div>
          <div className="col-head">🟡 {pB.label}</div>
          <FourBox rec={RECIPE(pB.themes)} compact />
        </div>
      </div>
    </div>
  );
};

// ------ shared 4-box output ------
const FourBox = ({ rec, compact }) => (
  <div>
    <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', textTransform: 'uppercase', marginBottom: 6 }}>
      2. Recommendation · 4 boxes
    </div>
    <div className="grid grid-2" style={{ gap: 12 }}>
      <div className="rec-card">
        <h4><span className="num">1</span>Message principles</h4>
        <ul>{rec.message.map((m, i) => <li key={i}>{m}</li>)}</ul>
        {!compact && <span className="evidence-link">show supporting quotes →</span>}
      </div>
      <div className="rec-card">
        <h4><span className="num">2</span>Recommended channel</h4>
        <ul>{rec.channels.map((m, i) => <li key={i}>{m}</li>)}</ul>
        {!compact && <span className="evidence-link">show supporting survey data →</span>}
      </div>
      <div className="rec-card">
        <h4><span className="num">3</span>Entry offer (low friction)</h4>
        <ul>{rec.offer.map((m, i) => <li key={i}>{m}</li>)}</ul>
        {!compact && <span className="evidence-link">show rule logic →</span>}
      </div>
      <div className="rec-card">
        <h4><span className="num">4</span>Proof elements</h4>
        <ul>{rec.proof.map((m, i) => <li key={i}>{m}</li>)}</ul>
        {!compact && <span className="evidence-link">show linked quotes →</span>}
      </div>
    </div>
  </div>
);

window.ActionsView = ActionsView;
