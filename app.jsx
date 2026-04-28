// SME Insight Platform — main app (swipe navigation, tweaks, shell)

const { useState, useEffect, useRef, useCallback, useMemo } = React;

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard', num: '01' },
  { id: 'brain',     label: 'Transcript Brain', num: '02' },
  { id: 'actions',   label: 'Evidence → Action', num: '03' },
];

const SECTORS = ['All sectors (avg.)', 'Tourism', 'Retail', 'Manufacturing', 'Agri-food', 'Services'];

const DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "dashboardLayout": "stacked",
  "brainViz": "force",
  "citations": true,
  "sector": "All sectors (avg.)",
  "audience": "all"
}/*EDITMODE-END*/;

// Tweak options
const LAYOUTS = [
  { id: 'stacked',  label: 'A. Stacked panels',   sub: 'as in the ideation doc' },
  { id: 'leftnav',  label: 'B. Left nav + canvas', sub: 'classic dashboard' },
  { id: 'split',    label: 'C. Split signals/evidence', sub: 'side by side' },
  { id: 'notion',   label: 'D. Document with widgets', sub: 'reading-first' },
  { id: 'command',  label: 'E. Search-first console', sub: 'Ask the Brain on top' },
];
const BRAIN_VIZ = [
  { id: 'force',     label: 'Force-directed graph' },
  { id: 'constellation', label: 'Constellation / starfield' },
  { id: 'sankey',    label: 'Barrier → Trigger → Proof' },
];

function Arrow({ dir = 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d={dir === 'right' ? 'M5 12 L19 12 M13 6 L19 12 L13 18' : 'M19 12 L5 12 M11 6 L5 12 L11 18'}
        stroke="#1d1d1b" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="6.5" stroke="#6b6b66" strokeWidth="2"/>
      <path d="M16 16 L21 21" stroke="#6b6b66" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function Topbar({ sector, setSector, tweaksOpen, toggleTweaks }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="brand-mark">SIP</div>
        <div>
          <div className="brand-name">SME Insight Platform</div>
          <div className="brand-sub">Wireframes · v0.1 · fictional data</div>
        </div>
      </div>
      <div className="search" role="search" aria-label="Ask the SME Brain">
        <SearchIcon />
        <span>Ask the SME Brain — e.g. "trust", "referrals", "compliance fatigue"…</span>
        <span className="label" style={{ marginLeft: 'auto', color: 'var(--pencil)', fontSize: 11 }}>⌘K</span>
      </div>
      <div className="chips" aria-label="Global filters">
        <span className="chip active">Sector: {sector} <span className="x">×</span></span>
        <span className="chip">Size: all</span>
        <span className="chip">Stage: all</span>
        <span className="chip">+ add filter</span>
      </div>
      <button className="navbtn" onClick={toggleTweaks} title="Toggle Tweaks" aria-label="Toggle tweaks panel">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="7" r="2.5" stroke="#1d1d1b" strokeWidth="2"/>
          <circle cx="18" cy="17" r="2.5" stroke="#1d1d1b" strokeWidth="2"/>
          <path d="M4 17 L15 17 M9 7 L20 7" stroke="#1d1d1b" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

function ViewTabs({ activeIdx, go, next, prev }) {
  return (
    <div className="tabs">
      {VIEWS.map((v, i) => (
        <div key={v.id}
             className={'tab ' + (i === activeIdx ? 'active' : '')}
             onClick={() => go(i)}>
          <span className="num">{v.num}</span>{v.label}
        </div>
      ))}
      <div className="tab-right">
        <div className="pagedots" title="View position">
          {VIEWS.map((_, i) => (
            <span key={i} className={'pagedot ' + (i === activeIdx ? 'active' : '')} />
          ))}
        </div>
        <button className="navbtn" onClick={prev} aria-label="Previous view" title="← previous (swipes whole screen left)"><Arrow dir="left" /></button>
        <button className="navbtn" onClick={next} aria-label="Next view" title="→ next (cycles through)"><Arrow dir="right" /></button>
      </div>
    </div>
  );
}

function Tweaks({ open, close, state, setState }) {
  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  return (
    <div className={'tweaks ' + (open ? '' : 'hidden')}>
      <h3>Tweaks <span className="x" onClick={close}>close ✕</span></h3>
      <div className="tweak-body">
        <div className="tweak-row">
          <label>Density</label>
          <div className="seg">
            <button className={state.density === 'compact' ? 'active' : ''} onClick={() => set('density', 'compact')}>Compact</button>
            <button className={state.density === 'comfortable' ? 'active' : ''} onClick={() => set('density', 'comfortable')}>Comfortable</button>
          </div>
        </div>

        <div className="tweak-row">
          <label>Dashboard layout (5 variations)</label>
          <select className="selectlike" value={state.dashboardLayout} onChange={e => set('dashboardLayout', e.target.value)}>
            {LAYOUTS.map(l => <option key={l.id} value={l.id}>{l.label} — {l.sub}</option>)}
          </select>
        </div>

        <div className="tweak-row">
          <label>Transcript Brain visualisation</label>
          <div className="seg">
            {BRAIN_VIZ.map(v => (
              <button key={v.id} className={state.brainViz === v.id ? 'active' : ''} onClick={() => set('brainViz', v.id)}>
                {v.id === 'force' ? 'Force' : v.id === 'constellation' ? 'Stars' : 'Sankey'}
              </button>
            ))}
          </div>
        </div>

        <div className="tweak-row">
          <label>Source citations</label>
          <div className={'toggle ' + (state.citations ? 'on' : '')} onClick={() => set('citations', !state.citations)}>
            <span className="dot" /> {state.citations ? 'Shown' : 'Hidden'}
          </div>
        </div>

        <div className="tweak-row">
          <label>Sector focus</label>
          <select className="selectlike" value={state.sector} onChange={e => set('sector', e.target.value)}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="tweak-row">
          <label>Audience voice</label>
          <div className="seg">
            <button className={state.audience === 'academic' ? 'active' : ''} onClick={() => set('audience', 'academic')}>Academic</button>
            <button className={state.audience === 'commercial' ? 'active' : ''} onClick={() => set('audience', 'commercial')}>Commercial</button>
            <button className={state.audience === 'board' ? 'active' : ''} onClick={() => set('audience', 'board')}>Board</button>
            <button className={state.audience === 'all' ? 'active' : ''} onClick={() => set('audience', 'all')}>All</button>
          </div>
        </div>

        <div className="tweak-row" style={{ fontFamily: "'Kalam', cursive", fontWeight: 300, fontSize: 12, color: 'var(--pencil)' }}>
          Swipe the stage with ← → arrow keys, the circular arrows in the top-right, or by clicking tabs.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('sip-state') || 'null');
      return { ...DEFAULTS, ...(saved || {}) };
    } catch { return DEFAULTS; }
  });
  const [activeIdx, setActiveIdx] = useState(() => {
    const n = parseInt(localStorage.getItem('sip-view') || '0', 10);
    return isNaN(n) ? 0 : n;
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [editModeActive, setEditModeActive] = useState(false);

  useEffect(() => { localStorage.setItem('sip-state', JSON.stringify(state)); }, [state]);
  useEffect(() => { localStorage.setItem('sip-view', String(activeIdx)); }, [activeIdx]);

  // Edit mode protocol
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') { setEditModeActive(true); setTweaksOpen(true); }
      if (e.data?.type === '__deactivate_edit_mode') { setEditModeActive(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // persist edits upstream
  const setStateWithHost = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*'); } catch {}
      return next;
    });
  }, []);

  const go = (i) => setActiveIdx(((i % VIEWS.length) + VIEWS.length) % VIEWS.length);
  const next = () => go(activeIdx + 1);
  const prev = () => go(activeIdx - 1);

  // Keyboard arrows
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx]);

  return (
    <div className="app" data-density={state.density} data-citations={state.citations ? 'on' : 'off'}>
      <Topbar sector={state.sector} setSector={s => setStateWithHost(st => ({...st, sector: s}))}
              tweaksOpen={tweaksOpen} toggleTweaks={() => setTweaksOpen(o => !o)} />
      <ViewTabs activeIdx={activeIdx} go={go} next={next} prev={prev} />
      <div className="stage">
        <div className="stage-track" style={{ transform: `translateX(-${activeIdx * 100}%)` }}>
          <div className="view" aria-hidden={activeIdx !== 0}>
            <div className="view-inner">
              <DashboardView state={state} />
            </div>
          </div>
          <div className="view" aria-hidden={activeIdx !== 1}>
            <div className="view-inner">
              <BrainView state={state} />
            </div>
          </div>
          <div className="view" aria-hidden={activeIdx !== 2}>
            <div className="view-inner">
              <ActionsView state={state} />
            </div>
          </div>
        </div>
      </div>
      <Tweaks open={tweaksOpen} close={() => setTweaksOpen(false)} state={state} setState={setStateWithHost} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
