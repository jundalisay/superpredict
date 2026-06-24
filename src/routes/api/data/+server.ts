import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/db/index';
import { us, ph, articleLog } from '$lib/server/db/schema';
import { desc, eq, and, gte } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url }) => {
	const country = url.searchParams.get('country') ?? 'us';
	const days = parseInt(url.searchParams.get('days') ?? '30');

	const db = getDb();

	const cutoffDate = new Date();
	cutoffDate.setDate(cutoffDate.getDate() - days);
	const cutoff = cutoffDate.toISOString().split('T')[0];

	try {
		let rows;
		if (country === 'us') {
			rows = await db
				.select()
				.from(us)
				.where(gte(us.date, cutoff))
				.orderBy(desc(us.date))
				.limit(days);
		} else {
			rows = await db
				.select()
				.from(ph)
				.where(gte(ph.date, cutoff))
				.orderBy(desc(ph.date))
				.limit(days);
		}

		// Also fetch recent article logs for this country
		const logs = await db
			.select()
			.from(articleLog)
			.where(and(eq(articleLog.country, country), gte(articleLog.date, cutoff)))
			.orderBy(desc(articleLog.createdAt))
			.limit(50);

		return json({ rows: rows.reverse(), logs });
	} catch (err) {
		console.error('[api/data] Error:', err);
		return json({ error: 'DB query failed', details: String(err) }, { status: 500 });
	}
};
