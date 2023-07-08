<template>
	<v-card v-if="article" width="300" height="93%" class="d-flex flex-column">
		<v-img
			v-if="this.article.attributes.cover.data && functionalCookieAccepted"
			height="200"
			:lazy-src="
				imgUrl +
				this.article.attributes.cover.data.attributes.formats.thumbnail.url
			"
			:src="imgUrl + this.article.attributes.cover.data.attributes.url"
			class="flex-grow-0 flex-shrink-1"
		/>
		<UtilsBanner
			v-else-if="!functionalCookieAccepted"
			icon="mdi-cookie-alert"
		/>
		<v-card-actions v-if="article.attributes.tags.data != 0">
			<v-avatar style="margin-top: -30px" color="white"
				><v-icon>{{
					article.attributes.tags.data[0].attributes.icon
				}}</v-icon></v-avatar
			></v-card-actions
		>
		<v-card-text class="flex-column align-start pt-0 flex-grow-1 flex-shrink-0">
			<h2 class="text-h2 secondary--text pt-0">
				{{ article.attributes.title }}
			</h2>
			<p class="font-weight-bold">
				{{ article.attributes.subtitle }}
			</p>
			<p class="caption mb-2" style="line-height: 1em">
				von {{ article.attributes.author }}
			</p></v-card-text
		>
		<v-card-actions class="pt-4"
			><v-btn
				:to="(changeUrl ? '/magazine/' : '') + article.attributes.slug"
				:append="appendUrl"
				outlined
				color="primary"
				>zum Eintrag</v-btn
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
			changeUrl: {
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
	};
</script>
