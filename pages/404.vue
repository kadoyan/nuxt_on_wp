<!-- layouts/error.vue -->
<script setup lang="ts">
defineProps<{ error: { statusCode: number; message: string } }>();
</script>

<template>
	<main>
		<div
			class="from-info-content from-50 mb-6 flex min-h-[30vw] flex-col items-center justify-center gap-6 bg-linear-to-t to-black p-8 text-white md:flex-row-reverse"
		>
			<div class="flex flex-col">
				<h1 class="mb-4 text-2xl font-bold md:text-4xl">
					ページが見つかりません
				</h1>
			</div>
		</div>
	</main>
</template>
