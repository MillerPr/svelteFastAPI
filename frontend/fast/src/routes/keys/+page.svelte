<script lang="ts">
	import type { TitleWithAuthor } from '$lib';

	let { data } = $props();
	$inspect(data);
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
</script>

<div class="overflow-x-auto rounded-lg border border-slate-200">
	<table class="w-full border-collapse text-left">
		<thead>
			<tr>
				{#each headers as header}
					<th
						class="border-b border-slate-200 bg-slate-50 p-4 pt-0 pb-3 font-medium text-slate-900"
					>
						{header}
					</th>
				{/each}
			</tr>
		</thead>

		<tbody class="divide-y divide-slate-100 border-t border-slate-200">
			{#each titles as title}
				<tr
					class="hover:bg-slate-50"
					onclick={() => (editingId = editingId === title.id ? null : title.id)}
				>
					<td class="p-4">{title.id}</td>
					<td class="p-4">{new Date(title.created_at).toLocaleDateString()}</td>
					<td class="p-4">{title.title}</td>
					<td class="p-4 pr-8">
						{title.author_title?.[0]?.authors?.last_name ?? '—'}, {title.author_title?.[0]?.authors
							?.first_name ?? '—'}</td
					>
					<td class="p-4 pr-8">{title.genre}</td>
					<td class="p-4 pr-8">{title.olid}</td>
					<td class="p-4 pr-8">{title.pgid}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
