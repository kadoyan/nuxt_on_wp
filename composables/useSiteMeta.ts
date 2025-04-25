/*
 * サイト初回表示時に
 * サイトのメタデータをストアしておく
 **/

// import { API_BASE_URL } from "~/config";
import type { SiteMeta } from "~/types/wordpress"; // APIから取得するデータの型
import { useSiteMetaStore } from "@/stores/siteMeta";

export const useSiteMeta = async () => {
	const config = useConfig();
	const API_BASE_URL = config.API_BASE_URL;

	const store = useSiteMetaStore(); //
	// 設定済みならそのまま返す
	if (store.fetched) {
		return store;
	}

	// 設定されていない場合、メタデータを取得する
	const { data } = await useFetch<SiteMeta>(API_BASE_URL);
	if (data.value) {
		store.setMeta({
			title: data.value.name ?? "",
			description: data.value.description ?? "",
			logo: data.value.site_logo ?? 0,
		});
	}

	return store;
};
