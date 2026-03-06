<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { PUBLIC_API_URL } from '$env/static/public';

	let { children } = $props();
	$effect(() => {
		// This will now use Localhost during dev and Render in production
		fetch(`${PUBLIC_API_URL}health`).catch(() => console.log('API is waking up...'));
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
