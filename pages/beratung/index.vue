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
				!user.stripe_account_success ||
				!user.verified
			"
		/>
		<div
			v-else-if="
				user.topic_areas && user.stripe_account_success && user.verified
			"
		>
			<h2 class="primary--text mb-2">Anfragen</h2>
			<v-btn
				v-if="upcomingMeetings"
				outlined
				color="primary"
				class="mb-4"
				@click="loadMeetings"
				><v-icon small class="mr-1">mdi-update</v-icon>Nach Updates
				suchen</v-btn
			>
			<CoachingRequestList
				v-if="upcomingMeetings.length != 0"
				:list="upcomingMeetings"
			/>
			<div>
				<!-- v-if="completedMeetings.length != 0">-->
				<div class="my-8 d-flex justify-center">
					<v-btn text color="grey" @click="showOld = !showOld"
						>vergangene Termine {{ showOld ? 'verbergen' : 'anzeigen' }}</v-btn
					>
				</div>
				<CoachingRequestList :list="completedMeetings" :showold="showOld" />
			</div>
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
				completedMeetings: [],
				upcomingMeetings: [],
			};
		},
		async mounted() {
			//this.stripeEnabled = await this.$func.getStripeAccData(); //.data.payouts_enabled;
			//this.loadMeetings();
			this.loadMeetings();
		},
		computed: {
			user() {
				return this.$store.getters['getCurrentUser'];
			},
			async test() {
				await this.$func.loadAllMeetingsOfParticipant();
			},
		},
		methods: {
			async loadMeetings() {
				var meetings = await this.$func.loadAllMeetingsOfParticipant();
				meetings.forEach((meeting) => {
					if (
						meeting.status == 'meeting canceled' ||
						meeting.status == 'meeting completed'
					)
						this.completedMeetings.push(meeting);
					else this.upcomingMeetings.push(meeting);
				});
			},
		},
	};
</script>
