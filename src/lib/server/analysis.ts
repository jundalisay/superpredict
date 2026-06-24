import { scrapeRappler, scrapeUSNews } from './scraper';
import { classifyArticle, scoreSentiment } from './classifier';
import { getDb } from './db/index';
import { us, ph, articleLog } from './db/schema';
import { eq } from 'drizzle-orm';

export interface DailyTotals {
	worker: number;
	warrior: number;
	thinker: number;
	trader: number;
	articleCount: number;
}

async function getDateString(timezone: 'Asia/Manila' | 'America/New_York'): Promise<string> {
	const now = new Date();
	return now.toLocaleDateString('en-CA', { timeZone: timezone });
}

export async function runPhAnalysis(): Promise<DailyTotals> {
	const db = getDb();
	const date = await getDateString('Asia/Manila');

	const articles = await scrapeRappler();
	const totals: DailyTotals = { worker: 0, warrior: 0, thinker: 0, trader: 0, articleCount: 0 };

	const logs: (typeof articleLog.$inferInsert)[] = [];

	for (const article of articles) {
		const category = classifyArticle(article.headline, article.snippet);
		if (!category) continue;

		const score = scoreSentiment(article.headline, article.snippet);
		totals[category] += score;
		totals.articleCount++;

		logs.push({
			country: 'ph',
			date,
			headline: article.headline.slice(0, 500),
			category,
			score,
			source: article.source,
			createdAt: new Date().toISOString()
		});
	}

	const existing = await db.select().from(ph).where(eq(ph.date, date)).limit(1);

	if (existing.length > 0) {
		await db
			.update(ph)
			.set({
				worker: (existing[0].worker || 0) + totals.worker,
				warrior: (existing[0].warrior || 0) + totals.warrior,
				thinker: (existing[0].thinker || 0) + totals.thinker,
				trader: (existing[0].trader || 0) + totals.trader,
				articleCount: (existing[0].articleCount || 0) + totals.articleCount
			})
			.where(eq(ph.date, date));
	} else {
		await db.insert(ph).values({
			date,
			worker: totals.worker,
			warrior: totals.warrior,
			thinker: totals.thinker,
			trader: totals.trader,
			articleCount: totals.articleCount,
			createdAt: new Date().toISOString()
		});
	}

	if (logs.length > 0) {
		await db.insert(articleLog).values(logs);
	}

	return totals;
}

export async function runUsAnalysis(): Promise<DailyTotals> {
	const db = getDb();
	const date = await getDateString('America/New_York');

	const articles = await scrapeUSNews();
	const totals: DailyTotals = { worker: 0, warrior: 0, thinker: 0, trader: 0, articleCount: 0 };

	const logs: (typeof articleLog.$inferInsert)[] = [];

	for (const article of articles) {
		const category = classifyArticle(article.headline, article.snippet);
		if (!category) continue;

		const score = scoreSentiment(article.headline, article.snippet);
		totals[category] += score;
		totals.articleCount++;

		logs.push({
			country: 'us',
			date,
			headline: article.headline.slice(0, 500),
			category,
			score,
			source: article.source,
			createdAt: new Date().toISOString()
		});
	}

	const existing = await db.select().from(us).where(eq(us.date, date)).limit(1);

	if (existing.length > 0) {
		await db
			.update(us)
			.set({
				worker: (existing[0].worker || 0) + totals.worker,
				warrior: (existing[0].warrior || 0) + totals.warrior,
				thinker: (existing[0].thinker || 0) + totals.thinker,
				trader: (existing[0].trader || 0) + totals.trader,
				articleCount: (existing[0].articleCount || 0) + totals.articleCount
			})
			.where(eq(us.date, date));
	} else {
		await db.insert(us).values({
			date,
			worker: totals.worker,
			warrior: totals.warrior,
			thinker: totals.thinker,
			trader: totals.trader,
			articleCount: totals.articleCount,
			createdAt: new Date().toISOString()
		});
	}

	if (logs.length > 0) {
		await db.insert(articleLog).values(logs);
	}

	return totals;
}
