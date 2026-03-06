import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Fetch authors to populate the initial picklist
	const response = await fetch('http://localhost:8000/authors');
	const authors = await response.json();

	return {
		authors
	};
};
