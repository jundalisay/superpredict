<script lang="ts">
	import { onMount } from 'svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import ScoreCards from '$lib/components/ScoreCards.svelte';

	interface DataRow {
		date: string;
		worker: number;
		warrior: number;
		thinker: number;
		trader: number;
		articleCount: number;
	}

	let usRows = $state<DataRow[]>([]);
	let phRows = $state<DataRow[]>([]);
	let loading = $state(true);

	onMount(async () => {
		try {
			const [usRes, phRes] = await Promise.all([
				fetch('/api/data?country=us&days=14'),
				fetch('/api/data?country=ph&days=14')
			]);
			const usData = await usRes.json();
			const phData = await phRes.json();
			usRows = usData.rows ?? [];
			phRows = phData.rows ?? [];
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Supersociology Predict — Overview</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<div>
			<h1 class="page-title">Supersociology Predict</h1>
			<p class="page-sub">
				Daily news pulse scored across four sociological archetypes
			</p>
		</div>
		<div class="header-badges">
			<span class="badge badge-ph">🇵🇭 PH</span>
			<span class="badge badge-us">🇺🇸 US</span>
		</div>
	</div>

	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<span>Loading data…</span>
		</div>
	{:else}
		<section class="section">
			<div class="section-heading">
				<span class="section-flag">🇺🇸</span>
				<h2>United States — Latest</h2>
			</div>
			<ScoreCards rows={usRows} />
		</section>

		<section class="section">
			<LineChart rows={usRows} title="US — 14-day pulse" />
		</section>

		<section class="section">
			<div class="section-heading">
				<span class="section-flag">🇵🇭</span>
				<h2>Philippines — Latest</h2>
			</div>
			<ScoreCards rows={phRows} />
		</section>

		<section class="section">
			<LineChart rows={phRows} title="PH — 14-day pulse" />
		</section>

		<div class="archetype-grid">
			{#each [
				{ icon: '✊', label: 'Worker', color: '#f97316', desc: 'Tracks social dynamics around freedom, human rights, wages, civil movements, and consumer welfare.' },
				{ icon: '⚔', label: 'Warrior', color: '#ef4444', desc: 'Monitors military actions, law enforcement, geopolitical conflicts, and state power expressions.' },
				{ icon: '◎', label: 'Thinker', color: '#8b5cf6', desc: 'Captures scientific discoveries, religious developments, philosophical debates, and educational shifts.' },
				{ icon: '◈', label: 'Trader', color: '#10b981', desc: 'Measures economic news, market movements, corporate activity, and financial system health.' }
			] as arch}
				<div class="arch-card">
					<div class="arch-icon" style="color: {arch.color}">{arch.icon}</div>
					<h3 class="arch-label" style="color: {arch.color}">{arch.label}</h3>
					<p class="arch-desc">{arch.desc}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>



<style>
	.page {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 1100px;
	}

	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.page-title {
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.page-sub {
		font-size: 0.875rem;
		color: var(--page-sub-color);
		margin-top: 0.25rem;
	}

	.header-badges {
		display: flex;
		gap: 0.5rem;
		align-items: center;
		margin-top: 0.25rem;
	}

	.badge {
		padding: 0.375rem 0.75rem;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.badge-us {
		background: var(--badge-bg);
		border: 1px solid var(--badge-border);
		color: var(--badge-text);
	}

	.badge-ph {
		background: var(--badge-bg);
		border: 1px solid var(--badge-border);
		color: var(--badge-text);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.section-heading {
		display: flex;
		align-items: center;
		gap: 0.625rem;
	}

	.section-flag {
		font-size: 1.25rem;
	}

	.section-heading h2 {
		font-size: 1rem;
		font-weight: 600;
		color: var(--section-heading);
		letter-spacing: -0.01em;
	}

	.loading {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 4rem 2rem;
		color: var(--loading-color);
		font-size: 0.875rem;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--spinner-border);
		border-top-color: var(--spinner-accent);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.archetype-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1024px) {
		.archetype-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.archetype-grid {
			grid-template-columns: 1fr;
		}
	}

	.arch-card {
		background: var(--arch-card-bg);
		border: 1px solid var(--arch-card-border);
		border-radius: 12px;
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.arch-icon {
		font-size: 1.5rem;
	}

	.arch-label {
		font-size: 0.875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.arch-desc {
		font-size: 0.75rem;
		color: var(--arch-desc);
		line-height: 1.5;
	}
</style>
