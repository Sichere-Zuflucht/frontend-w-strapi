<template>
	<v-sheet class="pb-0">
		<v-sheet color="secondary pa-8">
			<h1 class="text-h1 white--text">Willkommen bei<br />Sichere Zuflucht</h1>
		</v-sheet>
		{{ this.completedMeetings }}
		<div v-if="upcomingMeetings">
			<v-container v-if="upcomingMeetings.length > 0">
				<h2 class="text-h4 font-weight-bold primary--text mb-3">
					Deine Korrespondenz
				</h2>
				<v-btn outlined color="primary" @click="loadMeetings"
					><v-icon small class="mr-1">mdi-update</v-icon>Nach Updates
					suchen</v-btn
				>
			</v-container>
			<v-sheet class="mx-auto">
				<v-slide-group
					:show-arrows="upcomingMeetings.length > 1"
					class="px-1 pb-4"
				>
					<v-slide-item v-for="(meeting, i) in upcomingMeetings" :key="i">
						<CoachingContactStatus
							:coach="meeting.relationships.coach.data"
							:meeting="meeting.attributes"
							:id="meeting.id"
							:clickable="false"
							@cancel="cancel(meeting)"
						/>
					</v-slide-item>
				</v-slide-group>
				<div v-if="completedMeetings.length > 0" class="d-flex align-center">
					<v-btn text class="mx-auto" @click="showOld = !showOld"
						>Alte Anfragen {{ !showOld ? 'anzeigen' : 'verbergen' }}</v-btn
					>
				</div>

				<v-slide-group
					v-if="showOld"
					:show-arrows="completedMeetings.length > 1"
					class="px-1 pb-4"
				>
					<v-slide-item v-for="(meeting, i) in completedMeetings" :key="i">
						<CoachingContactStatus
							:coach="meeting.coach"
							:response="meeting.attributes"
							:id="meeting.id"
							:clickable="false"
							oldlist
							@cancel="cancel(meeting)"
						/>
					</v-slide-item>
				</v-slide-group>
			</v-sheet>
			<UtilsBtn
				v-if="upcomingMeetings.length != 0"
				text="Beratungsangebote ansehen"
				link="/berater"
			/>
		</div>
		<v-container v-else-if="upcomingMeetings == null">
			<v-sheet elevation="2" class="pa-2">
				<v-skeleton-loader
					class="mx-auto"
					max-width="300"
					type="list-item-avatar, list-item-three-line, list-item-three-line, actions"
				></v-skeleton-loader>
			</v-sheet>
		</v-container>
		<v-sheet color="blue-grey lighten-5">
			<v-container>
				<v-alert
					v-model="newWoman"
					type="success"
					color="success"
					icon="mdi-check"
					dismissible
					>Geschafft! Ab jetzt sind alle Angebote von Sichere Zuflucht frei
					zugänglich.</v-alert
				>
				<SharedServiceOverview />
			</v-container>
		</v-sheet>
	</v-sheet>
</template>

<script>
	export default {
		middleware: 'authWoman',
		data() {
			return {
				completedMeetings: [],
				upcomingMeetings: [],
			};
		},
		async mounted() {
			this.loadMeetings();

			//this.newWoman = window.localStorage.getItem('newWoman');
			//window.localStorage.removeItem('newWoman');
		},
		methods: {
			async loadMeetings() {
				var meetings = await this.$func.loadAllMeetingsOfParticipant();
				this.upcomingMeetings = [];

				const up = [];
				const compl = [];
				meetings.forEach((meeting) => {
					if (
						meeting.status == 'meeting canceled' ||
						meeting.status == 'meeting completed'
					)
						compl.push(meeting);
					else up.push(meeting);
				});
				this.upcomingMeetings = up;
				this.completedMeetings = compl;
				console.log('up', up);
			},
		},
		/*methods: {
			cancel(response) {
				this.responses = this.responses.filter((r) => r !== response);
			},
			async loadMeetings() {
				var meetings = await this.$func.loadAllMeetingsOfParticipant();
				console.log('meetings', meetings);
				meetings.forEach((meeting) => {
					if (
						meeting.status == 'meeting canceled' ||
						meeting.status == 'meeting completed'
					)
						this.completedMeetings.push(meeting);
					else this.upcomingMeetings.push(meeting);
				});
				/*await this.$func.loadAllMeetingsOfParticipant().then((res) => {
					//if Coach still existed and didn't deleted the account, search for coach
					console.log('res', res);
					/*var collection = [];
						res.data.forEach((response) => {
							if (!response.attributes.users_permissions_users.data[1])
								return collection.push({
									coach: { noCoach: true },
									...response,
								});
							this.$strapi.$users
								.find({
									populate: 'avatar',
									'filters[id]':
										response.attributes.users_permissions_users.data[1].id,
								})
								.then((thisCoach) => {
									const coach = thisCoach[0];
									collection.push({
										coach,
										...response,
									});
									collection.sort((a, b) => {
										return b.id - a.id;
									});
								});
						});
						this.responses = collection;
				});
			},
		},*/
	};
</script>
