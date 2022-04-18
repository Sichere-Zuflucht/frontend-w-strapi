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
              e.preventDefault()
            }
          "
        >
          <v-text-field
            v-model="email"
            type="email"
            :rules="emailRules"
            label="E-mail"
            required
            append-icon="mdi-email"
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
          >Wenn ein Account mit der E-Mail {{ email }} bei uns hinterlegt ist,
          wird eine E-Mail an diese Adresse geschickt. Bitte folge den dort
          beschriebenen Anweisungen.
        </v-alert>
        <v-alert v-if="error.status" color="error" class="white--text mt-4"
          >{{ error.message }}
        </v-alert>
      </v-card-text>
    </v-card>
{{email}}
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
      buttonText: 'Passwort zurücksetzen',
      disabled: false,
      email: '',
      error: {
        status: false,
        message: '',
      },
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) =>
          /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
          'E-mail must be valid',
      ],
    }
  },
  methods: {
    resetPassword() {
      this.loading = true
      this.$strapi.forgotPassword({ email: this.email })
      .then(() => {
          // Email sent.
          this.loading = false
          this.buttonText = 'Versendet'
          this.showConfirmation = true
          this.valid = false
        })
        .catch((err) => {
          this.$store.dispatch('errorhandling',err)
          // An error happened.
          this.error.status = true
          this.error.message = err.message
        })
      /*this.$fire.auth
        .sendPasswordResetEmail(this.email)
        .then(() => {
          // Email sent.
          this.loading = false
          this.buttonText = 'Versendet'
          this.showConfirmation = true
        })
        .catch((err) => {
          // An error happened.
          console.log(err)
          this.error.status = true
          this.error.message = err.message
        })*/
    },
  },
}
</script>
