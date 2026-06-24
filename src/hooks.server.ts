// This file handles Cloudflare Workers scheduled events (cron triggers)
// It is imported by the Cloudflare adapter automatically

export default {
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		const hour = new Date(event.scheduledTime).getUTCHours();

		// 16:00 UTC = midnight PH time (UTC+8)
		// 05:00 UTC = midnight US Eastern time (UTC-5)
		const isPh = hour === 16;
		const isUs = hour === 5;

		const baseUrl = env.PUBLIC_ORIGIN ?? 'https://supersociology.pages.dev';
		const secret = env.CRON_SECRET ?? '';

		if (isPh) {
			ctx.waitUntil(
				fetch(`${baseUrl}/api/cron/ph`, {
					method: 'POST',
					headers: { Authorization: `Bearer ${secret}` }
				}).then(async (r) => {
					const body = await r.json();
					console.log('[cron] PH analysis result:', JSON.stringify(body));
				})
			);
		}

		if (isUs) {
			ctx.waitUntil(
				fetch(`${baseUrl}/api/cron/us`, {
					method: 'POST',
					headers: { Authorization: `Bearer ${secret}` }
				}).then(async (r) => {
					const body = await r.json();
					console.log('[cron] US analysis result:', JSON.stringify(body));
				})
			);
		}
	}
};

interface Env {
	PUBLIC_ORIGIN?: string;
	CRON_SECRET?: string;
}
