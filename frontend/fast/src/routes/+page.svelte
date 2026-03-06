<script lang="ts">
	import { PUBLIC_API_URL } from '$env/static/public';
	import * as Select from '$lib/components/ui/select';

	let { data } = $props();
	//$inspect(data);
	// Wait, just in case the process is slow.
	let loading = $derived(!data.authors || data.authors.length === 0);

	let selectedAuthorId = $state('');
	let titles = $state<any[]>([]);
	//$inspect(titles);
	let titleCount = $derived(titles.length);
	let isFetching = $state(false);
	let selectOptions: Array<{ value: string; label: string }> = $derived(
		data.authors.map((author: { id: string; last_name: string; first_name: string }) => ({
			value: author.id,
			label: `${author.last_name}, ${author.first_name}`
		}))
	);
	const triggerContent = $derived(
		selectOptions.find((f) => f.value === selectedAuthorId)?.label ?? 'Select an author'
	);

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

	<Select.Root type="single" name="favoriteFruit" bind:value={selectedAuthorId}>
		<Select.Trigger class="w-96" aria-label="Select an author">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Authors</Select.Label>
				{#each selectOptions as option (option.value)}
					<Select.Item
						value={option.value}
						label={option.label}
						disabled={option.value === 'grapes'}
					>
						{option.label}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>

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
