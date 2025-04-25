<script setup lang="ts">
// import { API_URL } from "~/config";
function toggleMenu() {
	isMobileMenuOpen.value = !isMobileMenuOpen.value;
}
const isMobileMenuOpen = ref(false);

const config = useConfig();
const API_URL = config.API_URL;

const siteMeta = await useSiteMeta();
const title = ref(siteMeta.title);
const logo = ref(siteMeta.logo);
</script>

<template>
	<header
		class="bg-primary fixed top-0 right-0 left-0 z-50 px-4 py-2.5 text-white"
	>
		<div
			class="mx-auto flex max-w-full items-center justify-between gap-x-8 md:max-w-7xl"
		>
			<div class="max-w-[200px]">
				<NuxtLink to="/">
					<GetMedia
						v-if="logo"
						:media-id="logo"
						media-size="full"
						:alt-text="title"
					/>
				</NuxtLink>
			</div>

			<CategoryList :json-url="API_URL">
				<template #default="{ categories }">
					<ul class="extend_sansserif font-500 hidden gap-x-6 md:flex">
						<!-- <li v-for="category in categories" :key="category.id">
							<NuxtLink
								:to="category.link"
								class="router-link-active:bg-neutral-600/50 router-link-exact-active:bg-neutral-700 block rounded-sm px-4 py-2 hover:bg-neutral-600"
							>
								{{ category.name }}
							</NuxtLink>
						</li> -->
						<li
							v-for="category in categories"
							:key="category.id ?? 'default-key'"
						>
							<NuxtLink
								:to="typeof category.link === 'string' ? category.link : '/'"
								class="router-link-active:bg-neutral-600/50 router-link-exact-active:bg-neutral-700 block rounded-sm px-4 py-2 hover:bg-neutral-600"
							>
								{{ category.name }}
							</NuxtLink>
						</li>
					</ul>
				</template>
			</CategoryList>

			<div class="md:hidden">
				<button
					type="button"
					class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
					aria-controls="mobile-menu"
					:aria-expanded="isMobileMenuOpen"
					@click="toggleMenu"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						v-if="!isMobileMenuOpen"
						class="block size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
						/>
					</svg>
					<svg
						v-else
						class="block size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M6 18 18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>

		<div
			id="mobile-menu"
			class="md:hidden"
			:class="isMobileMenuOpen ? 'block' : 'hidden'"
		>
			<CategoryList :json-url="API_URL">
				<template #default="{ categories }">
					<ul class="gap-2extend_sansserif font-500 flex flex-col p-4">
						<li
							v-for="category in categories"
							:key="category.id ?? 'default-key'"
						>
							<NuxtLink
								:to="typeof category.link === 'string' ? category.link : '/'"
								class="router-link-active:bg-neutral-600/50 router-link-exact-active:bg-neutral-700 block rounded-sm px-4 py-2 hover:bg-neutral-600"
							>
								{{ category.name }}
							</NuxtLink>
						</li>
					</ul>
				</template>
			</CategoryList>
		</div>
	</header>
</template>
