import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = async () => {
	// Fetch all titles
	const response = await fetch(`${PUBLIC_API_URL}titles_by_author`);
	const titles = await response.json();

	return {
		titles
	};
};
