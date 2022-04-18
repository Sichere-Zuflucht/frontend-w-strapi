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
          <p>{{email}}</p>
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
                  hint="Bitte beachten Sie folgende Passwortvorgaben"
                  persistent-hint
                  @click:append="() => (hidePassword = !hidePassword)"
                ></v-text-field>
                <v-chip :color="/^(?=.*?[A-Z]).{1,}$/.test(password) ? 'green' : 'grey'" dark class="mt-2">Großbuchstaben</v-chip>
                <v-chip :color="/^(?=.*?[a-z]).{1,}$/.test(password) ? 'green' : 'grey'" dark class="mt-2">Kleinbuchstaben</v-chip>
                <v-chip :color="/^(?=.*?[0-9]).{1,}$/.test(password) ? 'green' : 'grey'" dark class="mt-2">Zahlen</v-chip>
                <v-chip :color="/^(?=.*?[#?!@$ %^&*-]).{1,}$/.test(password) ? 'green' : 'grey'" dark class="mt-2">Sonderzeichen (#?!@$ %^&*-)</v-chip>
                <v-chip :color="/^.{8,}$/.test(password) ? 'green' : 'grey'" dark class="mt-2">mind. 8 Zeichen</v-chip>
                <v-text-field
                  v-model="password2"
                  class="secondary--text font-weight-bold mt-4"
                  :rules="rules.passwordRules2"
                  label="Passwort wiederholen"
                  type="password"
                ></v-text-field>
                <v-btn
                  v-if="membership ? membership.id === 'Coach' : false"
                  color="secondary"
                  class="mt-4"
                  style="float: right"
                  :loading="loading"
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
                  exact
                  @click="updateProfile"
                  >Passwort speichern</v-btn
                ></v-form
              >
            </v-stepper-content></v-stepper-items
          >
          <v-stepper-items>
            <v-stepper-content step="3">
              <SharedVerificationPage editprofile :userdata="userdata"/> </v-stepper-content
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
      email: null, //this.$store.getters['modules/user/user'].claims.email,
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
            'Ihr Passwort erfüllt nicht alle Vorgaben.',
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
      memberships: [
        {
          description: "Ich suche Beratung",
          icon: "mdi-face-woman",
          id: "Woman",
          name: "Frau",
        },
        {
          description: "Ich möchte Beratung anbieten",
          icon: "mdi-message",
          id: "Coach",
          name: "Beratung",
        },
      ],
      membership: undefined,
      userdata: null,
    }
  },
  async fetch() {
    this.membership = this.memberships[0]
    this.email = window.localStorage.getItem('emailForSignIn')
  },
  methods: {
    load(){
      console.log(this.$strapi.user.id)
      this.$strapi.$users.update(this.$strapi.user,{
        blocked: true, //this.membership.id.toLowerCase() 
      }).then(()=>{
        console.log('done')
      }).catch((e) => {
          // eslint-disable-next-line no-console
          console.error(e)
          this.showError = true
          this.loading = false
        })
    },
    updateProfile() {
      this.loading = true
      const d = new Date()

      const username = this.firstName 
        ? this.firstName + ' ' + this.lastName 
        : d.getMilliseconds().toString().slice(0,1) + d.getSeconds().toString() + d.getDay().toString() +d.getMonth().toString() + d.getFullYear().toString().slice(2)

      this.$strapi.register({ 
        username: username, 
        email: this.email, 
        password: this.password,
        roleName: this.membership.id,
        blocked: true,
        isVerifying: false,
        //role: havetofixproblem,
      }).then(()=>{
          this.$store.dispatch('checkAuth')
          window.localStorage.removeItem('emailForSignIn')
          this.loading = false
          this.userdata = this.$store.getters['getActiveUser']
          this.membership.id === 'Coach' ? this.stepper++ : this.$router.push('/frauen')
      })
    },
  },
}
</script>
