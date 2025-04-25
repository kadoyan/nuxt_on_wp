<script setup lang="ts">
import type { WPCategory, WPPost } from "~/types/wordpress";
// import { API_URL } from "~/config";
const config = useConfig();
const API_URL = config.API_URL;

const categoryPosts = ref<WPPost>();
const categoryId = ref<number | null>(null);
const error = ref("");

const props = defineProps({
	id: {
		type: Number,
		default: null,
	},
	slug: {
		type: String,
		default: null,
	},
	number: {
		type: Number,
		default: 10,
	},
});

categoryId.value = props.id;

onMounted(async () => {
	fetchCategoryPosts();
});
watch(
	() => [props.id, props.slug],
	() => {
		// カテゴリーIDが変更された場合、再取得
		categoryId.value = props.id;
		fetchCategoryPosts();
	}
);

async function fetchCategoryPosts() {
	if (!props.id && !props.slug) {
		error.value = "カテゴリIDまたはスラッグを指定してください";
		return;
	}
	// カテゴリーIDが指定されていない場合、スラッグからIDを取得
	if (!props.id && props.slug) {
		try {
			const categoryIdRes = await fetch(
				`${API_URL}categories?slug=${props.slug}`
			);
			if (!categoryIdRes.ok) {
				error.value = `ステータスエラー: ${categoryIdRes.status} ${categoryIdRes.statusText}`;
				return;
			}
			const categoryIdData = await categoryIdRes.json();
			if (categoryIdData.length > 0) {
				categoryId.value = categoryIdData[0].id;
			} else {
				error.value = "カテゴリが見つかりません";
			}
		} catch (e: unknown) {
			if (e instanceof Error) {
				error.value = `通信エラー: ${e.message}`;
			} else {
				error.value = "未知のエラーが発生しました";
			}
		}
	}
	try {
		const postsRes = await fetch(
			`${API_URL}posts?categories=${categoryId.value}&per_page=${props.number}`
		);
		const posts = await postsRes.json();
		if (!postsRes.ok) {
			error.value = `ステータスエラー: ${postsRes.status} ${postsRes.statusText}`;
			return;
		}
		if (posts.length === 0) {
			error.value = "該当する記事が見つかりません";
		} else {
			categoryPosts.value = posts.map((category: WPCategory) => ({
				// 変換
				...category,
				link:
					category.link && typeof category.link === "string"
						? new URL(category.link).pathname
						: "",
			}));
		}
	} catch (e: unknown) {
		if (e instanceof Error) {
			error.value = `通信エラー: ${e.message}`;
		} else {
			error.value = "未知のエラーが発生しました";
		}
	}
}
</script>

<template>
	<slot name="posts" :category-posts="categoryPosts">
		<div v-if="categoryPosts">
			<ul>
				<li v-for="post in categoryPosts" :key="post.id">
					<NuxtLink :to="post.link">{{ post.title.rendered }}</NuxtLink>
				</li>
			</ul>
		</div>
		<div v-else-if="error" class="text-red-600">{{ error }}</div>
		<div v-else>読み込み中...</div>
	</slot>
</template>
