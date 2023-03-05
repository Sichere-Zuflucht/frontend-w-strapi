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
      </v-sheet></v-col><v-col cols="12" md="6" class="pa-0">
      <v-container style="max-width: 450px" class="ma-auto py-16">
        <h1 class="text-h1 mt-4 primary--text">{{ title }}</h1>
        <p v-if="subtitle" class="caption">{{ subtitle }}</p>
        <v-stepper v-model="step" :flat="true" style="box-shadow: none">
          <v-stepper-items>
            <v-stepper-content v-if="!makeLogin" step="1" class="pa-0 mt-4">
              <h2 v-if="!emailExisting" class="text-h3 secondary--text">Ihr Anliegen</h2>
              <p class="caption">Bitte wähle dein Anliegen aus:</p>
              <v-item-group v-model="membership" class="mt-2">
                <v-row>
                  <v-col v-for="(n, i) in memberships" :key="i" cols="12" sm="6">
                    <v-item v-slot="{ active, toggle }" :value="n">
                      <v-card :color="active ? 'primary' : 'blue-grey lighten-5'"
                        class="d-flex flex-column justify-center align-center pa-8" :dark="active" height="200"
                        @click="toggle">
                        <v-icon large class="pr-2">{{ n.icon }}</v-icon>
                        <p class="ma-0 text-center" style="padding-top: 2px">
                          {{ n.description }}
                        </p>
                      </v-card></v-item></v-col></v-row></v-item-group>
              <div class="d-flex justify-end pt-6">
                <v-btn color="primary" :disabled="!membership" @click="step++">Weiter ></v-btn>
              </div>
            </v-stepper-content>
            <v-stepper-content step="2" class="pa-0 mt-4">
              <v-form v-model="valid.email" style="width: 100%" class="mb-4" autocomplete="on">
                <h2 v-if="!emailExisting" class="text-h3 secondary--text">E-Mail-Adresse</h2>
                <v-text-field v-model="email" type="email" :rules="rules.email" label="E-mail-Adresse" required
                  name="email" autocomplete="email"></v-text-field>
                <div class="d-flex justify-end pt-0">
                  <p v-if="!makeLogin" class="caption">
                    Wir senden im nächsten Schritt eine E-Mail an die o.g.
                    Adresse, um sie zu bestätigen. <b>Bitte auch im Spam-Ordner nachsehen.</b>
                  </p><v-btn color="primary" :loading="loading" :disabled="!valid.email" @click="next">Weiter ></v-btn>
                </div>

              </v-form>
            </v-stepper-content>
            <v-stepper-content step="3" class="pa-0">
              <v-form v-model="valid.password" style="width: 100%" class="mb-8" autocomplete="on">
                <v-alert v-if="emailExisting && !makeLogin" type="info" color="secondary" class="my-4">
                  Es existiert bereits ein Konto mit der E-Mail-Adresse
                  <b>{{ email }}</b>. Logge dich ein oder klicke "Passwort vergessen", solltest
                  du dein Passwort vergessen haben.
                </v-alert>
                <v-alert v-if="!emailExisting && makeLogin" type="info" color="secondary" class="my-4">
                  Es existiert kein Konto mit der E-Mail-Adresse
                  {{ email }}. Willst du dich mit der E-Mail
                  <b>{{ email }}</b> bei Sichere Zuflucht registrieren?
                  <v-btn light color="white" class="mt-4" to="/registration/signup">Registrieren</v-btn>
                </v-alert>
                <div v-else>
                  <h2 v-if="!emailExisting" class="text-h3 secondary--text mt-4">Account erstellen</h2>
                  <v-text-field type="email" disabled name="username" autocomplete="off" v-model="email"
                    class="mt-0 pt-0" />
                  <!--<p class="grey--text">für {{email}}</p>-->

                  <v-text-field v-model="password" label="Passwort" :rules="emailExisting ? [] : rules.passwordRules"
                    :type="hidePassword ? 'password' : 'text'" :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :name="emailExisting ? 'current-password' : 'new-password'"
                    :autocomplete="emailExisting ? 'current-password' : 'new-password'" :hint="
                      emailExisting
                        ? ''
                        : 'Bitte beachten Sie folgende Passwortvorgaben'
                    " persistent-hint @click:append="() => (hidePassword = !hidePassword)"></v-text-field>
                  <div v-if="!emailExisting">
                    <v-chip v-for="(n, i) in chips" :key="i" :color="
                      n.rule(password) ? 'success' : 'grey'
                    " dark class="mt-1 mr-1" small filter>
                      {{ n.title }}
                    </v-chip>
                    <v-text-field v-model="password2" :rules="rules.passwordRules2" label="Passwort wiederholen"
                    :type="hidePassword2 ? 'password' : 'text'" :append-icon="hidePassword2 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="() => (hidePassword2 = !hidePassword2)" name="new-password" autocomplete="off" class="mt-6"></v-text-field>
                  </div>
                  <div class="d-flex justify-end">
                    <v-btn text color="grey" @click="back()"> Zurück </v-btn>
                    <v-btn v-if="emailExisting" text @click="sendResetPasswortCode" :loading="resetLoading"
                      color="grey">Passwort vergessen</v-btn><v-btn class="inline" color="success" :loading="loading"
                      :disabled="!valid.password" nuxt @click="emailExisting ? login() : register()">{{
                        emailExisting?
                                            "Einloggen": "Account erstellen"
                      }}</v-btn>
                  </div>
                  <v-alert v-if="codeSent.status" type="success" class="mt-2">{{ codeSent.message }}</v-alert>
                </div>
              </v-form>
            </v-stepper-content>
            <v-stepper-content step="4" class="pa-0">
              <!--<h3 class="text-h2 secondary--text mb-8">
                  Danke, dass du dich bei Sichere Zuflucht registrieren möchtest!
                </h3>
                <p class="caption">
                  Bitte folge dem Prozess und erstelle ein Profil
                </p>
                <v-btn
                  color="primary"
                  class="mb-4"
                  to="membership-selection"
                  >Profil erstellen</v-btn
                >-->
              <h2 class="text-h1 primary--text mb-4">
                Danke für die Anmeldung!
              </h2>
              <h3 class="text-h2 secondary--text mb-8">
                Wir haben Ihnen eine Bestätigungsmail gesendet.
              </h3>
              <p>
                <b>{{ email }}</b>
              </p>
              <p class="caption">
                Bitte schauen Sie in Ihr E-Mail-Postfach. Kontrolliere ggf. auch den
                Spam Ordner.
              </p>
              <p class="caption">
                Sollte nichts angekommen sein, können Sie sich die E-mail noch
                einmal zusenden lassen.
              </p>
              <v-btn color="primary" class="mb-4" href="/registration/signin">Einloggen</v-btn>
              <v-btn color="primary" outlined :loading="loading" class="mb-4" @click="sendConfirmationAgain">Erneut
                senden</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
        <v-alert v-if="error.status" color="error" class="white--text mt-4" dismissible>
          {{
  error.message ? error.message : `Es wurde eine E-Mail inklusive einem Link an ${email} geschickt. Bitte
          folgen Sie den dort beschriebenen Anweisungen.` }}

        </v-alert>
      </v-container>
    </v-col></v-row>
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
      default: "",
    },
    subtitle: {
      type: String,
      default: null,
    },
    buttonText: {
      type: String,
      default: "Als Berater*in registrieren?",
    },
    buttonLink: {
      type: String,
      default: "/registration/signup-coach",

    }
  },
  data() {
    return {
      step: this.makeLogin ? 2 : 1,
      valid: {
        email: false,
        password: false,
        membership: false,
      },
      email: "",
      password: "",
      password2: "",
      hidePassword: true,
      hidePassword2: true,
      rules: {
        passwordRules: [
          (v) =>
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
              v
            ) || "Ihr Passwort erfüllt nicht alle Vorgaben.",
        ],
        passwordRules2: [
          (v) => !!v || "Passwortüberprüfung nicht vergessen",
          (v) =>
            (!!v && v === this.password) || "Passwörter müssen übereinstimmen",
        ],
        email: [
          (v) => !!v || "E-Mail ist erforderlich",
          (v) =>
            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
            "E-Mail muss gültig sein",
        ],
      },
      chips: [
        {
          title: "Großbuchstaben",
          rule: (v) => /^(?=.*?[A-Z]).{1,}$/.test(v),
        },
        {
          title: "Kleinbuchstaben",
          rule: (v) => /^(?=.*?[a-z]).{1,}$/.test(v),
        },
        {
          title: "Zahlen",
          rule: (v) => /^(?=.*?[0-9]).{1,}$/.test(v),
        },
        {
          title: "Sonderzeichen (#?!@$ %^&*-)",
          rule: (v) => /^(?=.*?[#?!@$ %^&*-]).{1,}$/.test(v),
        },
        {
          title: "mind. 8 Zeichen",
          rule: (v) => /^.{8,}$/.test(v),
        },

      ],
      loading: false,
      //showConfirmation: false,
      emailExisting: false,
      showRegister: false,
      //buttonText: "Registrieren",
      error: {
        status: false,
        message: "",
      },
      resetLoading: false,
      codeSent: {
        status: false,
      },
      memberships: [
        {
          description: "Ich suche Beratung",
          icon: "mdi-face-woman",
          id: "Woman",
          roleName: 'woman',
          name: "Frau",
        },
        {
          description: "Ich möchte Beratung anbieten",
          icon: "mdi-message",
          id: "Coach",
          roleName: 'authenticated',
          name: "Beratung",
        },
      ],
      membership: null,
    };
  },
  mounted() {
    console.log(this.strapi)
    const email = window.localStorage.getItem("emailForSignIn");
    if (email) {
      this.email = email
      this.next()
      //this.step++
      //this.showConfirmation = true;
    }
  },
  methods: {
    back() {
      this.step--
    },
    next() {
      this.$strapi
        .count("users", {
          email: this.email,
        })
        .then((loginMethods) => {
          loginMethods > 0
            ? (
              this.emailExisting = true
            )
            : this.emailExisting = false
          this.step++
        });
    },
    login() {
      this.loading = true;
      if (!process.client) return
      this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password,
        })
        .then((e) => {
          this.loading = false;
          const route = window.localStorage.getItem("redirectBackTo")
            ? window.localStorage.getItem("redirectBackTo")
            : "/frauen"
          window.localStorage.removeItem('redirectBackTo')
          this.$router.push(route);
        })
        .catch((err) => {
          this.loading = false;
          this.error.status = true;
          this.error.message = err.response.data.error.message.includes('Invalid identifier') ? 'Ungültige E-Mail-Adresse oder ungültiges Passwort' : err.response.data.error.message;
          this.$store.dispatch("errorhandling", err);
        });

    },
    async register() {
      this.loading = true
      const d = new Date();
      const username =
        "FR-" +
        d.getMilliseconds().toString().slice(0, 1) +
        d.getSeconds().toString() +
        d.getDay().toString() +
        d.getMonth().toString() +
        d.getFullYear().toString().slice(2);

      const roleTypes = []
      const res = (await this.$strapi.find("users-permissions/roles")).roles;
      console.log('res', res)
      res.forEach((role) => {
        if (role.type == "coach") roleTypes.push(role);
        if (role.type == "woman") roleTypes.push(role);
      });

      // Ist nodemailer aktiviert, damit die Registrierung via localhost funktioniert?
      this.$strapi
        .register({
          username: username,
          email: this.email,
          password: this.password,
          role: roleTypes.find(
            (r) => r.type == this.membership.id.toLowerCase()
          ).id,
          roleName: this.membership.roleName,
        })
        .then(() => {
          this.valid = false
          this.loading = false
          this.showConfirmation = true
          this.step++
          window.localStorage.setItem('emailForSignIn', this.email)

        })
        .catch((err) => {
          this.$store.dispatch("errorhandling", err);
        })
    },
    sendConfirmationAgain() {
      this.loading = true;
      this.$strapi.sendEmailConfirmation({ email: this.email }).then(() => {
        this.loading = false;
      })
    },
    sendResetPasswortCode() {
      this.resetLoading = true
      this.$strapi
        .forgotPassword({ email: this.email })
        .then(() => {
          this.resetLoading = false;
          this.codeSent.status = true;
        })
        .catch((error) => {
          this.error.status = true;
          this.error.message = error.code + ": " + error.message;
        });
    }
  },
};
</script>
