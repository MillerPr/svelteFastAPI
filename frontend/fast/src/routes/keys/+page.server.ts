import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Fetch all titles
	const response = await fetch('http://localhost:8000/titles_by_author');
	const titles = await response.json();

	return {
		titles
	};
};
