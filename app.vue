<script lang="ts" setup>
import { useSeoMeta } from "#app";
const currentUrl = ref<string | null>(null);
const siteMeta = await useSiteMeta();
const siteTitle = siteMeta.title ?? "";
const siteDescription = siteMeta.description ?? "";
const defaultImage = "/images/ogp.png";

if (siteMeta) {
	useSeoMeta({
		title: siteTitle,
		description: siteDescription,
		ogTitle: siteTitle,
		ogDescription: siteDescription,
		ogImage: defaultImage,
		ogType: "website",
		ogSiteName: siteTitle,
		ogUrl: currentUrl,

		twitterCard: "summary_large_image",
		twitterTitle: siteTitle,
		twitterDescription: siteDescription,
		twitterImage: defaultImage,
	});
}

onMounted(() => {
	currentUrl.value = window.location.href;
});
</script>

<template>
	<SiteHeader />
	<div class="mt-16">
		<NuxtPage />
	</div>
	<SiteFooter />
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@500;700&display=swap");

.page-enter-active,
.page-leave-active {
	transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
	opacity: 0;
	filter: blur(1rem);
}
</style>
