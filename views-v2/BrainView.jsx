// SME Brain — knowledge graph + Ask search + Evidence → Action (folded in)

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

const NODES = [
  { id: 'trust',       label: 'Trust',              type: 'theme',   n: 28, x: 0.42, y: 0.42,
    definition: 'The primary gateway condition for SME engagement. Without it, no offer converts — regardless of price or quality.',
    synonyms: ['credibility', 'credible', 'confidence', 'reliable', 'believe', 'trusted'] },
  { id: 'referrals',   label: 'Referrals',          type: 'theme',   n: 22, x: 0.26, y: 0.30,
    definition: 'The dominant discovery mechanism. SMEs overwhelmingly find external advisors via peer recommendations, accountants, or bank introductions.',
    synonyms: ['recommendation', 'word of mouth', 'introduced', 'referred', 'network', 'introduce'] },
  { id: 'cost',        label: 'Cost / ROI',          type: 'theme',   n: 19, x: 0.58, y: 0.60,
    definition: 'Cost concern reads primarily as scope anxiety, not price sensitivity. SMEs want to know exactly what they are paying for before committing.',
    synonyms: ['price', 'expensive', 'budget', 'roi', 'return', 'value', 'spend', 'fee', 'afford'] },
  { id: 'jargon',      label: 'Jargon fatigue',     type: 'theme',   n: 17, x: 0.60, y: 0.26,
    definition: 'Consulting language ("transformation", "maturity model", "roadmap") actively reduces engagement. SMEs read jargon as a signal they are not the intended audience.',
    synonyms: ['language', 'complex', 'terminology', 'buzzword', 'complicated', 'technical', 'confusing'] },
  { id: 'compfat',     label: 'Compliance fatigue', type: 'theme',   n: 15, x: 0.72, y: 0.45,
    definition: 'Accumulated exhaustion from ongoing regulatory demands. SMEs disengage not because they do not care, but because volume and complexity overwhelms without guidance.',
    synonyms: ['compliance', 'regulation', 'regulatory', 'rules', 'fatigue', 'overwhelm', 'overload'] },
  { id: 'speed',       label: 'Speed',              type: 'theme',   n: 11, x: 0.48, y: 0.72,
    definition: 'SMEs operate with short decision horizons. Long diagnostic or scoping phases are perceived as signs an engagement will be slow and expensive overall.',
    synonyms: ['fast', 'quick', 'time', 'duration', 'timeline', 'agile', 'rapid', 'slow'] },
  { id: 'sectorfit',   label: 'Sector fit',         type: 'theme',   n: 13, x: 0.20, y: 0.56,
    definition: '"Do they understand businesses like mine?" is a pre-qualifying question. Generic offerings fail; sector-specific signals unlock the conversation.',
    synonyms: ['sector', 'industry', 'relevant', 'specific', 'understand', 'fit', 'experience', 'hospitality', 'retail', 'manufacturing'] },
  { id: 'digital',     label: 'Digital readiness',  type: 'theme',   n: 10, x: 0.82, y: 0.26,
    definition: 'Most Greek SMEs recognise a digital gap but lack internal resource and a clear entry point. Broad mandates are ignored; scoped quick wins engage.',
    synonyms: ['digital', 'technology', 'tech', 'online', 'software', 'automation', 'tools'] },
  { id: 'b-expensive', label: '"Too expensive"',    type: 'barrier', n: 14, x: 0.14, y: 0.76,
    definition: 'The most common stated barrier. Often masks scope anxiety rather than actual budget constraint — the antidote is transparent, fixed-fee framing.',
    synonyms: ['expensive', 'cost too much', 'afford', 'cannot pay', 'budget constraint'] },
  { id: 'b-notforus',  label: '"Not for us"',       type: 'barrier', n: 9,  x: 0.08, y: 0.40,
    definition: 'A perception barrier driven by brand association with large corporates. Overcome by sector-specific proof and peer evidence from similarly-sized firms.',
    synonyms: ['not for us', 'too big', 'large company', 'corporate', 'not relevant', 'not our size'] },
  { id: 'b-salesfear', label: 'Fear of being sold', type: 'barrier', n: 12, x: 0.38, y: 0.82,
    definition: 'SMEs are wary of being upsold into long, open-ended engagements. Fear is strongest among those with prior negative consulting experiences.',
    synonyms: ['sold', 'sales pitch', 'selling', 'upsell', 'pressure', 'pushy', 'pitch'] },
  { id: 't-bank',      label: 'Bank requirement',  type: 'trigger', n: 10, x: 0.88, y: 0.62,
    definition: 'Banks requiring compliance, reporting, or advisory conditions before extending credit is a consistent and powerful engagement trigger for SMEs.',
    synonyms: ['bank', 'banking', 'loan', 'credit', 'required by', 'forced', 'lender'] },
  { id: 't-reg',       label: 'New regulation',    type: 'trigger', n: 11, x: 0.90, y: 0.40,
    definition: 'New regulatory obligations (ESG, digital, labour) create urgency-driven entry points — but only when communicated as practical obligations, not abstract policy.',
    synonyms: ['regulation', 'law', 'legislation', 'new rule', 'regulatory change', 'legal', 'mandate'] },
  { id: 't-crisis',    label: 'Crisis',            type: 'trigger', n: 6,  x: 0.74, y: 0.80,
    definition: 'Business crises — operational, financial, or competitive — create reactive demand for advisory support with compressed time horizons.',
    synonyms: ['crisis', 'emergency', 'urgent', 'problem', 'issue', 'trouble', 'threat'] },
  { id: 'p-peer',      label: 'Peer endorsement',  type: 'proof',   n: 16, x: 0.18, y: 0.14,
    definition: 'The most trusted proof signal. A named recommendation from a peer in the same sector and size band removes more risk than any case study or brochure.',
    synonyms: ['peer', 'endorsement', 'recommendation', 'testimonial', 'colleague', 'fellow'] },
  { id: 'p-pilot',     label: 'Pilot results',     type: 'proof',   n: 13, x: 0.42, y: 0.10,
    definition: 'Concrete results from a short, scoped pilot dramatically reduce perceived risk. SMEs respond to "see what we did in 4 weeks" over long case narratives.',
    synonyms: ['pilot', 'trial', 'test', 'results', 'proof of concept', 'demo', 'example'] },
  { id: 'p-scope',     label: 'Clear scope/price', type: 'proof',   n: 15, x: 0.62, y: 0.10,
    definition: 'Transparent, upfront pricing with a fixed scope is itself a trust signal. Ambiguity in scope is perceived as a sales tactic, not flexibility.',
    synonyms: ['scope', 'fixed fee', 'clear', 'transparent', 'defined', 'proposal', 'quote', 'fixed price'] },
  { id: 'p-sector',    label: 'Sector expertise',  type: 'proof',   n: 9,  x: 0.82, y: 0.12,
    definition: 'Demonstrated knowledge of sector-specific dynamics — regulations, seasonal patterns, typical margins — is a prerequisite for credibility with sector-first SMEs.',
    synonyms: ['sector expertise', 'industry knowledge', 'specialisation', 'niche', 'expert', 'specialist'] },
];

const EDGES = [
  ['trust','referrals',18], ['trust','cost',9],    ['trust','sectorfit',11],
  ['trust','p-peer',14],    ['trust','p-pilot',8],  ['referrals','p-peer',12],
  ['cost','b-expensive',11],['cost','p-scope',10],  ['cost','speed',6],
  ['jargon','trust',7],     ['jargon','b-notforus',5],
  ['compfat','t-reg',9],    ['compfat','t-bank',7], ['compfat','digital',4],
  ['speed','p-pilot',7],    ['sectorfit','p-sector',8],
  ['b-salesfear','trust',6],['b-salesfear','p-scope',5],
  ['b-expensive','p-scope',6],['b-notforus','p-sector',4],
  ['t-crisis','cost',5],    ['digital','jargon',5],
];

const COLORS = {
  theme:   '#F85519',
  barrier: '#1d1d1f',
  trigger: '#86868b',
  proof:   '#34c759',
};

const QUOTES = {
  trust: [
    { t: 'Before we signed anything, I called two people I know in the sector. That\'s how we decide.', tags: 'Retail · Small · I-04' },
    { t: 'We\'ve had bad experiences before. Someone came in, gave us a big report, and nothing happened. So now we need results before we commit properly.', tags: 'Tourism · Small · I-09' },
  ],
  referrals: [
    { t: 'Our accountant mentioned them. That\'s the only reason we opened the door.', tags: 'Manufacturing · Small · I-02' },
    { t: 'We would never respond to a cold call. But when [peer firm] said they used them — that changed things completely.', tags: 'Services · Micro · I-06' },
  ],
  cost: [
    { t: 'Open-ended scope kills it for us. Just tell me the number.', tags: 'Retail · Micro · I-11' },
    { t: 'I\'m not against paying — I\'m against not knowing what I\'m paying for.', tags: 'Manufacturing · Small · I-03' },
  ],
  jargon: [
    { t: 'They kept saying "digital maturity". I still don\'t know what that means for my business.', tags: 'Services · Micro · I-08' },
    { t: 'When they started talking about "transformation journeys" I just switched off. Tell me what changes on Monday morning.', tags: 'Retail · Small · I-12' },
  ],
  compfat: [
    { t: 'We only engaged when our bank asked for it — and even then, we wanted someone who wouldn\'t overcomplicate it.', tags: 'Retail · Small · I-07' },
    { t: 'Every month there\'s something new. ESG, digital, energy. We can\'t keep up — so we wait until someone tells us we have to act.', tags: 'Tourism · Small · I-05' },
  ],
  sectorfit: [
    { t: 'If they haven\'t worked with a hospitality business before, I\'m not interested. Our seasonality alone makes us completely different.', tags: 'Tourism · Small · I-01' },
    { t: 'The first question I ask is: have you worked with a firm our size, in our sector? If not, we\'re their learning curve.', tags: 'Manufacturing · Medium · I-10' },
  ],
  speed: [
    { t: 'If it takes 3 months to tell me what to do, it will take 12 months to do it. I don\'t have that runway.', tags: 'Services · Micro · I-08' },
  ],
  digital: [
    { t: 'I know we need to do something digital. But I don\'t have someone to run it. So unless it\'s very simple and someone helps us through it, it won\'t happen.', tags: 'Retail · Micro · I-11' },
  ],
  'b-expensive': [
    { t: 'It\'s not that we can\'t afford it — it\'s that we don\'t know what we\'re buying. That\'s the problem.', tags: 'Manufacturing · Small · I-03' },
  ],
  'b-salesfear': [
    { t: 'They came in for a "diagnostic" and within 20 minutes were pitching a 6-month project. We politely ended the meeting.', tags: 'Services · Small · I-06' },
  ],
  't-bank': [
    { t: 'Our bank said we needed to show a sustainability framework before they\'d review our credit line. That\'s when we started looking.', tags: 'Manufacturing · Medium · I-10' },
  ],
  't-reg': [
    { t: 'The new CSRD thing — we\'re not even sure it applies to us yet. But our accountant said we should be ready. So we started asking questions.', tags: 'Tourism · Small · I-05' },
  ],
  'p-peer': [
    { t: 'If someone I respect in the sector has used them and recommends them — that\'s worth more than any brochure.', tags: 'Retail · Small · I-04' },
  ],
  'p-pilot': [
    { t: 'We said: do 4 weeks, show us results, then we\'ll talk about what comes next. That felt safe.', tags: 'Services · Small · I-06' },
  ],
  'p-scope': [
    { t: 'Two pages. What you\'ll do, what you won\'t do, what it costs, how long. That\'s all I need.', tags: 'Manufacturing · Small · I-02' },
  ],
};

const DEFAULT_RECIPE = {
  message:  ['Plain language — drop consulting jargon entirely.', 'Outcome-first framing — what changes in 4–6 weeks.', 'Specify scope and fee on page one.'],
  channels: ['Accountant and bank ecosystem referrals.', 'Sector associations and chamber events.', 'Peer roundtables — 3–5 SMEs, same size band.'],
  offer:    ['Fixed-fee diagnostic — two weeks, one deliverable.', 'Clinic — 90-minute group session.', 'Staged pilot — diagnostic → 30-day pilot → gate.'],
  proof:    ['One-page sector micro-case.', 'Named peer endorsement, where permitted.', 'Sample deliverable preview.'],
};

const RECIPES = {
  trust: {
    message:  ['Lead with outcomes, not process or methodology.', 'Specify scope and fee upfront — on the first page.', 'Avoid "transformation" and "maturity" framing entirely.'],
    channels: ['Peer and accountant referrals — highest conversion rate.', 'Association-led events with light-touch presence.', 'Sector-specific workshops that signal expertise.'],
    offer:    ['Fixed-fee diagnostic — 2 weeks, one clear deliverable.', 'Peer clinic — 90 mins, 4–6 SMEs, same size band.', 'Staged pilot — diagnostic → 30-day trial → decision gate.'],
    proof:    ['One-page sector case study — same sector, similar size.', 'Named peer endorsement where permitted.', 'Sample deliverable: show what you produce, not what you do.'],
  },
  referrals: {
    message:  ['Reference the referral source explicitly in outreach.', 'Use peer language, not corporate language.', '"A firm like yours" framing wherever possible.'],
    channels: ['Accountant and bank ecosystem — warm introductions.', 'Sector association channels.', 'Peer roundtables — let SMEs introduce each other.'],
    offer:    ['Peer clinic — let existing clients bring contacts.', 'Association-endorsed diagnostic offer.', 'Referral-activated fixed-fee entry.'],
    proof:    ['The referrer is the proof — reference the relationship.', 'Sector-specific outcomes visible to the peer network.', 'Named testimonials from within the same sector circle.'],
  },
  cost: {
    message:  ['State the fee and scope on line 1, not page 4.', 'Frame cost as "risk controlled" — not as an investment.', '"Fixed price, fixed scope, fixed timeline" — say all three.'],
    channels: ['Bank and accountant referrals reduce cost-risk perception.', 'Association-sponsored clinics reduce the perceived cost barrier.'],
    offer:    ['Fixed-fee diagnostic — the antidote to scope anxiety.', 'Staged payment tied to staged engagement — 30-day gate.', 'No open-ended retainers in early-stage engagement.'],
    proof:    ['Clear invoice examples — what you get for the fee.', 'Before/after cost impact from similar firms.', 'Explicit "what is NOT included" section in proposals.'],
  },
  jargon: {
    message:  ['Rewrite all materials at "intelligent non-expert" level.', 'Replace "digital transformation" → "improving how you run X".', '"In 4 weeks you will have Y" beats "we will roadmap your journey".'],
    channels: ['Face-to-face events — jargon is easier to filter in person.', 'Plain-language written follow-ups after any meeting.'],
    offer:    ['Short-named offers: "Clinic", "Diagnostic", "Sprint" — not "Advisory Engagement".', 'Two-page proposal maximum.'],
    proof:    ['Plain-language case narrative — what the firm did, not what the advisor did.', 'SME-authored testimonials, unedited.'],
  },
  compfat: {
    message:  ['"You need to know 3 things about this regulation — not 30."', 'Translate regulatory change into operational terms.', 'Acknowledge fatigue first: "We know you\'ve heard a lot about this."'],
    channels: ['Association briefing events — trusted, not salesy.', 'Accountant / bank trigger activation.', 'Short email briefings — 5 bullets, not 10 pages.'],
    offer:    ['Compliance readiness check — fixed scope, 2-week turnaround.', '"What this means for you" one-pager before any proposal.', 'Group compliance clinic — shared cost, shared context.'],
    proof:    ['Plain-language regulation summaries — translated, not forwarded.', '"Already helped 12 firms in your sector with this."', 'Checklist of what is required — concrete, not abstract.'],
  },
  sectorfit: {
    message:  ['"We work specifically with hospitality / retail / manufacturing SMEs."', 'Name-drop sector-specific regulations, seasonality, and typical margins.', 'Show you know their cost structure before they tell you.'],
    channels: ['Sector associations — the credibility endorsement channel.', 'Trade events and chamber events.', 'Sector-specific publications and newsletters.'],
    offer:    ['Sector diagnostic — industry-benchmarked, not generic.', 'Sector clinic — 90 mins with 4–6 firms from the same sector.', 'Sector case pack — 3 stories from the same industry.'],
    proof:    ['Sector-specific case studies — same type of firm.', '"We\'ve worked with 8 firms in your sector" is powerful.', 'Sector benchmarking data as a deliverable.'],
  },
  speed: {
    message:  ['"We\'ll have your first output in 10 business days."', 'Publish a clear timeline on page one of the proposal.', 'Avoid phased engagement language in initial outreach.'],
    channels: ['Direct introductions — remove as many steps as possible.', 'Short video or one-pager before any meeting request.'],
    offer:    ['Sprint format — defined start date, defined end date, fixed output.', 'Diagnostic in 2 weeks or less.', 'Group clinic — no long onboarding required.'],
    proof:    ['Timeline from a similar engagement — specific dates.', '"From intro call to first deliverable: 11 days."', 'Progress update cadence explained upfront.'],
  },
  digital: {
    message:  ['"We start with one process, not everything."', 'Frame digital as operational relief, not strategic transformation.', 'Speak in time saved and errors reduced — not in technology terms.'],
    channels: ['Sector workshops where digital is framed as a practical tool.', 'Accountant or bank introductions when digitisation is a condition.'],
    offer:    ['Digital quick-win sprint — one process, 3 weeks, measurable output.', 'Diagnostic: "where does digital help most?"', 'Clinic — show, don\'t tell.'],
    proof:    ['Demo of the output — not the technology.', '"This saved [firm] 4 hours per week."', 'Sector peer who has done it and can speak to it.'],
  },
};

// Conversational synonyms layered on top of node synonyms — maps emotional/question language to node ids
const INTENT_MAP = [
  { id: 'compfat',   terms: ['scared', 'afraid', 'fear', 'overwhelm', 'stress', 'anxious', 'anxiety', 'worried about regulation', 'too many rules', 'keep up', 'can\'t keep up', 'too much', 'new regulation', 'new law', 'new rules'] },
  { id: 'trust',     terms: ['trust you', 'do i trust', 'can i trust', 'skeptical', 'sceptical', 'doubt', 'suspicious', 'believe you', 'credible', 'rely on'] },
  { id: 'cost',      terms: ['too expensive', 'afford', 'worth it', 'pay for', 'how much', 'pricing', 'worried about cost', 'budget', 'roi', 'return'] },
  { id: 'jargon',    terms: ['confused', 'don\'t understand', 'don\'t know what', 'what does', 'what is', 'unclear', 'lost', 'complex language', 'plain english', 'plain language', 'what do you mean'] },
  { id: 'b-salesfear', terms: ['being sold', 'sales pitch', 'hard sell', 'committed', 'locked in', 'pushy', 'pitch me', 'don\'t want to be sold', 'obligation', 'no obligation'] },
  { id: 'referrals', terms: ['how did you find', 'who recommended', 'word of mouth', 'introduced by', 'heard about', 'find an advisor', 'how to choose'] },
  { id: 'speed',     terms: ['how long', 'how fast', 'quick', 'takes too long', 'too slow', 'timeline', 'how many weeks', 'months'] },
  { id: 't-reg',     terms: ['new law', 'new legislation', 'mydata', 'esg reporting', 'cbam', 'ai act', 'csrd', 'omnibus', 'compliance deadline', 'regulation coming'] },
  { id: 'digital',   terms: ['go digital', 'digitise', 'digitize', 'start digital', 'technology', 'software', 'online', 'automate', 'where to start with digital'] },
  { id: 'sectorfit', terms: ['understand my sector', 'understand my business', 'worked with', 'experience in', 'hospitality', 'tourism', 'retail', 'manufacturing', 'my industry'] },
];

// Strip common question-framing words before matching
const STRIP = /\b(are you|do you|can you|should i|would you|is it|what is|what are|how do|how does|i am|i'm|we are|we're|tell me about|worried about|scared of|afraid of|anxious about|concerned about)\b/g;

function findBestMatch(query) {
  const raw = query.toLowerCase().trim();
  if (!raw) return null;

  // 1. Strip question framing for a cleaner signal
  const q = raw.replace(STRIP, ' ').replace(/\s+/g, ' ').trim();

  // 2. Exact node label match
  const direct = NODES.find(n => n.label.toLowerCase().includes(q));
  if (direct) return direct.id;

  // 3. Intent map — emotional / conversational language (check both raw and stripped)
  for (const { id, terms } of INTENT_MAP) {
    if (terms.some(t => raw.includes(t) || q.includes(t))) return id;
  }

  // 4. Node synonyms
  for (const n of NODES) {
    if (n.synonyms && n.synonyms.some(s => q.includes(s) || s.includes(q))) return n.id;
  }

  // 5. Definition full-text fallback
  const defMatch = NODES.find(n => n.definition && n.definition.toLowerCase().includes(q));
  if (defMatch) return defMatch.id;

  return null;
}

// ── Inspector ──────────────────────────────────────────────────────────────────

const Inspector = ({ sel, dark, searchQuery }) => {
  const n = NODES.find(x => x.id === sel);
  if (!n) return null;

  const qs = QUOTES[sel] || [{ t: 'Anonymised quote will appear once transcripts are processed.', tags: 'placeholder' }];
  const recipe = RECIPES[sel] || DEFAULT_RECIPE;

  const related = EDGES
    .filter(([a, b]) => a === sel || b === sel)
    .sort((x, y) => y[2] - x[2])
    .slice(0, 3)
    .map(([a, b]) => {
      const otherId = a === sel ? b : a;
      return NODES.find(x => x.id === otherId)?.label || otherId;
    });

  const textColor = dark ? '#d2d2d7' : 'var(--ink-2)';
  const softColor = dark ? '#86868b' : 'var(--ink-4)';
  const hairline  = dark ? 'rgba(255,255,255,0.08)' : 'var(--hairline-soft)';
  const tileBg    = dark ? 'rgba(255,255,255,0.06)' : 'var(--bg-soft)';

  return (
    <div className="brain-inspector" style={{ overflowY: 'auto', maxHeight: 520 }}>
      {searchQuery && (
        <div style={{ fontSize: 11, color: 'var(--accent)', marginBottom: 10, fontWeight: 600, letterSpacing: '0.02em' }}>
          Results for "{searchQuery}"
        </div>
      )}

      <div className="eyebrow" style={{ marginBottom: 6 }}>{n.type}</div>
      <div className="h3">{n.label}</div>
      <div className="small" style={{ marginTop: 4, marginBottom: 12 }}>n = {n.n} quotes</div>

      {n.definition && (
        <p style={{ fontSize: 13, color: textColor, lineHeight: 1.55, margin: '0 0 14px', paddingLeft: 10, borderLeft: '2px solid var(--hairline)' }}>
          {n.definition}
        </p>
      )}

      {related.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Strongest links</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {related.map(r => (
              <span key={r} className="pill" style={{ fontSize: 11 }}>{r}</span>
            ))}
          </div>
        </div>
      )}

      {qs.slice(0, 2).map((q, i) => (
        <blockquote key={i}>
          "{q.t}"
          <div style={{ fontSize: 12, color: softColor, marginTop: 8 }}>{q.tags}</div>
        </blockquote>
      ))}

      {/* Evidence → Action (folded in) */}
      <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${hairline}` }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>What this means</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['01', 'Message',  recipe.message],
            ['02', 'Channel',  recipe.channels],
            ['03', 'Offer',    recipe.offer],
            ['04', 'Proof',    recipe.proof],
          ].map(([num, title, items]) => (
            <div key={num} style={{ background: tileBg, borderRadius: 8, padding: '10px 12px' }}>
              <div style={{ fontSize: 10, color: softColor, fontWeight: 600, letterSpacing: '0.05em', marginBottom: 6 }}>
                {num} · {title.toUpperCase()}
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {items.slice(0, 2).map((item, i) => (
                  <li key={i} style={{
                    fontSize: 12, color: textColor, lineHeight: 1.5,
                    padding: '5px 0',
                    borderTop: i > 0 ? `1px solid ${hairline}` : 'none',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Visualisations ─────────────────────────────────────────────────────────────

const Force = ({ sel, onSel }) => {
  const W = 1000, H = 560;
  const by = Object.fromEntries(NODES.map(n => [n.id, n]));
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" style={{ display: 'block' }}>
      {EDGES.map(([a, b, w], i) => {
        const A = by[a], B = by[b];
        if (!A || !B) return null;
        const active = sel === a || sel === b;
        return (
          <line key={i}
            x1={A.x * W} y1={A.y * H} x2={B.x * W} y2={B.y * H}
            stroke={active ? '#F85519' : '#d2d2d7'}
            strokeWidth={Math.max(1, w * 0.25)}
            strokeOpacity={active ? 0.8 : 0.5}
            style={{ transition: 'stroke .2s, stroke-opacity .2s' }}
          />
        );
      })}
      {NODES.map(n => {
        const r = 14 + n.n * 0.7;
        const active = sel === n.id;
        return (
          <g key={n.id} onClick={() => onSel(n.id)} style={{ cursor: 'pointer' }}>
            {/* invisible enlarged hit area — pointer events only here, stops jitter from nested elements */}
            <circle cx={n.x * W} cy={n.y * H} r={r + 10} fill="transparent" />
            <circle cx={n.x * W} cy={n.y * H} r={r + 8} fill={COLORS[n.type]}
              style={{ transition: 'opacity .2s' }} opacity={active ? 0.18 : 0} pointerEvents="none" />
            <circle cx={n.x * W} cy={n.y * H} r={r}
              fill={COLORS[n.type]}
              style={{ transition: 'opacity .2s, stroke-width .15s' }}
              opacity={active ? 1 : 0.92}
              stroke={active ? '#fff' : 'none'}
              strokeWidth={active ? 3 : 0}
              pointerEvents="none"
            />
            <text x={n.x * W} y={n.y * H + r + 18} textAnchor="middle" fill="#1d1d1f"
              fontSize="13" fontFamily="Inter" pointerEvents="none">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const Constellation = ({ sel, onSel }) => {
  const W = 1000, H = 560;
  const by = Object.fromEntries(NODES.map(n => [n.id, n]));
  const stars = Array.from({ length: 110 }, (_, i) => {
    const r = i * 37 + 13;
    return { x: r * 17 % W, y: (r * 29 + i * 41) % H, s: r % 5 + 0.3 };
  });
  const nodeColor = (type) =>
    type === 'theme' ? '#60a5fa' : type === 'proof' ? '#30d158' : type === 'trigger' ? '#a1a1a6' : '#fff';
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {stars.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.s * 0.4} fill="#fff" opacity="0.3" />)}
      {EDGES.map(([a, b, w], i) => {
        const A = by[a], B = by[b];
        if (!A || !B) return null;
        const active = sel === a || sel === b;
        return (
          <line key={i}
            x1={A.x * W} y1={A.y * H} x2={B.x * W} y2={B.y * H}
            stroke={active ? '#60a5fa' : '#3a3a3c'}
            strokeOpacity={active ? 0.9 : 0.4}
            strokeWidth={Math.max(0.8, w * 0.15)}
          />
        );
      })}
      {NODES.map(n => {
        const r = 5 + n.n * 0.3;
        const active = sel === n.id;
        const color = nodeColor(n.type);
        return (
          <g key={n.id} onClick={() => onSel(n.id)} style={{ cursor: 'pointer' }}>
            <circle cx={n.x * W} cy={n.y * H} r={r * 4} fill="transparent" />
            <circle cx={n.x * W} cy={n.y * H} r={r * 3} fill={color}
              style={{ transition: 'opacity .2s' }} opacity={active ? 0.25 : 0} pointerEvents="none" />
            <circle cx={n.x * W} cy={n.y * H} r={r * 1.8} fill={color}
              style={{ transition: 'opacity .2s' }} opacity="0.4" pointerEvents="none" />
            <circle cx={n.x * W} cy={n.y * H} r={r} fill={color} pointerEvents="none" />
            <text x={n.x * W} y={n.y * H + r + 18} textAnchor="middle"
              fontSize="12" fontWeight="500" fill="#f5f5f7" fontFamily="Inter" pointerEvents="none">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

const Sankey = ({ sel, onSel }) => {
  const W = 1000, H = 560;
  const barriers = NODES.filter(n => n.type === 'barrier');
  const themes   = NODES.filter(n => n.type === 'theme').slice(0, 5);
  const triggers = NODES.filter(n => n.type === 'trigger');
  const proofs   = NODES.filter(n => n.type === 'proof');
  const colX = [120, 380, 640, 900];
  const lay = (arr, x) => arr.map((n, i) => ({ ...n, cx: x, cy: 80 + i * ((H - 140) / Math.max(1, arr.length - 1)) }));
  const cols = [lay(barriers, colX[0]), lay(themes, colX[1]), lay(triggers, colX[2]), lay(proofs, colX[3])];
  const by = Object.fromEntries(cols.flat().map(n => [n.id, n]));
  const flows = [
    ['b-expensive','cost',11], ['cost','p-scope',10],
    ['b-salesfear','trust',6], ['trust','p-peer',14], ['trust','p-pilot',8],
    ['b-notforus','sectorfit',4], ['sectorfit','p-sector',8],
    ['compfat','t-reg',9], ['t-reg','p-scope',5],
    ['compfat','t-bank',7], ['t-bank','p-pilot',4],
  ];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {['Barrier', 'Theme', 'Trigger', 'Proof'].map((l, i) => (
        <text key={l} x={colX[i]} y={40} textAnchor="middle"
          fontSize="11" letterSpacing="1" fill="#86868b" fontFamily="Inter" fontWeight="500">
          {l.toUpperCase()}
        </text>
      ))}
      {flows.map(([a, b, w], i) => {
        const A = by[a], B = by[b];
        if (!A || !B) return null;
        const mid = (A.cx + B.cx) / 2;
        const active = sel === a || sel === b;
        return (
          <path key={i}
            d={`M${A.cx + 18},${A.cy} C${mid},${A.cy} ${mid},${B.cy} ${B.cx - 18},${B.cy}`}
            stroke={active ? '#F85519' : '#d2d2d7'}
            strokeOpacity={active ? 0.8 : 0.5}
            strokeWidth={Math.max(2, w * 0.8)}
            fill="none" strokeLinecap="round"
          />
        );
      })}
      {cols.flat().map(n => {
        const h = 14 + n.n * 0.4;
        const active = sel === n.id;
        return (
          <g key={n.id} onClick={() => onSel(n.id)} style={{ cursor: 'pointer' }}>
            <rect x={n.cx - 18} y={n.cy - h / 2} width={36} height={h} rx={5}
              fill={COLORS[n.type]}
              opacity={active ? 1 : 0.9}
              stroke={active ? '#fff' : 'none'} strokeWidth={active ? 3 : 0}
            />
            <text x={n.cx} y={n.cy + h / 2 + 18} textAnchor="middle"
              fontSize="11" fill="#1d1d1f" fontFamily="Inter">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
};

// ── Main view ─────────────────────────────────────────────────────────────────

const BrainView = ({ state }) => {
  const [mode, setMode]           = useStateB(state.brainViz || 'force');
  const [sel, setSel]             = useStateB(null);
  const [searchInput, setSearchInput] = useStateB('');
  const [searchQuery, setSearchQuery] = useStateB('');
  const inputRef = useRefB(null);

  useEffectB(() => { setMode(state.brainViz); }, [state.brainViz]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      const match = findBestMatch(searchInput);
      if (match) {
        setSel(match);
        setSearchQuery(searchInput);
      } else {
        setSearchQuery(searchInput + ' — no direct match');
      }
    }
  };

  const toggleSel = (id) => setSel(prev => prev === id ? null : id);

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
  };

  return (
    <div className="view-inner">

      <div className="section" style={{ marginTop: 0 }}>
        <span className="eyebrow">SME Brain</span>
        <h1 className="display" style={{ margin: '14px 0 18px' }}>Structure, not anecdotes.</h1>
        <p className="lead" style={{ maxWidth: 640 }}>
          Every node is a theme, barrier, trigger, or proof signal coded from interviews. Every edge is an evidenced co-occurrence. Click any node — or ask a question below.
        </p>
      </div>

      <div className="section">
        <div className="brain-controls">
          <div className="seg">
            <button className={mode === 'force'         ? 'active' : ''} onClick={() => setMode('force')}>Force</button>
            <button className={mode === 'constellation' ? 'active' : ''} onClick={() => setMode('constellation')}>Constellation</button>
            <button className={mode === 'sankey'        ? 'active' : ''} onClick={() => setMode('sankey')}>Flow</button>
          </div>
        </div>

        <div className="brain-search-wrap">
          <div className="brain-search brain-search-lg">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask anything — try: scared of regulations, trust, cost, referrals…"
              value={searchInput}
              onChange={e => { setSearchInput(e.target.value); if (!e.target.value) clearSearch(); }}
              onKeyDown={handleSearch}
            />
            {searchInput && (
              <span onClick={clearSearch} style={{ cursor: 'pointer', fontSize: 13, color: 'var(--ink-4)', userSelect: 'none' }}>✕</span>
            )}
            <button className="btn btn-primary" style={{ height: 30, padding: '0 16px', fontSize: 12, borderRadius: 999 }} onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>

        <div className={'brain-layout ' + (sel ? 'has-sel' : '')}>
          <div className={'brainstage ' + (mode === 'constellation' ? 'dark' : '')}>
            {mode === 'force'         && <Force         sel={sel} onSel={toggleSel} />}
            {mode === 'constellation' && <Constellation sel={sel} onSel={toggleSel} />}
            {mode === 'sankey'        && <Sankey        sel={sel} onSel={toggleSel} />}

            <div className="brain-legend">
              <span><span className="sw" style={{ background: COLORS.theme }}   />Theme</span>
              <span><span className="sw" style={{ background: COLORS.barrier }} />Barrier</span>
              <span><span className="sw" style={{ background: COLORS.trigger }} />Trigger</span>
              <span><span className="sw" style={{ background: COLORS.proof }}   />Proof</span>
            </div>
          </div>

          <div className={'brain-panel ' + (sel ? 'open ' : '') + (mode === 'constellation' ? 'dark' : '')}>
            <div className="brain-panel-inner" key={sel}>
              <Inspector sel={sel} dark={mode === 'constellation'} searchQuery={searchQuery} />
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="grid grid-3">
          <div>
            <span className="eyebrow">Strongest edges</span>
            <h3 className="h3" style={{ margin: '8px 0 16px' }}>Top co-occurrences.</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
              {[
                ['Trust ↔ Referrals', 18],
                ['Trust ↔ Peer endorsement', 14],
                ['Referrals ↔ Peer endorsement', 12],
                ['Cost ↔ "Too expensive"', 11],
                ['Compliance fatigue ↔ Regulation', 9],
              ].map(([l, n]) => (
                <li key={l} style={{ padding: '12px 0', borderTop: '1px solid var(--hairline-soft)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink)' }}>{l}</span>
                  <span className="small num">{n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Persona clusters</span>
            <h3 className="h3" style={{ margin: '8px 0 16px' }}>By mindset.</h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: 14 }}>
              {[
                ['Cost-pressured pragmatists', 6],
                ['Growth, bandwidth-limited', 4],
                ['Compliance / bank-driven', 5],
                ['Digitally curious, unsure', 3],
              ].map(([l, n]) => (
                <li key={l} style={{ padding: '12px 0', borderTop: '1px solid var(--hairline-soft)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--ink)' }}>{l}</span>
                  <span className="small num">n = {n}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="eyebrow">Method</span>
            <h3 className="h3" style={{ margin: '8px 0 16px' }}>How the graph is built.</h3>
            <p className="body" style={{ marginBottom: 16 }}>
              Nodes from the interview codebook. Edges from co-occurrence within the same answer unit. All quotes are anonymised. Node size = theme frequency; edge weight = co-occurrence count.
            </p>
            <p className="body">
              Transcripts from 5 semi-structured interviews with Greek SME owners and managers across Tourism, Retail, Manufacturing, and Services.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

window.BrainView = BrainView;
