<script setup lang="ts">
import type { WPPost } from "~/types/wordpress";
// import { API_URL } from "~/config";
const config = useConfig();
const API_URL = config.API_URL;

const page = ref<WPPost | null>(null);
const error = ref("");
const pageId = 2509;

onMounted(async () => {
	try {
		const res = await fetch(`${API_URL}pages/${pageId}`);
		if (!res.ok) {
			error.value = `ステータスエラー: ${res.status} ${res.statusText}`;
			return;
		}
		const data = await res.json();
		page.value = data;
	} catch (e: unknown) {
		if (e instanceof Error) {
			error.value = `通信エラー: ${e.message}`;
		} else {
			error.value = `通信エラー: ${e}`;
		}
	}
});
</script>
<template>
	<footer class="footer bg-neutral-content text-base-600 mt-20 w-full">
		<div class="mx-autopx-4 container mx-auto max-w-5xl py-8 md:flex-row">
			<div v-if="page" class="about max-w-3xl" v-html="page.content.rendered" />
		</div>
		<div
			class="bg-neutral flex w-full flex-row items-center justify-center gap-4 p-4 text-sm text-white"
		>
			<span>© KADOYAN</span>
			<span>Powered by Nuxt</span>
			<figure>
				<a href="https://nuxt.com/" target="_blank">
					<NuxtImg
						src="/images/nuxt3-logo.svg"
						alt="Power by Nuxt"
						class="w-auto h-[16px]"
						height="16"
					/>
				</a>
			</figure>
		</div>
	</footer>
</template>
