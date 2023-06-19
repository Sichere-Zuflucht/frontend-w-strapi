<template>
	<v-container v-if="user">
		<client-only>
			<p class="caption mb-0 font-weight-bold">Hallo</p>
			<h1 v-if="user" class="text-h1 secondary--text">
				{{ user.display_name }}
			</h1>
		</client-only>
		<CoachFulfilRegistration
			v-if="
				user.topic_areas == null ||
				user.stripe ||
				user.verification_status != 'done'
			"
		/>
		<div
			v-else-if="
				user.topic_areas && user.stripe && user.verification_status == 'done'
			"
		>
			<h2 class="primary--text mb-2">Anfragen</h2>
			<v-btn outlined color="primary" class="mb-4" @click="loadMeetings"
				><v-icon small class="mr-1">mdi-update</v-icon>Nach Updates
				suchen</v-btn
			>

			<div v-if="requests">
				<CoachingRequestList :list="requests" />
				<div class="my-8 d-flex justify-center">
					<v-btn text color="grey" @click="showOld = !showOld"
						>vergangene Termine {{ showOld ? 'verbergen' : 'anzeigen' }}</v-btn
					>
				</div>
				<CoachingRequestList :list="requests" oldlist :showold="showOld" />
			</div>
			<div v-else><v-skeleton-loader type="article"></v-skeleton-loader></div>
		</div>
		<div v-else><v-skeleton-loader type="article"></v-skeleton-loader></div>
	</v-container>
</template>

<script>
	export default {
		middleware: 'authCoach',
		data() {
			return {
				showOld: false,
				//stripeEnabled: null,
				requests: null,
			};
		},
		async mounted() {
			//this.stripeEnabled = await this.$func.getStripeAccData(); //.data.payouts_enabled;
			this.loadMeetings();
		},
		computed: {
			user() {
				return this.$store.getters['getCurrentUser'];
			},
		},
		methods: {
			async loadMeetings() {
				this.requests = null;
				this.requests = await this.$func.loadAllMeetingsOfParticipant();
				/*this.$strapi.$meetings
					.find({
						populate: '*',
						'filters[users_permissions_users]': this.$strapi.user.id,
					})
					.then((meetings) => {
						this.requests = meetings.data;
					});*/
			},
		},
	};
</script>
