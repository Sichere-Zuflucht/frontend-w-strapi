<template>
  <v-row class="ma-0">
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="secondary" dark height="100%">
        <v-container
          style="max-width: 450px; position: sticky; top: 100px"
          class="ma-auto"
        >
          <h1 class="text-h2 white--text text-uppercase pb-8">
            SCHÖN, DASS DU DA BIST! <br />DU KANNST DIREKT LOSLEGEN.
          </h1>
          <p>Bitte schließe als erstes deine Registrierung ab.</p>
          <v-icon large>mdi-arrow-right-thin</v-icon></v-container
        ></v-sheet
      ></v-col
    ><v-col cols="12" md="6" class="pa-0">
      <v-container>
        <v-stepper v-if="memberships" v-model="stepper" elevation="0">
          <v-stepper-header style="box-shadow: none">
            <v-stepper-step
              step="1"
              :complete="stepper > 1"
              :editable="stepper > 1 && stepper < 3"
              :color="stepper > 1 ? 'success' : 'primary'"
            >
              Anliegen
            </v-stepper-step>
            <v-divider></v-divider>
            <v-stepper-step
              step="2"
              :complete="stepper > 2"
              :editable="stepper > 2 && stepper < 3"
              :color="stepper > 2 ? 'success' : 'primary'"
            >
              Anmeldung
            </v-stepper-step>
            <v-divider
              v-if="membership ? membership.id === 'Coach' : false"
            ></v-divider>
            <v-stepper-step
              v-if="membership ? membership.id === 'Coach' : false"
              step="3"
              :complete="stepper > 3"
            >
              Verifizierung
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="pb-4">
            <v-stepper-content step="1">
              <h2 class="text-h2 secondary--text pb-4">Dein/Ihr Anliegen</h2>
              <v-chip-group
                v-model="membership"
                column
                mandatory
                style="width: 260px"
                class="d-flex flex-column"
              >
                <v-chip
                  v-for="(n, i) in memberships"
                  :key="i"
                  :value="n"
                  outlined
                  active-class="primary primary--text font-weight-bold"
                >
                  <v-icon class="pr-2">{{ n.icon }}</v-icon>
                  <p class="ma-0" style="padding-top: 2px">
                    {{ n.description }}
                  </p>
                </v-chip>
              </v-chip-group>
              <v-btn
                color="secondary"
                class="mt-4"
                style="float: right"
                @click="stepper++"
                >Weiter</v-btn
              >
            </v-stepper-content>
          </v-stepper-items>
          <v-stepper-items>
            <v-stepper-content step="2">
              <div v-if="membership ? membership.id === 'Coach' : false">
                <h2 class="text-h2 secondary--text pb-4">Anmeldung</h2>
                <p>
                  Ihr Vor- und Nachname werden in Ihrem Profil öffentlich
                  sichtbar sein.
                </p>
              </div>
              <div v-else>
                <h2 class="text-h2 secondary--text pb-4">Passwort</h2>
                <p>
                  Du brauchst ein Passwort, um dich in dein Konto einzuloggen
                  und mit den Berater*innen Kontakt aufnehmen zu können.
                </p>
              </div>
              <v-form ref="form" v-model="validMem" class="pt-8">
                <v-text-field
                  v-if="membership ? membership.id === 'Coach' : false"
                  v-model="firstName"
                  class="secondary--text font-weight-bold"
                  :rules="rules.textRules"
                  label="Vorname"
                  type="name"
                ></v-text-field>
                <v-text-field
                  v-if="membership ? membership.id === 'Coach' : false"
                  v-model="lastName"
                  class="secondary--text font-weight-bold"
                  :rules="rules.textRules"
                  label="Nachname"
                  type="name"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  class="secondary--text font-weight-bold"
                  label="Passwort"
                  :rules="rules.passwordRules"
                  :type="hidePassword ? 'password' : 'text'"
                  :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                  persistent-hint
                  hint="Nutzen Sie ein sicheres Passwort. Mindestens 8 Zeichen, eine Zahl, ein Sonderzeichen (#?!@$ %^&*-), einmal Groß- und Kleinschreibung."
                  @click:append="() => (hidePassword = !hidePassword)"
                ></v-text-field>
                <v-text-field
                  v-model="password2"
                  class="secondary--text font-weight-bold"
                  :rules="rules.passwordRules2"
                  label="Passwort wiederholen"
                  type="password"
                ></v-text-field>
                <v-btn
                  v-if="membership ? membership.id === 'Coach' : false"
                  color="secondary"
                  class="mt-4"
                  style="float: right"
                  :disabled="!validMem"
                  @click="updateProfile"
                  >Weiter</v-btn
                >
                <v-btn
                  v-else
                  color="secondary"
                  class="mt-4"
                  style="float: right"
                  :loading="loading"
                  :disabled="!validMem"
                  @click="updateProfile"
                  >Passwort speichern</v-btn
                ></v-form
              >
            </v-stepper-content></v-stepper-items
          >
          <v-stepper-items>
            <v-stepper-content step="3">
              <SharedVerificationPage editprofile /> </v-stepper-content
          ></v-stepper-items>
        </v-stepper> </v-container></v-col
  ></v-row>
</template>

<script>
export default {
  name: 'UpdateProfile',
  data() {
    return {
      validMem: false,
      stepper: 1,
      // email: this.$store.getters['modules/user/user'].claims.email,
      lastName: null,
      firstName: null,
      rules: {
        textRules: [
          // (v) => !!v || 'Bitte ausfüllen',
          (v) => (v && v.length >= 3) || 'mind. 3 Zeichen lang',
        ],
        passwordRules: [
          (v) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
              v
            ) ||
            'Nutzen Sie ein sicheres Passwort. Mindestens 8 Zeichen, eine Zahl, ein Sonderzeichen (#?!@$ %^&*-), einmal Groß- und Kleinschreibung.',
        ],
        passwordRules2: [
          (v) => !!v || 'Passwortüberprüfung nicht vergessen',
          (v) =>
            (!!v && v === this.password) || 'Passwörter müssen übereinstimmen',
        ],
      },
      password: '',
      hidePassword: true,
      password2: '',
      showError: false,
      loading: false,
      memberships: [],
      membership: undefined,
    }
  },
  async fetch() {
    this.memberships = (
      await this.$fire.firestore.collection('memberships').get()
    ).docs.map((doc) => doc.data())
    this.memberships.reverse()
    this.membership = this.memberships[0]
  },
  fetchOnServer: false,
  methods: {
    updateProfile() {
      this.loading = true
      this.$fire.auth.currentUser
        .updatePassword(this.password)
        .catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e)
          this.showError = true
          this.loading = false
        })
        .then(() => {
          const createdUserData = {}
          if (this.membership.id === 'Coach') {
            this.stepper++
            createdUserData.public = {
              firstName: this.firstName,
              lastName: this.lastName,
              membership: this.membership.id,
              // avatar: this.$config.baseUrl + '/coach-avatar.jpg',
            }
            createdUserData.private = {
              email: this.$fire.auth.currentUser.email,
            }
            return this.$store.dispatch('modules/user/createFirebaseUser', {
              userData: createdUserData,
              redirectTo: false,
            })
          } else {
            createdUserData.public = {
              membership: this.membership.id,
            }
            createdUserData.private = {
              firstName: this.firstName,
              lastName: this.lastName,
              email: this.$fire.auth.currentUser.email,
            }
            window.localStorage.setItem('newWoman', true)
            return this.$store.dispatch('modules/user/createFirebaseUser', {
              userData: createdUserData,
              redirectTo: true,
            })
          }
        })
    },
  },
}
</script>
