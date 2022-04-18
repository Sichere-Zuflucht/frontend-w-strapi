<template>
  <v-row>
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="secondary" height="100%" dark>
        <v-container
          style="max-width: 450px; position: sticky; top: 100px"
          class="ma-auto"
        >
          <v-icon size="60" class="pb-4" color="white"
            >mdi-account-edit-outline</v-icon
          >
          <h1 class="h2--text text-uppercase">Zeigen Sie sich</h1>
          <p>In Ihrem Profil präsentieren Sie sich und Ihre Leistung.</p>
        </v-container>
      </v-sheet>
    </v-col>
    <v-col cols="12" md="6">
      <v-container>
        <v-stepper v-if="user.public" v-model="stepper" elevation="0">
          <v-stepper-header style="box-shadow: none">
            <v-stepper-step
              step="1"
              :complete="stepper > 1"
              :editable="stepper > 1"
              :color="stepper > 1 ? 'success' : 'primary'"
            >
              Profil
            </v-stepper-step>
            <v-divider v-if="!stripe"></v-divider>
            <v-stepper-step v-if="!stripe" step="2" editable>
              Zahlung aktivieren
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="pb-4">
            <v-stepper-content v-if="!bioSaved" step="1">
              <h2 class="text-h2 secondary--text pb-4">
                IHR ÖFFENTLICHES PROFIL
              </h2>
              <p>
                Erstellen Sie ein sympathisches, fachlich ansprechendes Profil
                von Ihnen und Ihrem Angebot. Dann können die Frauen besser
                abwägen, an wen Sie sich wenden wollen.
              </p>
              <CoachingSelection
                :info="user.public.info || {}"
                :avatar="user.public.avatar"
                @selection="updateProfile"
              />
              <v-btn
                text
                :to="stripe ? '/berater/' + user.public.uid : null"
                color="grey"
                @click="!stripe ? stepper++ : null"
                >{{ !stripe ? 'Später' : 'Weiter ohne Speichern' }}</v-btn
              >
            </v-stepper-content>
            <v-stepper-content v-else step="1">
              <h2 class="text-h2 secondary--text pb-4">PROFIL erstellt</h2>
              <p>
                Sie können sich Ihr Profil ansehen oder direkt weiter zur
                Zahlungsanbindung gehen.
              </p>
              <div class="d-flex">
                <v-btn
                  color="secondary"
                  class="mt-4 mr-3"
                  outlined
                  target="_blank"
                  :to="'/berater/' + user.public.uid"
                  >Profil ansehen</v-btn
                ><v-btn
                  v-if="!stripe"
                  color="secondary"
                  class="mt-4"
                  @click="stepper++"
                  >Weiter zur Zahlung</v-btn
                >
              </div>
            </v-stepper-content>
            <v-stepper-content step="2">
              <h2 class="text-h2 secondary--text pb-4">ZAHLUNG</h2>
              <p>
                Sie erhalten pro Beratungseinheit (50 Min.) über unser Portal
                <b>50€</b>. Damit das Geld Sie auch umgehend erreicht, arbeiten
                wir mit dem <b>Zahlungssystem Stripe.</b>
              </p>
              <p>
                Legen Sie sich deshalb bitte ein Stripe-Konto an. Das geht
                schnell und ist für Sie <b>kostenlos.</b>
              </p>

              <div class="d-flex flex-column align-center">
                <v-btn
                  color="secondary"
                  class="mt-4 mb-2"
                  :loading="loading"
                  :disabled="disabled"
                  @click="addStripe"
                  >Mein Stripe-Konto anlegen</v-btn
                >
                <p class="caption">Wir leiten Sie zu Stripe weiter.</p>
              </div>
              <v-alert
                v-if="stripeRegisterURL"
                color="secondary"
                class="caption"
                dark
              >
                Falls die Weiterleitung nicht funktioniert, kopiere und öffne
                bitte folgende URL:
                <a :href="stripeRegisterURL" target="_blank">{{
                  stripeRegisterURL
                }}</a>
              </v-alert>
              <v-alert v-if="error" color="error" dark>
                {{ error }}
              </v-alert>
              <h2 class="text-h2 secondary--text pb-4 pt-12">HÄUFIGE FRAGEN</h2>
              <nuxt-link to="">
                Wie erstelle ich ein Konto bei Stripe?
              </nuxt-link>
            </v-stepper-content></v-stepper-items
          ></v-stepper
        >
      </v-container></v-col
    ></v-row
  >
</template>

<script>
export default {
  middleware: 'authCoach',
  data() {
    return {
      select: true,
      stepper: 1,
      bioSaved: false,
      stripeRegisterURL: null,
      loading: false,
      disabled: false,
      stripeData: null,
      error: null,
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
  },
  methods: {
    updateProfile(data) {
      console.log('edit: ', data)
      this.$store.dispatch('modules/user/setInfo', {
        topicArea: data.topicArea, // topic
        description: data.description,
        quote: data.quote,
        history: data.history,
        profession: data.profession,
      })
      this.$store.dispatch('modules/user/setAvatar', data.avatar)
      this.bioSaved = true
      // this.$router.push('/berater/' + this.user.public.uid)
    },
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
        .catch((err) => (this.error = err))
    },
  },
}
</script>
