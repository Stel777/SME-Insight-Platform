// Market Insights — infinite scroll ticker + curated article grid

const { useState: useStateM } = React;

const TICKER_ITEMS = [
  { source: 'Eurostat 2025',          text: 'Only 53% of Greek SMEs reach basic digital intensity — EU average is 73%, Greece ranks 2nd from bottom', tag: 'Digital' },
  { source: 'EC Fact Sheet 2025',     text: 'Greek SMEs account for 86.4% of private-sector employment across 99.8% of all enterprises', tag: 'Economy' },
  { source: 'NBG H2 2025',            text: 'SME Confidence Index at 17 pts — well above the 10-year historical average; 58% now pursuing growth strategies', tag: 'Sentiment' },
  { source: 'EU AI Act · Aug 2026',   text: 'EU AI Act fully applicable from August 2026 — SMEs get free priority access to national regulatory sandboxes', tag: 'Digital' },
  { source: 'AADE / myDATA 2026',     text: 'Mandatory B2B e-invoicing for all Greek SMEs from October 2026 — two-month transition window applies', tag: 'Regulation' },
  { source: 'EC Omnibus · Feb 2025',  text: 'EU Omnibus cuts CSRD scope by 80%; reporting data points slashed from 1,073 to 320 — SME burden target -35%', tag: 'ESG' },
  { source: 'EU Taxation 2026',       text: 'CBAM (Carbon Border Adjustment Mechanism) in force from 1 Jan 2026 — importers under 50 tonnes fully exempt', tag: 'Regulation' },
  { source: 'EC / Greece 2.0 · 2026', text: 'Greece disbursed €5.2B under NextGenerationEU with 53% of milestones met; Aug 2026 implementation deadline looms', tag: 'Funding' },
  { source: 'EY Greece · 2025',       text: 'US-EU baseline tariff settled at 15% (Jul 2025) — ~33% of Greek SMEs report significant cost impact via supply chain', tag: 'Trade' },
  { source: 'GTP Headlines · 2026',   text: 'Greek tourism revenue reached €23.6B in 2025 (+9.4%), with 37.9M international arrivals — SME supply chains under margin pressure', tag: 'Tourism' },
  { source: 'KPMG Greece · 2025',     text: 'R&D super-deduction up to 215% now available for qualifying Greek SMEs under Law 5193/2025', tag: 'Funding' },
  { source: 'GTP Headlines · Mar 2026', text: 'Greece minimum wage raised to €880/month (+6%) from April 2025 — affecting ~575,000 private-sector workers', tag: 'Employment' },
  { source: 'OECD Greece 2024',       text: 'Productivity gap: Greek firms operate 40% below OECD average — visible across all sectors', tag: 'Economy' },
  { source: 'OECD Financing 2026',    text: 'EIF + EIB guaranteed €702M to Greek SMEs in 2024 — new lending higher than pre-pandemic 2019 levels', tag: 'Funding' },
  { source: 'NBG ESG Survey 2025',    text: 'ESG awareness-action gap: >66% of Greek SMEs interested; only 12% implementing — 22% have received substantial ESG information', tag: 'ESG' },
];

const TAG_COLORS = {
  Digital:    '#2563eb',
  Economy:    '#6e6e73',
  Sentiment:  '#7c3aed',
  Funding:    '#059669',
  Structure:  '#86868b',
  ESG:        '#16a34a',
  Tourism:    '#0ea5e9',
  Regulation: '#dc2626',
  Trade:      '#d97706',
  Employment: '#9333ea',
};

const ARTICLES = [
  // ── Digital & Operations ──────────────────────────────────────────
  {
    id: 1, category: 'Digital & Operations', source: 'AADE / KPMG Greece · 2025–26', tag: 'Digital',
    date: '2026-01-15',
    url: 'https://edicomgroup.com/blog/greece-mandatory-electronic-invoice',
    headline: 'myDATA B2B e-Invoicing: Greek SMEs Must Comply by October 2026',
    body: 'Greece mandates electronic invoicing for all B2B transactions from October 2026 (SMEs) via the myDATA platform. Large enterprises (>€1M revenue) go first in February 2026. Early adopters benefit from a 100% super-deduction on e-invoicing expenses. Non-compliance risks significant penalties from AADE.',
  },
  {
    id: 2, category: 'Digital & Operations', source: 'EU AI Act · 2026', tag: 'Digital',
    date: '2026-01-01',
    url: 'https://artificialintelligenceact.eu/small-businesses-guide-to-the-ai-act/',
    headline: 'EU AI Act Fully Applies from August 2026 — What Greek SMEs Need to Know',
    body: 'The EU AI Act reaches full application on 2 August 2026. Most Greek SMEs are AI users, not developers — placing them in a lower-risk compliance tier. Critically, SMEs get free priority access to national regulatory sandboxes. Prohibited AI practices have been banned since February 2025. Greece must establish at least one sandbox by August 2026.',
  },
  {
    id: 3, category: 'Digital & Operations', source: 'Eurostat · 2025', tag: 'Digital',
    date: '2025-09-01',
    url: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
    headline: 'Greece Ranks Near Bottom in EU SME Digital Intensity',
    body: 'Only 53% of Greek SMEs reach basic digital intensity (EU avg: 73%), placing Greece 2nd from bottom — ahead only of Bulgaria. At current trajectory, Greece will not meet the EU 2030 target of 90%. Root causes: micro-firm dominance (96.4% of enterprises), no dedicated IT resource, and perceived cost complexity.',
  },
  {
    id: 4, category: 'Digital & Operations', source: 'EC SME Fact Sheet · 2025', tag: 'Digital',
    date: '2025-05-01',
    url: 'https://ec.europa.eu/eurostat/web/interactive-publications/digitalisation-2025',
    headline: 'Digital Tools Adoption Lags Across Micro and Small Firms',
    body: 'Complexity and implementation cost deter uptake across all firm sizes — but the impact is sharpest for micro-firms with no dedicated IT resource. Scoped pilots and peer-based clinics consistently show stronger adoption rates than broad digital programmes. The "where to start" question remains the dominant barrier for Greek micro-firms.',
  },
  // ── Regulation & Compliance ───────────────────────────────────────
  {
    id: 5, category: 'Regulation & Compliance', source: 'European Commission · Feb 2025', tag: 'Regulation',
    date: '2025-02-26',
    url: 'https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en',
    headline: 'EU Omnibus Simplification: 80% of Firms Exit CSRD Reporting Scope',
    body: 'The EU Omnibus package (adopted Feb 2025) raises CSRD thresholds to 1,000+ employees and €450M+ turnover — removing ~80% of originally in-scope companies. ESRS data points cut from 1,073 to 320. The administrative burden target for SMEs: -35%. SME suppliers can legally decline to provide data beyond voluntary standards.',
  },
  {
    id: 6, category: 'Regulation & Compliance', source: 'EU Taxation & Customs · Jan 2026', tag: 'Regulation',
    date: '2026-01-14',
    url: 'https://taxation-customs.ec.europa.eu/news/cbam-successfully-entered-force-1-january-2026-2026-01-14_en',
    headline: 'CBAM Enters Full Force — Most Greek SME Importers Are Exempt',
    body: 'The Carbon Border Adjustment Mechanism is fully operational from 1 January 2026. Covered goods: cement, steel, aluminium, fertilisers, electricity. A new de minimis threshold exempts importers of fewer than 50 tonnes annually — covering ~90% of small importers. Authorised declarants must purchase CBAM certificates for 2026 emissions, payable in 2027.',
  },
  {
    id: 7, category: 'Regulation & Compliance', source: 'European Parliament · 2025', tag: 'Regulation',
    date: '2025-06-01',
    url: 'https://www.europarl.europa.eu/legislative-train/theme-a-europe-fit-for-the-digital-age/file-late-payments-directive-revision',
    headline: 'EU Late Payment Reform Stalled — 60-Day Terms Persist for Greek SMEs',
    body: 'The proposed Late Payment Regulation — which would have capped B2B payment terms at 30 days and triggered automatic interest on late payments — failed to pass the European Council. The Polish and Danish presidencies found no compromise. Greek SMEs, where late payment is endemic, continue under the existing 2011 Directive with weaker enforcement.',
  },
  {
    id: 8, category: 'Regulation & Compliance', source: 'OECD Greece · Dec 2024', tag: 'Regulation',
    date: '2024-12-01',
    url: 'https://www.oecd.org/en/publications/oecd-economic-surveys-greece-2024_a35a56b6-en.html',
    headline: 'Regulatory Burden Remains a Top Barrier for Greek SME Growth',
    body: 'Administrative complexity disproportionately affects micro-firms with no dedicated compliance resource. While Greece achieved the largest improvement in OECD\'s Product Market Regulation indicator between 2018–2023, restrictive regulations persist in professional services. Fixed-scope advisory clinics show measurably stronger SME engagement than open-ended compliance mandates.',
  },
  // ── Funding & Incentives ──────────────────────────────────────────
  {
    id: 9, category: 'Funding & Incentives', source: 'GreekReporter / EC · Feb–Mar 2026', tag: 'Funding',
    date: '2026-03-27',
    url: 'https://greece20.gov.gr/en/at-a-glance/',
    headline: 'Greece 2.0: €5.2B Disbursed, But August 2026 Deadline Is Closing Fast',
    body: 'Greece has disbursed €5.2B under the Recovery and Resilience Facility with 53% of milestones met as of February 2026. The Hellenic Development Bank approved €2.9B in SME loans in 2025 — 90% to firms with under 50 employees. All projects must be implemented by August 2026. SMEs with pending applications should act immediately.',
  },
  {
    id: 10, category: 'Funding & Incentives', source: 'KPMG Greece / Law 5193/2025', tag: 'Funding',
    date: '2025-11-20',
    url: 'https://kpmg.com/gr/en/home/insights/2025/11/tax-updates-20112025.html',
    headline: 'R&D Super-Deduction Up to 215% Now Available for Greek SMEs',
    body: 'Under Law 5193/2025, qualifying Greek SMEs can deduct up to 215% of R&D expenses — and up to 315% for collaboration with firms on the National Startup Registry. A separate 100% additional deduction applies to green economy, energy, and digitalisation expenditure for FY2023–25. Early-stage SMEs with any tech or process innovation activity should assess eligibility.',
  },
  {
    id: 11, category: 'Funding & Incentives', source: 'OECD Financing SMEs · Mar 2026', tag: 'Funding',
    date: '2026-03-31',
    url: 'https://www.oecd.org/en/publications/financing-smes-and-entrepreneurs-2026_075d8058-en/full-report.html',
    headline: 'EIF + EIB Guaranteed €702M to Greek SMEs in 2024 — A Positive Outlier in Europe',
    body: 'Greece is one of only ~12 of 21 European countries where new SME lending in 2024 exceeded pre-pandemic 2019 levels. EIF provided €152M and EIB €550M in guarantees. The OECD flags that evaluation mechanisms must be strengthened to ensure guarantee-backed loans reach productive firms — not zombie enterprises.',
  },
  {
    id: 12, category: 'Funding & Incentives', source: 'OECD Financing SMEs · Mar 2026', tag: 'Funding',
    date: '2026-03-31',
    url: 'https://www.oecd.org/en/publications/financing-smes-and-entrepreneurs-2026_075d8058-en/full-report.html',
    headline: 'EU Cohesion Funds Opening New SME Financing Pathways',
    body: 'Recovery and Resilience Facility programmes are channelling funding through regional intermediaries and the Hellenic Development Bank — but direct uptake by Greek SMEs remains below potential. Most eligible firms are unaware they qualify. A funding readiness diagnostic is consistently the highest-conversion advisory entry offer in this context.',
  },
  {
    id: 13, category: 'Funding & Incentives', source: 'NBG SME Survey · H2 2025', tag: 'Funding',
    date: '2026-02-01',
    url: 'https://www.nbg.gr/en/group/studies-and-economic-analysis/reports/smes-2025-h2',
    headline: 'Bank Relationships Remain the Dominant SME Financing Route',
    body: 'Most Greek SMEs rely on bank channels as their primary financing route, with EU grant mechanisms severely underutilised due to low awareness of eligibility. Improving access to finance is consistently cited as a top barrier alongside skill shortages, with high cost-of-capital sensitivity making SMEs particularly price-aware when evaluating advisory spend.',
  },
  // ── ESG & Sustainability ──────────────────────────────────────────
  {
    id: 14, category: 'ESG & Sustainability', source: 'NBG ESG Survey · May 2025', tag: 'ESG',
    date: '2025-05-01',
    url: 'https://www.nbg.gr/en/group/studies-and-economic-analysis/reports/smes-esg-2025',
    headline: 'ESG Awareness-Action Gap: 66% Interested, Only 12% Implementing',
    body: 'A survey of 600 Greek SMEs by the National Bank of Greece found that over two-thirds express active ESG interest — but only 22% have received substantial ESG information, and just 12% are implementing any ESG actions. The most persuasive argument: profitability, not compliance. ~50% of very small firms that adopted ESG report measurable profit gains.',
  },
  {
    id: 15, category: 'ESG & Sustainability', source: 'European Commission Omnibus · Feb 2025', tag: 'ESG',
    date: '2025-02-26',
    url: 'https://finance.ec.europa.eu/news/omnibus-package-2025-04-01_en',
    headline: 'CSRD Scope Narrows — But Supply Chain ESG Pressure on SMEs Will Grow',
    body: 'While fewer large companies are now directly required to report under CSRD, those who remain in scope are prohibited from requesting data from SME suppliers beyond voluntary standards. However, commercial pressure — not legal obligation — is the real driver. Greek SMEs in export-oriented or retail supply chains should prepare for buyer-driven ESG questionnaires.',
  },
  // ── Sector Spotlight ─────────────────────────────────────────────
  {
    id: 16, category: 'Sector Spotlight', source: 'GTP Headlines / SETE · Apr 2026', tag: 'Tourism',
    date: '2026-04-27',
    url: 'https://news.gtp.gr/2026/04/27/greece-maintains-strong-tourism-growth-as-european-destinations-accelerate/',
    headline: 'Greek Tourism Hits €23.6B Revenue in 2025 — But SME Margins Are Squeezed',
    body: 'International arrivals reached 37.9M in 2025 (+5.6%) with revenues up 9.4% to €23.6B. Tourism now contributes ~21% of Greek GDP. Yet SME operators face a dual reality: rising operational costs, labour shortages, and regulatory complexity offset headline growth. Off-season cashflow and seasonality remain the sector\'s structural weak point.',
  },
  {
    id: 17, category: 'Sector Spotlight', source: 'NBG SME Survey · H2 2025', tag: 'Tourism',
    date: '2026-02-01',
    url: 'https://www.nbg.gr/en/group/studies-and-economic-analysis/reports/smes-2025-h2',
    headline: 'Tourism SMEs: Recovery Uneven, Off-Season Cashflow Still Acute',
    body: 'Peak-season revenues are recovering strongly, but off-season cashflow remains a critical risk for Greek hospitality SMEs. Appetite for short-term liquidity products and working capital solutions is highest in this sector. Labour shortages and elevated operational costs are compressing margins even in high-demand periods.',
  },
  {
    id: 18, category: 'Sector Spotlight', source: 'EY Greece / Macropolis · 2025', tag: 'Trade',
    date: '2025-07-29',
    url: 'https://www.ey.com/en_gr/technical/tax/tax-alerts/eu-and-us-reached-a-trade-and-tariff-deal',
    headline: 'US-EU Tariff Deal at 15%: Greek Agri-Food Exporters Still Cautious',
    body: 'The July 2025 EU-US agreement set a 15% baseline tariff — down from the earlier 20%+ threat but still a significant barrier for Greek agri-food exports (olive oil, feta, olives, wine). Greece exports ~€2.6B to the US annually. ~33% of Greek SMEs report significant supply chain cost impact. Larger exporters absorb costs better than small cooperatives.',
  },
  {
    id: 19, category: 'Sector Spotlight', source: 'GTP Headlines · Mar 2026', tag: 'Employment',
    date: '2026-03-27',
    url: 'https://news.gtp.gr/2026/03/27/greece-raises-minimum-wage-to-e920-impacting-700000-workers/',
    headline: 'Minimum Wage Raised to €920 — Two Consecutive Hikes Hit SME Payrolls',
    body: 'Following the April 2025 rise to €880 (+6%), Greece raised the minimum wage again to €920/month in March 2026, impacting ~700,000 workers. For micro-firms where labour is the dominant cost line, back-to-back increases translate directly into margin compression. Knock-on effects include higher statutory benefits: unemployment benefit and marriage allowances both rise in step.',
  },
];

const CATEGORIES = ['All', 'Digital & Operations', 'Regulation & Compliance', 'Funding & Incentives', 'ESG & Sustainability', 'Sector Spotlight'];

const MarketView = () => {
  const [activeCategory, setActiveCategory] = useStateM('All');
  const filtered = (activeCategory === 'All' ? ARTICLES : ARTICLES.filter(a => a.category === activeCategory))
    .slice().sort((a, b) => (b.date > a.date ? 1 : -1));

  return (
    <div className="view-inner">

      <div className="section" style={{ marginTop: 0 }}>
        <span className="eyebrow">Market Insights</span>
        <h1 className="display" style={{ margin: '14px 0 18px' }}>The Greek SME Briefing.</h1>
        <p className="lead" style={{ maxWidth: 640 }}>
          New laws and regulations, funding signals, market shifts, and sector intelligence — all affecting Greek SMEs, sourced from the OECD, European Commission, Eurostat, and the National Bank of Greece.
        </p>
      </div>

      {/* Scrolling ticker */}
      <div className="ticker-outer">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-bubble">
              <span className="ticker-source">{item.source}</span>
              <span className="ticker-sep">·</span>
              <span className="ticker-text">{item.text}</span>
              <span className="ticker-tag" style={{ color: TAG_COLORS[item.tag] || 'var(--ink-3)' }}>{item.tag}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="section">
        <div className="market-cats">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={'mcat-btn' + (activeCategory === c ? ' active' : '')}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="article-grid">
          {filtered.map(a => (
            <div key={a.id} className="article-card fade-in">
              <div className="article-meta">
                <span className="article-cat">{a.category}</span>
                <span className="small">{a.source}</span>
              </div>
              <h3 className="article-headline">{a.headline}</h3>
              <p className="article-body">{a.body}</p>
              <div className="article-footer">
                <span
                  className="article-tag"
                  style={{ background: (TAG_COLORS[a.tag] || '#6e6e73') + '18', color: TAG_COLORS[a.tag] || '#6e6e73' }}
                >
                  {a.tag}
                </span>
                <a className="article-link" href={a.url} target="_blank" rel="noopener noreferrer">View source →</a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

window.MarketView = MarketView;
