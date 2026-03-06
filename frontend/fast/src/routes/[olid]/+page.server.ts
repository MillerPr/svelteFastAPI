import type { OpenLibraryWork } from '$lib/index';

//get params as props and query the open library by book id
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { olid } = params;
	const response = await fetch(`https://openlibrary.org/works/${olid}.json`);
	const bookData = await response.json();

	return {
		book: bookData as OpenLibraryWork
	};
};
