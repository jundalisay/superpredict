<script lang="ts">
	interface DataRow {
		date: string;
		worker: number;
		warrior: number;
		thinker: number;
		trader: number;
		articleCount: number;
	}

	let { rows = [], title = '' }: { rows: DataRow[]; title: string } = $props();

	const SERIES = [
		{ key: 'worker', label: 'Worker', color: '#f97316', desc: 'Freedom, rights, wages' },
		{ key: 'warrior', label: 'Warrior', color: '#ef4444', desc: 'Military, law, order' },
		{ key: 'thinker', label: 'Thinker', color: '#8b5cf6', desc: 'Science, religion, ideas' },
		{ key: 'trader', label: 'Trader', color: '#10b981', desc: 'Economy, markets, business' }
	] as const;

	type SeriesKey = (typeof SERIES)[number]['key'];

	let activeLines = $state<Set<SeriesKey>>(new Set(['worker', 'warrior', 'thinker', 'trader']));

	const WIDTH = 720;
	const HEIGHT = 320;
	const PADDING = { top: 24, right: 24, bottom: 48, left: 56 };

	const chartW = WIDTH - PADDING.left - PADDING.right;
	const chartH = HEIGHT - PADDING.top - PADDING.bottom;

	const data = $derived(() => {
		if (!rows || rows.length === 0) return null;

		const allValues = rows.flatMap((r) =>
			SERIES.filter((s) => activeLines.has(s.key)).map((s) => r[s.key])
		);

		if (allValues.length === 0) return null;

		const minVal = Math.min(...allValues, 0);
		const maxVal = Math.max(...allValues, 0);
		const range = maxVal - minVal || 10;
		const yMin = minVal - range * 0.1;
		const yMax = maxVal + range * 0.1;

		function xPos(i: number) {
			return PADDING.left + (i / Math.max(rows.length - 1, 1)) * chartW;
		}

		function yPos(val: number) {
			return PADDING.top + chartH - ((val - yMin) / (yMax - yMin)) * chartH;
		}

		function makePath(key: SeriesKey) {
			return rows
				.map(
					(r, i) =>
						`${i === 0 ? 'M' : 'L'} ${xPos(i).toFixed(1)} ${yPos(r[key]).toFixed(1)}`
				)
				.join(' ');
		}

		// Y-axis ticks
		const tickCount = 5;
		const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
			const val = yMin + (i / tickCount) * (yMax - yMin);
			return { val, y: yPos(val) };
		});

		// X-axis ticks (show ~6 labels)
		const step = Math.max(1, Math.floor(rows.length / 6));
		const xTicks = rows
			.filter((_, i) => i === 0 || i === rows.length - 1 || i % step === 0)
			.map((r, _, arr) => ({
				date: formatDate(r.date),
				x: xPos(rows.indexOf(r))
			}));

		const zeroY = yPos(0);

		return { makePath, yTicks, xTicks, zeroY, yMin, yMax };
	});

	function formatDate(d: string) {
		const date = new Date(d + 'T00:00:00');
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}

	function toggleLine(key: SeriesKey) {
		const next = new Set(activeLines);
		if (next.has(key)) {
			if (next.size > 1) next.delete(key);
		} else {
			next.add(key);
		}
		activeLines = next;
	}

	function getLatest(key: SeriesKey) {
		if (!rows || rows.length === 0) return '—';
		const val = rows[rows.length - 1][key];
		return val >= 0 ? `+${val.toFixed(1)}` : val.toFixed(1);
	}
</script>

<div class="chart-card">
	<div class="chart-header">
		<h2 class="chart-title">{title}</h2>
		<div class="legend">
			{#each SERIES as s}
				<button
					class="legend-item"
					class:dimmed={!activeLines.has(s.key)}
					onclick={() => toggleLine(s.key)}
					title={s.desc}
				>
					<span class="legend-dot" style="background: {s.color}"></span>
					<span class="legend-label">{s.label}</span>
					<span class="legend-val" style="color: {s.color}">{getLatest(s.key)}</span>
				</button>
			{/each}
		</div>
	</div>

	{#if rows.length === 0}
		<div class="empty-state">
			<div class="empty-icon">◈</div>
			<p>No data yet. Run the analysis to populate this chart.</p>
		</div>
	{:else}
		{@const d = data()}
		{#if d}
			<svg viewBox="0 0 {WIDTH} {HEIGHT}" class="chart-svg">
				<!-- Grid lines -->
				{#each d.yTicks as tick}
					<line
						x1={PADDING.left}
						y1={tick.y}
						x2={WIDTH - PADDING.right}
						y2={tick.y}
						stroke="#1e1c30"
						stroke-width="1"
					/>
				{/each}

				<!-- Zero line -->
				{#if d.zeroY >= PADDING.top && d.zeroY <= HEIGHT - PADDING.bottom}
					<line
						x1={PADDING.left}
						y1={d.zeroY}
						x2={WIDTH - PADDING.right}
						y2={d.zeroY}
						stroke="#3a3860"
						stroke-width="1.5"
						stroke-dasharray="4 3"
					/>
				{/if}

				<!-- Data lines -->
				{#each SERIES as s}
					{#if activeLines.has(s.key)}
						<path
							d={d.makePath(s.key)}
							fill="none"
							stroke={s.color}
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							opacity="0.9"
						/>
						<!-- Dots at each point -->
						{#each rows as row, i}
							<circle
								cx={PADDING.left + (i / Math.max(rows.length - 1, 1)) * chartW}
								cy={PADDING.top +
									chartH -
									((row[s.key] - (d.yMin || 0)) /
										((d.yMax || 1) - (d.yMin || 0))) *
										chartH}
								r="3"
								fill={s.color}
								opacity="0.7"
							>
								<title>{s.label}: {row[s.key] >= 0 ? '+' : ''}{row[s.key]} on {row.date}</title>
							</circle>
						{/each}
					{/if}
				{/each}

				<!-- Y-axis labels -->
				{#each d.yTicks as tick}
					<text
						x={PADDING.left - 8}
						y={tick.y + 4}
						text-anchor="end"
						font-size="11"
						fill="#5a5880"
						font-family="monospace"
					>
						{tick.val >= 0 ? '+' : ''}{tick.val.toFixed(0)}
					</text>
				{/each}

				<!-- X-axis labels -->
				{#each d.xTicks as tick}
					<text
						x={tick.x}
						y={HEIGHT - 12}
						text-anchor="middle"
						font-size="11"
						fill="#5a5880"
					>
						{tick.date}
					</text>
				{/each}
			</svg>
		{/if}
	{/if}
</div>

<style>
	.chart-card {
		background: #0f0e18;
		border: 1px solid #1e1c30;
		border-radius: 12px;
		padding: 1.5rem;
	}

	.chart-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1.25rem;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.chart-title {
		font-size: 1rem;
		font-weight: 600;
		color: #c8c5e0;
		letter-spacing: -0.01em;
	}

	.legend {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.3rem 0.625rem;
		background: #1a1828;
		border: 1px solid #2a2840;
		border-radius: 6px;
		cursor: pointer;
		transition:
			opacity 0.15s,
			border-color 0.15s;
		font-size: 0.75rem;
		color: #9896b8;
	}

	.legend-item:hover {
		border-color: #3a3860;
	}

	.legend-item.dimmed {
		opacity: 0.35;
	}

	.legend-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
	}

	.legend-val {
		font-variant-numeric: tabular-nums;
		font-family: monospace;
		font-size: 0.8rem;
	}

	.chart-svg {
		width: 100%;
		height: auto;
		display: block;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		gap: 1rem;
		color: #5a5880;
	}

	.empty-icon {
		font-size: 2.5rem;
		opacity: 0.4;
	}

	.empty-state p {
		font-size: 0.875rem;
		text-align: center;
	}
</style>
