# SME Insight Platform — Task Plan

**Project:** SME Insight Platform (Digital Thesis Artefact)
**Owner:** Stelios Gavrielides
**Repo:** https://github.com/Stel777/SME-Insight-Platform.git
**Goal:** Presentation-grade static web platform for Greek SME market intelligence — to be shown to PwC colleagues and university supervisor.

---

## Status Overview

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Architecture & scaffolding (3-tab layout, Hero-only Dashboard, BrainView, MarketView) | ✅ complete |
| 2 | Source research — 5 institutional `.md` files extracted | ✅ complete |
| 3 | Local server fix (Python http.server with correct working directory) | ✅ complete |
| 4 | Dashboard data update — replace placeholders with real source numbers | 🔲 pending |
| 5 | SME Brain — replace placeholder nodes/quotes with real transcript data | 🔲 pending |
| 6 | Market Insights — Research Hub content finalisation | 🔲 pending |
| 7 | Design polish pass (frontend-design skill active) | 🔲 pending |
| 8 | GitHub Pages deployment | 🔲 pending |

---

## Phase 4: Dashboard Data Update

Replace all placeholder stats in `views-v2/DashboardView.jsx` with verified numbers from the 5 source `.md` files.

Key numbers to wire in (from `sources/00_SOURCES_INDEX.md`):
- SME share: 99.8% of all enterprises (EC Fact Sheet)
- Micro-firm share: 96.4% (EC Fact Sheet)
- SME employment: 86.4% / ~2.21 million (EC Fact Sheet)
- Productivity gap: 40% below OECD avg (OECD Survey 2024)
- Digital intensity: 53% at basic level, EU avg 73% (Eurostat 2025)
- EIF + EIB guarantees: €702M (OECD Financing 2026)
- Confidence Index: 17 pts above 10-yr avg (NBG H2 2025)
- Growth-strategy firms: 58% (NBG H2 2025)
- ESG interest: >66%, only 12% implementing (NBG ESG 2025)

---

## Phase 5: SME Brain Transcripts

User will share folder path containing 5 interview transcripts.
- Extract: themes, barriers, triggers, proof points, quotes
- Replace placeholder NODES, EDGES, QUOTES, RECIPES in `views-v2/BrainView.jsx`
- Anonymise all quotes before adding

**Status:** Awaiting transcript folder path from user.

---

## Phase 6: Market Insights Research Hub

- Finalise article content (currently placeholder text)
- Add real insight snippets from the 5 source `.md` files
- Review ticker items for accuracy

---

## Phase 7: Design Polish

**Skill active:** frontend-design + awesome-design-md (DESIGN.md created)
**DESIGN.md:** See `DESIGN.md` in project root

Key polish targets:
- Dashboard hero tiles: sharper data viz treatment
- SME Brain: graph panel visual refinement
- Market Insights: article card typography

---

## Phase 8: GitHub Pages Deploy

- Repo: https://github.com/Stel777/SME-Insight-Platform.git
- Ensure all files self-contained (no broken CDN references)
- Set GitHub Pages source to main branch / root
- Test on Pages URL before presenting

---

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| 404 on local server | 1 | Python server launched in wrong CWD via `start` |
| 404 on local server | 2 | Fixed: PowerShell `Start-Process` with explicit `-WorkingDirectory` |

---

## Key Files

| File | Purpose |
|------|---------|
| `SME Insight Platform v2.html` | Entry point — loads all JSX via Babel CDN |
| `app-v2.jsx` | Tab routing, topbar, tweaks panel |
| `views-v2/DashboardView.jsx` | Dashboard tab (Hero layout only) |
| `views-v2/BrainView.jsx` | SME Brain tab (knowledge graph + inspector) |
| `views-v2/MarketView.jsx` | Market Insights tab (ticker + article grid) |
| `styles-v2.css` | All styles (design tokens, components, responsive) |
| `sources/00_SOURCES_INDEX.md` | Master source index + all key numbers |
| `DESIGN.md` | Design system spec (awesome-design-md add-on) |
