import type { PageServerLoad } from './$types';
import { PUBLIC_API_URL } from '$env/static/public';

export const load: PageServerLoad = async () => {
	// Fetch authors to populate the initial picklist
	const response = await fetch(`${PUBLIC_API_URL}authors`);
	const authors = await response.json();

	return {
		authors
	};
};
