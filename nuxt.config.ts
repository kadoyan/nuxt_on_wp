// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import axios from "axios";
import type { WPPost } from "./types/wordpress";

const WP_API_BASE = process.env.WP_API_BASE; //"https://pico8.penpale.jp/wp-json/";
const API_VERSION = "wp/v2";
const API_URL = `${WP_API_BASE}${API_VERSION}/`;

const fetchRoutes = async () => {
	const resPost = await axios.get(`${API_URL}posts?_embed&per_page=100`);
	const posts = resPost.data;

	const postPath = posts.map((post: WPPost) => {
		const category =
			post._embedded?.["wp:term"]?.[0]?.[0]?.slug ?? "uncategorized";
		const slug = post.slug;
		const path = `/${category}/${slug}`;
		return path;
	});

	const resCategory = await axios.get(`${API_URL}categories`);
	const categories = resCategory.data;
	const categoryPath = categories.map((category: WPPost) => {
		const path = `/${category.slug}/`;
		return path;
	});
	return postPath.concat(categoryPath);
};

const dynamicRoutes = await fetchRoutes();

export default defineNuxtConfig({
	modules: ["@nuxt/eslint", "@nuxt/image", "@pinia/nuxt", "@nuxt/scripts"],
	runtimeConfig: {
		secret: process.env.GIT_HUB_TOKEN,
		public: {
			APL_BASE_URL: process.env.WP_API_BASE,
		},
	},

	app: {
		pageTransition: { name: "page", mode: "out-in" },
		head: {
			htmlAttrs: {
				lang: "ja",
			},
		},
	},
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	vite: {
		plugins: [tailwindcss()],
	},
	css: [
		"~/assets/css/style.css",
		"@fortawesome/fontawesome-svg-core/styles.css",
	],
	components: [
		{
			path: "~/components",
			pathPrefix: false,
		},
	],
	eslint: {
		config: {
			stylistic: true,
		},
	},
	// SSGモードを指定
	ssr: true,
	nitro: {
		preset: "static",
		prerender: {
			failOnError: false,
			crawlLinks: true,
			routes: ["/", ...dynamicRoutes],
		},
	},
	$production: {
		scripts: {
			registry: {
				googleTagManager: {
					id: process.env.GOOGLE_TAG_MANAGER_ID,
				},
			},
		},
	},
});
