// Evidence → Action v2 — Apple-inspired

const { useState: useStateA } = React;

const THEMES = ['Trust', 'Referrals', 'Cost / ROI', 'Scope clarity', 'Jargon fatigue',
  'Compliance fatigue', 'Speed', 'Sector fit', 'Peer endorsement', 'Pilot results'];

const PERSONAS = [
  { id: 'cpp', label: 'Cost-pressured pragmatists', themes: ['Cost / ROI', 'Scope clarity', 'Speed'] },
  { id: 'gbl', label: 'Growth, bandwidth-limited',  themes: ['Speed', 'Sector fit', 'Pilot results'] },
  { id: 'cbd', label: 'Compliance / bank-driven',   themes: ['Compliance fatigue', 'Trust', 'Scope clarity'] },
  { id: 'dcu', label: 'Digitally curious, unsure',  themes: ['Jargon fatigue', 'Pilot results', 'Peer endorsement'] },
];

const RECIPE = () => ({
  message: [
    'Plain language — drop "transformation", "maturity", "roadmap".',
    'Outcome-first framing — what changes in 4–6 weeks.',
    'Specify scope and fee on the first page.',
  ],
  channels: [
    'Accountant & bank ecosystem referrals.',
    'Sector associations and chamber events.',
    'Peer roundtables — 3–5 SMEs, same size band.',
  ],
  offer: [
    'Fixed-fee diagnostic — two weeks, one deliverable.',
    'Clinic — 90-minute group session on the regulation.',
    'Staged pilot — diagnostic, 30-day pilot, gate.',
  ],
  proof: [
    'One-page micro-case from the same sector.',
    'Named peer endorsement, where permitted.',
    'Sample deliverable preview.',
  ],
});

const ActionsView = () => {
  const [mode, setMode] = useStateA('picker');
  return (
    <div className="view-inner">
      <div className="section" style={{ marginTop: 0 }}>
        <span className="eyebrow">Evidence → Action</span>
        <h1 className="display" style={{ margin: '14px 0 18px' }}>Insight, translated.</h1>
        <p className="lead" style={{ maxWidth: 640 }}>
          Four interaction models, one rules engine. Each output is a 4-box recipe — message, channel, offer, proof — with the supporting evidence one click away.
        </p>
        <div className="seg" style={{ marginTop: 32 }}>
          <button className={mode === 'picker' ? 'active' : ''} onClick={() => setMode('picker')}>Cluster picker</button>
          <button className={mode === 'wizard' ? 'active' : ''} onClick={() => setMode('wizard')}>Guided wizard</button>
          <button className={mode === 'canvas' ? 'active' : ''} onClick={() => setMode('canvas')}>Drag on canvas</button>
          <button className={mode === 'compare' ? 'active' : ''} onClick={() => setMode('compare')}>Compare personas</button>
        </div>
      </div>

      {mode === 'picker' && <Picker />}
      {mode === 'wizard' && <Wizard />}
      {mode === 'canvas' && <Canvas />}
      {mode === 'compare' && <Compare />}
    </div>
  );
};

const FourBox = ({ compact }) => {
  const rec = RECIPE();
  return (
    <div className="rec-grid">
      {[['01', 'Message principles', rec.message],
        ['02', 'Recommended channel', rec.channels],
        ['03', 'Entry offer', rec.offer],
        ['04', 'Proof elements', rec.proof]].map(([n, t, items]) => (
        <div className="rec" key={n}>
          <div className="rec-num">{n}</div>
          <h3 className="h3">{t}</h3>
          <ul>{items.map((x, i) => <li key={i}>{x}</li>)}</ul>
          {!compact && <button className="btn btn-ghost" style={{ padding: 0, marginTop: 16 }}>View evidence</button>}
        </div>
      ))}
    </div>
  );
};

const Picker = () => {
  const [picked, setPicked] = useStateA(['Trust', 'Referrals', 'Sector fit']);
  const toggle = (t) => setPicked(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  return (
    <>
      <div className="section">
        <span className="eyebrow">Step 1</span>
        <h2 className="h2" style={{ margin: '8px 0 20px' }}>Pick a theme cluster, or a persona.</h2>
        <div className="cluster-bar">
          {THEMES.map(t => (
            <span key={t} className={'chip ' + (picked.includes(t) ? 'picked' : '')} onClick={() => toggle(t)}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {PERSONAS.map(p => (
            <span key={p.id} className="pill" style={{ cursor: 'pointer', padding: '8px 16px' }}
                  onClick={() => setPicked(p.themes)}>{p.label}</span>
          ))}
        </div>
      </div>
      <div className="section">
        <span className="eyebrow">Step 2</span>
        <h2 className="h2" style={{ margin: '8px 0 28px' }}>Your recipe.</h2>
        <FourBox />
      </div>
    </>
  );
};

const Wizard = () => {
  const [step, setStep] = useStateA(0);
  const steps = ['Barrier', 'Profile', 'Stage', 'Recipe'];
  return (
    <div className="section">
      <div className="wizard">
        <div className="wizard-steps">
          {steps.map((s, i) => (
            <div key={i} className={'wiz-step ' + (i === step ? 'active' : i < step ? 'done' : '')} onClick={() => setStep(i)}>
              <span className="num">Step {i + 1}</span>
              <span className="label">{s}</span>
            </div>
          ))}
        </div>
        {step === 0 && (
          <div className="grid grid-3">
            {['"Too expensive"', '"Not for firms like us"', 'Fear of being sold to',
              'Jargon fatigue', 'Scope anxiety', 'Compliance fatigue'].map(b => (
              <div key={b} className="card" style={{ background: '#fff', cursor: 'pointer', padding: 24 }} onClick={() => setStep(1)}>
                <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{b}</div>
                <div className="small">Linked to 3–6 themes</div>
              </div>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-2">
            {PERSONAS.map(p => (
              <div key={p.id} className="card" style={{ background: '#fff', cursor: 'pointer' }} onClick={() => setStep(2)}>
                <div className="h3" style={{ marginBottom: 6 }}>{p.label}</div>
                <div className="small">Common themes: {p.themes.join(', ')}</div>
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="grid grid-3">
            {['Awareness', 'Consideration', 'Engagement'].map(s => (
              <div key={s} className="card" style={{ background: s === 'Consideration' ? 'var(--accent-soft)' : '#fff', cursor: 'pointer' }} onClick={() => setStep(3)}>
                <div className="h3">{s}</div>
              </div>
            ))}
          </div>
        )}
        {step === 3 && <FourBox />}
      </div>
    </div>
  );
};

const Canvas = () => (
  <div className="section">
    <div className="canvas-mode">
      <div className="palette">
        <span className="eyebrow" style={{ marginBottom: 8 }}>Palette</span>
        {THEMES.map(t => <span key={t} className="pill" style={{ cursor: 'grab', justifyContent: 'flex-start' }}>⋮⋮ {t}</span>)}
      </div>
      <div className="drop-zone">
        <div className="floater accent" style={{ top: 60, left: 80 }}>Trust</div>
        <div className="floater accent" style={{ top: 120, left: 240 }}>Referrals</div>
        <div className="floater accent" style={{ top: 220, left: 140 }}>Sector fit</div>
        <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} viewBox="0 0 500 400" preserveAspectRatio="none">
          <path d="M130,80 C180,100 210,115 250,130" stroke="#F85519" strokeWidth="1.5" fill="none" strokeDasharray="4,4"/>
          <path d="M160,140 C180,190 190,220 180,230" stroke="#F85519" strokeWidth="1.5" fill="none" strokeDasharray="4,4"/>
        </svg>
      </div>
      <div>
        <span className="eyebrow" style={{ marginBottom: 12, display: 'block' }}>Live recipe</span>
        <div className="rec-grid" style={{ gridTemplateColumns: '1fr', gap: 12 }}>
          <FourBox compact />
        </div>
      </div>
    </div>
  </div>
);

const Compare = () => {
  const [a, setA] = useStateA('cpp');
  const [b, setB] = useStateA('cbd');
  return (
    <div className="section">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 32, flexWrap: 'wrap' }}>
        <span className="small">Compare</span>
        <select className="select" style={{ width: 260 }} value={a} onChange={e => setA(e.target.value)}>
          {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
        <span className="small">vs</span>
        <select className="select" style={{ width: 260 }} value={b} onChange={e => setB(e.target.value)}>
          {PERSONAS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>
      </div>
      <div className="compare">
        <div>
          <div className="col-head">{PERSONAS.find(p => p.id === a).label}</div>
          <FourBox compact />
        </div>
        <div>
          <div className="col-head">{PERSONAS.find(p => p.id === b).label}</div>
          <FourBox compact />
        </div>
      </div>
    </div>
  );
};

window.ActionsView = ActionsView;
