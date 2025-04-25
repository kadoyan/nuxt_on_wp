<script setup>
// 親コンポーネントからデータを受け取る
const props = defineProps({
	title: {
		type: [String, null],
		default: "",
	},
	url: {
		type: [String, null],
		default: "",
	},
	hashtags: {
		type: Array,
		default: () => ["PICO8"],
	},
	text: {
		type: String,
		default: "",
	},
});

// emitsの定義
const emit = defineEmits(["shared"]);

// メソッド
function shareToX() {
	const shareText = encodeURIComponent(
		props.text ? `${props.title} ${props.text}` : props.title
	);
	const shareUrl = encodeURIComponent(props.url);
	const hashtags = encodeURIComponent(props.hashtags.join(","));

	const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&hashtags=${hashtags}`;
	window.open(twitterUrl, "_blank", "width=550,height=420");

	emit("shared", { platform: "x", url: twitterUrl });
}

function shareToBluesky() {
	const hashtags = props.hashtags.map((tag) => `#${tag}`).join(" ");
	const shareText = encodeURIComponent(
		`${props.title} ${props.text} ${hashtags} ${props.url}`
	);
	const blueSkyUrl = `https://bsky.app/intent/compose?text=${shareText}`;
	window.open(blueSkyUrl, "_blank");
}
</script>

<template>
	<div class="social-share-container">
		<button
			class="share-button x-button"
			aria-label="Share to X"
			@click="shareToX"
		>
			<font-awesome-icon :icon="['fab', 'x-twitter']" />
			<span class="sr-only">X (Twitter)でシェア</span>
		</button>

		<button
			class="share-button bluesky-button"
			aria-label="Share to Bluesky"
			@click="shareToBluesky"
		>
			<font-awesome-icon :icon="['fab', 'bluesky']" />
			<span class="sr-only">Blueskyでシェア</span>
		</button>
	</div>
</template>

<style scoped>
.social-share-container {
	display: flex;
	gap: 12px;
}

.share-button {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border: none;
	border-radius: 50%;
	cursor: pointer;
	transition: background-color 0.2s;
	color: white;
	font-size: 18px;
}

.x-button {
	background-color: #000;
}

.x-button:hover {
	background-color: #333;
}

.bluesky-button {
	background-color: #1285fe;
}

.bluesky-button:hover {
	background-color: #0a6ad4;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border-width: 0;
}
</style>
