<svelte:head>
	<title>About — Supersociology Predict</title>
</svelte:head>

<div class="page">
	<h1 class="page-title">About Supersociology Predict</h1>

	<div class="intro-card">
		<p class="intro-text">
			Supersociology Predict is a daily news intelligence tool that classifies headlines
			into four sociological archetypes and scores them for positive or negative sentiment.
			The result is a quantitative daily pulse of a society's dominant energy.
		</p>
	</div>

	<section class="section">
		<h2 class="section-title">The Four Archetypes</h2>
		<div class="archetype-list">
			{#each [
				{
					icon: '✊',
					color: '#f97316',
					name: 'Worker',
					keywords: ['freedom', 'human rights', 'wages', 'cost of living', 'riots', 'consumers', 'consumer debt', 'divorce', 'civil issues', 'left wing'],
					examples: [
						{ text: 'Minimum wage raised to $18/hr', score: '+2' },
						{ text: 'Inflation hits 8% — households struggling', score: '−2' },
						{ text: 'Workers strike at major auto plant', score: '−1' }
					]
				},
				{
					icon: '⚔',
					color: '#ef4444',
					name: 'Warrior',
					keywords: ['right wing', 'military', 'war', 'regulations', 'taxes', 'populism', 'police', 'spying', 'border'],
					examples: [
						{ text: 'Ceasefire agreement signed in conflict zone', score: '+3' },
						{ text: 'Airstrike kills civilians in disputed region', score: '−3' },
						{ text: 'New surveillance bill passes Congress', score: '−1' }
					]
				},
				{
					icon: '◎',
					color: '#8b5cf6',
					name: 'Thinker',
					keywords: ['religion', 'science', 'philosophy', 'research', 'discovery', 'education', 'innovation', 'AI'],
					examples: [
						{ text: 'Groundbreaking cancer vaccine shows 94% efficacy', score: '+3' },
						{ text: 'Research funding cut by 30% in budget bill', score: '−2' },
						{ text: 'New archaeological find rewrites Bronze Age history', score: '+2' }
					]
				},
				{
					icon: '◈',
					color: '#10b981',
					name: 'Trader',
					keywords: ['money', 'stocks', 'commodities', 'oligarchy', 'neoliberalism', 'privatization', 'corporations', 'executives', 'business', 'GDP'],
					examples: [
						{ text: 'GDP grows 3.2% — strongest quarter in years', score: '+2' },
						{ text: 'Major cargo ship sinks with $2B in goods', score: '−1' },
						{ text: 'Central bank raises rates for 4th time', score: '−1' }
					]
				}
			] as arch}
				<div class="arch-block">
					<div class="arch-header">
						<span class="arch-icon" style="color: {arch.color}">{arch.icon}</span>
						<h3 class="arch-name" style="color: {arch.color}">{arch.name}</h3>
					</div>
					<div class="keywords">
						{#each arch.keywords as kw}
							<span class="keyword">{kw}</span>
						{/each}
					</div>
					<div class="examples">
						{#each arch.examples as ex}
							<div class="example">
								<span class="example-text">{ex.text}</span>
								<span
									class="example-score"
									class:pos={ex.score.startsWith('+')}
									class:neg={ex.score.startsWith('−')}
								>{ex.score}</span>
							</div>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Scoring Method</h2>
		<div class="method-grid">
			<div class="method-card">
				<h4>Step 1 — Scrape</h4>
				<p>Headlines are collected from Rappler (PH) and AP News / NewsNow (US) at midnight local time.</p>
			</div>
			<div class="method-card">
				<h4>Step 2 — Classify</h4>
				<p>Each headline is matched against keyword sets. The archetype with the most keyword matches wins.</p>
			</div>
			<div class="method-card">
				<h4>Step 3 — Score</h4>
				<p>Sentiment signals produce a score from −3 to +3. Positive events add, negative events subtract.</p>
			</div>
			<div class="method-card">
				<h4>Step 4 — Aggregate</h4>
				<p>All article scores for a day are summed. The daily total reflects both volume and intensity.</p>
			</div>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Cron Integration</h2>
		<div class="code-block">
			<p class="code-comment"># Cloudflare Workers cron triggers (wrangler.toml)</p>
			<pre class="code">[[triggers.crons]]
# PH analysis at midnight Philippine time (UTC+8 = 16:00 UTC)
cron = "0 16 * * *"
path = "/api/cron/ph"

[[triggers.crons]]
# US analysis at midnight Eastern time (UTC-5 = 05:00 UTC)
cron = "0 5 * * *"
path = "/api/cron/us"</pre>
			<p class="code-note">
				Set the <code>CRON_SECRET</code> environment variable in your Cloudflare dashboard.
				Pass it as <code>Authorization: Bearer &lt;secret&gt;</code> in cron headers.
			</p>
		</div>
	</section>

	<section class="section">
		<h2 class="section-title">Data Sources</h2>
		<div class="sources">
			<div class="source-item">
				<strong>🇵🇭 Philippines</strong>
				<a href="https://www.rappler.com/latest" target="_blank" rel="noopener">Rappler — rappler.com/latest</a>
				<span>Award-winning Philippine digital newsroom</span>
			</div>
			<div class="source-item">
				<strong>🇺🇸 United States</strong>
				<a href="https://apnews.com/hub/us-news" target="_blank" rel="noopener">AP News — apnews.com</a>
				<span>Associated Press, the most widely distributed US newswire</span>
			</div>
			<div class="source-item">
				<strong>🇺🇸 United States (supplemental)</strong>
				<a href="https://www.newsnow.co.uk/h/World/Americas/USA" target="_blank" rel="noopener">NewsNow USA — newsnow.co.uk</a>
				<span>Aggregated US news headlines from hundreds of sources</span>
			</div>
		</div>
	</section>
</div>

<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		max-width: 900px;
	}

	.page-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.intro-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 12px;
		padding: 1.5rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.intro-text {
		font-size: 0.9375rem;
		color: var(--text-secondary);
		line-height: 1.7;
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-title {
		font-size: 1rem;
		font-weight: 600;
		color: var(--section-heading);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		padding-bottom: 0.5rem;
		border-bottom: 1px solid var(--border-color);
		transition: border-color 0.3s ease;
	}

	.archetype-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.archetype-list {
			grid-template-columns: 1fr;
		}
	}

	.arch-block {
		background: var(--about-arch-bg);
		border: 1px solid var(--about-arch-border);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.875rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.arch-header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.arch-icon {
		font-size: 1.125rem;
	}

	.arch-name {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.375rem;
	}

	.keyword {
		font-size: 0.65rem;
		padding: 0.2rem 0.5rem;
		background: var(--keyword-bg);
		border: 1px solid var(--keyword-border);
		border-radius: 4px;
		color: var(--keyword-text);
		font-family: monospace;
		transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
	}

	.examples {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.example {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.example-text {
		color: var(--about-example-text);
		flex: 1;
	}

	.example-score {
		font-family: monospace;
		font-weight: 700;
		font-size: 0.8rem;
		color: var(--about-example-score);
		flex-shrink: 0;
	}

	.example-score.pos {
		color: var(--trend-up);
	}

	.example-score.neg {
		color: var(--trend-down);
	}

	.method-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 768px) {
		.method-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.method-card {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 10px;
		padding: 1rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.method-card h4 {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--about-method-heading);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 0.5rem;
	}

	.method-card p {
		font-size: 0.75rem;
		color: var(--about-method-text);
		line-height: 1.5;
	}

	.code-block {
		background: var(--code-bg);
		border: 1px solid var(--code-border);
		border-radius: 10px;
		padding: 1.25rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.code-comment {
		font-size: 0.75rem;
		color: var(--code-comment);
		font-family: monospace;
		margin-bottom: 0.75rem;
	}

	.code {
		font-size: 0.75rem;
		color: var(--code-text);
		font-family: monospace;
		white-space: pre-wrap;
		line-height: 1.6;
	}

	.code-note {
		font-size: 0.75rem;
		color: var(--code-note);
		margin-top: 0.75rem;
		line-height: 1.5;
	}

	.code-note code {
		font-family: monospace;
		color: var(--code-inline-text);
		background: var(--code-inline-bg);
		padding: 0.1rem 0.3rem;
		border-radius: 3px;
	}

	.sources {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.source-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 8px;
		padding: 0.875rem 1rem;
		font-size: 0.8125rem;
		flex-wrap: wrap;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.source-item strong {
		color: var(--about-source-strong);
		min-width: 160px;
	}

	.source-item a {
		color: var(--accent-purple-light);
		text-decoration: none;
	}

	.source-item a:hover {
		text-decoration: underline;
	}

	.source-item span {
		color: var(--about-source-span);
		font-size: 0.75rem;
	}
</style>

