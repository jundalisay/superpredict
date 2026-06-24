import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { runPhAnalysis, runUsAnalysis } from '$lib/server/analysis';

export const POST: RequestHandler = async ({ request }) => {
	// Only allow in development
	if (process.env.NODE_ENV === 'production') {
		return json({ error: 'Not available in production' }, { status: 403 });
	}

	const body = await request.json().catch(() => ({}));
	const country = body.country ?? 'both';

	try {
		const results: Record<string, unknown> = {};

		if (country === 'ph' || country === 'both') {
			results.ph = await runPhAnalysis();
		}
		if (country === 'us' || country === 'both') {
			results.us = await runUsAnalysis();
		}

		return json({ success: true, results });
	} catch (err) {
		return json({ error: String(err) }, { status: 500 });
	}
};
