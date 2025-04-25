export const useConfig = () => {
	const config = useRuntimeConfig();

	const GOOGLE_TAG_MANAGER_ID = config.public.GOOGLE_TAG_MANAGER_ID;
	const API_BASE_URL = config.public.APL_BASE_URL;
	const API_VERSION = "wp/v2/";
	const API_URL = `${API_BASE_URL}${API_VERSION}`;
	const API_MEDIA_URL = `${API_BASE_URL}${API_VERSION}media/`;

	return {
		GOOGLE_TAG_MANAGER_ID,
		API_BASE_URL,
		API_VERSION,
		API_URL,
		API_MEDIA_URL,
	};
};
