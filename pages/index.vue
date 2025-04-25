<script setup lang="ts">
import type { WPCategory, WPPost } from "~/types/wordpress";
const siteMeta = await useSiteMeta();
const siteTitle = ref(siteMeta.title);
const siteDescription = ref(siteMeta.description);
const currentUrl = ref<string | null>(null);

onMounted(() => {
	currentUrl.value = window.location.href;
});
</script>

<template>
	<div>
		<div
			class="hero text-base-100 from-info-content from-50 min-h-[100vh] bg-linear-to-t to-black md:min-h-[40vw] mb-6"
		>
			<div class="flex flex-col items-center gap-8 md:flex-row-reverse">
				<div class="shrink-0 grow px-4 z-2">
					<h1
						class="text-[min(10vw,3rem)] font-bold site-title"
						:data-text="siteTitle"
					>
						{{ siteTitle }}
					</h1>
					<p class="py-6">
						{{ siteDescription }}
					</p>
				</div>
				<div class="flex w-full flex-col items-center justify-center">
					<figure>
						<img src="/assets/pico8.svg" alt="PICO-8" class="rotate mb-4" />
					</figure>
					<figure class="logo-mask relative aspect-2/1 overflow-hidden">
						<img
							src="/assets/pico8.svg"
							alt=""
							class="rotate bottom-0 mb-4 -scale-y-100"
						/>
					</figure>
				</div>
			</div>
		</div>
		<main class="container mx-auto max-w-6xl px-4">
			<SocialButtons :title="siteTitle" :url="currentUrl" />
			<CategoryList>
				<template #default="{ categories }">
					<div v-for="cat in categories" :key="cat.id ?? 'default-key'">
						<h2 class="text-info-content mt-12 text-2xl font-bold">
							{{ cat.name }}
						</h2>
						<p class="mt-3 text-sm text-neutral-900">
							{{ cat.description }}
						</p>
						<div class="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
							<CategoryPostList :id="cat.id ?? 0" :number="6">
								<template #posts="{ categoryPosts }">
									<div
										v-for="post in categoryPosts"
										:key="post.id"
										class="flex w-full flex-row gap-4 overflow-hidden rounded-md border border-neutral-300 bg-white p-3 hover:border-neutral-700"
									>
										<router-link
											:to="post.link"
											class="flex w-full flex-row gap-4"
										>
											<figure
												class="aspect-square h-auto w-full max-w-1/4 overflow-hidden rounded-sm"
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
												<div
													class="heading text-md/6 mb-2 border-b border-gray-600 pb-2 font-bold"
												>
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
					</div>
				</template>
			</CategoryList>
		</main>
	</div>
</template>
