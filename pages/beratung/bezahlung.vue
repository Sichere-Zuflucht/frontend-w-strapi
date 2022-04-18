<template>
  <div>
    <UtilsBanner icon="mdi-credit-card-plus-outline" />
    <v-container>
      <div v-if="!stripe || !stripe.verified">
        <h1 class="text-h1 primary--text mb-4">Bezahlung<br />verwalten</h1>
        <p>
          Sie erhalten für Ihre Beratungsleistung über unser Portal
          <b>50€/Stunde</b>. Damit das Geld Sie auch umgehend erreicht, arbeiten
          wir mit dem <b>Zahlungssystem Stripe</b>.<br /><br />Legen Sie sich
          deshalb bitte ein Stripe-Konto an. Das geht schnell und ist für Sie
          <b>kostenlos</b>.<br /><br />Nach dieser Anmeldung und der
          vollständigen Verifizierung Ihrer Person, können Sie direkt starten.
        </p>

        <div v-if="!stripe">
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
            v-if="!stripe.chargesEnabled"
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
          <v-alert
            v-else-if="stripe.chargesEnabled && !stripe.payoutsEnabled"
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
        <v-btn :href="stripeDash" target="_blank" color="secondary" class="mt-4"
          >Zum Stripe Dashboard</v-btn
        >
        <div v-if="stripeData">
          <p>Kartenzahlung:</p>
        </div>
        <v-card v-for="(item, i) of stripeData" :key="i">
          <v-card-text>
            <p>
              Betrag: {{ item.amount }} {{ item.currency.toUpperCase() }}<br />

              erstellt am: {{ new Date(item.created).getDate() }}.{{
                new Date(item.created).getMonth() + 1
              }}.{{ new Date(item.created).getFullYear() }}
            </p>

            <v-btn @click="more(item.id)">Mehr</v-btn>
          </v-card-text>
        </v-card>
      </div>

      <p v-if="stripeRegisterURL" class="caption">
        Falls die Weiterleitung nicht funktioniert, kopiere und öffne bitte
        folgende URL:
        <a :href="stripeRegisterURL" target="_blank">{{ stripeRegisterURL }}</a>
      </p>
    </v-container>
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
      stripeData: null,
    }
  },
  computed: {
    user() {
      return this.$store.state.modules.user
    },
    stripe() {
      try {
        return this.$store.getters['modules/user/stripe']
      } catch (TypeError) {
        return 'type error'
      }
    },
    stripeDash() {
      return (
        'https://dashboard.stripe.com/' +
        this.stripe.id +
        (this.$config.isDev ? '/test/' : '/') +
        'dashboard'
      )
    },
  },
  methods: {
    addStripe() {
      this.loading = true
      this.$fire.functions
        .httpsCallable('stripe-getStripeLink')({
          email: this.user.private.email,
          isDev: this.$config.isDev,
        })
        .then((stripeData) => {
          this.stripeRegisterURL = stripeData.data.url
          this.loading = false
          this.disabled = true
          if (
            confirm(
              'Sichere Zuflucht möchte Sie weiterleiten zu: ' +
                stripeData.data.url
            )
          ) {
            location.replace(this.stripeRegisterURL)
          }
        })
    },
  },
}
</script>
