<script setup lang="ts">
import type { WPCategory } from "~/types/wordpress";
// import { API_URL } from "~/config";

const config = useConfig();
const API_URL = config.API_URL;

const route = useRoute();
const error = ref<string | null>(null);

const currentUrl = ref<string | null>(null);
onMounted(() => {
	currentUrl.value = window.location.href;
});

const categorySlug = route.params.categorySlug as string;
const { data: categoryData, err } = await useAsyncData<WPCategory>(
	`category-${categorySlug}`,
	async () => {
		const res = await $fetch<WPCategory[]>(
			`${API_URL}categories?slug=${categorySlug}`
		);
		return res?.[0];
	}
);
if (categoryData.value) {
	setCategoryMeta(categoryData.value);
}

watch(
	() => route.params.categorySlug,
	(newSlug) => {
		fetchCategoryPosts(newSlug as string);
		// console.log("route.params", route.params);
	},
	{ immediate: true }
);

async function fetchCategoryPosts(slug: string) {
	// categorySlug.value = slug;
	try {
		const categoryIdRes = await fetch(`${API_URL}categories?slug=${slug}`);
		if (!categoryIdRes.ok) {
			error.value = `ステータスエラー: ${categoryIdRes.status} ${categoryIdRes.statusText}`;
			return;
		}

		const categoryIdData = await categoryIdRes.json();
		if (categoryIdData.length > 0) {
			categoryData.value = categoryIdData[0];
			// console.log("categoryData.value", categoryData.value);
		} else {
			error.value = "カテゴリが見つかりません";
		}
	} catch (e: string | any) {
		error.value = `通信エラー: ${e.message}`;
		console.error("Fetch error:", e);
	}
}

if (categoryData.value) {
	setCategoryMeta(categoryData.value);
}
</script>

<template>
	<div v-if="categoryData">
		<div
			class="from-info-content from-50 mb-6 flex h-48 flex-col items-center justify-center bg-linear-to-t to-black text-center text-white"
		>
			<h1 class="text-base-100 text-3xl font-bold">
				{{ categoryData.name }}
			</h1>
			<p class="mt-6 text-sm text-neutral-300">
				{{ categoryData.description }}
			</p>
		</div>
		<main class="container mx-auto max-w-6xl px-4">
			<SocialButtons :title="categoryData.name" :url="currentUrl" />
			<div class="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
				<CategoryPostList
					v-if="categoryData.id"
					:id="categoryData.id"
					:number="6"
				>
					<template #posts="{ categoryPosts }">
						<div
							v-for="post in categoryPosts"
							:key="post.id"
							class="flex w-full flex-row gap-4 overflow-hidden rounded-md border border-white bg-white p-4 hover:border-neutral-300"
						>
							<router-link :to="post.link" class="flex w-full flex-row gap-4">
								<figure
									class="aspect-square h-auto w-full max-w-1/3 overflow-hidden rounded-sm"
								>
									<GetMedia
										:media-id="post.featured_media"
										media-size="full"
										:alt-text="post.title.rendered"
										class-extend="w-full h-full object-cover"
										loading="lazy"
									/>
								</figure>
								<div>
									<div class="text-lg font-bold">
										{{ post.title.rendered }}
									</div>
									<p class="mt-1 text-sm/6 text-gray-700">
										{{ post.excerpt.rendered.replace(/<[^>]+>/g, "") }}
									</p>
								</div>
							</router-link>
						</div>
					</template>
				</CategoryPostList>
			</div>
		</main>
	</div>
	<div v-else-if="error">
		<main class="container mx-auto max-w-6xl px-4">
			<p>カテゴリが見つかりません</p>
		</main>
	</div>
	<div v-else>
		<main class="container mx-auto max-w-6xl px-4"><p>Loading.</p></main>
	</div>
</template>
