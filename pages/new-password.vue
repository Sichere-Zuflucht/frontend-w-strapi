<template>
  <v-container class="d-flex flex-column">
    <h1 class="text-center text-h4 my-4">Passwort zurücksetzen</h1>
    <v-card>
      <v-card-text>
        <v-form ref="form" v-model="validMem">
          <v-text-field
            v-model="password"
            class="secondary--text font-weight-bold"
            label="Neues Passwort"
            :rules="rules.passwordRules"
            :type="hidePassword ? 'password' : 'text'"
            :append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
            hint="Bitte beachten Sie folgende Passwortvorgaben"
            persistent-hint
            @click:append="() => (hidePassword = !hidePassword)"
          ></v-text-field>
          <v-chip
            :color="/^(?=.*?[A-Z]).{1,}$/.test(password) ? 'green' : 'grey'"
            dark
            class="mt-2"
            >Großbuchstaben</v-chip
          >
          <v-chip
            :color="/^(?=.*?[a-z]).{1,}$/.test(password) ? 'green' : 'grey'"
            dark
            class="mt-2"
            >Kleinbuchstaben</v-chip
          >
          <v-chip
            :color="/^(?=.*?[0-9]).{1,}$/.test(password) ? 'green' : 'grey'"
            dark
            class="mt-2"
            >Zahlen</v-chip
          >
          <v-chip
            :color="
              /^(?=.*?[#?!@$ %^&*-]).{1,}$/.test(password) ? 'green' : 'grey'
            "
            dark
            class="mt-2"
            >Sonderzeichen (#?!@$ %^&*-)</v-chip
          >
          <v-chip
            :color="/^.{8,}$/.test(password) ? 'green' : 'grey'"
            dark
            class="mt-2"
            >mind. 8 Zeichen</v-chip
          >
          <v-text-field
            v-model="passwordConfirmation"
            class="secondary--text font-weight-bold mt-4"
            :rules="rules.passwordRules2"
            label="Passwort wiederholen"
            type="password"
          ></v-text-field>
          <div class="d-flex justify-end">
            <v-btn
              color="secondary"
              class="mt-4"
              :loading="loading"
              :disabled="!validMem"
              @click="changePW"
              >ändern</v-btn
            >
          </div>
        </v-form>
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
      validMem: false,
      loading: false,
      buttonText: "Passwort ändern",
      hidePassword: true,
      error: {
        status: false,
        message: "",
      },
      password: null,
      passwordConfirmation: null,
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
    };
  },
  mounted() {
    let paramString = this.$route.fullPath.split("?")[1];
    let queryString = new URLSearchParams(paramString);
    for (let pair of queryString.entries()) {
      this.code = pair[1];
    }
  },
  methods: {
    changePW() {
      this.loading = true;
      this.$strapi
        .resetPassword({
          code: this.code,
          password: this.password,
          passwordConfirmation: this.passwordConfirmation,
        })
        .then((r) => {
          this.loading = false;
          this.buttonText = "Passwort geändert";
          this.$router.push("/frauen");
        })
        .catch((e) => {
          console.log("error:", e);
          this.error.status = true;
          this.error.message = e.message;
        });
    },
  },
};
</script>
