<script setup lang="ts">
import type { WPCategory } from "~/types/wordpress";
// import { API_URL } from "~/config";

const config = useConfig();
const API_URL = config.API_URL;
const categoryList = ref<WPCategory[]>([]);

onMounted(async () => {
	fetchCategories();
});

async function fetchCategories() {
	const res = await fetch(`${API_URL}categories`);
	if (res.ok) {
		const data = await res.json();
		categoryList.value = data.map((category: WPCategory) => ({
			// 変換
			...category,
			link:
				category.link && typeof category.link === "string"
					? new URL(category.link).pathname
					: "",
		}));
	} else {
		console.error("Failed to fetch categories:", res.statusText);
	}
}
</script>

<template>
	<slot :categories="categoryList">
		<ul>
			<li
				v-for="cat in categoryList"
				:key="cat.id ?? `category-${Math.random()}`"
			>
				{{ cat.name }}
			</li>
		</ul>
	</slot>
</template>
