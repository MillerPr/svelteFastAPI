<script lang="ts">
	// This route is still rough and not meant for public use, but it allows us to easily view and edit the OLID/PGID values for each title in our database.
	import type { TitleWithAuthor } from '$lib';
	import * as Table from '$lib/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { PUBLIC_API_URL } from '$env/static/public';

	let { data } = $props();
	//$inspect(data);
	let titles: Array<TitleWithAuthor> = $derived(data.titles);

	let displayTitles = $derived(
		titles.map((t: TitleWithAuthor) => ({
			id: t.id,
			created_at: t.created_at,
			title: t.title,
			author: `${t.author_title?.[0]?.authors?.first_name ?? '—'} ${t.author_title?.[0]?.authors?.last_name ?? '—'}`,
			genre: t.genre,
			olid: t.olid,
			pgid: t.pgid
		}))
	);

	let headers = $derived(displayTitles.length > 0 ? Object.keys(displayTitles[0]) : []);
	//$inspect(titles);
	let editingId = $state<number | null>(null);
	let editValues = $state({ olid: '', pgid: '' });
	let isSaving = $state(false);
	function startEditing(title: TitleWithAuthor) {
		editingId = title.id;
		editValues = { olid: title.olid ?? '', pgid: title.pgid ?? '' };
	}

	async function saveChanges(id: number) {
		isSaving = true;
		try {
			const response = await fetch(`${PUBLIC_API_URL}/titles/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify($state.snapshot(editValues))
			});

			if (response.ok) {
				// Update local state so the UI refreshes without a page reload
				const index = titles.findIndex((t) => t.id === id);
				titles[index] = { ...titles[index], ...$state.snapshot(editValues) };
				editingId = null;
			}
		} catch (err) {
			console.error('Save failed:', err);
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="m-4 overflow-x-auto rounded-lg border border-slate-200">
	<Table.Root>
		<Table.Caption>A list of the entire library.</Table.Caption>
		<Table.Header>
			<Table.Row>
				{#each headers as header}
					<Table.Head>{header}</Table.Head>
				{/each}
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each titles as title}
				<Table.Row
					class="cursor-pointer hover:bg-slate-50 {editingId === title.id ? 'bg-indigo-50/50' : ''}"
					onclick={() => {
						// Only trigger "Start Editing" if we aren't already editing THIS row
						if (editingId !== title.id) {
							startEditing(title);
						}
					}}
				>
					<Table.Cell>{title.id}</Table.Cell>
					<Table.Cell>{new Date(title.created_at).toLocaleDateString()}</Table.Cell>
					<Table.Cell>{title.title}</Table.Cell>
					<Table.Cell>
						{title.author_title?.[0]?.authors?.last_name}, {title.author_title?.[0]?.authors
							?.first_name}
					</Table.Cell>
					<Table.Cell>{title.genre}</Table.Cell>

					<Table.Cell onclick={(e) => e.stopPropagation()}>
						{#if editingId === title.id}
							<input
								bind:value={editValues.olid}
								placeholder="OLID..."
								class="w-full rounded border border-indigo-300 p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						{:else}
							<span class="text-slate-600">{title.olid ?? '—'}</span>
						{/if}
					</Table.Cell>

					<Table.Cell onclick={(e) => e.stopPropagation()}>
						{#if editingId === title.id}
							<Input
								bind:value={editValues.pgid}
								placeholder="PGID..."
								class="w-full rounded border border-indigo-300 p-1 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
							/>
						{:else}
							<span class="text-slate-600">{title.pgid ?? '—'}</span>
						{/if}
					</Table.Cell>

					<Table.Cell onclick={(e) => e.stopPropagation()}>
						{#if editingId === title.id}
							<div class="flex gap-2">
								<Button
									onclick={() => saveChanges(title.id)}
									disabled={isSaving}
									class="font-bold text-green-600 hover:underline disabled:opacity-50"
								>
									{isSaving ? '...' : 'Save'}
								</Button>
								<Button
									onclick={() => (editingId = null)}
									class="text-slate-400 hover:text-slate-600"
								>
									Cancel
								</Button>
							</div>
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
