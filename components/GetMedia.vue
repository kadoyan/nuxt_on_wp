<script setup lang="ts">
const loadingStore = useLoadingStore();
// import { API_MEDIA_URL } from "~/config";
const config = useConfig();
const API_MEDIA_URL = config.API_MEDIA_URL;

// リテラル型でprops定義
const props = defineProps<{
	mediaId: number | string;
	mediaSize?: "full" | "medium" | "thumbnail";
	altText?: string | null;
	classExtend?: string;
	loading?: "lazy" | "eager";
}>();

// alt属性の初期値
const mediaAlt = ref(props.altText ?? "");

// mediaごとのURLとサイズを保持
const mediaSizes = ref<{
	full?: { url: string; width: number; height: number };
	medium?: { url: string; width: number; height: number };
	thumbnail?: { url: string; width: number; height: number };
}>({});

onMounted(async () => {
	if (!props.mediaId) {
		console.error("mediaId is null or undefined");
		return;
	}

	const res = await fetch(`${API_MEDIA_URL}${props.mediaId}`);
	if (!res.ok) {
		console.error("Failed to fetch media:", res.statusText);
		return;
	}

	const data = await res.json();

	mediaSizes.value.full = {
		url: data.source_url,
		width: data.media_details?.width || 0,
		height: data.media_details?.height || 0,
	};

	const sizeNames: ("medium" | "thumbnail")[] = ["medium", "thumbnail"];
	for (const size of sizeNames) {
		const sizeData = data.media_details?.sizes?.[size];
		if (sizeData) {
			mediaSizes.value[size] = {
				url: sizeData.source_url,
				width: sizeData.width,
				height: sizeData.height,
			};
		}
	}
	// 画像のプリロード
	if (mediaSizes.value.full) {
		const img = new Image();
		img.onload = () => {
			loadingStore.resourceLoaded();
		};
		img.onerror = () => {
			loadingStore.resourceLoaded(); // エラーでも読み込み完了とみなす
		};
		img.src = mediaSizes.value.full.url;
	} else {
		loadingStore.resourceLoaded(); // 画像がない場合も読み込み完了
	}
});

// ✅ mediaSizeに応じてimage情報を切り替え
const selectedSize = computed(() => {
	const key = props.mediaSize ?? "full";
	return mediaSizes.value[key] ?? mediaSizes.value.full ?? null;
});
</script>

<template>
	<NuxtImg
		v-if="selectedSize"
		:src="selectedSize.url"
		:alt="mediaAlt"
		:class="classExtend"
		:loading="loading ?? 'lazy'"
		:width="selectedSize.width"
		:height="selectedSize.height"
	/>
</template>
