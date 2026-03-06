<script lang="ts">
	import type { OpenLibraryWork } from '$lib';

	let { data } = $props();
	//parse the open library data to display all the book metadata on the page
	const book: OpenLibraryWork = $derived(data.book);
</script>

<div class="mx-auto max-w-xl space-y-4 p-6">
	<div>
		<a href="/" class="text-blue-500 hover:underline">Back to Search</a>
	</div>
	<h1 class="text-2xl font-bold">{book.title}</h1>

	<div class="space-y-2">
		{#if book.first_publish_date}
			<p><strong>First published:</strong> {book.first_publish_date}</p>
		{/if}
		{#if typeof book.description === 'object' && book.description && 'value' in book.description}
			<p><strong>Description:</strong> {@html book.description.value}</p>
		{:else if typeof book.description === 'string'}
			<p><strong>Description:</strong> {@html book.description}</p>
		{/if}

		{#if book.first_sentence?.value}
			<p><strong>First Sentence:</strong> {book.first_sentence.value}</p>
		{/if}
		{#if book.first_sentence}
			<p><strong>First Sentence:</strong> {book.first_sentence}</p>
		{/if}
		{#if book.links && book.links.length > 0}
			<div>
				<strong>Links:</strong>
				<ul class="list-disc pl-5">
					{#each book.links as link}
						<li>
							<a href={link.url} class="text-blue-500 hover:underline" target="_blank"
								>{link.title}</a
							>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
		{#if book.covers && book.covers.length > 0}
			<div class="m4-2 grid grid-cols-4 place-items-center">
				{#each book.covers as coverId}
					<img
						src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
						alt="Book Cover"
						class="rounded px-2 shadow"
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
