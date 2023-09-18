<template>
	<div>
		<v-expansion-panel-header
			color="grey lighten-5"
			class="d-flex align-center justify-start"
			:style="`border: 1px solid ${status.borderColor}`"
		>
			<v-avatar
				class="mr-2 flex-shrink-1 flex-grow-0"
				style="border: 1px solid lightgrey"
			>
				<SharedWomanIcon color="black" class="pa-2" />
			</v-avatar>
			<div
				class="d-flex flex-column flex-grow-0 flex-shrink-0"
				style="position: relative"
			>
				<p
					class="mb-0"
					style="position: absolute; top: -50%; font-size: 0.5em !important"
				>
					KryptoNr.
				</p>
				<p class="font-weight-bold mb-0">
					{{ meeting.woman_name }}
				</p>
			</div>
			<div>
				<v-chip
					v-if="status.isArchived"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="error"
					text-color="white"
				>
					abgesagt
				</v-chip>
				<v-chip
					v-else-if="status.isPayed"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="success"
					text-color="white"
				>
					laufend...
				</v-chip>
				<v-chip
					v-else-if="status.isPassed"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="grey"
					text-color="white"
				>
					abgelaufen
				</v-chip>
				<v-chip
					v-else-if="status.isRequest"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="error"
					text-color="white"
				>
					unbearbeitet
				</v-chip>
				<v-chip
					v-else-if="status.hasTimeslots"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="orange"
					text-color="white"
				>
					Antwort abwarten
				</v-chip>
				<v-chip
					v-else-if="status.hasCreditCard || status.isAccessable"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="success"
					text-color="white"
				>
					bereit
				</v-chip>
			</div>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-card elevation="0">
				<v-card-text>
					<v-row>
						<v-col cols="9" sm="10" md="11">
							<v-sheet v-if="meeting.message" color="grey lighten-5 pa-3 my-4">
								<p
									class="caption ma-0 grey--text"
									style="transform: translateY(-22px); position: absolute"
								>
									Nachricht
								</p>
								<p class="mb-0">
									{{ meeting.message }}
								</p>
							</v-sheet>
						</v-col>
					</v-row>
					<div v-if="status.isArchived">
						<p class="caption">Termin abgesagt</p>
						<v-alert dark text dense color="primary"
							>Der Termin
							{{
								meeting.selected_meeting
									? `für ${formatDate(
											meeting.selected_meeting
									  )} um ${formatTime(meeting.selected_meeting)}`
									: ''
							}}
							wurde abgesagt.
						</v-alert>
					</div>
					<div v-else-if="status.isPassed">
						<p class="caption">Termin abgelaufen</p>
						<v-alert dark text dense color="grey"
							>Der Termin hat
							{{
								meeting.selected_meeting
									? `am ${formatDate(meeting.selected_meeting)} um ${formatTime(
											meeting.selected_meeting
									  )}`
									: ''
							}}
							stattgefunden.
						</v-alert>
					</div>
					<div v-else-if="status.isRequest">
						<div class="d-flex">
							<v-select
								v-model="selectedVideoType"
								:hint="
									selectedVideoType == 'normal' ? descrNormal : descrSecure
								"
								:items="videoTypes"
								outlined
								label="Videoanbieter auswählen"
								persistent-hint
								class="mb-4"
							></v-select>
							<v-btn
								color="grey"
								small
								icon
								width="30"
								height="30"
								class="mt-3 ml-2"
								@click="sheet = !sheet"
							>
								<v-icon>mdi-information-variant</v-icon>
							</v-btn>
						</div>
						<v-overlay :value="sheet">
							<div class="pa-1">
								<v-sheet
									class="text-center pa-6"
									light
									color="white"
									max-width="450"
								>
									<div class="my-3">
										<p>
											<b class="secondary--text"
												>Sicherer Anbieter Jitsi Meet:</b
											><br />
											ist <b>vollständig verschlüsselt</b>. Es werden keine
											personenbezogenen Daten erhoben, da kein Account für die
											Nutzung notwendig ist. <br /><br />
											<b class="secondary--text"
												>Zertifizierter Anbieter RED connect:</b
											><br />
											ist mit dem <b>ips-Gütesiegel</b> ausgezeichnet. Es hat in
											der Vergangenheit als <b>einziges System</b> in
											Deutschland das
											<b>Datenschutz-Gütesiegel des ULD </b>erhalten. RED
											connect ist von der kassenärztlichen Bundesvereinigung
											(KBV) als zertifizierter Videodienstanbieter gelistet.
										</p>
									</div>
									<v-btn class="mt-6" color="primary" @click="sheet = !sheet">
										Schließen
									</v-btn>
								</v-sheet>
							</div>
						</v-overlay>
						<v-list>
							<v-list-item-group>
								<v-list-item v-for="(d, di) in suggestionArray" :key="di">
									<v-list-item-content>
										<v-list-item-title
											class="font-weight-bold"
											style="font-size: 1em"
											>{{ formatDate(d) }}
										</v-list-item-title>
										<p class="caption">{{ formatTime(d) }} Uhr</p>
									</v-list-item-content>
									<v-list-item-icon>
										<v-icon @click="eraseDate(di, suggestionArray)"
											>mdi-close
										</v-icon>
									</v-list-item-icon>
								</v-list-item>
							</v-list-item-group>
						</v-list>
						<v-alert
							v-if="selectedVideoType !== 'normal'"
							type="info"
							color="primary"
							>Aktuell können wir noch keinen zertifizierten Anbieter zur
							Verfügung stellen. Wir arbeiten daran, dies bald zu
							möglich.</v-alert
						>
						<UtilsDatePicker
							v-if="selectedVideoType == 'normal'"
							:meeting="meeting"
							@suggestion="addToSuggestionList"
						/>
						<p class="mt-2 mb-0 pa-2 caption">
							Bitte füge mind. 3 Termine hinzu.
						</p>
					</div>
					<div v-else-if="status.hasCreditCard || status.isAccessable">
						<p class="caption">Bestätigter Termin</p>
						<b
							>{{ formatDate(meeting.selected_meeting) }}
							|
							{{ formatTime(meeting.selected_meeting) }}
							<span class="caption">(50min)</span>
						</b>
						<v-divider></v-divider>
						<v-alert type="success" icon="mdi-key">
							<b>Login als Moderator*in</b><br />
							Username:
							{{ $store.getters['getCurrentUser'].slug }} <br />
							Passwort: {{ $store.getters['getCurrentUser'].id.slice(0, 4) }}
						</v-alert>
						<v-btn
							class="my-2"
							color="success"
							target="_blank"
							:disabled="!status.isAccessable"
							:href="meeting.personal_videolink"
							>zum Videocall
						</v-btn>
						<v-btn
							v-if="meeting.video_type === 'normal'"
							class="my-2"
							color="secondary"
							outlined
							target="_blank"
							:href="`https://meetings.sichere-zuflucht.de/coachtest-${id}-${Date.now()}`"
							>Video testen
						</v-btn>
						({{
							meeting.video_type == 'normal'
								? 'standard Videoanbieter '
								: 'zertifizierter Videoanbieter'
						}})

						<p class="caption">
							Der Zugang zum Videocall wird
							<b>15min vor Beginn</b> freigeschaltet. Bitte laden Sie kurz vor
							Beginn die Seite nochmal neu, um den Videocall-Button zu
							aktivieren. <a @click="reload">neu laden</a>
						</p>
					</div>
					<div v-else-if="status.hasTimeslots">
						<div v-if="meeting.selected_meeting">
							<p class="caption">Bezahlung noch nicht eingerichtet</p>
							<v-alert dark text dense color="primary"
								>Die Frau hat noch keine Bezahlung für den Termin
								{{
									meeting.selected_meeting
										? `am ${formatDate(
												meeting.selected_meeting
										  )} um ${formatTime(meeting.selected_meeting)}`
										: ''
								}}
								hinterlegt.
							</v-alert>
						</div>
						<v-banner v-else>
							Es wurde noch kein Termin bestätigt. Ihre vorgeschlagenen Termine
							sind:<br /><br />
							<span
								v-for="(d, di) in meeting.time_proposals_parsed"
								:key="di"
								class="pt-4"
								><b>{{ formatDate(d) }}</b
								><br />
								{{ formatTime(d) }} Uhr<br /><br
							/></span>
						</v-banner>
					</div>
				</v-card-text>

				<v-card-actions class="d-flex justify-end">
					<v-btn
						v-if="selectedVideoType == 'normal' && status.isRequest"
						:loading="loading"
						:disabled="suggestionArray.length < 3"
						color="success"
						@click="addSuggestions()"
						>Termine vorschlagen
					</v-btn>
					<v-dialog
						v-if="!status.isArchived && !oldlist"
						v-model="isDelete"
						persistent
						max-width="290"
					>
						<template #activator="{ on, attrs }">
							<v-btn small text color="grey" v-bind="attrs" v-on="on"
								>Termin absagen
							</v-btn>
						</template>
						<v-alert type="error" color="error" class="mt-2 ma-2">
							<p>Wirklich absagen?</p>
							<v-btn
								light
								class="mr-1"
								:loading="eraseLoading"
								@click="cancel()"
								>Ja, absagen
							</v-btn>
							<v-btn light @click="isDelete = false"> nein</v-btn>
						</v-alert>
					</v-dialog>
				</v-card-actions>
			</v-card>
		</v-expansion-panel-content>
	</div>
</template>

<script>
	export default {
		props: {
			meeting: {
				type: Object,
				default: {},
			},
			id: {
				type: String,
				default: null,
			},
			oldlist: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				requests: null,
				newDate: new Date(new Date().setHours(new Date().getHours() - 1)),
				suggestionArray: [],
				selectedVideoType: 'normal',
				videoTypes: [
					{
						text: 'sicherer Anbieter',
						value: 'normal',
					},
					{
						text: 'zertifizierter Anbieter',
						value: 'secure',
					},
				],
				descrNormal:
					'Als sicheren Anbieter nutzen wir Jitsi. Viele Gespräche können hierüber abgewickelt werden, solange keine sensiblen Daten ausgetauscht werden.',
				descrSecure:
					'In seltenen Fällen lohnt es sich, unseren zertifizierten Anbieter RED zu nutzen. So zum Beispiel bei sensiblen ärztlichen Informationen.',
				loading: false,
				eraseLoading: false,
				isDelete: false,
				payment: null,
				sheet: false,
			};
		},
		computed: {
			status() {
				return this.setStatus();
			},
		},
		mounted() {
			console.log(this.meeting);
		},
		methods: {
			setStatus() {
				var isRequest = false;
				var hasTimeslots = false;
				var hasCreditCard = false;
				var isAccessable = false;
				var isPayed = false;
				var isPassed = false;
				var isArchived = false;
				var borderColor = this.$vuetify.theme.themes.light.primary;

				//** Matching Process */
				switch (this.meeting.status) {
					case 'woman requested meeting':
						isRequest = true;
						break;
					case 'coach proposed timeslots':
						hasTimeslots = true;
						break;
					case 'woman payment method is valid':
						hasCreditCard = true;
						break;
					case 'woman fee was captchured':
						isPayed = true;
						break;
					case 'archived':
						isArchived = true;
						break;
				}

				if (this.meeting.selected_meeting != 'not selected yet') {
					const meetingTime = new Date(this.meeting.selected_meeting);
					const meetingTimeEnd = new Date(
						this.meeting.selected_meeting_expired
					);
					const entryTime = new Date(meetingTime.getTime() - 15 * 60 * 1000);
					const currentTime = new Date();
					if (currentTime >= entryTime && currentTime < meetingTimeEnd) {
						isAccessable = true;
					} else if (currentTime > meetingTimeEnd) {
						isPassed = true;
					}
				}

				if (isAccessable)
					borderColor = this.$vuetify.theme.themes.light.success;
				if (isArchived || isPassed) borderColor = 'grey';

				return {
					isRequest,
					hasTimeslots,
					hasCreditCard,
					isAccessable,
					isPayed,
					isPassed,
					isArchived,
					borderColor,
				};
			},
			addToSuggestionList(d) {
				this.suggestionArray.push(new Date(d).toString());
			},
			addSuggestions() {
				this.loading = true;
				const data = {
					time_proposals: this.suggestionArray,
					video_type: this.selectedVideoType,
					meeting_id: this.id,
				};
				this.$func.coachGivesProposals(data).then(() => {
					this.meeting.status = 'coach proposed timeslots';
					this.meeting.time_proposals_parsed = this.suggestionArray;
					this.meeting.video_type = this.selectedVideoType;
					this.loading = false;
					this.suggestionArray = [];
					this.selectedVideoType = 'normal';
				});
			},
			cancel() {
				this.eraseLoading = true;
				this.$func
					.archiveMeeting(this.id)
					.then(() => {
						this.isDelete = false;
						this.eraseLoading = false;
						this.error = null;
						this.meeting.status = 'archived';
						//location.reload();
						//this.$emit('cancel');
					})
					.catch((err) => {
						this.isDelete = false;
						this.eraseLoading = false;
						this.error = err;
						this.$errorhandling(err, 'ContactStatus $archiveMeeting');
					});
			},
			eraseDate(d, list) {
				const d2 = d + 1;
				list.splice(d, d2);
			},
			formatDate(date) {
				return this.$format.date(date);
			},
			formatTime(date) {
				return this.$format.time(date);
			},
			getCodeQuery(d) {
				const n = d.replace('//', '').split('/');
				return window.location.origin + '/videomeeting/' + n[1];
			},
			reload() {
				window.location.reload();
			},
		},
	};
</script>
