// Dashboard view — 5 layout variations

const DashboardView = ({ state }) => {
  const layout = state.dashboardLayout;
  if (layout === 'leftnav')  return <DashLeftNav state={state} />;
  if (layout === 'split')    return <DashSplit state={state} />;
  if (layout === 'notion')   return <DashNotion state={state} />;
  if (layout === 'command')  return <DashCommand state={state} />;
  return <DashStacked state={state} />;
};

// ------ shared bits ------
const MacroTiles = () => (
  <div className="grid grid-4">
    <div className="tile">
      <div className="kicker">SME value added</div>
      <div className="value">€42.8<span style={{ fontSize: 18 }}>B</span></div>
      <div className="trend flat">Stagnating · vs EU avg growth 2.1%<span className="citation">[EC 2025]</span></div>
    </div>
    <div className="tile">
      <div className="kicker">SME employment</div>
      <div className="value">2.21<span style={{ fontSize: 18 }}>M</span></div>
      <div className="trend up">+1.4% YoY<span className="citation">[OECD 2024]</span></div>
    </div>
    <div className="tile">
      <div className="kicker">Micro-firm share</div>
      <div className="value">96.4<span style={{ fontSize: 18 }}>%</span></div>
      <div className="trend flat">dominant structure<span className="citation">[EC 2025]</span></div>
    </div>
    <div className="tile">
      <div className="kicker">Digital intensity (low/v-low)</div>
      <div className="value">61<span style={{ fontSize: 18 }}>%</span></div>
      <div className="trend down">bottom tier EU<span className="citation">[Eurostat]</span></div>
    </div>
  </div>
);

const SectorLens = () => {
  const [active, setActive] = useState('Tourism');
  const sectors = ['Tourism', 'Retail', 'Manufacturing', 'Agri-food', 'Services'];
  return (
    <div>
      <div className="sectortabs">
        {sectors.map(s => (
          <span key={s} className={'sectortab ' + (active === s ? 'active' : '')} onClick={() => setActive(s)}>{s}</span>
        ))}
      </div>
      <div className="grid grid-3">
        <div>
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', marginBottom: 4 }}>SECTOR SIGNALS</div>
          <ul className="bullets">
            <li>Demand recovery plateauing; cost base still elevated<span className="citation">[NBG]</span></li>
            <li>Labour shortages persisting in seasonal roles</li>
            <li>ESG reporting creep from upstream buyers</li>
          </ul>
        </div>
        <div>
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', marginBottom: 4 }}>IMPLICATIONS FOR SMEs</div>
          <ul className="bullets">
            <li><span className="hl">Cashflow squeeze</span> into off-season</li>
            <li>Investment appetite cautious, short-horizon</li>
            <li>Compliance anxiety ↑ without capacity to respond</li>
          </ul>
        </div>
        <div>
          <div className="label" style={{ fontSize: 11, color: 'var(--pencil)', marginBottom: 4 }}>LIKELY NEEDS</div>
          <ul className="bullets">
            <li>Readiness checks (plain, scoped)</li>
            <li>Peer workshops / clinics</li>
            <li>Fixed-fee diagnostic → staged pilot</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const OpportunityRadar = () => (
  <div className="matrix">
    <table>
      <thead>
        <tr>
          <th>External signal</th>
          <th>SME pain point</th>
          <th>Low-friction entry offer</th>
          <th>Evidence</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="signal">New EU sustainability disclosure rules</td>
          <td className="pain">"We don't know if this applies to us"</td>
          <td className="offer">Fixed-scope readiness check</td>
          <td><span className="tag">EC</span><span className="tag">n=4 interviews</span></td>
        </tr>
        <tr>
          <td className="signal">Cost pressure in off-season</td>
          <td className="pain">ROI anxiety on any spend</td>
          <td className="offer">2-week pilot sprint</td>
          <td><span className="tag">NBG Survey</span></td>
        </tr>
        <tr>
          <td className="signal">Digital adoption gap</td>
          <td className="pain">Skills + bandwidth gap</td>
          <td className="offer">Clinic / peer workshop</td>
          <td><span className="tag">Eurostat DII</span><span className="tag">n=6</span></td>
        </tr>
        <tr>
          <td className="signal">Bank-driven funding conditions</td>
          <td className="pain">"It only started when the bank asked"</td>
          <td className="offer">Compliance diagnostic</td>
          <td><span className="tag">Interviews</span></td>
        </tr>
      </tbody>
    </table>
  </div>
);

const SparkTrend = () => (
  <div className="ph" style={{ minHeight: 120, padding: 10 }}>
    <svg viewBox="0 0 300 100" preserveAspectRatio="none" style={{ width: '100%', height: 100 }}>
      <path d="M0,80 C40,60 60,75 100,55 C140,35 160,60 200,40 C240,25 270,45 300,25"
            stroke="#1d1d1b" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M0,90 L300,90" stroke="#9a9a94" strokeDasharray="3,3" strokeWidth="1" />
      <circle cx="300" cy="25" r="4" fill="#f6d43a" stroke="#1d1d1b" strokeWidth="1.5" />
    </svg>
    <div className="ph-label" style={{ position: 'absolute', top: 6, left: 8 }}>trend ~ SME confidence index</div>
  </div>
);

const SparkBars = () => (
  <div className="ph" style={{ minHeight: 120 }}>
    <div className="bars" style={{ width: '100%' }}>
      <div className="bar" style={{ height: '40%' }} data-label="Tour"/>
      <div className="bar hi" style={{ height: '72%' }} data-label="Retail"/>
      <div className="bar" style={{ height: '55%' }} data-label="Manuf"/>
      <div className="bar" style={{ height: '35%' }} data-label="Agri"/>
      <div className="bar" style={{ height: '60%' }} data-label="Serv"/>
    </div>
  </div>
);

const TriangulationHint = () => (
  <div className="panel soft" style={{ background: 'rgba(246,212,58,.18)', padding: '10px 14px' }}>
    <div className="hand" style={{ fontSize: 22 }}>Triangulation at a glance →</div>
    <div className="hand-note" style={{ fontSize: 13 }}>
      <b>Facts</b> (OECD/EC/Eurostat) + <b>Surveys</b> (NBG, Deloitte) + <b>Interviews</b> (the Brain) —
      every tile below links to the evidence behind it.
    </div>
  </div>
);

// =================== LAYOUT A: STACKED ===================
const DashStacked = ({ state }) => (
  <div className="col">
    <TriangulationHint />
    <div className="panel">
      <div className="panel-title">
        <h2>Macro snapshot · Greek SMEs</h2>
        <span className="meta">Layer 1 — facts · refreshed Apr 2026</span>
      </div>
      <MacroTiles />
      <div className="grid grid-2" style={{ marginTop: 'var(--gap)' }}>
        <SparkTrend />
        <SparkBars />
      </div>
    </div>

    <div className="panel">
      <div className="panel-title">
        <h2>Sector lens</h2>
        <span className="meta">pick a tab · signals / implications / needs</span>
      </div>
      <SectorLens />
    </div>

    <div className="panel">
      <div className="panel-title">
        <h2>Opportunity radar</h2>
        <span className="meta">signal → pain → entry offer</span>
      </div>
      <OpportunityRadar />
    </div>

    <div className="viewfoot">
      <span>Layout A · Stacked panels — direct from the ideation doc</span>
      <span>→ swipe to 02 · Transcript Brain</span>
    </div>
  </div>
);

// =================== LAYOUT B: LEFT NAV + CANVAS ===================
const DashLeftNav = ({ state }) => {
  const [active, setActive] = useState('Start here');
  return (
    <div className="row">
      <div className="panel" style={{ width: 220, flexShrink: 0, height: 'fit-content' }}>
        <div className="leftnav">
          <div className="nav-group">
            <div className="nav-group-title">Orientation</div>
            <div className={'nav-item ' + (active === 'Start here' ? 'active' : '')} onClick={() => setActive('Start here')}>Start here <span className="count">2m</span></div>
            <div className="nav-item" onClick={() => setActive('Method')}>Method transparency</div>
          </div>
          <div className="nav-group">
            <div className="nav-group-title">Market signals</div>
            <div className="nav-item">Macro snapshot <span className="count">8</span></div>
            <div className="nav-item">Funding & incentives <span className="count">12</span></div>
            <div className="nav-item">Regulation & compliance <span className="count">9</span></div>
            <div className="nav-item">Digital & operations <span className="count">14</span></div>
            <div className="nav-item">ESG / sustainability <span className="count">7</span></div>
            <div className="nav-item">People / HR <span className="count">5</span></div>
          </div>
          <div className="nav-group">
            <div className="nav-group-title">Sectors</div>
            <div className="nav-item">Tourism</div>
            <div className="nav-item">Retail</div>
            <div className="nav-item">Manufacturing</div>
            <div className="nav-item">Agri-food</div>
            <div className="nav-item">Services</div>
          </div>
          <div className="nav-group">
            <div className="nav-group-title">Evidence</div>
            <div className="nav-item">Research library <span className="count">48</span></div>
            <div className="nav-item">Interview codebook</div>
          </div>
        </div>
      </div>

      <div className="col" style={{ flex: 1, minWidth: 0 }}>
        <div className="panel">
          <div className="panel-title">
            <h2>Start here · 2-minute overview</h2>
            <span className="meta">for new team members</span>
          </div>
          <div style={{ fontFamily: "'Kalam', cursive", fontWeight: 300, lineHeight: 1.6, fontSize: 14 }}>
            <p>The SME Insight Platform combines <span className="hl">macro/sector signals</span>, <span className="hl">large-sample surveys</span>, and <span className="hl">our own interviews</span> into one view — so the
            team can stop relearning the same SME objections every engagement.</p>
            <p>Each page uses a fixed template: <b>5 insights · 2 visuals · what SMEs are saying · recommended next step</b>.</p>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title"><h2>Macro snapshot</h2><span className="meta">Layer 1 — facts</span></div>
          <MacroTiles />
        </div>

        <div className="grid grid-2">
          <div className="panel"><div className="panel-title"><h2>Sector lens</h2><span className="meta">tabs</span></div><SectorLens /></div>
          <div className="panel"><div className="panel-title"><h2>Trend</h2><span className="meta">placeholder</span></div><SparkTrend /></div>
        </div>

        <div className="panel">
          <div className="panel-title"><h2>Opportunity radar</h2><span className="meta">signal → pain → offer</span></div>
          <OpportunityRadar />
        </div>

        <div className="viewfoot">
          <span>Layout B · Left nav + canvas — reads like a "hub"</span>
          <span>→ swipe to 02 · Transcript Brain</span>
        </div>
      </div>
    </div>
  );
};

// =================== LAYOUT C: SPLIT ===================
const DashSplit = ({ state }) => (
  <div className="col">
    <TriangulationHint />
    <div className="grid grid-2">
      <div className="panel">
        <div className="panel-title"><h2>Signals · what's happening</h2><span className="meta">Layer 1–2</span></div>
        <MacroTiles />
        <div style={{ height: 12 }} />
        <SparkTrend />
        <div style={{ height: 12 }} />
        <SectorLens />
      </div>
      <div className="panel">
        <div className="panel-title"><h2>Evidence · what SMEs are saying</h2><span className="meta">Layer 3–4</span></div>
        <div style={{ fontFamily: "'Architects Daughter', cursive", fontSize: 11, color: 'var(--pencil)', marginBottom: 8 }}>TOP THEMES (last 30 days of coding)</div>
        <div className="grid grid-3" style={{ gap: 8 }}>
          {[['Trust', 28], ['Referrals', 22], ['Cost / ROI', 19], ['Jargon fatigue', 17], ['Compliance fatigue', 15], ['Speed', 11]].map(([t, n]) => (
            <div key={t} className="tile" style={{ padding: '8px 10px' }}>
              <div className="kicker">Theme</div>
              <div className="hand" style={{ fontSize: 20, fontWeight: 700 }}>{t}</div>
              <div className="trend flat">n={n} quotes</div>
            </div>
          ))}
        </div>
        <div style={{ height: 12 }} />
        <div className="ph" style={{ minHeight: 180 }}>
          <div className="ph-label">mini Transcript Brain preview → tap to expand on view 02</div>
        </div>
        <div style={{ height: 12 }} />
        <blockquote style={{ borderLeft: '3px solid var(--accent)', margin: 0, padding: '6px 12px', fontFamily: "'Kalam', cursive", fontWeight: 300, fontSize: 14 }}>
          "We only engaged when our bank asked for it — and even then, we wanted someone who wouldn't overcomplicate it."
          <div style={{ fontSize: 11, color: 'var(--pencil)' }}><span className="tag sector">Retail</span><span className="tag size">Small</span><span className="tag stage">Trigger</span> [I-07]</div>
        </blockquote>
      </div>
    </div>
    <div className="panel">
      <div className="panel-title"><h2>Opportunity radar</h2><span className="meta">the bridge between signals & evidence</span></div>
      <OpportunityRadar />
    </div>
    <div className="viewfoot">
      <span>Layout C · Split — signals on the left, SME voice on the right</span>
      <span>→ swipe to 02</span>
    </div>
  </div>
);

// =================== LAYOUT D: NOTION-ISH ===================
const DashNotion = ({ state }) => (
  <div className="panel" style={{ maxWidth: 920, margin: '0 auto' }}>
    <div style={{ fontFamily: "'Caveat', cursive", fontSize: 42, lineHeight: 1, marginBottom: 4 }}>
      Greek SMEs · Pulseboard <span style={{ background: 'var(--accent)', fontSize: 28, padding: '0 6px', borderRadius: 4, border: '1.5px solid var(--ink)' }}>April 2026</span>
    </div>
    <div className="hand-note" style={{ fontSize: 14, color: 'var(--pencil)', marginBottom: 16 }}>
      A reading-first view: the data reads like a briefing, widgets embedded inline.
    </div>

    <h3 className="hand" style={{ fontSize: 28, borderBottom: '1.5px dashed var(--pencil)', paddingBottom: 4 }}>1 · What's happening in the market</h3>
    <div className="hand-note" style={{ fontSize: 14, lineHeight: 1.6, margin: '6px 0 12px' }}>
      Greek SMEs account for <span className="hl">€42.8B</span> of value added and <span className="hl">2.21M</span> jobs. Structure remains <span className="hl">micro-dominated (96.4%)</span>, and digital intensity still sits in the bottom tier of the EU.
      Recovery is uneven; confidence wavers around neutral. <span className="citation">[EC 2025 · OECD 2024 · Eurostat]</span>
    </div>
    <MacroTiles />

    <h3 className="hand" style={{ fontSize: 28, borderBottom: '1.5px dashed var(--pencil)', paddingBottom: 4, marginTop: 22 }}>2 · Sector signals</h3>
    <SectorLens />

    <h3 className="hand" style={{ fontSize: 28, borderBottom: '1.5px dashed var(--pencil)', paddingBottom: 4, marginTop: 22 }}>3 · What SMEs are actually doing about it</h3>
    <div className="hand-note" style={{ fontSize: 14, lineHeight: 1.6, margin: '6px 0 12px' }}>
      Interview themes cluster around <span className="hl">trust</span>, <span className="hl">referrals</span>, and <span className="hl">scope clarity</span>. The strongest edge is
      Trust ↔ Referrals — SMEs check with a peer before they check a brochure.
    </div>
    <div className="ph" style={{ minHeight: 180 }}>
      <div className="ph-label">mini graph preview</div>
    </div>

    <h3 className="hand" style={{ fontSize: 28, borderBottom: '1.5px dashed var(--pencil)', paddingBottom: 4, marginTop: 22 }}>4 · What this means for us</h3>
    <OpportunityRadar />

    <div className="viewfoot">
      <span>Layout D · Notion-style document with widgets</span>
      <span>→ swipe to 02</span>
    </div>
  </div>
);

// =================== LAYOUT E: COMMAND / SEARCH-FIRST ===================
const DashCommand = ({ state }) => (
  <div className="col">
    <div className="panel" style={{ background: 'var(--paper-2)', padding: 24, textAlign: 'center' }}>
      <div className="hand" style={{ fontSize: 42, lineHeight: 1, marginBottom: 8 }}>Ask the SME Brain</div>
      <div className="hand-note" style={{ fontSize: 14, color: 'var(--pencil)', marginBottom: 16 }}>
        Type a theme, a barrier, a trigger — get evidence + related themes + actions.
      </div>
      <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', gap: 8, alignItems: 'center', padding: '10px 14px', background: 'var(--paper)', border: 'var(--stroke) solid var(--ink)', borderRadius: 8, boxShadow: '3px 3px 0 var(--ink)' }}>
          <SearchIcon />
          <span style={{ fontFamily: "'Kalam', cursive", fontWeight: 300, color: 'var(--pencil)', flex: 1, textAlign: 'left' }}>e.g. "trust", "bank requirement", "cost anxiety"…</span>
          <span className="label" style={{ background: 'var(--accent)', padding: '2px 8px', border: '1.5px solid var(--ink)', borderRadius: 4, fontSize: 11 }}>↵</span>
      </div>
      <div style={{ marginTop: 14, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
        {['trust', 'referrals', 'fixed-fee scope', 'compliance fatigue', 'peer workshop', 'ESG readiness'].map(s => (
          <span key={s} className="chip">{s}</span>
        ))}
      </div>
    </div>

    <div className="grid grid-3">
      <div className="panel">
        <div className="panel-title"><h2>Signals · today</h2><span className="meta">tiles</span></div>
        <div className="col" style={{ gap: 8 }}>
          <div className="tile" style={{ padding: '8px 10px' }}>
            <div className="kicker">Confidence index</div>
            <div className="value">48.2</div>
            <div className="trend up">+1.1 vs last wave<span className="citation">[NBG]</span></div>
          </div>
          <div className="tile" style={{ padding: '8px 10px' }}>
            <div className="kicker">Investment intent</div>
            <div className="value">31<span style={{ fontSize: 16 }}>%</span></div>
            <div className="trend flat">flat<span className="citation">[NBG]</span></div>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-title"><h2>SME voice · today</h2><span className="meta">top themes</span></div>
        <ul className="bullets">
          <li><b>Trust</b> — 28 quotes <span className="tag">↔ Referrals</span></li>
          <li><b>Cost / ROI</b> — 19 <span className="tag">↔ Fixed scope</span></li>
          <li><b>Jargon fatigue</b> — 17</li>
          <li><b>Compliance fatigue</b> — 15 <span className="tag">↔ Trigger: bank</span></li>
        </ul>
      </div>
      <div className="panel">
        <div className="panel-title"><h2>Suggested actions</h2><span className="meta">from Evidence→Action</span></div>
        <ul className="bullets">
          <li>Host peer clinic for Retail SMEs (trust ↔ referrals)</li>
          <li>Offer fixed-fee readiness on ESG disclosure</li>
          <li>Reframe workshop copy — remove "transformation"</li>
        </ul>
      </div>
    </div>

    <div className="panel">
      <div className="panel-title"><h2>Opportunity radar</h2><span className="meta">tap a row to open an Evidence→Action recipe</span></div>
      <OpportunityRadar />
    </div>

    <div className="viewfoot">
      <span>Layout E · Search-first console — Ask the Brain is the front door</span>
      <span>→ swipe to 02</span>
    </div>
  </div>
);

window.DashboardView = DashboardView;
