<template>
	<v-card
		elevation="2"
		nuxt
		outlined
		width="100%"
		class="ma-2 d-flex flex-column"
		:max-width="width"
		:style="
			'border: 1px solid ' +
			(videoStatus.ready
				? $vuetify.theme.themes.light.success
				: videoStatus.done
				? 'grey'
				: $vuetify.theme.themes.light.primary)
		"
	>
		<nuxt-link
			:to="'/berater/' + meeting.coach_slug"
			style="text-decoration: none"
			class="d-flex"
			:style="
				'border-bottom: 1px solid ' +
				(videoStatus.ready
					? $vuetify.theme.themes.light.success
					: videoStatus.done
					? 'grey'
					: $vuetify.theme.themes.light.primary) +
				' !important'
			"
		>
			<v-avatar color="primary ma-5" size="90" contain>
				<v-img
					v-if="meeting.coach_avatar && functionalCookieAccepted"
					:lazy-src="
						(meeting.coach_avatar.url.includes('https')
							? ''
							: 'http://localhost:1337') + meeting.coach_avatar.url
					"
					:src="
						(meeting.coach_avatar.url.includes('https')
							? ''
							: 'http://localhost:1337') + meeting.coach_avatar.url
					"
					data-cookiescript="accepted"
					data-cookiecategory="functionality"
				/><v-icon v-else-if="!functionalCookieAccepted" color="white"
					>mdi-cookie-alert</v-icon
				>
			</v-avatar>
			<div class="ma-5 ml-2 d-flex flex-column justify-center">
				<h2 class="secondary--text text-h2">
					{{ meeting.coach_name }}
				</h2>
				<h3 class="mt-2 text-h5">
					{{ meeting.coach_profession }}
				</h3>
			</div>
		</nuxt-link>
		<v-card-text class="flex-grow-1 relative">
			<div v-if="meeting.status == 'woman requested meeting'">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Der Coach hat auf deine Anfrage noch nicht reagiert.
				</p>
				<p>
					Bitte habe ein wenig Gedult. Der*die Berater*in sollte sich innerhalb
					von 24h bei dir melden.
				</p>
			</div>
			<div v-else-if="meeting.status == 'coach proposed timeslots'">
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
							@click="pay(selectedDate)"
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
			<div v-else-if="meeting.status == 'deleted'">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Termin abgesagt
				</p>
				<v-alert dark text dense color="primary"
					>Der Termin
					{{
						meeting.acceptedDate
							? `für
                  ${formatDate(
										meeting.time_proposals_parsed[meeting.selected_time_index]
									)} um
                  ${formatTime(
										meeting.time_proposals_parsed[meeting.selected_time_index]
									)}`
							: ''
					}}
					wurde abgesagt.
				</v-alert>
			</div>
			<div v-else-if="videoStatus.done">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Vergangener Termin
				</p>
				<v-alert dark text dense color="grey"
					>Das Meeting hat am {{ formatDate(meeting.acceptedDate) }} um
					{{ formatTime(meeting.acceptedDate) }} stattgefunden.
				</v-alert>
			</div>
			<div v-else-if="meeting.payment_session_id">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Dein Online-Beratungstermin ist eingerichtet und startbereit.
				</p>
				<v-btn
					class="my-2"
					color="success"
					target="_blank"
					:disabled="!videoStatus.ready"
					:href="
						meeting.videoType === 'normal'
							? jitsiWithWomanName
							: meeting.videoWoman
					"
					@click="startPaySession"
					>zum Videocall
				</v-btn>
				<v-btn
					v-if="meeting.videoType === 'normal'"
					class="my-2"
					color="secondary"
					outlined
					target="_blank"
					:href="meeting.personal_videolink"
					>Video testen
				</v-btn>
				<v-alert dark text dense color="success"
					>Zugesagt für {{ formatDate(meeting.acceptedDate) }} um
					{{ formatTime(meeting.acceptedDate) }}
				</v-alert>
				<p class="caption">
					Der Zugang zum Videocall wird <b>15min vor Beginn</b> freigeschaltet.
					Bitte lade kurz vor Beginn die Seite nochmal neu, um den
					Videocall-Button zu aktivieren. <a @click="reload">neu laden</a>
				</p>
			</div>
			<div
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
			</div>
		</v-card-text>
		<v-card-actions style="position: relative">
			<v-dialog
				v-if="meeting.status != 'deleted' && !oldlist && videoStatus.before"
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
					<v-btn
						light
						class="mr-1"
						:loading="eraseLoading"
						@click="cancel(meeting)"
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
				:to="'/berater/' + coach.username"
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
			functionalCookieAccepted() {
				return this.$functionalCookieAccepted();
			},
			jitsiWithWomanName() {
				const name = this.$store.getters['getCurrentUser'].username;
				return `${this.meeting.videoCoach}#userInfo.displayName="${name}"`;
			},
			videoStatus() {
				let b = true;
				let r = false;
				let d = false;

				console.log('m', this.meeting);

				if (this.meeting.selected_time_index != -1) {
					const startTime = new Date(
						this.meeting.time_proposals_parsed[this.meeting.selected_time_index]
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

				console.log('brd', b, r, d);

				return {
					before: b,
					ready: r,
					done: d,
				};
			},
		},
		/*async mounted() {
			this.payment = await this.$getStripePaymentSession(
				this.meeting.paymentID
			);
		},*/
		methods: {
			cancel(doc) {
				this.eraseLoading = true;
				const informTo = this.coach.email
					? this.coach.email
					: 'nouser@sichere-zuflucht.de';
				this.$deleteMeeting(informTo, this.id, doc.acceptedDate)
					.then(() => {
						this.isDelete = false;
						this.eraseLoading = false;
						this.error = null;
						this.$emit('cancel');
					})
					.catch((err) => {
						this.isDelete = false;
						this.eraseLoading = false;
						this.error = err;
						this.$errorhandling(err, 'ContactStatus $deleteMeeting');
					});
			},
			sendNotificationEmail({ date, time, id }) {
				const email = this.coach.email
					? this.coach.email
					: 'nouser@sichere-zuflucht.de';
				const body = {
					date: date,
					time: time,
					id: id,
				};
				this.$meetingConfirmationEmail({ email, ...body })
					.then(() => {
						this.loading = false;
						this.success = true;
					})
					.catch((err) => {
						this.$errorhandling(err, 'ContactStatus $meetingConfirmationEmail');
					});
			},
			/*startPaySession() {
				this.$retrieveStripePaymentSetup(this.payment.id, id);
			},*/
			async pay(dateInput) {
				this.btn.payButtonLoading = true;
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
				}
			},
			standardPayment(v, dI) {
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
			reload() {
				window.location.reload();
			},
		},
	};
</script>
