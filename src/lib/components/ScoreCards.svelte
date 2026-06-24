<script lang="ts">
	interface DataRow {
		date: string;
		worker: number;
		warrior: number;
		thinker: number;
		trader: number;
		articleCount: number;
	}

	let { rows = [] }: { rows: DataRow[] } = $props();

	const CARDS = [
		{
			key: 'worker' as const,
			label: 'Worker',
			icon: '✊',
			color: '#f97316',
			desc: 'Freedom · Rights · Wages · Civil'
		},
		{
			key: 'warrior' as const,
			label: 'Warrior',
			icon: '⚔',
			color: '#ef4444',
			desc: 'Military · Law · Order · Power'
		},
		{
			key: 'thinker' as const,
			label: 'Thinker',
			icon: '◎',
			color: '#8b5cf6',
			desc: 'Science · Religion · Philosophy'
		},
		{
			key: 'trader' as const,
			label: 'Trader',
			icon: '◈',
			color: '#10b981',
			desc: 'Economy · Markets · Business'
		}
	];

	function getValue(key: (typeof CARDS)[number]['key']) {
		if (!rows || rows.length === 0) return null;
		return rows[rows.length - 1][key];
	}

	function getTrend(key: (typeof CARDS)[number]['key']) {
		if (!rows || rows.length < 2) return null;
		const current = rows[rows.length - 1][key];
		const prev = rows[rows.length - 2][key];
		return current - prev;
	}

	function formatScore(val: number | null) {
		if (val === null) return '—';
		return val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1);
	}

	function getTrendIcon(trend: number | null) {
		if (trend === null) return '';
		if (trend > 0.5) return '↑';
		if (trend < -0.5) return '↓';
		return '→';
	}
</script>

<div class="score-grid">
	{#each CARDS as card}
		{@const val = getValue(card.key)}
		{@const trend = getTrend(card.key)}
		<div class="score-card">
			<div class="card-top">
				<span class="card-icon" style="color: {card.color}">{card.icon}</span>
				<span class="card-label" style="color: {card.color}">{card.label}</span>
			</div>
			<div class="card-value" style="color: {card.color}">
				{formatScore(val)}
			</div>
			<div class="card-trend">
				{#if trend !== null}
					<span
						class="trend-indicator"
						class:up={trend > 0}
						class:down={trend < 0}
					>
						{getTrendIcon(trend)}
						{Math.abs(trend).toFixed(1)}
					</span>
					<span class="trend-label">vs prev day</span>
				{/if}
			</div>
			<p class="card-desc">{card.desc}</p>
		</div>
	{/each}
</div>

<style>
	.score-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1024px) {
		.score-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.score-grid {
			grid-template-columns: 1fr;
		}
	}

	.score-card {
		background: var(--card-bg, #0f0e18);
		border: 1px solid var(--card-border, #1e1c30);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.card-icon {
		font-size: 1.125rem;
	}

	.card-label {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.card-value {
		font-size: 2rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.card-trend {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		min-height: 1.25rem;
	}

	.trend-indicator {
		font-size: 0.75rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		color: var(--trend-neutral, #5a5880);
	}

	.trend-indicator.up {
		color: var(--trend-up, #22c55e);
	}

	.trend-indicator.down {
		color: var(--trend-down, #f87171);
	}

	.trend-label {
		font-size: 0.65rem;
		color: var(--trend-label, #3a3860);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.card-desc {
		font-size: 0.7rem;
		color: var(--card-desc, #3a3860);
		margin-top: auto;
		padding-top: 0.25rem;
		border-top: 1px solid var(--card-divider, #1a1828);
	}
</style>