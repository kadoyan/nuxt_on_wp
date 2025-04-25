import { useSeoMeta } from "#app";
import type { WPCategory } from "~/types/wordpress";

export const setCategoryMeta = async (data: WPCategory) => {
	const siteMeta = await useSiteMeta();

	const siteTitle = siteMeta.title ?? "";
	const siteDescription = siteMeta.description ?? "";
	const defaultImage = "/images/ogp.png";
	const currentUrl = data.link;

	const categoryTitle = data.name;
	const description = data.description?.replace(/<[^>]*>/g, "").trim() ?? "";
	const featuredImage = defaultImage;

	useSeoMeta({
		title: () => {
			let title = "";
			if (categoryTitle) title += `${categoryTitle} | `;
			title += siteTitle;
			return title.trim();
		},
		description: () => description || siteDescription || "",

		ogTitle: () =>
			// categoryTitle || categoryName ? `${categoryName} | ${siteTitle}` : siteTitle,
			`${categoryTitle} | ${siteTitle}`,
		ogDescription: () => description || siteDescription || "",
		ogImage: () => featuredImage ?? defaultImage,
		ogType: () => (categoryTitle ? "article" : "website"),
		ogSiteName: () => siteTitle,
		ogUrl: () => currentUrl,

		twitterCard: () =>
			featuredImage !== defaultImage ? "summary_large_image" : "summary",
		twitterTitle: () =>
			// categoryTitle || categoryName ? `${categoryName} | ${siteTitle}` : siteTitle,
			`${categoryTitle} | ${siteTitle}`,
		twitterDescription: () => description || siteDescription || "",
		twitterImage: () => featuredImage ?? defaultImage,

		articlePublishedTime: () =>
			categoryTitle ? new Date().toISOString() : undefined,
		articleModifiedTime: () =>
			categoryTitle ? new Date().toISOString() : undefined,
	});
};
