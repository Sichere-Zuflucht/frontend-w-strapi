<template>
	<div v-if="article">
		<UtilsBanner :url="article.cover.url" />
		<v-container style="margin-top: -45px">
			<v-avatar color="white"
				><v-icon v-if="article.category == 'sehen'">mdi-youtube</v-icon>
				<v-icon v-if="article.category == 'hören'">mdi-podcast</v-icon>
				<v-icon v-if="article.category == 'lesen'"
					>mdi-book-open</v-icon
				></v-avatar
			>
			<h1 class="text-h1 primary--text pt-2">{{ article.title }}</h1>
			<p class="font-weight-bold pb-6">{{ article.subtitle }}</p>
			<p class="caption">von {{ article.author }}</p>
			<div>
				<!----<iframe
					v-if="article.attributes.spotifylink"
					:src="
						'https://open.spotify.com/embed/' +
						article.attributes.spotifylink.replace(
							'https://open.spotify.com/',
							''
						)
					"
					data-cookiescript="accepted"
					data-cookiecategory="functionality"
					class="pt-2"
					width="100%"
					frameBorder="0"
					allowtransparency="true"
					allow="encrypted-media"
				></iframe>
				<div
					v-if="article.attributes.iframe"
					v-html="article.attributes.iframe"
				></div>
				<iframe
					v-if="article.attributes.youtubelink"
					:src="
						'https://www.youtube.com/embed/' +
						article.attributes.youtubelink.replace('https://youtu.be/', '')
					"
					width="100%"
					class="pt-2"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
					allowfullscreen
				></iframe>-->
				<!--<a
        v-if="article.attributes.youtubelink"
        class="caption"
        :href="article.attributes.youtubelink"
        target="_blank"
      >
        {{ article.attributes.youtubelink.slice(0, 50)
        }}{{ article.attributes.youtubelink.length > 50 ? "..." : "" }}
      </a>-->
				<!----<iframe
					v-if="article.attributes.soundcloudlink"
					:src="
						'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' +
						article.attributes.soundcloudlink +
						'&color=%23f9a825&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true'
					"
					class="pt-2"
					width="100%"
					height="300"
					scrolling="no"
					frameborder="no"
					allow="autoplay"
				></iframe>-->
			</div>
			<div
				class="singleArticleText mt-8"
				:style="cssVars"
				v-html="article.content"
			></div>
		</v-container>
		<v-divider />
		<v-container>
			<h2 class="text-h2 secondary--text mb-4 mt-12">Neueste Einträge</h2>
			<v-row v-if="relatedArticles" class="pt-8" style="z-index: 1">
				<v-col
					v-for="(relatedArticle, index) in relatedArticles"
					:key="index"
					cols="12"
					sm="6"
					md="4"
					class="pb-4"
				>
					<MagazineTeaserBox
						:article="relatedArticle.attributes"
						:use-redirect="true"
						@redirect="redirect"
					/> </v-col
			></v-row>
		</v-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				error: null,
			};
		},
		async asyncData({ query, $func }) {
			const article = await $func.loadSingleArticle(query.title);
			const relatedArticles = await $func.loadRelatedArticles(article.id);
			console.log(article);
			console.log(relatedArticles);

			return {
				article,
				relatedArticles,
			};
		},
		computed: {
			cssVars() {
				return {
					'--primary': this.$vuetify.theme.themes.light.primary,
					'--secondary': this.$vuetify.theme.themes.light.secondary,
				};
			},
		},
		methods: {
			redirect(url) {
				console.log('a', url);
				location.href = `/magazine/article?title=${url}`;
			},
		},
	};
</script>

<style>
	.singleArticleText h1,
	.singleArticleText h3 {
		color: var(--primary);
		text-transform: uppercase;
	}

	.singleArticleText h2,
	.singleArticleText h4 {
		color: var(--secondary);
		text-transform: uppercase;
	}

	.singleArticleText h1 {
		font-size: 1.4rem;
	}

	.singleArticleText h2 {
		font-size: 1.2rem;
	}

	.singleArticleText h3,
	.singleArticleText h4,
	.singleArticleText h5,
	.singleArticleText h6 {
		font-size: 1rem;
	}

	.singleArticleText ul {
		margin-bottom: 60px;
	}

	.singleArticleText li {
		margin-top: 5px;
	}

	.singleArticleText p {
		line-height: 2em;
	}
	.singleArticleText img {
		width: 100%;
	}
</style>
