<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	// 1. Receive the authors from the load function
	let { data } = $props();
	$inspect(data);
	let loading = $derived(!data.authors || data.authors.length === 0);

	// 2. Local state for the dynamic selection
	let selectedAuthorId = $state('');
	let titles = $state<any[]>([]);
	$inspect(titles);
	let titleCount = $derived(titles.length);
	let isFetching = $state(false);

	// 3. Effect to fetch books when the selection changes
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
		<p class="text-sm text-muted-foreground italic">No books found for this author.</p>
	{/if}
</div>
