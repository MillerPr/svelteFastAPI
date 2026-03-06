export type Author = {
	first_name: string;
	last_name: string;
};

export type Title = {
	id: number;
	title: string;
	genre: string;
	olid: string;
	pbid: string;
};

export type TitleWithAuthor = {
	id: number;
	created_at: string;
	title: string;
	author_title: Array<{
		authors: {
			first_name: string;
			last_name: string;
		};
	}>;
	genre: string;
	olid: string;
	pgid: string;
};

export type OpenLibraryWork = {
	title: string;
	key: string; // e.g., "/works/OL81618W"
	description?: string | { type: string; value: string };
	covers?: number[];
	first_publish_date?: string;

	// Subjects & metadata arrays
	subjects?: string[];
	subject_places?: string[];
	subject_people?: string[];
	subject_times?: string[];

	// Links section
	links?: Array<{
		title: string;
		url: string;
		type: { key: string };
	}>;

	// Author references
	authors?: Array<{
		author: { key: string };
		type: { key: string };
	}>;

	// Excerpts & first sentences
	excerpts?: Array<{
		excerpt: string;
		comment?: string;
		author?: { key: string };
	}>;
	first_sentence?: {
		type: string;
		value: string;
	};

	// Versioning and Timestamps
	revision: number;
	latest_revision: number;
	created: { type: string; value: string };
	last_modified: { type: string; value: string };

	// Reference to specific editions
	cover_edition?: { key: string };
};
