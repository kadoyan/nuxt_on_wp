# WordPress REST APIとNuxt 3を使用したWordPressフロントエンド

普段はVueやNuxtのような環境を仕事で使う機会がないため、個人的な試みとして、自分が管理するWordPressで動いているサイトのフロントを実装してみることにしました。

## 当初はVue3で作成
手始めに、Vue3でSPAとして作成を試みました。

Vue2の頃に少し触っていたこともあり、この段階では手探りながら割と早めに形になりました。

## metaタグ対策のため、Nuxt 3に移植
SPAだと、レンダリングされるまでmetaタグがなく、SNSでのシェアや（現在はあまり問題ないそうですが）SEO的にも気になるところがあるため、Nuxt 3を使って、SSG(Static Site Generation)を試してみることにしました。

- ファイル構成の変更、コンポーネント読み込み修正
- API通信分の書き換え（fetch から useFetch）
- ルーティングの修正

などを行ってSPAとして動くようになったところで、静的に書き出しを行ったところ、数々の問題が。

### npm run generateが落ちる
run devでは問題がなかったのに、generateすると、何度やっても```Nuxt Build Error: [vite:vue] Could not load〜〜〜```と失敗する。
ファイルのパスの日本語部分がUnicodeエスケープされていたので、まさか今どきそんなことはないだろう…と思いながら日本語を挟まないパスに移動して実行したら通った。

### スラッグが変わっているのにコンテンツが書きかわらない
useAsyncDataにポストスラッグを使ったユニークなキーを指定して、データの更新がかかるようにした。
```
const { data: fetchedPosts, error } = await useAsyncData<WPPost[]>(
	`${slug}-posts`, // ユニークなKEYを指定
	() => $fetch(`${API_URL}posts?slug=${slug}&_embed`)
);
```
https://nuxt.com/docs/api/composables/use-async-data#reactive-keys
>Reactive Keys  
>You can use a computed ref, plain ref or a getter function as the key, allowing for dynamic data fetching that automatically updates when the key changes:

### ページ内リンクをクリックしても、正しいページが出ない（トップに戻る）
WordPress本文内リンク先のページが作られていなかった（＝SSGの対象になっていなかった）。
```nuxt.config.ts
const fetchRoutes = async () => {
	const resPost = await axios.get(`${API_URL}posts?_embed&per_page=100`);//ページ数指定がなかった
	const posts = resPost.data;
....
```
ただ、これでも100ポストを超えると出なくなるので、マジックナンバーにしないようにする必要がある。

### setSeoMetaが効かない
onMountedの中でデータ生成をしていた（ブラウザ側のフックなので、サーバーサイドで生成されるSSGでは動作しない）。
これに気づくまで、コンポーネントといじり倒してだいぶ時間がかかりました。

### 生成されたファイルがやたらでかい
不要なモジュールや読み込みファイルのパージ。
インストールの際、使用しないモジュールも全部入れていたり、不必要なFontAwesomeのセットも読み込んでいたりしたものを全てをインポートしないように修正しました。

### devやgenerateの際にサーバーが起動しない・.envの設定がundefinedになる
Nuxt 3の場合、実行時にはuseRuntimeConfig()を使って環境変数を設定する。
```nuxt.config.ts
export default defineNuxtConfig({
	runtimeConfig: {
		secret: process.env.GIT_HUB_TOKEN,
		public: {
			APL_BASE_URL: process.env.WP_API_BASE,
		},
	},
....
```
```useConfig.ts
export const useConfig = () => {
	const config = useRuntimeConfig();

	const GOOGLE_TAG_MANAGER_ID = config.public.GOOGLE_TAG_MANAGER_ID;
	const API_BASE_URL = config.public.APL_BASE_URL;
	const API_VERSION = "wp/v2/";
	const API_URL = `${API_BASE_URL}${API_VERSION}`;
	const API_MEDIA_URL = `${API_BASE_URL}${API_VERSION}media/`;

	return {
		GOOGLE_TAG_MANAGER_ID,
		API_BASE_URL,
		API_VERSION,
		API_URL,
		API_MEDIA_URL,
	};
};
```
```コンポーネント
<script setup lang="ts">

const config = useConfig();
const API_URL = config.API_URL;
```

と、いろいろとつまづきながらも、なんとか形になりました。
