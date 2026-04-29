// SME Brain — knowledge graph + Ask search + Evidence → Action (folded in)

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

const NODES = [
  { id: 'trust',          label: 'Communication fit',   type: 'theme',   n: 12, x: 0.42, y: 0.42,
    definition: 'Communication quality and personal fit are the primary selection criteria — cited across all five interviews. Direct, accessible communication is not a preference; its absence ends the relationship.',
    synonyms: ['credibility', 'credible', 'communication', 'personal fit', 'reliable', 'trusted', 'accessible', 'direct'] },
  { id: 'referrals',      label: 'Personal referral',   type: 'theme',   n: 9,  x: 0.26, y: 0.30,
    definition: 'The only proven entry point into a consulting relationship. Four of five interviewees described discovery through a personally known contact, not through marketing, cold outreach, or brand recognition.',
    synonyms: ['recommendation', 'word of mouth', 'introduced', 'referred', 'network', 'friend', 'known person', 'personal connection'] },
  { id: 'sectorfit',      label: 'Sector fit',          type: 'theme',   n: 11, x: 0.20, y: 0.56,
    definition: '"Do they understand businesses like mine?" is a pre-qualifying question across all five sectors. Generic expertise is rejected. Sector-specific knowledge must be visible before any engagement begins.',
    synonyms: ['sector', 'industry', 'relevant', 'specific', 'understand', 'fit', 'experience', 'hospitality', 'legal', 'coffee', 'construction'] },
  { id: 'familyculture',  label: 'Firm identity',       type: 'theme',   n: 7,  x: 0.58, y: 0.60,
    definition: 'Family business structure and team culture are inseparable from how SMEs evaluate external partners. A firm that treats an SME as just another account is perceived as culturally misaligned — regardless of its capability.',
    synonyms: ['family business', 'family firm', 'team culture', 'small team', 'values', 'culture', 'identity', 'who we are'] },
  { id: 'standardized',   label: 'Template rejection',  type: 'theme',   n: 6,  x: 0.60, y: 0.26,
    definition: 'Standardised, step-by-step advisory approaches are an active disqualifier. Brochures and generic frameworks signal that the provider does not understand the firm — and are rejected immediately.',
    synonyms: ['brochure', 'template', 'generic', 'standardized', 'one size fits all', 'not personalised', 'methodology', 'framework', 'steps'] },
  { id: 'isolation',      label: 'SME isolation',       type: 'theme',   n: 5,  x: 0.48, y: 0.72,
    definition: 'Greek SMEs feel structurally underserved relative to their share of the economy. The perception that large firms focus on large businesses creates both a readiness gap and an emotional barrier to engagement.',
    synonyms: ['alone', 'on our own', 'underserved', 'ignored', 'not supported', 'feel alone', 'left out', 'not for small firms'] },
  { id: 'esg',            label: 'ESG spectrum',        type: 'theme',   n: 8,  x: 0.72, y: 0.45,
    definition: 'ESG engagement spans from zero awareness (construction) to operationally embedded (legal). Where it appears it is externally imposed — bank conditions, regulation, client demand — not values-driven. Legal sector is uniquely ahead.',
    synonyms: ['esg', 'sustainability', 'green', 'environmental', 'compliance', 'regulation', 'ecological', 'carbon', 'social'] },
  { id: 'channels',       label: 'Discovery channels',  type: 'theme',   n: 9,  x: 0.82, y: 0.26,
    definition: 'Trade exhibitions dominate as the primary information channel for four of five sectors. The legal sector is the critical exception — awareness there is built entirely through legal databases, the Bar Association, newsletters, and inter-firm peer networks.',
    synonyms: ['exhibition', 'trade fair', 'sector event', 'bar association', 'legal database', 'newsletter', 'how to find', 'where to look', 'internet'] },
  { id: 'b-notforus',     label: '"Won\'t understand us"', type: 'barrier', n: 5,  x: 0.08, y: 0.40,
    definition: 'The clearest large-firm perception barrier in the dataset. The fear that a large advisory firm cannot understand the work ethics of a small niche firm is not abstract — it is the stated reason a boss has not yet engaged a management consultant.',
    synonyms: ['not for us', 'too big', 'large company', 'corporate', 'not relevant', 'won\'t understand', 'not our size', 'niche firm'] },
  { id: 'b-confidential', label: 'Confidentiality risk', type: 'barrier', n: 3,  x: 0.14, y: 0.76,
    definition: 'Specific to the legal sector: confidentiality risk is a structural barrier to expanding the team and to engaging external advisors. High-value governmental and investor clients create an asymmetry where external engagement carries real reputational risk.',
    synonyms: ['confidential', 'confidentiality', 'sensitive', 'private clients', 'data security', 'discretion', 'keep it private', 'sensitive information'] },
  { id: 'b-salesfear',    label: 'Open-ended fear',     type: 'barrier', n: 4,  x: 0.38, y: 0.82,
    definition: 'SMEs are wary of being drawn into open-ended engagements with no defined scope or exit. The rejection of brochure-style advisory is partly a defence against this — a bounded, defined offer removes the fear.',
    synonyms: ['sold', 'sales pitch', 'selling', 'open-ended', 'locked in', 'pressure', 'pushy', 'obligation', 'no exit'] },
  { id: 't-bank',         label: 'Bank requirement',    type: 'trigger', n: 3,  x: 0.88, y: 0.62,
    definition: 'Banking and credit conditions that require ESG compliance or sustainability reporting are a concrete engagement trigger — experienced directly by the hotel interviewee when seeking loan approval.',
    synonyms: ['bank', 'banking', 'loan', 'credit', 'required by', 'lender', 'green loan', 'financing condition'] },
  { id: 't-reg',          label: 'Regulatory change',   type: 'trigger', n: 5,  x: 0.90, y: 0.40,
    definition: 'New regulation — ESG mandates, Golden Visa requirements, public procurement green criteria — creates urgency-driven entry points. Most acute in the legal sector where regulatory change directly affects client outcomes.',
    synonyms: ['regulation', 'law', 'legislation', 'new rule', 'regulatory change', 'mandate', 'golden visa', 'procurement', 'green criteria'] },
  { id: 't-events',       label: 'Trade exhibitions',   type: 'trigger', n: 7,  x: 0.74, y: 0.80,
    definition: 'Trade exhibitions and sector events are where four of five interviewees discover products, suppliers, and advisors. For HoReCa specifically, key exhibitions (HoReCa, HOST Italy) are considered must-attend for anyone in the sector.',
    synonyms: ['exhibition', 'trade fair', 'expo', 'event', 'conference', 'sector gathering', 'horeca', 'trade show'] },
  { id: 'p-peer',         label: 'Peer endorsement',    type: 'proof',   n: 8,  x: 0.18, y: 0.14,
    definition: 'The most trusted proof signal across all five interviews. A known person in the same sector recommending an advisor removes more risk than any case study, brochure, or brand credential.',
    synonyms: ['peer', 'endorsement', 'recommendation', 'testimonial', 'colleague', 'known person', 'same sector', 'introduced by'] },
  { id: 'p-track',        label: 'Track record',        type: 'proof',   n: 6,  x: 0.42, y: 0.10,
    definition: 'Evidence of past work with comparable clients is the primary due diligence step. Both the hotel and law firm interviewees described wanting to see what the advisor had done before, and with whom.',
    synonyms: ['track record', 'former clients', 'past work', 'what have you done', 'experience', 'history', 'previous clients'] },
  { id: 'p-results',      label: 'Demonstrated results', type: 'proof',  n: 4,  x: 0.62, y: 0.10,
    definition: 'For Greek SMEs, demonstrated performance outranks stated credentials. The coffee machine distributor articulated this directly: from the moment you deliver results, cost comes second. The market failure is that most SMEs ask about price before asking about outcomes.',
    synonyms: ['results', 'outcome', 'delivered', 'performance', 'impact', 'what changed', 'proof of value', 'roi'] },
  { id: 'p-sector',       label: 'Sector expertise',    type: 'proof',   n: 5,  x: 0.82, y: 0.12,
    definition: 'Sector-specific knowledge demonstrated before the engagement begins — naming the right regulations, understanding the seasonality, knowing the typical pressures — is a prerequisite for credibility, not a differentiator.',
    synonyms: ['sector expertise', 'industry knowledge', 'specialisation', 'niche', 'expert', 'specialist', 'know our sector'] },
];

const EDGES = [
  ['trust','referrals',18],         ['trust','sectorfit',10],        ['trust','familyculture',9],
  ['trust','p-peer',12],            ['trust','p-track',7],
  ['referrals','p-peer',11],        ['referrals','channels',6],
  ['sectorfit','standardized',9],   ['sectorfit','p-sector',7],      ['sectorfit','p-track',5],
  ['familyculture','isolation',5],  ['familyculture','b-notforus',4],
  ['standardized','b-notforus',6],  ['standardized','b-salesfear',5],
  ['isolation','b-notforus',7],
  ['esg','t-reg',8],                ['esg','t-bank',6],
  ['channels','t-events',9],
  ['b-confidential','b-notforus',4],
  ['t-reg','p-sector',4],
  ['p-results','trust',5],
];

const COLORS = {
  theme:   '#F85519',
  barrier: '#1d1d1f',
  trigger: '#86868b',
  proof:   '#34c759',
};

const QUOTES = {
  trust: [
    { t: 'Communication is everything. There needs to be a direct communication bridge — as easy and clear as possible.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
    { t: 'I don\'t want them to see us as a big client that just needs what they do for everyone. More personal — like family.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  referrals: [
    { t: 'He\'s a friend. He\'s worked in a coffee company — he knows exactly what goes on in that world.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
    { t: 'Someone approached us who we already knew, and we knew what he had done in the sector — so we had trust to take advice from him.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  sectorfit: [
    { t: 'Experience in the sector. Not general experience. Each sector needs a different perspective and different handling of information.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
    { t: 'To be able to see how we operate, how we work — because I think that\'s where every result comes from.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  familyculture: [
    { t: 'We\'re not a huge company with 100+ staff. Here we\'re all a family who care for each other. We see it very differently.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
    { t: 'Any good thing that happens in one case, it\'s like it happened because of all of us. This creates a team spirit.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  standardized: [
    { t: 'People who just give you brochures of like 1, 2, 3, 4, 5 steps to follow. It just doesn\'t feel personalised at all.', tags: 'Boutique Law Firm · Legal · Interview 5' },
    { t: 'Don\'t see us as a big client that just needs what you do for everyone.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  isolation: [
    { t: 'Small and medium businesses feel a bit on their own. Greece has this tendency to focus more on large businesses.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
    { t: 'He fears that a large firm won\'t understand the work ethics of a small niche firm.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  esg: [
    { t: 'Consulting companies have specific departments for sustainability and ESG. They would be really helpful for us — we\'re neither specialised nor staffed enough for this.', tags: 'Boutique Law Firm · Legal · Interview 5' },
    { t: 'For some loans we were looking at, they asked us to follow certain green and ecological decisions and practices.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  channels: [
    { t: 'I think the biggest part is exhibitions. That\'s the biggest part — and then the internet.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
    { t: 'We usually get informed from legal databases, from government announcements, from the Bar Association. We\'ve also subscribed to some legal magazines.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  'b-notforus': [
    { t: 'He fears that a large firm won\'t understand the work ethics of a small niche legal firm.', tags: 'Boutique Law Firm · Legal · Interview 5' },
    { t: 'Small and medium businesses feel a bit on their own... Greece focuses more on large businesses.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  'b-confidential': [
    { t: 'We have big clients — kind of governmental — so it\'s not easy to expand the team.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  'b-salesfear': [
    { t: 'People who just give you brochures of 1, 2, 3, 4, 5 steps to follow. It just doesn\'t feel personalised at all.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  't-bank': [
    { t: 'For some loans we were looking at, they asked us to follow certain green and ecological decisions and practices.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  't-reg': [
    { t: 'The government reinforces new laws every day regarding sustainability.', tags: 'Boutique Law Firm · Legal · Interview 5' },
    { t: 'Our international investors are starting to ask about energy efficiency and ESG ratings of real estate portfolios.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  't-events': [
    { t: 'If you\'re in the HoReCa sector, it\'s a must-go exhibition. I think it\'s the biggest part — and then the internet.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
  ],
  'p-peer': [
    { t: 'We would only choose someone who has been recommended by other firms who share the same mentality as ours.', tags: 'Boutique Law Firm · Legal · Interview 5' },
    { t: 'Someone approached us who we already knew — and we knew what he\'d done in the sector. That\'s our trust.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
  ],
  'p-track': [
    { t: 'We want to see what they\'ve done in the past. What clients they had.', tags: 'Boutique Hotel · Hospitality · Interview 4' },
    { t: 'We would check their former clients.', tags: 'Boutique Law Firm · Legal · Interview 5' },
  ],
  'p-results': [
    { t: 'From the moment you deliver and bring results, cost will always come second.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
    { t: 'Most people ask how much it costs first. Not what the result is, or why they need it.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
  ],
  'p-sector': [
    { t: 'Experience in the sector. Not general experience. Each sector needs a different perspective and different processing of information.', tags: 'Coffee Machine Company · HoReCa · Interview 2' },
  ],
};

const DEFAULT_RECIPE = {
  message:  ['Lead with the sector, not the firm — relevance opens doors.', 'Plain operational language — no consulting jargon.', 'State outcomes in 4–6 weeks, not methodology.'],
  channels: ['Personal introduction via a known sector contact.', 'Sector associations and trade exhibitions.', 'Peer roundtables — 3–5 SMEs, same sector.'],
  offer:    ['Fixed-fee diagnostic — two weeks, one deliverable.', 'Sector clinic — 90-minute group session.', 'Staged pilot — diagnostic → 30-day pilot → gate.'],
  proof:    ['One-page sector case with a comparable firm.', 'Named peer endorsement where permitted.', 'Track record of former clients in the same sector.'],
};

const RECIPES = {
  trust: {
    message:  ['Address communication style before credentials — show you listen.', 'Match the firm\'s register: family business language for family firms, professional for legal.', 'Use operational language, not consulting jargon.'],
    channels: ['Personal introduction via a known contact — trust transfers from the referrer.', 'Sector events where you meet, not market.', 'Accountant or peer firm referral.'],
    offer:    ['One defined conversation — no upsell, no scope creep implied.', 'Peer clinic: 4–6 SMEs in the same sector, light-touch presence.', 'Short, bounded diagnostic — fixed scope and outcome.'],
    proof:    ['Let the referrer speak first — they are the proof.', 'Show how you worked with a similar firm, not what you do in general.', 'One-page outcome summary from a comparable engagement.'],
  },
  referrals: {
    message:  ['Reference the referral explicitly — it is the entry point.', 'Frame every message as if a trusted peer wrote it.', 'Acknowledge the relationship first, the offer second.'],
    channels: ['Peer firm and sector association network — highest trust channel.', 'Roundtables where SMEs introduce each other.', 'Law firm networks for the legal sector specifically.'],
    offer:    ['Referral-activated fixed-fee entry — the referrer lowers the risk.', 'Let existing contacts bring peers to events.', 'Association-endorsed engagement structure.'],
    proof:    ['The referrer is the proof — their relationship with you is the evidence.', 'Peer-to-peer testimonials within the same sector circle.', 'Named outcomes visible to the referral network.'],
  },
  sectorfit: {
    message:  ['"We work specifically with hospitality / legal / HoReCa SMEs" — say it plainly.', 'Name the sector\'s specific regulations, seasonality, and pressures first.', 'Show you know their cost structure before they tell you.'],
    channels: ['Sector trade fairs and association events — not generic business events.', 'Sector-specific publications and newsletters.', 'Bar Association and legal databases for the legal sector.'],
    offer:    ['Sector diagnostic benchmarked against peers in the same industry.', 'Sector clinic — 90 minutes with 4–6 firms from the same sector.', 'Sector case pack: three stories from the same type of firm.'],
    proof:    ['Case studies from the same sector and firm type.', '"We have worked with hotel groups / law firms / HoReCa businesses like yours."', 'Sector benchmarking data as a tangible deliverable.'],
  },
  familyculture: {
    message:  ['Acknowledge the family or team dynamic before the business case.', '"A firm like yours" framing — not generic SME language.', 'Avoid corporate register and hierarchy assumptions.'],
    channels: ['Personal introduction by someone already inside the firm\'s network.', 'Family business associations or hospitality sector events.', 'Direct dialogue — no mass outreach.'],
    offer:    ['Engagement scoped around the firm\'s own decision-making style.', 'Informal first meeting — relationship before proposal.', 'Flexible delivery that fits a family business calendar.'],
    proof:    ['Reference a family-owned firm you have worked with.', 'Show results in the same context: 3rd-generation hotel, small professional team.', 'Let the firm describe success before proposing anything.'],
  },
  standardized: {
    message:  ['No step-by-step frameworks in proposals — ever.', 'Describe outcomes in the specific operational language of their sector.', '"This is what we would do for you" — not "this is our standard process".'],
    channels: ['Face-to-face first — standardisation is harder to detect in person.', 'Plain-language follow-up that shows the proposal was written for this firm.', 'Peer roundtables: sector peers notice generic pitches immediately.'],
    offer:    ['Bespoke scoping call before any document is shared.', 'Show previous work that was visibly tailored, not templated.', 'Two-page max proposal: if it looks like a brochure, it is rejected.'],
    proof:    ['Anonymised case where the engagement was shaped around the firm, not the methodology.', 'Let an existing client explain how the approach was adapted.', 'Avoid bullet-pointed methodology lists — use narrative.'],
  },
  isolation: {
    message:  ['Acknowledge that Greek SMEs are underserved relative to their share of the economy.', 'Position as a firm that specifically chose to focus on SMEs — not one that tolerates them.', '"You shouldn\'t have to navigate this alone."'],
    channels: ['Peer gatherings — the antidote to isolation is community.', 'Sector associations that actively represent SME interests.', 'Events where SME decision-makers can share problems and compare approaches.'],
    offer:    ['Workshop or roundtable: 3–5 SMEs, same sector, shared challenges.', 'Group advisory model: shared cost, shared context.', 'Annual sector gathering where firms exchange practices.'],
    proof:    ['Evidence that the firm has prioritised SMEs, not just serviced them.', 'Testimonials from other SMEs who felt heard and supported.', 'Visible sector commitment — number of SMEs served, by sector.'],
  },
  esg: {
    message:  ['Lead with the regulatory requirement, not the sustainability narrative.', 'Translate ESG into operational consequence: loan approval, Golden Visa clients, procurement bids.', 'Acknowledge the compliance burden — don\'t add to it.'],
    channels: ['Banking and lending ecosystem — ESG requirements originate here.', 'Bar Association and legal newsletters for the legal sector.', 'Ministry communications and government portals.'],
    offer:    ['ESG readiness check: fixed scope, 2-week turnaround.', 'Sector-specific briefing: what this regulation means for your type of firm.', 'Specialist ESG advisory for firms with international clients or loan conditions.'],
    proof:    ['Plain-language regulation summary in operational context.', 'Checklist of what is required before a deadline.', '"We have helped hotel groups meet bank ESG conditions for credit approval."'],
  },
  channels: {
    message:  ['Be present at the events SMEs attend — not the ones large firms sponsor.', 'Legal sector only: be visible in legal databases, Bar Association, and professional newsletters.', 'Social media is relevant only in HoReCa — not in construction, legal, or traditional retail.'],
    channels: ['Trade exhibitions (HoReCa, sector fairs) for 4 of 5 sectors.', 'Legal databases, Bar Association, law firm peer networks for legal sector.', 'Ministry communications and government portals for regulated sectors.'],
    offer:    ['Exhibition presence with a sector-specific talking point — not a company stand.', 'Peer event co-hosted with a sector association.', 'Legal sector: written content in association channels and newsletters.'],
    proof:    ['Visibility at the right events before any outreach.', 'Association endorsement or co-hosting credit.', 'Published content in the channel where the sector actually reads.'],
  },
  'b-notforus': {
    message:  ['Never lead with firm scale or global reach when speaking to SMEs.', 'Open with the sector, not the firm — let relevance come first.', '"We work with firms like yours" is more powerful than any brand credential.'],
    channels: ['All outreach through trusted intermediaries — cold contact reinforces the barrier.', 'Peer referrals are the only reliable bridge past this perception.', 'Sector events where scale is invisible.'],
    offer:    ['Fixed-fee, bounded entry that removes open-ended scale risk.', 'Peer clinic — same-size firms, shared context.', '"Try us for one engagement — no ongoing obligation."'],
    proof:    ['Named SME clients in the same sector and size band.', 'Evidence from a boutique firm or family business — not a corporate.', 'One-pager: what engagement with a firm like yours actually looks like.'],
  },
  'b-confidential': {
    message:  ['Address confidentiality constraints explicitly in the first conversation.', 'Describe how you handle sensitive client data before being asked.', 'Small team, high-value clients = confidentiality is structural, not a preference.'],
    channels: ['Only through the firm\'s trusted network — legal sector does not respond to cold outreach.', 'Bar Association and law firm peer networks.', 'Private, one-to-one format only — no group events for initial engagement.'],
    offer:    ['One-to-one engagement with a named advisor, not a team.', 'Explicit data handling protocol as part of the proposal.', 'Scoped advisory on a single area — not broad engagement.'],
    proof:    ['Demonstrated experience with confidentiality-sensitive sectors.', 'Reference from a comparable boutique professional services firm.', 'Your own data handling and ethics standards visible before being asked.'],
  },
  'b-salesfear': {
    message:  ['State explicitly what is NOT included and what does NOT follow the engagement.', 'No upselling language in any materials.', '"This is a bounded engagement — there is no next step unless you want one."'],
    channels: ['Peer referrals reduce fear before contact — the referrer sets expectations.', 'Sector association context: advisory as a service, not a sales call.', 'Written format with a clear scope removes ambiguity.'],
    offer:    ['Fixed-fee, fixed-scope, fixed-duration — all three stated upfront.', 'No open-ended retainer in an initial engagement.', '"Done in 2 weeks. One deliverable. You own it. No follow-up obligation."'],
    proof:    ['Former clients who can describe the end of the engagement, not just the start.', 'Explicit "what happens at the end" section in the proposal.', 'Simple two-page proposal — not a 30-page sales document.'],
  },
  't-bank': {
    message:  ['Bank requirement is a mandate, not an opportunity — respect the urgency.', 'Translate the bank\'s requirement into practical terms the SME can act on.', 'Don\'t expand the scope beyond what the bank asked for.'],
    channels: ['Bank ecosystem introductions — the bank is the trigger and the referrer.', 'Loan advisor or financial intermediary network.', 'SME banking events and financial services associations.'],
    offer:    ['ESG readiness report: exactly what the bank needs, nothing more.', 'Fixed scope, fast turnaround — bank deadlines are real.', 'Done-for-you documentation: minimum burden on the SME.'],
    proof:    ['"We have helped hotel groups meet bank ESG conditions for credit approval."', 'Sample output that matches the bank\'s reporting format.', 'Timeline from intro to deliverable: under 2 weeks.'],
  },
  't-reg': {
    message:  ['Regulatory change is the entry point — don\'t miss the moment.', 'Translate the regulation into 3 operational implications, not a legal overview.', 'Acknowledge that SMEs are overwhelmed by the volume of new requirements.'],
    channels: ['Ministry announcements and government portals (hospitality, construction).', 'Bar Association, legal databases, Golden Visa specialist networks.', 'Accountant and tax advisor ecosystem — they are the first call.'],
    offer:    ['Compliance readiness check: fixed scope, specific regulation, fast turnaround.', 'Sector briefing: what this means for your firm specifically.', 'Group workshop: 5 SMEs, same regulation, shared cost.'],
    proof:    ['"Already applied this for firms in your sector before the deadline."', 'Checklist of requirements — concrete and sector-specific.', 'Plain-language summary of the regulation and its impact.'],
  },
  't-events': {
    message:  ['Lead with sector knowledge at events — not firm credentials.', 'A sector-specific talking point is more valuable than a stand or banner.', 'Be present where the sector is — not where it thinks it should be seen.'],
    channels: ['HoReCa, EcoFestival, HOST (Italy) for coffee and hospitality sectors.', 'Wine and beverage sector exhibitions for retail.', 'Construction trade fairs for equipment and materials.'],
    offer:    ['Event presence with a sector briefing — not a sales pitch.', 'Invite existing clients to events as advocates.', 'Association co-hosting of a sector event.'],
    proof:    ['Visible sector expertise at the event before any follow-up.', 'Association endorsement as event partner.', 'SME participants who already know the firm.'],
  },
  'p-peer': {
    message:  ['The referrer is the message — centre them, not the firm.', 'Quote peer endorsements in sector-specific language, not corporate language.', '"A firm in your sector has used us and recommends us" — this opens doors.'],
    channels: ['The peer\'s network is the channel — not social media, not email.', 'Sector roundtables where peers recommend directly.', 'Law firm networks for the legal sector specifically.'],
    offer:    ['Let existing clients invite contacts — peer-to-peer referral event.', 'Association-endorsed peer testimonial programme.', 'Named SME reference call as part of the proposal process.'],
    proof:    ['The peer endorser is the proof — their relationship is the evidence.', 'Named testimonials within the same sector circle.', 'Track record of peer-referral-led engagements.'],
  },
  'p-track': {
    message:  ['"We have worked with a firm exactly like yours" — say it specifically.', 'Name what you did, the firm type, and the sector — no generics.', 'Let the former client speak for themselves if possible.'],
    channels: ['Former client testimonials visible at the point where trust needs to be earned.', 'Case examples available at sector events and association channels.', 'Direct reference calls with comparable clients.'],
    offer:    ['Reference call with a former client in the same sector.', 'One-page case summary: firm type, challenge, outcome.', 'Before-and-after framing: what changed after the engagement.'],
    proof:    ['The track record IS the proof — specificity and comparability matter.', 'Sector and size of former clients disclosed where possible.', '"We have helped hotel groups / law firms in Greece with exactly this."'],
  },
  'p-results': {
    message:  ['State the outcome on line 1 — not the methodology.', 'Quantify wherever possible: time saved, cost impact, compliance met.', '"What changes for you in 4 weeks" beats "our approach to advisory".'],
    channels: ['Results-first messaging in every sector event and association channel.', 'Short case example in the first follow-up — not a full case study.', 'Direct conversation: "here\'s what we achieved for a firm like yours."'],
    offer:    ['Performance-based framing: outcome agreed upfront, results measured.', 'Short pilot: agree the outcome, deliver in 4 weeks, gate on results.', 'Concrete deliverable preview: show the output before asking for commitment.'],
    proof:    ['Named outcome from a comparable firm.', '"From the moment you deliver results, cost comes second." — this is the SME logic.', 'Before-and-after documentation: what the firm had, what it has now.'],
  },
  'p-sector': {
    message:  ['Demonstrate sector knowledge before presenting credentials.', 'Name-drop sector-specific regulations, events, and vocabulary.', 'Show you know their typical cost structure and operating pressures.'],
    channels: ['Sector publications and trade press.', 'Trade exhibitions and association events.', 'Legal sector: Bar Association publications and legal newsletters.'],
    offer:    ['Sector diagnostic benchmarked against peers.', 'Sector-specific briefing as a free introductory offer.', 'Sector micro-case: one-page story from the same type of firm.'],
    proof:    ['Sector expertise demonstrated before the engagement begins.', 'Sector benchmarking data as a deliverable.', 'Named sector experience: number of firms, same industry.'],
  },
};

// Conversational synonyms layered on top of node synonyms — maps emotional/question language to node ids
const INTENT_MAP = [
  { id: 'esg',            terms: ['scared', 'afraid', 'fear', 'overwhelm', 'stress', 'anxious', 'worried about regulation', 'too many rules', 'keep up', 'can\'t keep up', 'new regulation', 'new law', 'new rules', 'esg', 'sustainability', 'green'] },
  { id: 'trust',          terms: ['trust you', 'do i trust', 'can i trust', 'skeptical', 'sceptical', 'doubt', 'suspicious', 'credible', 'rely on', 'communication', 'personal fit'] },
  { id: 'familyculture',  terms: ['family business', 'family firm', 'team culture', 'small team', 'understand us', 'different from big firms', 'not corporate', 'family owned'] },
  { id: 'standardized',   terms: ['brochure', 'template', 'generic', 'standardized', 'one size fits all', 'not personalised', 'not personalized', 'methodology', 'framework', 'steps'] },
  { id: 'isolation',      terms: ['alone', 'on our own', 'underserved', 'ignored', 'not supported', 'feel alone', 'no support', 'left out'] },
  { id: 'b-salesfear',    terms: ['being sold', 'sales pitch', 'hard sell', 'committed', 'locked in', 'pushy', 'pitch me', 'don\'t want to be sold', 'obligation', 'open-ended'] },
  { id: 'referrals',      terms: ['how did you find', 'who recommended', 'word of mouth', 'introduced by', 'heard about', 'find an advisor', 'how to choose', 'personal connection'] },
  { id: 'channels',       terms: ['exhibition', 'trade fair', 'sector event', 'bar association', 'legal database', 'legal magazine', 'how to reach', 'how to find', 'where to look'] },
  { id: 'b-confidential', terms: ['confidential', 'confidentiality', 'sensitive', 'private clients', 'data security', 'discretion', 'keep it private', 'sensitive information'] },
  { id: 't-reg',          terms: ['new law', 'new legislation', 'esg reporting', 'cbam', 'ai act', 'csrd', 'compliance deadline', 'regulation coming', 'golden visa', 'public procurement'] },
  { id: 'sectorfit',      terms: ['understand my sector', 'understand my business', 'worked with', 'experience in', 'hospitality', 'legal', 'hotel', 'construction', 'retail', 'coffee', 'my industry', 'my sector'] },
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
    ['b-notforus','sectorfit',6],    ['b-salesfear','trust',5],       ['b-confidential','referrals',4],
    ['trust','p-peer',12],           ['trust','p-track',7],
    ['referrals','p-peer',11],       ['sectorfit','p-sector',7],
    ['standardized','b-notforus',6],
    ['t-reg','p-sector',4],          ['t-reg','trust',5],
    ['t-bank','p-results',4],
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
                ['Communication fit ↔ Personal referral', 18],
                ['Communication fit ↔ Peer endorsement', 12],
                ['Personal referral ↔ Peer endorsement', 11],
                ['Sector fit ↔ Template rejection', 9],
                ['ESG spectrum ↔ Regulatory change', 8],
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
                ['Relationship-only engagers', 4],
                ['Compliance-triggered (bank / reg)', 2],
                ['Consultation-naive (no prior advisory)', 2],
                ['Confidentiality-constrained', 1],
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
              Nodes coded from 5 semi-structured interviews with Greek SME decision-makers across hospitality, legal services, HoReCa, construction, and beverage retail (April 2026). Edges from co-occurrence within the same answer unit.
            </p>
            <p className="body">
              All quotes anonymised to sector and firm type. Node size reflects theme frequency; edge weight reflects co-occurrence count. Primary data only — no external sources used.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

window.BrainView = BrainView;
