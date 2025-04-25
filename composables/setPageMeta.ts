import { useSeoMeta } from "#app";
import type { WPPost } from "~/types/wordpress";

export const setPageMeta = async (data: WPPost) => {
	const route = useRoute();
	const runtimeConfig = useRuntimeConfig();
	const siteMeta = await useSiteMeta();

	const siteTitle = siteMeta.title ?? "";
	const siteDescription = siteMeta.description ?? "";
	const defaultImage = "/images/ogp.png";
	// console.log("page", siteMeta);
	const currentUrl = computed(
		() => `${runtimeConfig.public.siteUrl}${route.fullPath}`
	);

	const slugPost = data.slug as string;

	let postTitle: string | null = null;
	let description: string | null = null;
	let featuredImage: string | null = null;

	if (slugPost) {
		postTitle = data.title.rendered;
		description = data.excerpt?.rendered?.replace(/<[^>]*>/g, "").trim() ?? "";
		featuredImage =
			data._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null;
	}

	// ✅ データが揃ってから useSeoMeta() を呼ぶ
	useSeoMeta({
		title: () => {
			let title = "";
			if (postTitle) title += `${postTitle} | `;
			// if (categoryName) title += `${categoryName} | `;
			title += siteTitle;
			// console.log("Meta rendered");
			return title.trim();
		},
		description: () => description || siteDescription || "",

		ogTitle: () =>
			// postTitle || categoryName ? `${categoryName} | ${siteTitle}` : siteTitle,
			`${postTitle} | ${siteTitle}`,
		ogDescription: () => description || siteDescription || "",
		ogImage: () => featuredImage ?? defaultImage,
		ogType: () => (postTitle ? "article" : "website"),
		ogSiteName: () => siteTitle,
		ogUrl: () => currentUrl.value,

		twitterCard: () =>
			featuredImage !== defaultImage ? "summary_large_image" : "summary",
		twitterTitle: () =>
			// postTitle || categoryName ? `${categoryName} | ${siteTitle}` : siteTitle,
			`${postTitle} | ${siteTitle}`,
		twitterDescription: () => description || siteDescription || "",
		twitterImage: () => featuredImage ?? defaultImage,

		articlePublishedTime: () =>
			postTitle ? new Date().toISOString() : undefined,
		articleModifiedTime: () =>
			postTitle ? new Date().toISOString() : undefined,
	});
};
