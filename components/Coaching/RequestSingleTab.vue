<template>
	<div>
		<v-expansion-panel-header
			color="grey lighten-5"
			class="d-flex align-center justify-start"
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
					{{ item.woman_name }}
				</p>
			</div>
			<div>
				<v-chip
					v-if="item.status == 'deleted'"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="error"
					text-color="white"
				>
					abgesagt
				</v-chip>
				<v-chip
					v-else-if="videoStatus.ready"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="success"
					text-color="white"
				>
					laufend...
				</v-chip>
				<v-chip
					v-else-if="videoStatus.done"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="grey"
					text-color="white"
				>
					abgelaufen
				</v-chip>
				<v-chip
					v-else-if="item.status == 'woman requested meeting'"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="error"
					text-color="white"
				>
					unbearbeitet
				</v-chip>
				<v-chip
					v-else-if="item.status == 'coach proposed timeslots'"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="orange"
					text-color="white"
				>
					Antwort abwarten
				</v-chip>
				<v-chip
					v-else-if="payment ? payment.status == 'complete' : false"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="success"
					text-color="white"
				>
					bereit
				</v-chip>
				<v-chip
					v-else-if="
						payment == false || payment ? payment.status == 'open' : false
					"
					class="ma-2 flex-shrink-0 flex-grow-1"
					color="success"
					text-color="white"
				>
					bezahlung offen
				</v-chip>
			</div>
		</v-expansion-panel-header>
		<v-expansion-panel-content>
			<v-card elevation="0">
				<v-card-text>
					<v-row>
						<v-col cols="9" sm="10" md="11">
							<v-sheet v-if="item.message" color="grey lighten-5 pa-3 my-4">
								<p
									class="caption ma-0 grey--text"
									style="transform: translateY(-22px); position: absolute"
								>
									Nachricht
								</p>
								<p class="mb-0">
									{{ item.message }}
								</p>
							</v-sheet>
						</v-col>
					</v-row>

					<div v-if="item.status == 'deleted'">
						<p class="caption">Termin abgesagt</p>
						<v-alert dark text dense color="primary"
							>Der Termin
							{{
								item.time_proposals_parsed[item.selected_time_index]
									? `für ${formatDate(
											item.time_proposals_parsed[item.selected_time_index]
									  )} um ${formatTime(
											item.time_proposals_parsed[item.selected_time_index]
									  )}`
									: ''
							}}
							wurde abgesagt.
						</v-alert>
					</div>

					<div
						v-else-if="
							payment == false || payment ? payment.status == 'open' : false
						"
					>
						<p class="caption">Bezahlung noch nicht eingerichtet</p>
						<v-alert dark text dense color="primary"
							>Die Frau hat noch keine Bezahlung für den Termin
							{{
								item.time_proposals_parsed[item.selected_time_index]
									? `am ${formatDate(
											item.time_proposals_parsed[item.selected_time_index]
									  )} um ${formatTime(
											item.time_proposals_parsed[item.selected_time_index]
									  )}`
									: ''
							}}
							hinterlegt.
						</v-alert>
					</div>
					<div v-else-if="videoStatus.done">
						<p class="caption">Termin abgelaufen</p>
						<v-alert dark text dense color="grey"
							>Der Termin hat
							{{
								item.time_proposals_parsed[item.selected_time_index]
									? `am ${formatDate(
											item.time_proposals_parsed[item.selected_time_index]
									  )} um ${formatTime(
											item.time_proposals_parsed[item.selected_time_index]
									  )}`
									: ''
							}}
							stattgefunden.
						</v-alert>
					</div>
					<div v-else-if="item.status == 'woman requested meeting'">
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
							:item="item"
							@suggestion="addToSuggestionList"
						/>
						<p class="mt-2 mb-0 pa-2 caption">
							Bitte füge mind. 3 Termine hinzu.
						</p>
					</div>
					<div v-else-if="payment ? payment.status == 'complete' : false">
						<p class="caption">Bestätigter Termin</p>
						<b
							>{{
								formatDate(item.time_proposals_parsed[item.selected_time_index])
							}}
							|
							{{
								formatTime(item.time_proposals_parsed[item.selected_time_index])
							}}
							<span class="caption">(50min)</span>
						</b>
						<v-divider></v-divider>
						<v-btn
							class="my-2"
							color="success"
							target="_blank"
							:disabled="!videoStatus.ready"
							:href="
								item.video_type === 'normal' ? item.videoCoach : item.videoWoman
							"
							>zum Videocall
						</v-btn>
						<v-btn
							v-if="item.video_type === 'normal'"
							class="my-2"
							color="secondary"
							outlined
							target="_blank"
							:href="`https://meet.jit.si/coachtest-${new Date().getTime()}`"
							>Video testen
						</v-btn>
						({{
							item.video_type == 'normal'
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
					<div v-else-if="item.status == 'coach proposed timeslots'">
						<v-banner>
							Es wurde noch kein Termin bestätigt. Ihre vorgeschlagenen Termine
							sind:<br /><br />
							<span
								v-for="(d, di) in item.time_proposals_parsed"
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
						v-if="
							selectedVideoType == 'normal' &&
							item.status == 'woman requested meeting'
						"
						:loading="loading"
						:disabled="suggestionArray.length < 3"
						color="success"
						@click="addSuggestions()"
						>Termine vorschlagen
					</v-btn>
					<v-dialog
						v-if="item.status != 'deleted' && !oldlist"
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
								@click="cancel(item)"
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
			item: {
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
			videoStatus() {
				let b = true;
				let r = false;
				let d = false;

				console.log('videoStatus', this.item.selected_time_index);

				if (this.item.selected_time_index != -1) {
					const startTime = new Date(
						this.item.time_proposals_parsed[this.item.selected_time_index]
					);
					const preTime = new Date();
					const overTime = new Date();
					const now = new Date();

					preTime.setTime(startTime.getTime() - 15 * 60 * 1000);
					overTime.setTime(startTime.getTime() + 60 * 60 * 1000);

					b = now < preTime;
					r = overTime >= now && now >= preTime;
					d = overTime < now;
				}

				return {
					before: b,
					ready: r,
					done: d,
				};
			},
		},
		/*async mounted() {
			this.payment = this.payment = await this.$getStripePaymentSession(
				this.item.paymentID
			);
		},*/
		methods: {
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
					this.item.status = 'coach proposed timeslots';
					this.item.time_proposals_parsed = this.suggestionArray;
					this.item.video_type = this.selectedVideoType;
					this.loading = false;
					this.suggestionArray = [];
					this.selectedVideoType = 'normal';
				});
			},
			cancel(doc) {
				//this.$deleteMeeting(informTo, this.id, doc.acceptedDate)
				this.$deleteMeeting(
					this.$store.getters['getCurrentUser'].email,
					this.id,
					doc.acceptedDate,
					doc.paymentID
				).then((r) => {
					this.isDelete = false;
					this.eraseLoading = false;
					location.reload();
					//this.requests = this.requests.filter((request) => request.id !== r.data.data.id);
				});
			},
			eraseDate(d, list) {
				const d2 = d + 1;
				list.splice(d, d2);
			},
			formatDate(date) {
				const d = new Date(date);
				return d.toLocaleDateString('de-DE', {
					weekday: 'long',
					year: 'numeric',
					month: 'long',
					day: 'numeric',
				});
			},
			formatTime(date) {
				const d = new Date(date);
				return d.toLocaleTimeString('de-DE', {
					hour: 'numeric',
					minute: 'numeric',
				});
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
