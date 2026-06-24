<script lang="ts">
	interface ArticleLog {
		id: number;
		country: string;
		date: string;
		headline: string;
		category: string;
		score: number;
		source: string;
	}

	let { logs = [] }: { logs: ArticleLog[] } = $props();

	const CATEGORY_CONFIG = {
		worker: { color: '#f97316', icon: '✊' },
		warrior: { color: '#ef4444', icon: '⚔' },
		thinker: { color: '#8b5cf6', icon: '◎' },
		trader: { color: '#10b981', icon: '◈' }
	} as const;

	let filter = $state<string>('all');

	const filtered = $derived(
		filter === 'all' ? logs : logs.filter((l) => l.category === filter)
	);
</script>

<div class="log-card">
	<div class="log-header">
		<h3 class="log-title">Recent Articles</h3>
		<div class="filter-tabs">
			{#each ['all', 'worker', 'warrior', 'thinker', 'trader'] as cat}
				<button
					class="filter-tab"
					class:active={filter === cat}
					onclick={() => (filter = cat)}
				>
					{#if cat !== 'all'}
						<span style="color: {CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.color}">
							{CATEGORY_CONFIG[cat as keyof typeof CATEGORY_CONFIG]?.icon}
						</span>
					{/if}
					{cat}
				</button>
			{/each}
		</div>
	</div>

	{#if filtered.length === 0}
		<p class="log-empty">No articles logged yet.</p>
	{:else}
		<ul class="log-list">
			{#each filtered.slice(0, 20) as log}
				{@const cfg = CATEGORY_CONFIG[log.category as keyof typeof CATEGORY_CONFIG]}
				<li class="log-item">
					<span class="log-icon" style="color: {cfg?.color}">{cfg?.icon}</span>
					<div class="log-body">
						<p class="log-headline">{log.headline}</p>
						<div class="log-meta">
							<span class="log-source">{log.source}</span>
							<span class="log-date">{log.date}</span>
							<span
								class="log-score"
								class:positive={log.score > 0}
								class:negative={log.score < 0}
							>
								{log.score >= 0 ? '+' : ''}{log.score}
							</span>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.log-card {
		background: #0f0e18;
		border: 1px solid #1e1c30;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.log-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.log-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: #c8c5e0;
	}

	.filter-tabs {
		display: flex;
		gap: 4px;
	}

	.filter-tab {
		padding: 0.25rem 0.5rem;
		border-radius: 5px;
		font-size: 0.7rem;
		background: #1a1828;
		border: 1px solid #2a2840;
		color: #5a5880;
		cursor: pointer;
		text-transform: capitalize;
		display: flex;
		align-items: center;
		gap: 3px;
		transition: all 0.15s;
	}

	.filter-tab:hover {
		border-color: #3a3860;
		color: #9896b8;
	}

	.filter-tab.active {
		background: #1e1a38;
		border-color: #4a4880;
		color: #c8c5e0;
	}

	.log-empty {
		color: #3a3860;
		font-size: 0.875rem;
		text-align: center;
		padding: 2rem;
	}

	.log-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 0;
	}

	.log-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		padding: 0.75rem 0;
		border-bottom: 1px solid #141224;
	}

	.log-item:last-child {
		border-bottom: none;
	}

	.log-icon {
		font-size: 0.875rem;
		flex-shrink: 0;
		margin-top: 1px;
		width: 16px;
		text-align: center;
	}

	.log-body {
		flex: 1;
		min-width: 0;
	}

	.log-headline {
		font-size: 0.8125rem;
		color: #c8c5e0;
		line-height: 1.4;
		margin-bottom: 0.25rem;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.log-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.7rem;
	}

	.log-source {
		color: #3a3860;
		font-style: italic;
	}

	.log-date {
		color: #2a2848;
	}

	.log-score {
		font-family: monospace;
		font-size: 0.75rem;
		font-weight: 600;
		color: #5a5880;
	}

	.log-score.positive {
		color: #22c55e;
	}

	.log-score.negative {
		color: #f87171;
	}
</style>
