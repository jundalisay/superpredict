import type { RequestHandler } from './$types';
import { runUsAnalysis } from '$lib/server/analysis';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('authorization');
	const cronSecret = process.env.CRON_SECRET ?? 'dev-secret';

	if (authHeader !== `Bearer ${cronSecret}`) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const totals = await runUsAnalysis();
		return json({ success: true, totals });
	} catch (err) {
		console.error('[cron/us] Error:', err);
		return json({ error: 'Analysis failed', details: String(err) }, { status: 500 });
	}
};
