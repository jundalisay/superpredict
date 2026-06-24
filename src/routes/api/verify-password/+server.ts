import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { RUNCODE } from '$env/static/private';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { password } = await request.json();
		
		if (!password || typeof password !== 'string') {
			return json({ valid: false }, { status: 400 });
		}

		const valid = password === RUNCODE;
		
		return json({ valid });
	} catch (error) {
		return json({ valid: false }, { status: 500 });
	}
};