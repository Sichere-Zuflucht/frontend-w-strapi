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
			:to="'/berater/' + coach.username"
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
					v-if="coach.avatar && functionalCookieAccepted"
					:lazy-src="
						(coach.avatar.url.includes('https')
							? ''
							: 'http://localhost:1337') + coach.avatar.url
					"
					:src="
						(coach.avatar.url.includes('https')
							? ''
							: 'http://localhost:1337') + coach.avatar.url
					"
					data-cookiescript="accepted"
					data-cookiecategory="functionality"
				/><v-icon v-else-if="!functionalCookieAccepted" color="white"
					>mdi-cookie-alert</v-icon
				>
			</v-avatar>
			<div class="ma-5 ml-2 d-flex flex-column justify-center">
				<h2 class="secondary--text text-h2">
					{{ coach.displayName }}
				</h2>
				<h3 class="mt-2 text-h5">
					{{ coach.profession }}
				</h3>
			</div>
		</nuxt-link>
		<v-card-text class="flex-grow-1 relative">
			<div v-if="response.status == 'newRequest'">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Der Coach hat auf deine Anfrage noch nicht reagiert.
				</p>
				<p>
					Bitte habe ein wenig Gedult. Der*die Berater*in sollte sich innerhalb
					von 24h bei dir melden.
				</p>
			</div>
			<div v-else-if="response.status == 'chooseDate'">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Vorschläge für einen Online-Beratungstermin
				</p>
				<v-row>
					<v-col cols="12">
						<v-select
							v-model="selectedDate"
							:items="response.suggestions"
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
											{{ formatDate(item.date) }}
										</v-list-item-title>
										<div class="caption">{{ formatTime(item.date) }} Uhr</div>
									</v-list-item-content>
								</v-list-item>
							</template>
							<template #selection="{ item }"
								>{{ formatDate(item.date) }} | {{ formatTime(item.date) }}
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
			<div v-else-if="response.status == 'deleted'">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Termin abgesagt
				</p>
				<v-alert dark text dense color="primary"
					>Der Termin
					{{
						response.acceptedDate
							? `für
                  ${formatDate(response.acceptedDate)} um
                  ${formatTime(response.acceptedDate)}`
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
					>Das Meeting hat am {{ formatDate(response.acceptedDate) }} um
					{{ formatTime(response.acceptedDate) }} stattgefunden.
				</v-alert>
			</div>
			<div v-else-if="payment ? payment.status == 'complete' : false">
				<p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
					Dein Online-Beratungstermin ist eingerichtet und startbereit.
				</p>
				<v-btn
					class="my-2"
					color="success"
					target="_blank"
					:disabled="!videoStatus.ready"
					:href="
						response.videoType === 'normal'
							? jitsiWithWomanName
							: response.videoWoman
					"
					@click="startPaySession"
					>zum Videocall
				</v-btn>
				<v-btn
					v-if="response.videoType === 'normal'"
					class="my-2"
					color="secondary"
					outlined
					target="_blank"
					:href="`https://meet.jit.si/test-${id}-${new Date().getTime()}`"
					>Video testen
				</v-btn>
				<v-alert dark text dense color="success"
					>Zugesagt für {{ formatDate(response.acceptedDate) }} um
					{{ formatTime(response.acceptedDate) }}
				</v-alert>
				<p class="caption">
					Der Zugang zum Videocall wird <b>15min vor Beginn</b> freigeschaltet.
					Bitte lade kurz vor Beginn die Seite nochmal neu, um den
					Videocall-Button zu aktivieren. <a @click="reload">neu laden</a>
				</p>
			</div>
			<div
				v-else-if="
					payment == false || payment ? payment.status == 'open' : false
				"
			>
				<v-alert dark color="error" type="error">
					<p>
						Es liegt keine Bezahlung vor. Es könnte sein, dass etwas schief
						gelaufen ist.
					</p>
					<v-btn
						v-if="response.acceptedDate"
						@click="pay(response.acceptedDate)"
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
				v-if="response.status != 'deleted' && !oldlist && videoStatus.before"
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
						@click="cancel(response)"
						>Ja, absagen
					</v-btn>
					<v-btn light @click="isDelete = false"> nein</v-btn>
				</v-alert>
			</v-dialog>
			<v-btn
				v-else-if="response.status == 'deleted' || oldlist"
				small
				color="primary"
				outlined
				nuxt
				:to="'/berater/' + coach.username"
				>Neue Anfrage stellen
			</v-btn>
			<p
				class="caption grey--text mb-0"
				style="position: absolute; bottom: 2px; right: 3px"
			>
				ID: {{ id }}
			</p>
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
	<!--
    <v-card elevation="2" nuxt outlined width="100%" class="ma-2" :max-width="width" :style="
      'border: 1px solid ' +
      (videoStatus.ready
        ? $vuetify.theme.themes.light.success
        : videoStatus.done
          ? 'grey'
          : $vuetify.theme.themes.light.primary)
    ">
      <nuxt-link :to="'/berater/' + coach.username" style="text-decoration: none;" class="d-flex" :style="
        'border-bottom: 1px solid ' +
        (videoStatus.ready
          ? $vuetify.theme.themes.light.success
          : videoStatus.done
            ? 'grey'
            : $vuetify.theme.themes.light.primary) +
        ' !important'
      ">
        <v-avatar v-if="coach.avatar" color="primary ma-5" size="15%" min-width="90" min-height="90">
          <v-img :lazy-src="
            (coach.avatar.url.includes('https')
              ? ''
              : 'http://localhost:1337') + coach.avatar.url
              " :src="(coach.avatar.url.includes('https')
                ? ''
                  : 'http://localhost:1337') + coach.avatar.url
        " />
        </v-avatar>
        <div class="ma-5 ml-2 d-flex flex-column justify-center">
          <h2 class="secondary--text text-h2">
            {{ coach.displayName }}
          </h2>
          <h3 class="mt-2 text-h5">
            {{ coach.profession }}
          </h3>
        </div>
      </nuxt-link>
      <v-card-text v-if="response && !oldlist">
        <p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
          Vorschläge für einen Online-Beratungstermin
        </p>
        <div v-if="!response.coachAnswered && !response.deleted">
          Der Coach hat auf deine Anfrage noch nicht reagiert.
        </div>
        <div v-else-if="!response.acceptedDate && !response.deleted">
          <v-row>
            <v-col cols="12">
              <v-select v-model="selectedDate" :items="response.suggestions" outlined dense hide-details color="primary"
                label="Bitte wählen" class="my-2">
                <template #item="{ item, on }">
                  <v-list-item v-on="on">
                    <v-list-item-content>
                      <v-list-item-title class="font-weight-bold mb-0">
                        {{ formatDate(item.date) }}
                      </v-list-item-title>
                      <div class="caption">{{ formatTime(item.date) }} Uhr</div>
                    </v-list-item-content>
                  </v-list-item>
                </template>
                <template #selection="{ item }">{{ formatDate(item.date) }} | {{ formatTime(item.date) }}
                </template>
              </v-select>
              <p class="font-weight-bold mb-0 my-4">Preis: 50€</p>
              <v-btn color="success" :loading="btn.payButtonLoading" :disabled="!selectedDate || btn.isDisabled" block
                @click="pay(selectedDate)">{{ btn.acceptText }}
              </v-btn>
              <v-alert v-if="btn.error" type="error">{{ btn.errorMsg }}</v-alert>
              <p class="caption">
                Nach der Terminbestätigung wirst du direkt zu unserem
                Zahlungsanbieter „stripe“ weitergeleitet. Wir belasten dein
                Konto erst zu Beginn des Videocalls.
              </p>
            </v-col>
          </v-row>
        </div>
        <div v-else-if="payment != null && !response.deleted">
          <div v-if="payment.status == 'complete'">
            <v-btn class="my-2" color="success" target="_blank" :disabled="!videoStatus.ready"
              :href="response.videoType === 'normal' ? jitsiWithWomanName : response.videoWoman"
              @click="startPaySession">zum Videocall
            </v-btn>
            <v-btn v-if="response.videoType === 'normal'" class="my-2" color="secondary" outlined target="_blank"
              :href="`https://meet.jit.si/test-${id}-${new Date().getTime()}`">Video testen
            </v-btn>
            <v-alert dark text dense color="success">Zugesagt für {{ formatDate(response.acceptedDate) }} um
              {{ formatTime(response.acceptedDate) }}
            </v-alert>
            <p class="caption">Der Zugang zum Videocall wird <b>15min vor Beginn</b> freigeschaltet. Bitte lade
              kurz vor Beginn die Seite nochmal neu, um den Button zu aktivieren. <a @click="reload">neu laden</a></p>
          </div>
          <div v-else-if="payment == false || payment.status == 'open'">
            <v-alert dark color="error" type="error">
              <p>
                Es liegt keine Bezahlung vor. Es könnte sein, dass etwas schief gelaufen ist.
              </p>
              <v-btn v-if="response.acceptedDate" @click="pay(response.acceptedDate)" class="mb-2">Zahlung erneut
                probieren</v-btn>
              <p class="caption">Wenn notwendig,
                kontaktieren Sie uns unter:
                <a href="mailto:support@sichere-zuflucht.de" class="white--text">
                  support@sichere-zuflucht.de</a>
              </p>
            </v-alert>
          </div>
        </div>
      </v-card-text>
      <v-card-text v-else-if="response && oldlist">
        <p class="text-uppercase font-weight-bold mb-1 mt-2 caption">
          Vergangener Termin
        </p>
        <v-alert v-if="!response.deleted" dark text dense color="grey">Das Meeting hatte am {{ formatDate(response.acceptedDate) }} um
          {{ formatTime(response.acceptedDate) }} stattgefunden.
        </v-alert>
      </v-card-text>
      <v-card-text v-if="response.deleted">
        <v-alert color="primary" dark>
          <b>
            Termin abgesagt
          </b>
          <p>Dieser Termin wurde abgesagt.</p>
          <v-btn small color="white" outlined nuxt :to="'/berater/' + coach.username">Neue Anfrage stellen
        </v-btn>
        </v-alert>
      </v-card-text>
      <v-card-actions v-if="!oldlist && !response.deleted" style="border-top: 1px solid lightgrey" class="align-stretch pa-4">
        <v-dialog v-model="isDelete" persistent max-width="290">
          <template #activator="{ on, attrs }">
            <v-btn small text color="primary" v-bind="attrs" v-on="on">Termin absagen
            </v-btn>
          </template>
          <v-alert type="error" color="error" class="mt-2 ma-2">
            <p>Wirklich absagen?</p>
            <v-btn light class="mr-1" :loading="eraseLoading" @click="cancel(response)">Ja, absagen
            </v-btn>
            <v-btn light @click="isDelete = false"> nein</v-btn>
          </v-alert>
        </v-dialog>
      </v-card-actions>
      <v-card-actions v-else style="border-top: 1px solid lightgrey" class="align-stretch pa-4">
        <v-btn small color="primary" outlined nuxt :to="'/berater/' + coach.username">Neue Anfrage stellen
        </v-btn>
        <v-dialog v-model="isDelete" persistent max-width="290">
          <template #activator="{ on, attrs }">
            <v-btn small text color="primary" v-bind="attrs" v-on="on">Termin löschen
            </v-btn>
          </template>
          <v-alert type="error" color="error" class="mt-2 ma-2">
            <p>Wirklich löschen?</p>

            <v-btn light class="mr-1" :loading="eraseLoading" @click="cancel(response)">Ja, löschen
            </v-btn>
            <v-btn light @click="isDelete = false"> nein</v-btn>
          </v-alert>
        </v-dialog>
      </v-card-actions>
      <v-card-actions>
        <v-alert v-if="error" type="error" color="error">{{ error }}</v-alert>
      </v-card-actions>
      <v-overlay :value="redirectWarning" color="black" opacity="0.8">
        <p>
          Weiterleitung zu Stripe. Dies kann ein bisschen dauern. Bitte warten...
        </p>
      </v-overlay>
    </v-card>-->
</template>

<script>
	export default {
		name: 'Coaching',
		props: {
			coach: {
				type: Object,
				default: () => {},
			},
			response: {
				type: Object,
				default: () => {},
			},
			id: {
				type: Number,
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
				const name = this.$store.getters['getActiveUser'].username;
				return `${this.response.videoCoach}#userInfo.displayName="${name}"`;
			},
			videoStatus() {
				let b = true;
				let r = false;
				let d = false;

				if (this.response.acceptedDate) {
					const startTime = new Date(this.response.acceptedDate);
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
		async mounted() {
			this.payment = await this.$getStripePaymentSession(
				this.response.paymentID
			);
		},
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
						this.$store.dispatch('errorhandling', err);
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
						this.$store.dispatch('errorhandling', err);
					});
			},
			startPaySession() {
				this.$retrieveStripePaymentSetup(this.payment.id, id);
			},
			// RED is not implemented yet
			/*async testRED() {
      const data = {
        method: "getEntryCodes",
        date: "2023-11-27",
        token: this.$config.redAPI,
      };
      /*const redReq = await this.$axios.$post(
        "https://redclient.redmedical.de/service/video",
        {
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      console.log("redReq", redReq);
      redReq.json().then((redRes) => {
        console.log("redRes", redRes);
      });*/ /*
this.$axios
.$post("https://redclient.redmedical.de/service/video", {
body: {
method: "getEntryCodes",
date: "2023-11-27",
token: this.$config.redAPI,
},
})
.then((response) => {
console.log('res', response);
})
.catch((err)=>{
this.$store.dispatch("errorhandling", err);
});
},*/
			async pay(dateInput) {
				this.btn.payButtonLoading = true;
				let redReq, data, video;
				if (this.response.videoType === 'secure') {
					data = {
						//method: 'getEntryCodes',
						//date: (dateInput.date.split('T'))[0],
						//token: this.$config.redAPI,
						method: 'getEntryCodes',
						date: '2023-11-27',
						token: this.$config.redAPI,
					};
					// RED is not implemented
					/*this.$axios
          .$post("https://redclient.redmedical.de/service/video", {
            header: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
          .then((response) => {
            console.log(response);
            if (!response.success) return (this.error = response.error);
            console.log("after error");
            this.redirectWarning = true;
          });*/
					/*redReq = await fetch('https://redclient.redmedical.de/service/video', {
          method: 'POST',
          header: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        console.log("redReq", redReq)
        redReq
          .json()
          .then((redRes) => {
            console.log("redRes", redRes)
            video = {
              codeArzt:
                'https://video.redmedical.de/#/login?name=' +
                this.coach.username +
                '&code=' +
                redRes.codeArzt,
              codePatient:
                'https://video.redmedical.de/#/login?name=unbekannt&code=' +
                redRes.codePatient,
            }
            this.standardPayment(video, dateInput)
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('err: ', error)
          })*/
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
								this.response.acceptedDate = dI;
								this.response.video = v;
								window.localStorage.setItem('meetingID', this.id);
								window.localStorage.setItem('sessionID', paymentID);

								this.sendNotificationEmail({
									date: new Date(dI.date),
									time: new Date(dI.date),
									id: this.id,
								});

								this.$stripe.redirectToCheckout({
									// Make the id field from the Checkout Session creation API response
									// available to this file, so you can provide it as argument here
									// instead of the {{CHECKOUT_SESSION_ID}} placeholder.
									sessionId: paymentID,
								});
							})
							.catch((e) => {
								this.$store.dispatch('errorhandling', e);
								this.error = e.response.data.error.name;
								this.redirectWarning = false;
							});
					})
					.catch((e) => {
						this.$store.dispatch('errorhandling', e);
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
