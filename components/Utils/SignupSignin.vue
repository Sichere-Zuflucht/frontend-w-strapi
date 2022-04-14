<template>
  <v-row class="ma-0">
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="secondary" dark height="100%">
        <v-container style="max-width: 450px" class="ma-auto py-16">
          <h3 class="h2--text white--text text-uppercase pb-8">
            NACH DER REGISTRIERUNG WERDEN<br />ALLE ANGEBOTE VON SICHERE<br />ZUFLUCHT
            FREIGESCHALTET.
          </h3>
          <v-list dense color="transparent">
            <v-list-item>
              <v-list-item-icon>
                <v-icon class="pt-2">mdi-face-woman</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <p class="font-weight-bold">ANGEBOTE FÜR FRAUEN</p>
                <p>Online-Beratungen buchen</p>
                <p class="pt-8 font-weight-bold">oder</p>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon color="white" class="pt-2">mdi-forum</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <p class="font-weight-bold">ANGEBOTE FÜR BERATER*INNEN</p>
                <p>
                  die eigene Beratungsleistung anbieten, um Frauen zu helfen
                </p>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-container>
      </v-sheet></v-col
    ><v-col cols="12" md="6" class="pa-0">
      <v-container style="max-width: 450px" class="ma-auto py-16">
        <h1 class="text-h1 my-4 primary--text">{{ title }}</h1>
        <v-form
          ref="form"
          v-model="valid"
          style="width: 100%"
          class="mb-4"
          @submit="
            (e) => {
              e.preventDefault()
            }
          "
        >
          <v-stepper v-model="step" :flat="true" style="box-shadow: none">
            <v-stepper-items>
              <v-stepper-content step="1" class="pa-0">
                <v-text-field
                  v-model="email"
                  type="email"
                  :rules="emailRules"
                  label="Deine E-mail-Adresse"
                  required
                  persistent-hint
                  :hint="
                    makeLogin
                      ? ''
                      : 'Per E-Mail senden wir eine Benachrichtigung, sobald eine Anfrage vorliegt. Zudem kann per E-Mail das Passwort zurückgesetzt werden.'
                  "
                ></v-text-field>

                <div class="d-flex justify-end pt-6">
                  <v-btn
                    color="primary"
                    :loading="loading"
                    :disabled="!valid"
                    @click="next"
                    >Weiter ></v-btn
                  >
                </div>
                <p v-if="!makeLogin" class="caption mt-4">
                  Wir senden im nächsten Schritt eine E-Mail an die o.g.
                  Adresse, um sie zu bestätigen.<br /><b
                    >Bitte auch im Spam-Ordner nachsehen.</b
                  >
                </p>
              </v-stepper-content>
              <v-stepper-content step="2" class="pa-0">
                <div v-if="requestPassword">
                  <v-alert
                    v-if="!makeLogin"
                    type="info"
                    color="secondary"
                    class="my-4"
                  >
                    Es existiert bereits ein Konto mit der E-Mail-Adresse
                    <b>{{ email }}</b
                    >. Logge dich ein oder klicke "Passwort vergessen", solltest
                    du dein Passwort vergessen haben.
                  </v-alert>
                  <v-text-field
                    v-model="password"
                    label="Passwort"
                    :type="value ? 'password' : 'text'"
                    :append-icon="value ? 'mdi-eye' : 'mdi-eye-off'"
                    required
                    @click:append="() => (value = !value)"
                  ></v-text-field>
                  <div class="d-flex justify-end">
                    <v-btn text to="/registration/reset-password" color="grey"
                      >Passwort vergessen</v-btn
                    ><v-btn
                      class="inline"
                      color="success"
                      :loading="loading"
                      :disabled="!valid"
                      nuxt
                      @click="login"
                      >Einloggen</v-btn
                    >
                  </div>
                </div>
                <div v-else>
                  <div v-if="makeLogin">
                    <v-alert type="info" color="secondary" class="my-4">
                      Es existiert kein Konto mit der E-Mail-Adresse
                      {{ email }}. Willst du dich mit der E-Mail
                      <b>{{ email }}</b> bei Sichere Zuflucht registrieren?
                    </v-alert>
                    <div class="d-flex justify-end">
                      <v-btn text class="inline" @click="step = 1">
                        Zurück
                      </v-btn>
                      <v-btn
                        color="success"
                        :loading="loading"
                        :disabled="!valid"
                        @click="register"
                        >{{ buttonText }}</v-btn
                      >
                    </div>
                  </div>
                  {{ !makeLogin && step === 2 ? register() : null }}
                </div>
              </v-stepper-content>
              <v-stepper-content step="3" class="pa-0">
                <h2 class="text-h1 primary--text mb-4">
                  Danke für deine Anmeldung!
                </h2>
                <h3 class="text-h2 secondary--text mb-8">
                  Wir haben dir eine Bestätigungsmail gesendet.
                </h3>
                <p>
                  <b>{{ email }}</b>
                </p>
                <p class="caption">
                  Bitte schau in dein Mail-Postfach. Kontrolliere ggf. auch den
                  Spam Ordner.
                </p>
                <p class="caption">
                  Sollte nichts angekommen sein, kannst du dir die E-mail noch
                  einmal zusenden lassen.
                </p>
                <v-btn
                  color="primary"
                  :loading="loading"
                  class="mb-4"
                  @click="register"
                  >Erneut senden</v-btn
                >
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
          <v-alert v-if="error.status" color="error" class="white--text mt-4">{{
            error.message
          }}</v-alert>
        </v-form>
      </v-container>
    </v-col></v-row
  >
</template>

<script>
export default {
  props: {
    makeLogin: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    value: String,
    step: 1,
    valid: false,
    email: '',
    password: '',
    emailRules: [
      (v) => !!v || 'E-Mail ist erforderlich',
      (v) =>
        /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
        'E-Mail muss gültig sein',
    ],
    loading: false,
    showConfirmation: false,
    requestPassword: false,
    showRegister: false,
    buttonText: 'Registrieren',
    error: {
      status: false,
      message: '',
    },
  }),
  mounted() {
    const email = window.localStorage.getItem('emailForSignIn')
    if (email) {
      this.email = email
      this.showConfirmation = true
    }
  },
  methods: {
    next() {
      if (!this.$refs.form.validate()) return
      this.showConfirmation = false
      this.$nuxt.$fire.auth
        .fetchSignInMethodsForEmail(this.email)
        .then((loginMethods) => {
          if (loginMethods.length > 1) {
            this.requestPassword = true
          } else {
            this.requestPassword = false
          }
          this.step = 2
        })
    },
    login() {
      this.loading = true
      if (process.client) {
        this.$store
          .dispatch('modules/user/login', {
            email: this.email,
            password: this.password,
          })
          .then((e) => {
            this.loading = false
          })
          .catch((err) => {
            this.loading = false
            this.error.status = true
            this.error.message = err.message
          })
      }
    },
    register() {
      // if (!this.$refs.form.validate()) return
      this.step = 3
      this.loading = true

      this.$fire.auth
        .sendSignInLinkToEmail(this.email, {
          url: this.$config.baseUrl + '/registration/confirm-register-link',
          handleCodeInApp: true,
        })
        .then(() => {
          this.buttonText = 'Gesendet'
          this.valid = false
          this.loading = false
          this.showConfirmation = true
          window.localStorage.setItem('emailForSignIn', this.email)
        })
    },
  },
}
</script>
