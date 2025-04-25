/*
 * サイトのメタデータをストア
 **/

import { defineStore } from "pinia";

export const useSiteMetaStore = defineStore("siteMeta", {
	state: () => ({
		title: null as string | null,
		description: null as string | null,
		logo: null as number | null,
		fetched: false, // 読み込み済みか否か
	}),
	actions: {
		setMeta({
			title,
			description,
			logo,
		}: {
			title: string;
			description: string;
			logo: number;
		}) {
			this.title = title;
			this.description = description;
			this.logo = logo;
			this.fetched = true;
		},
	},
});
