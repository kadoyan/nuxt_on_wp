export {};

declare global {
	interface Window {
		twttr?: {
			widgets: {
				load: (el?: Element) => void;
			};
		};
	}
}
