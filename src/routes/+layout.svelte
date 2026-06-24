<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let { children } = $props();

	const navItems = [
		{ href: '/', label: 'Overview', icon: '◈' },
		{ href: '/us', label: 'United States', icon: '★' },
		{ href: '/ph', label: 'Philippines', icon: '☀' },
		{ href: '/about', label: 'About', icon: '?' }
	];

	import { onMount } from 'svelte';
	import '../app.css'; // Ensure your global styles are imported

	let isDark = false;

	// Check the initial theme on component mount
	onMount(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	// Function to toggle the theme and save it to localStorage
	function toggleTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>



<div class="app-shell layout">
	<nav class="sidebar">
		<div class="brand">
			<div class="brand-mark">S</div>
			<div class="brand-text">
				<span class="brand-title">Super</span>
				<span class="brand-sub">sociology</span>
			</div>
		</div>

		<ul class="nav-list">
			<button on:click={toggleTheme}>
				{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
			</button>

			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class="nav-item"
						class:active={$page.url.pathname === item.href}
					>
						<span class="nav-icon">{item.icon}</span>
						<span class="nav-label">{item.label}</span>
					</a>
				</li>
			{/each}
		</ul>

		<div class="sidebar-footer">
			<div class="predict-label">PREDICT</div>
		</div>
	</nav>

	<main class="main-content">
		{@render children()}
	</main>
</div>



<style>
	.layout {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	header nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		padding-bottom: 1rem;
		border-bottom: 1px solid var(--border-color);
	}

	:global(*) {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	:global(body) {
		font-family:
			'Inter',
			system-ui,
			-apple-system,
			sans-serif;
		background: var(--bg-primary);
		color: var(--text-primary);
		min-height: 100vh;
	}

	.app-shell {
		display: flex;
		min-height: 100vh;
	}

	.sidebar {
		width: 220px;
		background: var(--bg-sidebar);
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		padding: 1.5rem 1rem;
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		z-index: 100;
	}

	.brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 2.5rem;
		padding: 0 0.5rem;
	}

	.brand-mark {
		width: 36px;
		height: 36px;
		background: var(--brand-gradient);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.25rem;
		font-weight: 700;
		color: white;
		flex-shrink: 0;
	}

	.brand-text {
		display: flex;
		flex-direction: column;
		line-height: 1.1;
	}

	.brand-title {
		font-size: 0.95rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.01em;
	}

	.brand-sub {
		font-size: 0.7rem;
		color: var(--text-muted);
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}

	.nav-list {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.625rem;
		padding: 0.625rem 0.75rem;
		border-radius: 8px;
		text-decoration: none;
		color: var(--nav-text);
		font-size: 0.875rem;
		font-weight: 500;
		transition:
			background 0.15s,
			color 0.15s;
	}

	.nav-item:hover {
		background: var(--nav-hover-bg);
		color: var(--nav-hover-text);
	}

	.nav-item.active {
		background: var(--bg-active);
		color: var(--accent-purple-light);
	}

	.nav-icon {
		font-size: 0.875rem;
		width: 18px;
		text-align: center;
	}

	.sidebar-footer {
		margin-top: auto;
		padding: 0.5rem;
	}

	.predict-label {
		font-size: 0.6rem;
		letter-spacing: 0.2em;
		color: var(--predict-label);
		text-align: center;
		font-weight: 700;
	}

	.main-content {
		flex: 1;
		margin-left: 220px;
		min-height: 100vh;
		padding: 2rem;
	}

	@media (max-width: 768px) {
		.sidebar {
			width: 60px;
		}

		.brand-text,
		.nav-label {
			display: none;
		}

		.brand-mark {
			margin: 0 auto;
		}

		.main-content {
			margin-left: 60px;
		}
	}
</style>


