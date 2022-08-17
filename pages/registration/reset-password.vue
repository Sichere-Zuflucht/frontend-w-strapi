<template>
  <v-container class="d-flex flex-column">
    <h1 class="text-center text-h4 my-4">Passwort zurücksetzen</h1>
    <v-card>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          style="width: 100%"
          class="mb-4"
          @submit="
            (e) => {
              e.preventDefault();
            }
          "
        >
          <v-text-field
            v-model="password"
            label="Neues Passwort"
            :rules="rules.passwordRules"
            :type="hidePassword ? 'password' : 'text'"
            :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
            hint="Bitte beachten Sie folgende Passwortvorgaben"
            persistent-hint
            @click:append="() => (hidePassword = !hidePassword)"
          ></v-text-field>
          <v-chip
            v-for="(n, i) in chips"
            :key="i"
            :color="n.rule(password) ? 'success' : 'grey'"
            dark
            class="mt-1 mr-1"
            small
            filter
          >
            {{ n.title }}
          </v-chip>
          <v-text-field
            v-model="password2"
            :rules="rules.passwordRules2"
            label="Neues Passwort wiederholen"
            type="password"
            class="mt-6"
          ></v-text-field>
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!valid"
            @click="resetPassword"
            >{{ buttonText }}
          </v-btn>
        </v-form>
        <v-alert
          v-if="showConfirmation"
          color="success"
          class="white--text mt-4"
          >Sie haben Ihr Passwort erfolgreich zurückgesetzt.
        </v-alert>
        <v-alert v-if="error.status" color="error" class="white--text mt-4"
          >{{ error.message }}
        </v-alert>
      </v-card-text>
    </v-card>
    <p class="text--secondary text-center mt-4 mb-0">
      Du kennst dein Passwort?
    </p>
    <v-btn to="/registration/signup" exact nuxt text color="grey"
      >Anmelden</v-btn
    >
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      valid: false,
      loading: false,
      showConfirmation: false,
      buttonText: "Passwort zurücksetzen",
      disabled: false,
      error: {
        status: false,
        message: "",
      },
      password: "",
      password2: "",
      hidePassword: true,
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
    };
  },
  methods: {
    resetPassword() {
      this.loading = true;
      console.log("code", this.$route.query.code);
      this.$strapi
        .resetPassword({
          code: this.$route.query.code,
          password: this.password,
          passwordConfirmation: this.password2,
        })
        .then(() => {
          // Email sent.
          this.loading = false;
          this.buttonText = "Versendet";
          this.showConfirmation = true;
          this.valid = false;
        })
        .catch((err) => {
          this.$store.dispatch("errorhandling", err);
          // An error happened.
          this.error.status = true;
          this.error.message = err.message;
        });
    },
  },
};
</script>
