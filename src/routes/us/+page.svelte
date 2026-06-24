<script lang="ts">
	import { onMount } from 'svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import ScoreCards from '$lib/components/ScoreCards.svelte';
	import ArticleLog from '$lib/components/ArticleLog.svelte';

	interface DataRow {
		date: string;
		worker: number;
		warrior: number;
		thinker: number;
		trader: number;
		articleCount: number;
	}

	interface ArticleLog {
		id: number;
		country: string;
		date: string;
		headline: string;
		category: string;
		score: number;
		source: string;
	}

	let rows = $state<DataRow[]>([]);
	let logs = $state<ArticleLog[]>([]);
	let loading = $state(true);
	let days = $state(30);
	let running = $state(false);
	let runResult = $state('');
	let showPasswordPopup = $state(false);
	let passwordInput = $state('');
	let passwordError = $state('');

	async function load() {
		loading = true;
		try {
			const res = await fetch(`/api/data?country=us&days=${days}`);
			const data = await res.json();
			rows = data.rows ?? [];
			logs = data.logs ?? [];
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function openPasswordPopup() {
		showPasswordPopup = true;
		passwordInput = '';
		passwordError = '';
	}

	function closePasswordPopup() {
		showPasswordPopup = false;
		passwordInput = '';
		passwordError = '';
	}

	async function verifyAndRun() {
		passwordError = '';
		
		if (!passwordInput.trim()) {
			passwordError = 'Please enter the password';
			return;
		}

		// Verify the password
		try {
			const verifyRes = await fetch('/api/verify-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password: passwordInput })
			});

			if (!verifyRes.ok) {
				passwordError = 'Invalid password';
				return;
			}

			const { valid } = await verifyRes.json();
			
			if (!valid) {
				passwordError = 'Invalid password';
				return;
			}

			// Password is valid, close popup and run analysis
			closePasswordPopup();
			await triggerAnalysis();
		} catch (e) {
			passwordError = 'Verification failed';
		}
	}

	async function triggerAnalysis() {
		running = true;
		runResult = '';
		try {
			const res = await fetch('/api/trigger', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ country: 'us' })
			});
			const data = await res.json();
			if (data.success) {
				runResult = `Done! Worker: ${data.results.us?.worker?.toFixed(1) ?? 0}, Warrior: ${data.results.us?.warrior?.toFixed(1) ?? 0}, Thinker: ${data.results.us?.thinker?.toFixed(1) ?? 0}, Trader: ${data.results.us?.trader?.toFixed(1) ?? 0} (${data.results.us?.articleCount ?? 0} articles)`;
				await load();
			} else {
				runResult = `Error: ${data.error ?? 'Unknown'}`;
			}
		} catch (e) {
			runResult = `Error: ${e}`;
		} finally {
			running = false;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			verifyAndRun();
		} else if (event.key === 'Escape') {
			closePasswordPopup();
		}
	}

	onMount(load);

	$effect(() => {
		load();
	});
</script>

<svelte:head>
	<title>US Dashboard — Supersociology Predict</title>
</svelte:head>

<div class="page">
	<div class="page-header">
		<div>
			<div class="page-eyebrow">🇺🇸 United States</div>
			<h1 class="page-title">News Archetype Dashboard</h1>
			<p class="page-sub">Daily sociological pulse from US news sources</p>
		</div>

		<div class="controls">
			<select
				bind:value={days}
				onchange={load}
				class="day-select"
			>
				<option value={7}>7 days</option>
				<option value={14}>14 days</option>
				<option value={30}>30 days</option>
				<option value={60}>60 days</option>
				<option value={90}>90 days</option>
			</select>

			<button onclick={openPasswordPopup} class="run-btn" disabled={running}>
				{#if running}
					<span class="btn-spinner"></span> Analyzing…
				{:else}
					▶ Run Now
				{/if}
			</button>
		</div>
	</div>

	{#if runResult}
		<div class="run-result" class:error={runResult.startsWith('Error')}>
			{runResult}
		</div>
	{/if}

	<div class="info-bar">
		<span>Sources: AP News, NewsNow USA</span>
		<span>Scheduled: midnight US Eastern time</span>
		<span>{rows.length} days of data</span>
	</div>

	{#if loading}
		<div class="loading">
			<div class="spinner"></div>
			<span>Loading US data…</span>
		</div>
	{:else}
		<ScoreCards {rows} />
		<LineChart {rows} title="US — Sociological Pulse" />

		<div class="how-section">
			<h3 class="how-title">How scores work</h3>
			<div class="how-grid">
				{#each [
					{ label: 'Classification', text: 'Each article is matched against keyword sets for Worker, Warrior, Thinker, and Trader archetypes.' },
					{ label: 'Sentiment', text: 'Positive events (growth, peace, discovery) add points. Negative events (crash, war, scandal) subtract.' },
					{ label: 'Scale', text: 'Scores range from −3 to +3 per article. Strong events like "lasting peace deal" score the maximum.' },
					{ label: 'Daily total', text: 'All article scores are summed into daily totals for each archetype. Larger totals = more news coverage + intensity.' }
				] as h}
					<div class="how-card">
						<h4 class="how-label">{h.label}</h4>
						<p class="how-text">{h.text}</p>
					</div>
				{/each}
			</div>
		</div>

		<ArticleLog {logs} />
	{/if}
</div>

<!-- Password Popup -->
{#if showPasswordPopup}
	<div class="popup-overlay" onclick={closePasswordPopup} onkeydown={handleKeydown} role="dialog" aria-modal="true">
		<div class="popup-content" onclick={(e) => e.stopPropagation()} onkeydown={handleKeydown}>
			<h3 class="popup-title">Enter Run Code</h3>
			<p class="popup-desc">Enter the secret code to trigger the analysis</p>
			
			<input
				type="password"
				bind:value={passwordInput}
				placeholder="Enter secret code…"
				class="popup-input"
				autofocus
				onkeydown={handleKeydown}
			/>

			{#if passwordError}
				<p class="popup-error">{passwordError}</p>
			{/if}

			<div class="popup-actions">
				<button onclick={closePasswordPopup} class="popup-btn popup-btn-cancel">
					Cancel
				</button>
				<button onclick={verifyAndRun} class="popup-btn popup-btn-submit">
					Run Analysis
				</button>
			</div>
		</div>
	</div>
{/if}

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

	.page-eyebrow {
		font-size: 0.75rem;
		color: var(--text-muted);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		margin-bottom: 0.25rem;
	}

	.page-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.02em;
	}

	.page-sub {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-top: 0.25rem;
	}

	.controls {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.day-select {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 7px;
		color: var(--text-secondary);
		padding: 0.5rem 0.75rem;
		font-size: 0.8125rem;
		cursor: pointer;
	}

	.run-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--bg-active);
		border: 1px solid var(--accent-purple);
		border-radius: 7px;
		color: var(--accent-purple-light);
		padding: 0.5rem 1rem;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.run-btn:hover:not(:disabled) {
		background: var(--nav-hover-bg);
		border-color: var(--accent-purple-light);
	}

	.run-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-spinner {
		width: 12px;
		height: 12px;
		border: 2px solid var(--border-color);
		border-top-color: var(--accent-purple-light);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
		display: inline-block;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.run-result {
		padding: 0.75rem 1rem;
		border-radius: 8px;
		font-size: 0.8125rem;
		background: var(--card-bg);
		border: 1px solid var(--trend-up);
		color: var(--trend-up);
	}

	.run-result.error {
		border-color: var(--trend-down);
		color: var(--trend-down);
	}

	.info-bar {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		font-size: 0.7rem;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.loading {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 4rem 2rem;
		color: var(--text-muted);
		font-size: 0.875rem;
	}

	.spinner {
		width: 20px;
		height: 20px;
		border: 2px solid var(--border-color);
		border-top-color: var(--accent-purple);
		border-radius: 50%;
		animation: spin 0.7s linear infinite;
	}

	.how-section {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 12px;
		padding: 1.5rem;
		transition: background-color 0.3s ease, border-color 0.3s ease;
	}

	.how-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text-secondary);
		margin-bottom: 1rem;
	}

	.how-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1024px) {
		.how-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.how-grid {
			grid-template-columns: 1fr;
		}
	}

	.how-card {
		background: var(--bg-primary);
		border-radius: 8px;
		padding: 1rem;
	}

	.how-label {
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.06em;
		margin-bottom: 0.5rem;
	}

	.how-text {
		font-size: 0.75rem;
		color: var(--text-muted);
		line-height: 1.5;
	}

	/* Popup Styles */
	.popup-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.2s ease;
	}

	@keyframes fadeIn {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	.popup-content {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		border-radius: 12px;
		padding: 2rem;
		max-width: 400px;
		width: 90%;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
		animation: slideUp 0.3s ease;
	}

	@keyframes slideUp {
		from { transform: translateY(20px); opacity: 0; }
		to { transform: translateY(0); opacity: 1; }
	}

	.popup-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 0.5rem;
	}

	.popup-desc {
		font-size: 0.8125rem;
		color: var(--text-muted);
		margin-bottom: 1.25rem;
	}

	.popup-input {
		width: 100%;
		padding: 0.75rem 1rem;
		background: var(--bg-primary);
		border: 1px solid var(--border-color);
		border-radius: 8px;
		color: var(--text-primary);
		font-size: 0.875rem;
		font-family: monospace;
		margin-bottom: 0.75rem;
		transition: border-color 0.15s;
	}

	.popup-input:focus {
		outline: none;
		border-color: var(--accent-purple);
	}

	.popup-input::placeholder {
		color: var(--text-muted);
	}

	.popup-error {
		font-size: 0.75rem;
		color: var(--trend-down);
		margin-bottom: 0.75rem;
	}

	.popup-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: flex-end;
		margin-top: 1rem;
	}

	.popup-btn {
		padding: 0.625rem 1.25rem;
		border-radius: 7px;
		font-size: 0.8125rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.popup-btn-cancel {
		background: var(--card-bg);
		border: 1px solid var(--card-border);
		color: var(--text-secondary);
	}

	.popup-btn-cancel:hover {
		background: var(--nav-hover-bg);
	}

	.popup-btn-submit {
		background: var(--accent-purple);
		border: 1px solid var(--accent-purple);
		color: white;
	}

	.popup-btn-submit:hover {
		background: var(--accent-purple-light);
		border-color: var(--accent-purple-light);
	}
</style>

