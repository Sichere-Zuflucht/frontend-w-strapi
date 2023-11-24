<template>
	<v-card
		elevation="2"
		nuxt
		outlined
		width="100%"
		class="ma-2 d-flex flex-column"
		:max-width="width"
		:style="`border: 1px solid ${status.borderColor}`"
	>
		<nuxt-link
			:to="'/berater/me?name=' + meeting.coach_slug"
			style="text-decoration: none"
			class="d-flex"
			:style="`border-bottom: 1px solid ${status.borderColor} !important`"
		>
			<v-avatar color="primary ma-5" size="90" contain>
				<v-img
					v-if="meeting.coach_avatar_content_url"
					:lazy-src="`${meeting.coach_avatar_content_url}?${Date.now()}`"
					:src="`${meeting.coach_avatar_content_url}?${Date.now()}`"
				/>
			</v-avatar>
			<div class="ma-5 ml-2 d-flex flex-column justify-center">
				<h2 class="secondary--text text-h2">
					{{ meeting.coach_name }}
				</h2>
				<h3 class="mt-2 text-h5">
					{{ meeting.coach_profession_line }}
				</h3>
			</div>
		</nuxt-link>
		<v-card-text class="flex-grow-1 relative">
			<div v-if="status.isRequest">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Der Coach hat auf deine Anfrage noch nicht reagiert.
				</p>
				<p>
					Bitte habe ein wenig Geduld. Der*die Berater*in sollte sich innerhalb
					von 24h bei dir melden.
				</p>
			</div>
			<div v-else-if="status.hasTimeslots">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Vorschläge für einen Online-Beratungstermin
				</p>
				<v-row>
					<v-col cols="12">
						<v-select
							v-model="selectedDate"
							:items="meeting.time_proposals_parsed"
							outlined
							dense
							hide-details
							color="primary"
							label="Bitte wählen"
							class="my-2"
						>
							<template #item="{ item, on }">
								<v-list-item v-on="on">
									<v-list-item-content>
										<v-list-item-title class="font-weight-bold mb-0">
											{{ formatDate(item) }}
										</v-list-item-title>
										<div class="caption">{{ formatTime(item) }} Uhr</div>
									</v-list-item-content>
								</v-list-item>
							</template>
							<template #selection="{ item }"
								>{{ formatDate(item) }}
								|
								{{ formatTime(item) }}
							</template>
						</v-select>
						<p class="font-weight-bold mb-0 my-4">Preis: 50€</p>
						<v-btn
							color="success"
							:loading="btn.payButtonLoading"
							:disabled="!selectedDate || btn.isDisabled"
							block
							@click="pay()"
							>Termin verbindlich buchen
							<v-icon small class="ml-1">mdi-open-in-new</v-icon>
						</v-btn>
						<v-alert v-if="btn.error" type="error">{{ btn.errorMsg }}</v-alert>
						<p class="caption">
							Um den Termin verbindlich zu buchen, wirst du unserem
							Zahlungsanbieter stripe weitergeleitet. Dort kannst du deine
							Zahlungsdaten hinterlegen. WICHTIG! Wir belasten dein Konto erst
							zu Beginn des Beratungsgespräches.
						</p>
					</v-col>
				</v-row>
			</div>
			<div v-else-if="status.isArchived">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Termin abgesagt
				</p>
				<v-alert dark text dense color="primary"
					>Der Termin
					{{
						meeting.acceptedDate
							? `für
                  ${formatDate(meeting.selected_meeting)} um
                  ${formatTime(meeting.selected_meeting)}`
							: ''
					}}
					wurde abgesagt.
				</v-alert>
			</div>
			<div v-else-if="status.isPayed">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Meeting läuft gerade.
				</p>
				<v-btn
					class="my-2"
					color="success"
					target="_blank"
					:disabled="status.isAccessable"
					:href="meeting.personal_videolink"
					>zurück zum Videocall
				</v-btn>
				<v-alert dark text dense color="success"
					>Der Videocall begann um
					{{ formatTime(meeting.selected_meeting) }}
				</v-alert>
			</div>
			<div v-else-if="status.isPassed">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Vergangener Termin
				</p>
				<v-alert dark text dense color="grey"
					>Das Meeting hat am {{ formatDate(meeting.selected_meeting) }} um
					{{ formatTime(meeting.selected_meeting) }} stattgefunden.
				</v-alert>
			</div>
			<div v-else-if="status.hasCreditCard">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Dein Online-Beratungstermin ist eingerichtet und startbereit.
				</p>
				<v-btn
					class="my-2"
					color="success"
					target="_blank"
					:disabled="!status.isAccessable"
					@click="startCapturePayment"
					>zum Videocall
				</v-btn>
				<v-btn
					v-if="meeting.video_type === 'normal'"
					class="my-2"
					color="secondary"
					outlined
					target="_blank"
					:href="`https://meet.jit.si/womantest-${id}-${Date.now()}`"
					>Video testen
				</v-btn>
				<v-alert dark text dense color="success"
					>Zugesagt für {{ formatDate(meeting.selected_meeting) }} um
					{{ formatTime(meeting.selected_meeting) }}
				</v-alert>
				<p class="caption">
					Der Zugang zum Videocall wird <b>15min vor Beginn</b> freigeschaltet.
					Bitte lade kurz vor Beginn die Seite nochmal neu, um den
					Videocall-Button zu aktivieren. <a @click="reload">neu laden</a>
				</p>
			</div>
			<!----<div
				v-else-if="
					payment_session_id == null || payment
						? payment.status == 'open'
						: false
				"
			>
				<v-alert dark color="error" type="error">
					<p>
						Es liegt keine Bezahlung vor. Es könnte sein, dass etwas schief
						gelaufen ist.
					</p>
					{{ meeting }}
					<v-btn
						v-if="meeting.selected_time_index != -1"
						@click="
							pay(meeting.time_proposals_parsed[meeting.selected_time_index])
						"
						class="mb-2"
						>Zahlung erneut probieren</v-btn
					>
					<p class="caption">
						Wenn notwendig, kontaktieren Sie uns unter:
						<a href="mailto:support@sichere-zuflucht.de" class="white--text">
							support@sichere-zuflucht.de</a
						>
					</p>
				</v-alert>
			</div>-->
		</v-card-text>
		<v-card-actions style="position: relative">
			<v-dialog
				v-if="meeting.status != 'deleted' && !oldlist"
				v-model="isDelete"
				persistent
				max-width="290"
			>
				<template #activator="{ on, attrs }">
					<v-btn small text color="primary" v-bind="attrs" v-on="on"
						>Termin absagen
					</v-btn>
				</template>
				<v-alert type="error" color="error" class="mt-2 ma-2">
					<p>Wirklich absagen?</p>
					<v-btn light class="mr-1" :loading="eraseLoading" @click="cancel"
						>Ja, absagen
					</v-btn>
					<v-btn light @click="isDelete = false"> nein</v-btn>
				</v-alert>
			</v-dialog>
			<v-btn
				v-else-if="meeting.status == 'deleted' || oldlist"
				small
				color="primary"
				outlined
				nuxt
				:to="'/berater/me?name=' + meeting.coach_slug"
				>Neue Anfrage stellen
			</v-btn>
		</v-card-actions>
		<v-card-actions v-if="error">
			<v-alert type="error" color="error">{{ error }}</v-alert>
		</v-card-actions>
		<v-overlay :value="redirectWarning" color="black" opacity="0.8">
			<p>
				Weiterleitung zu Stripe. Dies kann ein bisschen dauern. Bitte warten...
			</p>
		</v-overlay>
	</v-card>
</template>

<script>
	export default {
		name: 'Coaching',
		props: {
			coach: {
				type: Object,
				default: () => {},
			},
			meeting: {
				type: Object,
				default: () => {},
			},
			id: {
				type: String,
				default: null,
			},
			clickable: {
				type: Boolean,
				default: true,
			},
			position: {
				type: Number,
			},
			oldlist: {
				type: Boolean,
				default: false,
			},
			width: {
				type: String,
				default: '350',
			},
		},
		data() {
			return {
				selectedDate: null,
				isDelete: false,
				eraseLoading: false,
				btn: {
					error: false,
					errorMsg: '',
					isDisabled: false,
					payButtonLoading: false,
				},
				redirectWarning: false,
				error: null,
				payment: null,
			};
		},
		computed: {
			selectedItemIndex() {
				return this.meeting.time_proposals_parsed.indexOf(this.selectedDate);
			},
			jitsiWithWomanName() {
				const name = this.$store.getters['getCurrentUser'].username;
				return `${this.meeting.videoCoach}#userInfo.displayName="${name}"`;
			},
			status() {
				return this.setStatus();
			},
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
					case 'woman fee was captured':
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
						if (!isPayed) isAccessable = true;
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
					isAccessable,
					isPayed,
					hasCreditCard,
					isPassed,
					isArchived,
					borderColor,
				};
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
						this.$emit('cancel');
					})
					.catch((err) => {
						this.isDelete = false;
						this.eraseLoading = false;
						this.error = err;
						this.$errorhandling(err, 'ContactStatus $archiveMeeting');
					});
			},
			async pay() {
				const pay_url = await this.$func.womanSelectsProposalAndPays({
					selected_time_index: this.selectedItemIndex,
					meeting_id: this.id,
				});
				location.href = pay_url;
				/*this.btn.payButtonLoading = true;
				let redReq, data, video;
				if (this.meeting.videoType === 'secure') {
					data = {
						//method: 'getEntryCodes',
						//date: (dateInput.date.split('T'))[0],
						//token: this.$config.redAPI,
						method: 'getEntryCodes',
						date: '2023-11-27',
						token: this.$config.redAPI,
					};
				} else {
					video = {
						codeArzt:
							'https://meet.jit.si/' +
							this.coach.username +
							'-meetingid-' +
							this.id, // no ?:&'"%# symbols allowed
						codePatient:
							'https://meet.jit.si/' +
							this.coach.username +
							'-meetingid-' +
							this.id,
					};
					this.redirectWarning = true;
					this.standardPayment(video, dateInput);
				}*/
			},
			async startCapturePayment() {
				if (this.status != 'isPayed') {
					await this.$func
						.womanParticipatesMeetingAndCapturesPayment({
							meeting_id: this.id,
						})
						.then(() => {
							window.open(this.meeting.personal_videolink, '_blank');
						})
						.catch((err) => {
							this.error = err;
						});
				} else {
					window.open(this.meeting.personal_videolink, '_blank');
				}
			},
			/*standardPayment(v, dI) {
				this.$stripePayment(this.coach.stripeID, this.id)
					.then((paymentID) => {
						const data = {
							acceptedDate: dI.date,
							videoCoach: v.codeArzt,
							videoWoman: v.codePatient,
							paymentID: paymentID,
						};

						this.$strapi.$meetings
							.update(this.id, {
								data,
							})
							.then((r) => {
								this.btn.payButtonLoading = false;
								this.btn.isDisabled = true;
								this.meeting.acceptedDate = dI;
								this.meeting.video = v;
								window.localStorage.setItem('meetingID', this.id);
								window.localStorage.setItem('sessionID', paymentID);

								this.sendNotificationEmail({
									date: new Date(dI.date),
									time: new Date(dI.date),
									id: this.id,
								});

								this.$stripe.redirectToCheckout({
									// Make the id field from the Checkout Session creation API meeting
									// available to this file, so you can provide it as argument here
									// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
									sessionId: paymentID,
								});
							})
							.catch((e) => {
								this.$errorhandling(e);
								this.error = e.response.data.error.name;
								this.redirectWarning = false;
							});
					})
					.catch((e) => {
						this.$errorhandling(e);
						this.error = e.response.data.error.name;
						this.redirectWarning = false;
					});
			},*/
			formatDate(date) {
				return this.$format.date(date);
			},
			formatTime(date) {
				return this.$format.time(date);
			},
			reload() {
				window.location.reload();
			},
		},
	};
</script>
