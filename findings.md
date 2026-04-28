# SME Insight Platform — Findings

*Research, discoveries, and key data points extracted during build.*

---

## Source Data (verified from 5 institutional .md files)

### Structure (EC Fact Sheet 2025)
- Greek SMEs: 99.8% of all enterprises
- Micro-firm share: 96.4% — highest in EU
- SME private-sector employment: 86.4%
- Total SME employment: ~2.21 million
- Total SME value added: ~€42.8 billion

### Performance (2024 — EC Fact Sheet)
- SME real value added growth: +0.6% overall; +6.8% micro only
- SME employment growth: +2.9% overall; +6.5% micro only
- Small firm value added: -4.1% (contracting)

### Productivity (OECD Survey Dec 2024)
- Productivity gap vs OECD: 40% below OECD average (2023)
- Micro firms: ~47% of all business employment
- Largest PMR improvement in OECD 2018-23 — but professional services still restrictive
- Skills paradox: 9.8% unemployment coexists with significant skill shortages

### Digital (Eurostat Digitalisation 2025)
- Greek SMEs at basic digital intensity: 53% (EU avg: 73%) — 2024 data
- Greek enterprises with very low DII: 56.2% — 2023 data (all enterprises, not SMEs only)
- EU 2030 target: 90% at basic level
- Greece rank: 2nd from bottom in EU (Bulgaria is lowest at 50%)
- Root causes: micro-firm dominance, cost/complexity, no IT resource, skills gap

### Finance (OECD Financing SMEs 2026 — March 2026)
- EIF guarantees to Greek SMEs (2024): €152 million
- EIB guarantees to Greek SMEs (2024): €550 million
- Combined: €702 million
- SME lending flow change: +1.8 pp — Greece is positive outlier in EU
- New SME lending 2024 vs 2019: Higher (one of ~12/21 European countries)

### Sentiment (NBG H2 2025 — published Feb/Mar 2026)
- SME Confidence Index: 17 points — above 10-yr average (was 16 in H1 2025)
- Growth-strategy businesses: 58% (up from 54%)
- Liquidity constraints: ~10% — near historic low
- Global Uncertainty Index (Sept 2025): 600% above long-term average
- Tariff impact significant: ~33% of SMEs (vs 82% in 2021 energy crisis)
- Of those affected: 83% via supply chain cost increases; ~66% absorbed via margin compression

### ESG (NBG May 2025 — 600 SMEs)
- Active ESG interest: >66%
- Received substantial ESG info: only 22%
- Already implementing ESG: 12% (very small enterprises: 4%)
- Holistic ESG strategy (incl. governance): only 3%
- No mandatory regulation needed to act: 93%
- Main barrier: lack of knowledge (~33%); complex procedures + high costs (majority)
- Benefits among implementors: ~33% tangible operational benefits; ~50% of very small firms see measurable profitability gains

---

## Technical Discoveries

### Babel CDN / Static File Loading
- Babel standalone requires XHR to load .jsx files — fails on file:// protocol
- Must use a local HTTP server for development
- CDN: React 18.3.1 UMD + ReactDOM UMD + Babel standalone
- All components exposed via window.ComponentName for cross-file access

### Python HTTP Server Fix
- `start python -m http.server` in bash spawns new process in wrong CWD on Windows
- Fix: `Start-Process -FilePath python -ArgumentList "-m","http.server","8080" -WorkingDirectory $dir`

### CSS Infinite Ticker
- Duplicate TICKER_ITEMS array: [...items, ...items]
- Animation: `translateX(0)` → `translateX(-50%)` at 55s linear infinite
- Gradient fade on edges via `::before` and `::after` with `linear-gradient` to transparent

---

## Design Decisions

- Accent color: `#F85519` (orange)
- Font: Inter (Google Fonts CDN)
- Brand: "by Stel" badge (was "S" dot logo)
- 3 tabs: Dashboard / SME Brain / Market Insights
- Dashboard: Hero layout only (all other layouts removed)
- SME Brain Inspector: scrollable, max-height 520px, width 310px
- Evidence→Action recipes folded into Inspector panel (2×2 grid tiles)
- Market Insights: infinite ticker + 3-column article grid with category filter pills

---

---

## Market Insights Research (April 2026 — verified sources)

### Legislation — Active & Upcoming
- **myDATA B2B e-invoicing**: Mandatory for Greek SMEs from **Oct 2026** (large firms Feb 2026). Platform: AADE myDATA. Early adopters: 100% super-deduction on e-invoicing costs. (KPMG Greece / EDICOM 2026)
- **EU AI Act**: Full application from **2 Aug 2026**. SMEs = lower-risk tier (users not developers). Free priority sandbox access. AI literacy obligations since Feb 2025. (artificialintelligenceact.eu)
- **EU Omnibus (Feb 2025)**: CSRD threshold raised to 1,000+ employees + €450M turnover → 80% exit scope. Data points cut from 1,073 to 320. SME burden target: -35%. SME suppliers can refuse requests beyond voluntary standards.
- **CBAM (Jan 2026)**: Carbon Border Adjustment Mechanism in force. Covered: cement, steel, aluminium, fertilisers. De minimis: under 50 tonnes = exempt (~90% of small importers). Certificates purchased in 2027 for 2026 emissions.
- **Late Payment Reform**: DEAD. Polish Presidency failed to achieve Council majority. Danish Presidency not scheduling it. Status quo (2011 Directive) remains. Greek SMEs continue on 60-day+ terms.
- **Greece tax reform (Law 5246/2025)**: "Tax Reform for Demographics and Middle Class" — primarily individual tax changes effective Jan 2026.

### Funding & Incentives
- **R&D super-deduction**: Up to 215% for SMEs under Law 5193/2025. Up to 315% for collab with Startup Registry firms. Separate 100% deduction for green/energy/digital for FY2023–25.
- **Greece 2.0 RRF**: €5.2B disbursed, 53% milestones met (Feb 2026). Hellenic Development Bank: €2.9B in SME loans in 2025 — 90% to firms under 50 employees. Aug 2026 deadline for all projects.
- **EIF + EIB guarantees**: €702M to Greek SMEs in 2024. Greece is positive outlier — new lending in 2024 > 2019 pre-pandemic levels. (OECD Financing 2026)

### Market & Trade
- **US-EU tariff deal (Jul 2025)**: 15% baseline tariff agreed (was 20%+). Greece exports ~€2.6B to US annually (5th largest market). Hardest hit: olive oil, feta, olives, wine, aluminium, cement. ~33% of Greek SMEs report significant supply chain cost impact (NBG). Small cooperatives more exposed than large exporters.
- **Greek minimum wage (Apr 2025)**: Raised to €880/month (+6% from €830). Affects ~575,000 private-sector workers. Unemployment benefit: €509→€540. Marriage allowance: →€88.
- **Greek tourism 2025**: €23.6B revenue (+9.4%), 37.9M international arrivals (+5.6%). Tourism = ~21% of Greek GDP. Dual reality: headline growth vs. margin compression from rising costs, labour shortages, seasonality.

### Pending Research
- 5 interview transcripts (user to share folder path) → for BrainView node/quote/recipe data
