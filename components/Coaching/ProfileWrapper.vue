<template>
	<v-card
		elevation="2"
		nuxt
		:ripple="false"
		:width="
			$vuetify.breakpoint.smAndUp
				? $vuetify.breakpoint.mdAndUp
					? 'calc(25vw - 26px)'
					: 'calc(50vw - 36px)'
				: '100%'
		"
		class="d-flex flex-column pb-2 mx-2"
	>
		<v-card-text class="pt-0 flex-grow-1 flex-shrink-0">
			<nuxt-link :to="'/berater/me?name=' + pubCoachData.slug">
				<v-avatar color="primary" class="my-5" size="80"
					><v-img
						v-if="pubCoachData.avatar_content_url"
						:lazy-src="`${pubCoachData.avatar_content_url}?${Date.now()}`"
						:src="`${pubCoachData.avatar_content_url}?${Date.now()}`"
						data-cookiescript="accepted"
						data-cookiecategory="functionality"
					/> </v-avatar
			></nuxt-link>
			<div class="d-flex flex-column justify-center">
				<nuxt-link
					:to="'/berater/me?name=' + pubCoachData.slug"
					style="text-decoration: none"
					><h2 class="secondary--text text-h2">
						{{ pubCoachData.display_name }}
					</h2>
					<h3 class="text-h5">
						<div v-html="pubCoachData.profession_line"></div></h3
				></nuxt-link>
			</div>
			<v-divider class="my-3" />
			<p class="font-weight-bold mb-1 mt-2 caption">Fachgebiet</p>
			<div class="d-flex flex-wrap">
				<v-chip outlined color="primary" class="mr-1 mb-1 caption">
					<p class="black--text ma-0 pa-0">{{ pubCoachData.topic_areas }}</p>
				</v-chip>
			</div>
		</v-card-text>
		<v-card-actions class="my-4 flex-grow-0 flex-shrink-1">
			<v-btn
				absolute
				right
				color="primary"
				:href="'/berater/me?name=' + pubCoachData.slug"
				>Profil ansehen</v-btn
			>
		</v-card-actions>
	</v-card>
</template>

<script>
	export default {
		name: 'Coaching',
		props: {
			pubCoachData: {
				type: Object,
				default: () => {},
			},
			response: {
				type: Object,
				default: () => {},
			},
			clickable: {
				type: Boolean,
				default: true,
			},
			small: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				acceptLoading: false,
				acceptDisable: true,
				date: null,
				payButtonLoading: false,
				isDelete: false,
			};
		},
		computed: {
			functionalCookieAccepted() {
				return this.$functionalCookieAccepted();
			},
		},
	};
</script>
