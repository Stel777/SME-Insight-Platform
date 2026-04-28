// SME Insight Platform v2 — app shell

const { useState, useEffect, useCallback } = React;

const VIEWS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'brain',     label: 'SME Brain' },
  { id: 'market',    label: 'Market Insights' },
];

const SECTORS = ['All sectors', 'Tourism', 'Retail', 'Manufacturing', 'Agri-food', 'Services'];

const DEFAULTS = {
  density:   'comfortable',
  brainViz:  'force',
  citations: true,
  sector:    'All sectors',
};

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function ChevronLeft()  { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function ChevronRight() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6"  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>; }
function SettingsIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="6" cy="7" r="2" stroke="currentColor" strokeWidth="1.6"/><circle cx="18" cy="17" r="2" stroke="currentColor" strokeWidth="1.6"/><path d="M4 17 L16 17 M8 7 L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>; }

function Topbar() {
  return (
    <div className="topbar">
      <div className="brand brand-centered">
        SME Insight Platform
        <span className="brand-byline">by Stel</span>
      </div>
    </div>
  );
}

function ViewBar({ activeIdx, go, next, prev, onSettings }) {
  return (
    <div className="viewbar">
      <div className="vswitch">
        {VIEWS.map((v, i) => (
          <button key={v.id} className={i === activeIdx ? 'active' : ''} onClick={() => go(i)}>
            {v.label}
          </button>
        ))}
      </div>
      <div className="right">
        <div className="dots">
          {VIEWS.map((_, i) => <span key={i} className={'dot ' + (i === activeIdx ? 'active' : '')} />)}
        </div>
        <button className="navbtn" onClick={prev} aria-label="Previous"><ChevronLeft /></button>
        <button className="navbtn" onClick={next} aria-label="Next"><ChevronRight /></button>
        <button className="iconbtn" onClick={onSettings} aria-label="Settings"><SettingsIcon /></button>
      </div>
    </div>
  );
}

function Tweaks({ open, close, state, setState }) {
  const set = (k, v) => setState(s => ({ ...s, [k]: v }));
  return (
    <div className={'tweaks ' + (open ? '' : 'hidden')}>
      <header>
        <div className="title">Display settings</div>
        <span className="close" onClick={close}>Done</span>
      </header>
      <div className="tweaks-body">
        <div className="tweak-row">
          <label>Density</label>
          <div className="seg" style={{ width: '100%' }}>
            <button style={{ flex: 1 }} className={state.density === 'comfortable' ? 'active' : ''} onClick={() => set('density', 'comfortable')}>Comfortable</button>
            <button style={{ flex: 1 }} className={state.density === 'compact'     ? 'active' : ''} onClick={() => set('density', 'compact')}>Compact</button>
          </div>
        </div>
        <div className="tweak-row">
          <label>SME Brain visualisation</label>
          <select className="select" value={state.brainViz} onChange={e => set('brainViz', e.target.value)}>
            <option value="force">Force-directed graph</option>
            <option value="constellation">Constellation (dark)</option>
            <option value="sankey">Barrier → Trigger → Proof flow</option>
          </select>
        </div>
        <div className="tweak-row">
          <label>Sector focus</label>
          <select className="select" value={state.sector} onChange={e => set('sector', e.target.value)}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="tweak-row">
          <div className={'toggle ' + (state.citations ? 'on' : '')} onClick={() => set('citations', !state.citations)}>
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink)' }}>Source citations</div>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginTop: 2 }}>Show data provenance inline</div>
            </div>
            <span className="toggle-switch" />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [state, setState] = useState(() => {
    try { return { ...DEFAULTS, ...(JSON.parse(localStorage.getItem('sip2-state') || 'null') || {}) }; }
    catch { return DEFAULTS; }
  });
  const [activeIdx, setActiveIdx] = useState(() => {
    const n = parseInt(localStorage.getItem('sip2-view') || '0', 10);
    return isNaN(n) ? 0 : n;
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  useEffect(() => { localStorage.setItem('sip2-state', JSON.stringify(state)); }, [state]);
  useEffect(() => { localStorage.setItem('sip2-view', String(activeIdx)); }, [activeIdx]);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode')   setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent?.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const setStateHost = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { window.parent?.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*'); } catch {}
      return next;
    });
  }, []);

  const go   = (i) => setActiveIdx(((i % VIEWS.length) + VIEWS.length) % VIEWS.length);
  const next = () => go(activeIdx + 1);
  const prev = () => go(activeIdx - 1);

  const goToBrain = () => { go(1); };

  useEffect(() => { window.sipNavigate = go; return () => { delete window.sipNavigate; }; }, [go]);

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIdx]);

  return (
    <div className="app" data-density={state.density} data-citations={state.citations ? 'on' : 'off'}>
      <Topbar />
      <ViewBar activeIdx={activeIdx} go={go} next={next} prev={prev} onSettings={() => setTweaksOpen(o => !o)} />
      <div className="stage">
        <div className="stage-track" style={{ transform: `translateX(-${activeIdx * 100}%)` }}>
          <div className="view"><DashboardView state={state} /></div>
          <div className="view"><BrainView state={state} /></div>
          <div className="view"><MarketView state={state} /></div>
        </div>
      </div>
      <Tweaks open={tweaksOpen} close={() => setTweaksOpen(false)} state={state} setState={setStateHost} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
