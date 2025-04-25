export interface SiteMeta {
	name: string | null;
	site_logo: number | null;
	description: string | null;
}

export interface WPPost {
	class_list: string[];
	content: { rendered: string };
	date: string;
	date_gmt: string;
	excerpt: { rendered: string };
	featured_media: number;
	format: string;
	guid: { rendered: string };
	id: number;
	link: string;
	meta: object;
	modified: string;
	modified_gmt: string;
	slug: string;
	status: string;
	sticky: boolean;
	tags: number[];
	template: string;
	title: { rendered: string };
	type: string;
	_embedded: {
		"wp:featuredmedia"?: Array<{
			id: number;
			media_details: {
				sizes: {
					medium: {
						file: string;
						width: number;
						height: number;
						mime_type: string;
						source_url: string;
					};
				};
			};
			slug: string;
			source_url: string;
		}>;
		"wp:term"?: Array<
			Array<{
				id: number;
				name: string;
				slug: string;
				taxonomy: string;
			}>
		>;
	};
}

export interface WPCategory {
	count: number | null;
	description: string | null;
	id: number | null;
	link: string[] | null;
	meta: string[] | null;
	name: string | null;
	parent: number | null;
	slug: string | null;
	taxonomy: string | null;
}
