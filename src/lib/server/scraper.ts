export interface Article {
	headline: string;
	snippet: string;
	source: string;
	url: string;
}

// Scrape Rappler latest news for PH
export async function scrapeRappler(): Promise<Article[]> {
	const articles: Article[] = [];

	try {
		const res = await fetch('https://www.rappler.com/latest/', {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (compatible; SupersociologyBot/1.0; +https://supersociology.app)',
				Accept: 'text/html,application/xhtml+xml'
			}
		});

		if (!res.ok) throw new Error(`Rappler fetch failed: ${res.status}`);

		const html = await res.text();
		const headlines = extractHeadlines(html, 'rappler');
		articles.push(...headlines);
	} catch (err) {
		console.error('[scraper] Rappler error:', err);
	}

	return articles;
}

// Scrape NewsNow for US news (world/usa section)
export async function scrapeUSNews(): Promise<Article[]> {
	const articles: Article[] = [];
	const sources = [
		{
			url: 'https://www.newsnow.co.uk/h/World/Americas/USA',
			label: 'newsnow-usa'
		},
		{
			url: 'https://apnews.com/hub/us-news',
			label: 'apnews'
		}
	];

	for (const src of sources) {
		try {
			const res = await fetch(src.url, {
				headers: {
					'User-Agent':
						'Mozilla/5.0 (compatible; SupersociologyBot/1.0; +https://supersociology.app)',
					Accept: 'text/html,application/xhtml+xml'
				}
			});

			if (!res.ok) {
				console.warn(`[scraper] ${src.label} returned ${res.status}`);
				continue;
			}

			const html = await res.text();
			const extracted = extractHeadlines(html, src.label);
			articles.push(...extracted);
		} catch (err) {
			console.error(`[scraper] ${src.label} error:`, err);
		}
	}

	return articles;
}

function extractHeadlines(html: string, source: string): Article[] {
	const articles: Article[] = [];
	const seen = new Set<string>();

	// Extract headline patterns from HTML
	// Pattern 1: <a href="...">Headline text</a>
	const anchorPattern = /<a[^>]+href="([^"]+)"[^>]*>([^<]{20,200})<\/a>/gi;
	let match;

	while ((match = anchorPattern.exec(html)) !== null) {
		const url = match[1];
		const text = decodeHtmlEntities(match[2].trim());

		if (!isValidHeadline(text, url, source)) continue;
		if (seen.has(text)) continue;
		seen.add(text);

		articles.push({ headline: text, snippet: '', source, url: normalizeUrl(url, source) });

		if (articles.length >= 80) break;
	}

	// Pattern 2: <h2>/<h3> titles
	const headingPattern = /<h[23][^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h[23]>/gi;
	while ((match = headingPattern.exec(html)) !== null) {
		const url = match[1];
		const text = decodeHtmlEntities(stripTags(match[2]).trim());

		if (!isValidHeadline(text, url, source)) continue;
		if (seen.has(text)) continue;
		seen.add(text);

		articles.push({ headline: text, snippet: '', source, url: normalizeUrl(url, source) });

		if (articles.length >= 100) break;
	}

	return articles;
}

function isValidHeadline(text: string, url: string, source: string): boolean {
	if (text.length < 20 || text.length > 250) return false;
	if (/^(menu|home|login|subscribe|read more|click here|sign up|follow)/i.test(text)) return false;
	if (text.includes('\n') && text.trim().split('\n').length > 3) return false;
	if (!/[a-zA-Z]{3,}/.test(text)) return false;

	// Source-specific URL filters
	if (source === 'rappler' && !url.includes('rappler.com') && !url.startsWith('/')) return false;
	if (source === 'apnews' && !url.includes('apnews.com') && !url.startsWith('/')) return false;

	return true;
}

function decodeHtmlEntities(text: string): string {
	return text
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&nbsp;/g, ' ')
		.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
		.replace(/\s+/g, ' ')
		.trim();
}

function stripTags(html: string): string {
	return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function normalizeUrl(url: string, source: string): string {
	if (url.startsWith('http')) return url;

	const bases: Record<string, string> = {
		rappler: 'https://www.rappler.com',
		'newsnow-usa': 'https://www.newsnow.co.uk',
		apnews: 'https://apnews.com'
	};

	return `${bases[source] ?? ''}${url}`;
}
