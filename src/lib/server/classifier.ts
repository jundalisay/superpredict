export type Category = 'worker' | 'warrior' | 'thinker' | 'trader' | null;

const WORKER_KEYWORDS = [
	'freedom', 'human rights', 'wages', 'wage', 'salary', 'cost of living',
	'riot', 'riots', 'protest', 'consumer', 'consumers', 'consumer debt',
	'divorce', 'civil rights', 'left wing', 'left-wing', 'labor', 'labour',
	'union', 'workers', 'employment', 'unemployment', 'welfare', 'poverty',
	'minimum wage', 'housing', 'rent', 'homeless', 'inequality', 'strike',
	'social justice', 'discrimination', 'civil liberties', 'workers rights',
	'living wage', 'healthcare access', 'food prices', 'inflation impact'
];

const WARRIOR_KEYWORDS = [
	'military', 'war', 'warfare', 'army', 'navy', 'marines', 'soldiers',
	'right wing', 'right-wing', 'populism', 'nationalist', 'nationalism',
	'police', 'law enforcement', 'surveillance', 'spying', 'intelligence',
	'regulations', 'taxes', 'taxation', 'border', 'immigration enforcement',
	'security', 'defense', 'missile', 'weapon', 'drone', 'airstrike',
	'invasion', 'troops', 'combat', 'conflict', 'sanctions', 'nato',
	'pentagon', 'cia', 'fbi', 'nsa', 'espionage', 'coup', 'geopolitical',
	'authoritarian', 'dictatorship', 'regime', 'crackdown', 'deportation'
];

const THINKER_KEYWORDS = [
	'religion', 'religious', 'church', 'mosque', 'temple', 'faith', 'spiritual',
	'science', 'scientific', 'research', 'discovery', 'invention', 'breakthrough',
	'philosophy', 'philosophical', 'ethics', 'morality', 'theory', 'study',
	'university', 'academic', 'education', 'innovation', 'technology',
	'artificial intelligence', 'ai', 'nasa', 'space', 'climate science',
	'medical', 'vaccine', 'cure', 'genome', 'quantum', 'physics', 'chemistry',
	'archaeology', 'anthropology', 'psychology', 'consciousness', 'biodiversity',
	'scientist', 'professor', 'nobel', 'peer reviewed', 'journal'
];

const TRADER_KEYWORDS = [
	'money', 'stocks', 'stock market', 'commodities', 'commodity',
	'oligarch', 'oligarchy', 'neoliberal', 'neoliberalism', 'privatization',
	'corporation', 'corporations', 'corporate', 'executives', 'ceo', 'cfo',
	'business', 'trade', 'tariff', 'tariffs', 'economy', 'economic',
	'gdp', 'inflation', 'interest rate', 'federal reserve', 'central bank',
	'investment', 'investor', 'hedge fund', 'venture capital', 'ipo',
	'merger', 'acquisition', 'profit', 'revenue', 'earnings', 'market cap',
	'cryptocurrency', 'bitcoin', 'blockchain', 'wall street', 'nasdaq',
	'supply chain', 'exports', 'imports', 'deficit', 'surplus', 'debt',
	'privatise', 'privatize', 'deregulation', 'subsidy', 'fiscal'
];

function countKeywords(text: string, keywords: string[]): number {
	const lower = text.toLowerCase();
	let count = 0;
	for (const kw of keywords) {
		if (lower.includes(kw)) count++;
	}
	return count;
}

export function classifyArticle(headline: string, snippet = ''): Category {
	const text = `${headline} ${snippet}`;
	const scores = {
		worker: countKeywords(text, WORKER_KEYWORDS),
		warrior: countKeywords(text, WARRIOR_KEYWORDS),
		thinker: countKeywords(text, THINKER_KEYWORDS),
		trader: countKeywords(text, TRADER_KEYWORDS)
	};

	const max = Math.max(...Object.values(scores));
	if (max === 0) return null;

	return Object.entries(scores).find(([, v]) => v === max)?.[0] as Category;
}

// Positive/negative sentiment scoring -3 to +3
const POSITIVE_SIGNALS = [
	'growth', 'increase', 'rise', 'surge', 'record high', 'breakthrough',
	'success', 'victory', 'win', 'gains', 'boost', 'recovery', 'improve',
	'peace deal', 'agreement', 'resolve', 'cure', 'discovery', 'historic',
	'landmark', 'achievement', 'award', 'progress', 'relief', 'expand',
	'prosper', 'thrive', 'launch', 'approve', 'pass', 'rescue', 'save',
	'protect', 'secure', 'strengthen', 'ally', 'cooperation', 'ceasefire',
	'reform', 'rights granted', 'acquitted', 'freed', 'released', 'pardoned'
];

const NEGATIVE_SIGNALS = [
	'crash', 'collapse', 'decline', 'fall', 'drop', 'plunge', 'record low',
	'crisis', 'emergency', 'disaster', 'death', 'killed', 'dead', 'murder',
	'war', 'invasion', 'attack', 'bomb', 'explosion', 'fire', 'flood',
	'scandal', 'corruption', 'fraud', 'arrest', 'convicted', 'sentenced',
	'bankrupt', 'layoffs', 'cut', 'deficit', 'debt crisis', 'recession',
	'fail', 'loss', 'shutdown', 'destroy', 'demolish', 'devastating',
	'injured', 'wounded', 'protest', 'riot', 'unrest', 'violence', 'threat',
	'warning', 'risk', 'danger', 'toxic', 'contamination', 'breach', 'hack',
	'sanction', 'ban', 'restrict', 'deny', 'reject', 'veto', 'coup'
];

// Strong positive events: +3
const STRONG_POSITIVE = [
	'lasting peace', 'peace deal signed', 'cure found', 'groundbreaking discovery',
	'record gdp', 'major breakthrough', 'historic agreement', 'massive growth',
	'fully recovered', 'cancer cured', 'ceasefire signed', 'war ended'
];

// Strong negative events: -3
const STRONG_NEGATIVE = [
	'civilization destroyed', 'nuclear attack', 'genocide', 'massive death toll',
	'economic collapse', 'market crash', 'total destruction', 'shutdown of research',
	'world war', 'catastrophic', 'irreversible damage', 'sinks', 'killed thousands'
];

export function scoreSentiment(headline: string, snippet = ''): number {
	const text = `${headline} ${snippet}`.toLowerCase();

	for (const phrase of STRONG_POSITIVE) {
		if (text.includes(phrase)) return 3;
	}
	for (const phrase of STRONG_NEGATIVE) {
		if (text.includes(phrase)) return -3;
	}

	let positiveCount = 0;
	let negativeCount = 0;

	for (const word of POSITIVE_SIGNALS) {
		if (text.includes(word)) positiveCount++;
	}
	for (const word of NEGATIVE_SIGNALS) {
		if (text.includes(word)) negativeCount++;
	}

	const net = positiveCount - negativeCount;

	if (net >= 3) return 2;
	if (net >= 1) return 1;
	if (net === 0) return 0;
	if (net >= -2) return -1;
	if (net >= -4) return -2;
	return -3;
}
