<template>
	<v-sheet class="pb-0">
		<v-sheet color="secondary pa-8">
			<h1 class="text-h1 white--text">Willkommen bei<br />Sichere Zuflucht</h1>
		</v-sheet>
		<div v-if="upcomingMeetings.length != 0 || completedMeetings.length != 0">
			<v-container v-if="upcomingMeetings.length == 1">
				<h2 class="text-h4 font-weight-bold primary--text mb-3">
					Bitte aktualisiere die Seite, um ggf. Antworten sehen zu können.
				</h2>
				<v-btn outlined color="primary" @click="loadMeetings"
					><v-icon small class="mr-1">mdi-update</v-icon>Aktualisieren</v-btn
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
							:position="meeting.position"
							@cancel="cancel(meeting)"
						/>
					</v-slide-item>
				</v-slide-group>

				<div
					v-if="completedMeetings.length > 0"
					class="d-flex align-center mb-2"
				>
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
							:coach="meeting.relationships.coach.data"
							:meeting="meeting.attributes"
							:id="meeting.id"
							:clickable="false"
							oldlist
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
		<v-container v-if="loading">
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
				showOld: false,
				newWoman: false,
				completedMeetings: [],
				upcomingMeetings: [],
				loading: true,
				fetchDataIntervalId: null,
			};
		},
		async mounted() {
			this.loadMeetings();

			this.newWoman = window.localStorage.getItem('newWoman');
			window.localStorage.removeItem('newWoman');

			this.fetchDataIntervalId = setInterval(() => {
				this.loadMeetings();
			}, 5 * 60 * 1000);
			console.log('loaded');
		},
		beforeDestroy() {
			// Clear the interval when the component is destroyed to prevent memory leaks
			clearInterval(this.fetchDataIntervalId);
		},
		methods: {
			async loadMeetings() {
				this.completedMeetings = [];
				this.upcomingMeetings = [];
				var meetings = await this.$func.loadAllMeetingsOfParticipant();
				meetings.forEach((meeting, i) => {
					const meetingStatus = meeting.attributes.status;
					if (
						meetingStatus == 'meeting canceled' ||
						meetingStatus == 'meeting completed' ||
						meetingStatus == 'archived'
					)
						this.completedMeetings.push({ ...meeting, position: i });
					else this.upcomingMeetings.push({ ...meeting, position: i });
				});
				this.loading = false;
			},
			cancel({ position }) {
				console.log('position 2', this.upcomingMeetings[position]);
				const getEl = this.upcomingMeetings.splice(position, 1)[0];
				this.completedMeetings.push(getEl);
				console.log(this.completedMeetings);
				//console.log(this.completedMeetings.inArray(position));
				//this.responses = this.responses.filter((r) => r !== response);
			},
		},
		/*methods: {
			
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
