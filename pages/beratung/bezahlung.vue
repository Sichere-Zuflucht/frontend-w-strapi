<template>
	<div>
		<UtilsBanner icon="mdi-credit-card-plus-outline" />
		<v-container v-if="user">
			<div v-if="!user.stripe_account_success">
				<h1 class="text-h1 primary--text mb-4">Bezahlung<br />verwalten</h1>

				<p>
					<b>Sie beraten nicht gratis!</b><br />
					Pro Beratungseinheit (Dauer: 50 min. ) zahlt jede Frau 50 Euro. Sie
					als Berater*in erhalten 40 Euro. Wir als Sichere Zuflucht behalten 10
					Euro ein, um damit laufende Kosten zu decken. Damit das Geld Sie auch
					umgehend erreicht, arbeiten wir mit dem
					<b>Zahlungssystem Stripe.</b>
				</p>
				<p>
					Legen Sie sich deshalb bitte ein Stripe-Konto an. Das geht schnell und
					ist für Sie <b>kostenlos.</b> <br /><br />
					Nach dieser Anmeldung und der vollständigen Verifizierung Ihrer
					Person, können Sie direkt starten.
				</p>

				<div v-if="!user.stripe_id">
					<div class="d-flex justify-center mb-2 mt-12">
						<v-btn
							:loading="loading"
							:disabled="disabled"
							color="secondary"
							target="_blank"
							@click="addStripe"
							>Mein Stripe-Konto anlegen
						</v-btn>
					</div>
					<p class="caption text-center grey--text">
						Wir leiten Sie zu Stripe weiter.
					</p>
				</div>
				<div v-else>
					<v-alert
						v-if="!user.stripe_account_success"
						color="error"
						icon="mdi-clock-fast"
						outlined
						text
					>
						<h3 class="text-h3">
							Registrierung unvollständig: Zahlung freischalten.
						</h3>
						<p>
							Aktuell können Sie keine Zahlungen entgegennehmen. Bitte
							registrieren Sie sich bei Stripe.
						</p>
						<v-divider class="my-4 error" style="opacity: 0.22" />
						<v-btn
							:loading="loading"
							:disabled="disabled"
							color="white"
							target="_blank"
							@click="addStripe"
							>Stripe-Konto anlegen
						</v-btn>
					</v-alert>
					<v-alert
						v-else-if="user.stripe_account_success"
						color="error"
						icon="mdi-clock-fast"
						outlined
						text
					>
						<h3 class="text-h3">
							Registrierung unvollständig: Auszahlung freischalten.
						</h3>
						<p>
							Aktuell können Sie sich kein Geld auszahlen lassen. Bitte
							vervollständigen Sie die Stripe-Registrierung.
						</p>
						<v-divider class="my-4 error" style="opacity: 0.22" />
						<v-btn
							:loading="loading"
							:disabled="disabled"
							color="white"
							target="_blank"
							@click="addStripe"
							>Stripe-Konto vervollständigen
						</v-btn>
					</v-alert>
				</div>
			</div>
			<div v-else>
				<h2 class="text-h2 primary--text">Stripe Übersicht</h2>
				<v-btn
					target="_blank"
					color="secondary"
					class="mt-4"
					@click="stripeLogin"
					>Zum Stripe Dashboard</v-btn
				>
				<!--<div v-if="stripeSession">
          <p>Kartenzahlung:</p>
        </div>
        <v-card v-for="(item, i) of stripeSession" :key="i">
          <v-card-text>
            <p>
              Betrag: {{ item.amount }} {{ item.currency.toUpperCase() }}<br />

              erstellt am: {{ new Date(item.created).getDate() }}.{{
                new Date(item.created).getMonth() + 1
              }}.{{ new Date(item.created).getFullYear() }}
            </p>

            <v-btn @click="more(item.id)">Mehr</v-btn>
          </v-card-text>
        </v-card>-->
			</div>

			<p v-if="stripeRegisterURL" color="secondary" class="caption" dark>
				Falls die Weiterleitung nicht funktioniert, kopiere und öffne bitte
				folgende URL:<br />
				<a :href="stripeRegisterURL" target="_blank">{{ stripeRegisterURL }}</a>
			</p>
		</v-container>
		<div v-else>
			<v-skeleton-loader type="article"></v-skeleton-loader>
		</div>
	</div>
</template>

<script>
	export default {
		middleware: 'authCoach',
		data() {
			return {
				stripeRegisterURL: null,

				loading: false,
				disabled: false,

				//stripe: null,
			};
		},
		async mounted() {
			//this.stripe = (await this.$getStripeAccData()).data;
		},
		computed: {
			user() {
				return this.$store.getters['getCurrentUser'];
			},
		},
		methods: {
			addStripe() {
				this.loading = true;

				this.$func.createStripeAcc().then((url) => {
					this.stripeRegisterURL = url;
					this.loading = false;
					this.disabled = true;
				});
			},
			stripeLogin() {
				this.$func.loginStripeAccLink().then((url) => {
					this.loading = true;
					window.open(url, '_blank');
				});
			},
		},
	};
</script>
