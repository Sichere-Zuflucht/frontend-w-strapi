<template>
	<div class="pt-4">
		<client-only v-if="userData">
			<v-alert
				v-if="!userData.topicArea"
				color="secondary"
				icon="mdi-account-question"
				outlined
				text
			>
				<h3 class="text-h3">Profil erstellen.</h3>

				<p>
					Aktuell existiert noch kein Profil von Ihnen. Bitte erstellen Sie ein
					Profil.
				</p>
				<v-divider class="my-4 error" style="opacity: 0.22" />
				<v-btn color="white" to="beratung/edit-profil">Profil erstellen </v-btn>
			</v-alert>
			<v-alert
				v-if="!stripeEnabled"
				color="secondary"
				icon="mdi-credit-card-off-outline"
				outlined
				text
			>
				<h3 class="text-h3">Zahlung freischalten.</h3>
				<p>
					Aktuell können Sie keine Zahlungen entgegennehmen. Bitte registrieren
					Sie sich bei Stripe.
				</p>
				<v-divider class="my-4 error" style="opacity: 0.22" />
				<v-btn color="white" to="beratung/bezahlung"
					>Stripe-Konto anlegen
				</v-btn>
			</v-alert>
			<v-alert
				v-if="userData.verification != 'done'"
				color="secondary"
				icon="mdi-account-clock"
				outlined
				text
			>
				<h3 class="text-h3">Verifizierung noch nicht abgeschlossen.</h3>
				<p>
					Aktuell ist ihr Profil nicht öffentlich einsehbar, da Sie von uns noch
					nicht freigeschaltet wurden. Sie können sich Ihren aktuellen Status
					ansehen.
				</p>
				<v-divider class="my-4 error" style="opacity: 0.22" />
				<v-btn color="white" to="beratung/personenverifizierung"
					>Status ansehen
				</v-btn>
			</v-alert>
			<p
				v-if="
					!userData.topicArea ||
					!stripeEnabled ||
					userData.verification != 'done'
				"
				class="caption"
			>
				Solange die oben angezeigte Warnungen existieren, ist Ihr Profil nicht
				öffentlich einsehbar und Sie können keine Anfragen erhalten.
			</p>
		</client-only>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				stripeEnabled: true,
			};
		},
		async mounted() {
			this.stripeEnabled = (
				await this.$getStripeAccData()
			).data.payouts_enabled;
		},
		computed: {
			userData() {
				return this.$store.getters['getActiveUser'];
			},
		},
	};
</script>
