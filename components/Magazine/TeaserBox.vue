<template>
	<v-card v-if="article" width="300" height="93%" class="d-flex flex-column">
		<v-img
			v-if="article.cover_url"
			height="200"
			:lazy-src="article.cover_url"
			:src="article.cover_url"
			class="flex-grow-0 flex-shrink-1"
		/>
		<v-card-actions v-if="article.category">
			<v-avatar style="margin-top: -30px" color="white"
				><v-icon v-if="article.category == 'sehen'">mdi-youtube</v-icon>
				<v-icon v-if="article.category == 'hören'">mdi-podcast</v-icon>
				<v-icon v-if="article.category == 'lesen'"
					>mdi-book-open</v-icon
				></v-avatar
			></v-card-actions
		>
		<v-card-text class="flex-column align-start pt-0 flex-grow-1 flex-shrink-0">
			<h2 class="text-h2 secondary--text pt-0">
				{{ article.title }}
			</h2>
			<p class="font-weight-bold">
				{{ article.subtitle }}
			</p>
			<p class="caption mb-2" style="line-height: 1em">
				von {{ article.author }}
			</p></v-card-text
		>
		<v-card-actions class="pt-4"
			><v-btn
				v-if="!useRedirect"
				outlined
				color="primary"
				:to="`article?title=${article.url_label}`"
				>zum Eintrag</v-btn
			><a
				v-else
				class="v-btn v-btn--outlined theme--light v-size--default primary--text"
				:href="`magazine/article?title=${article.url_label}`"
				>zum Eintrag</a
			></v-card-actions
		>
	</v-card>
</template>

<script>
	export default {
		props: {
			article: {
				type: Object,
				default: null,
			},
			appendUrl: {
				type: Boolean,
				default: false,
			},
			useRedirect: {
				type: Boolean,
				default: false,
			},
		},
		computed: {
			functionalCookieAccepted() {
				return this.$functionalCookieAccepted();
			},
			imgUrl() {
				return this.article.attributes.cover.data.attributes.url.includes(
					'https'
				)
					? ''
					: 'http://localhost:1337';
			},
		},
		methods: {
			redirect() {
				console.log('t', this.article.url_label);
				this.$emit('redirect', this.article.url_label);
			},
		},
	};
</script>
