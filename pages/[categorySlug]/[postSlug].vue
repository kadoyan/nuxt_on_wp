<script setup lang="ts">
import type { WPPost } from "~/types/wordpress";
// import { API_URL } from "~/config";

import hljs from "highlight.js/lib/core";
import "highlight.js/styles/tokyo-night-dark.min.css";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import lua from "highlight.js/lib/languages/lua";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("lua", lua);
hljs.registerLanguage("css", css);

const config = useConfig();
const API_URL = config.API_URL;

const route = useRoute();
const slug = route.params.postSlug;

// SSGでも動く形でデータ取得
const { data: fetchedPosts, error } = await useAsyncData<WPPost[]>(
	`${slug}-posts`,
	() => $fetch(`${API_URL}posts?slug=${slug}&_embed`)
);

// 投稿を取得（fetchedPosts は配列）
const post = computed(() => fetchedPosts.value?.[0] ?? null);

// meta 設定
if (post.value) {
	setPageMeta(post.value);
}

const htmlRef = ref<HTMLElement | null>(null);
const currentUrl = ref<string | null>(null);

// ハイライト処理（クライアント限定）
onMounted(() => {
	currentUrl.value = window.location.href;
	if (htmlRef.value) {
		hljs.highlightAll();

		if (window.twttr?.widgets?.load) {
			window.twttr.widgets.load();
		} else {
			const script = document.createElement("script");
			script.src = "https://platform.twitter.com/widgets.js";
			script.async = true;
			document.body.appendChild(script);
		}
	}
});
</script>

<template>
	<main>
		<div v-if="post">
			<!-- ヘッダー -->
			<div
				class="from-info-content from-50 mb-6 flex min-h-[30vw] flex-col items-center justify-center gap-6 bg-linear-to-t to-black p-8 text-white md:flex-row-reverse"
			>
				<div class="flex flex-col">
					<h1
						v-html="post.title.rendered"
						class="mb-4 text-2xl font-bold md:text-4xl"
					/>
					<p
						class="mt-3 text-sm text-neutral-300"
						v-html="post.excerpt.rendered"
					></p>
				</div>
				<figure
					class="max-w-1/2 overflow-hidden rounded-sm border border-neutral-300 md:max-w-1/5"
				>
					<GetMedia
						:media-id="post.featured_media"
						media-size="full"
						:alt-text="post.title.rendered"
						class-extend="object-cover"
						loading="lazy"
					/>
				</figure>
			</div>

			<!-- 本文 -->
			<div class="container mx-auto max-w-4xl px-4">
				<SocialButtons :title="post.title.rendered" :url="`${currentUrl}`" />
				<div
					v-html="post.content.rendered"
					ref="htmlRef"
					class="wp-post-content mt-10"
				/>
			</div>
		</div>
		<div v-else-if="error" class="text-red-600">{{ error.message }}</div>
		<div v-else>読み込み中...</div>
	</main>
</template>
