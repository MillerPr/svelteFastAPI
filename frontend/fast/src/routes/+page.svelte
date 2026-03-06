<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';

	let { data } = $props();
	//$inspect(data);
	// Wait, just in case the process is slow.
	let loading = $derived(!data.authors || data.authors.length === 0);

	let selectedAuthorId = $state('');
	let titles = $state<any[]>([]);
	//$inspect(titles);
	let titleCount = $derived(titles.length);
	let isFetching = $state(false);

	// Effect to fetch books when the selection changes
	$effect(() => {
		if (selectedAuthorId) {
			isFetching = true; // Start loading
			fetch(`${PUBLIC_API_URL}/titles-by-author/${selectedAuthorId}`)
				.then((res) => res.json())
				.then((val) => {
					titles = val;
					isFetching = false; // End loading
				})
				.catch(() => (isFetching = false));
		} else {
			titles = [];
		}
	});
</script>

<div class="mx-auto max-w-xl space-y-4 p-6">
	<h1 class="text-2xl font-bold">Library Browser</h1>
	<!-- This should not be displayed because I ping the Render backend in +layout.svelte -->
	{#if loading}
		<div class="flex items-center gap-2">
			<div class="h-4 w-4 animate-spin rounded-full border-b-2 border-indigo-600"></div>
			<p>Waking up the database engine (this may take 30s)...</p>
		</div>
	{/if}

	<select bind:value={selectedAuthorId} class="w-full rounded-md border bg-background p-2">
		<option value="">Select an Author...</option>
		{#each data.authors as author}
			<option value={author.id}>
				{author.last_name}, {author.first_name}
			</option>
		{/each}
	</select>

	{#if isFetching}
		<div class="flex items-center gap-2 text-slate-500 italic">
			<div
				class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"
			></div>
			Reticulating spines...
		</div>
	{:else if titles.length > 0}
		<h2>Books ({titleCount})</h2>
		<ul class="divide-y rounded-md border">
			{#each titles as title}
				<li class="p-3"><a href="/{title.olid}">{title.title}</a></li>
			{/each}
		</ul>
	{:else if selectedAuthorId}
		<p class="text-sm text-muted-foreground italic">
			No books found for this author. (Check the backend logs.)
		</p>
	{/if}
</div>
