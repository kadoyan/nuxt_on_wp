// stores/loadingStore.ts
import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
	state: () => ({
		isLoading: true,
		totalResources: 0,
		loadedResources: 0,
	}),

	actions: {
		startLoading() {
			this.isLoading = true;
			this.totalResources = 0;
			this.loadedResources = 0;
		},

		registerResource() {
			this.totalResources++;
		},

		resourceLoaded() {
			this.loadedResources++;
			this.checkAllLoaded();
		},

		checkAllLoaded() {
			if (this.loadedResources >= this.totalResources) {
				setTimeout(() => {
					this.isLoading = false;
				}, 200); // 少し遅延を入れてすべてのレンダリングが完了するのを待つ
			}
		},

		setForceLoaded() {
			this.isLoading = false;
		},
	},
});
