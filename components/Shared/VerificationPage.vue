<template>
  <div class="py-4">
    <div v-if="!success && !verified && !isVerifying">
      <h2 class="text-h2 secondary--text pb-4">Verifizierung</h2>
      <p>
        Wir nehmen innerhalb der nächsten Tage mit Ihnen Kontakt auf, um Sie
        kennenzulernen und offene Fragen klären zu können.
      </p>
      <nuxt-link to="" target="_blank"
        >Warum ist eine Verifizierung nötig?</nuxt-link
      >
      <v-form ref="verify" v-model="validRef" class="pt-8">
        <v-text-field
          v-model="verPhone"
          class="secondary--text font-weight-bold"
          :rules="rules.phone"
          label="Telefonnummer"
          type="tel"
          persistent-hint
          hint="Wir nehmen innerhalb der nächsten Tage mit Ihnen Kontakt
                    auf, um Sie kennenzulernen und offene Fragen klären zu
                    können."
        ></v-text-field>
        <v-text-field
          v-model="verEmail"
          class="secondary--text font-weight-bold"
          :rules="rules.email"
          label="E-Mail-Adresse"
          type="email"
          persistent-hint
          hint="Über die wir mit Ihnen Kontakt aufnehmen dürfen."
        ></v-text-field>
        <v-text-field
          v-model="verWeb"
          class="secondary--text font-weight-bold"
          label="Webseite (optional)"
        ></v-text-field>
        <v-btn
          color="secondary"
          :loading="loading"
          :disabled="!validRef"
          class="mt-4"
          style="float: right"
          @click="verifyProfil"
          >Verifizierung starten</v-btn
        >
      </v-form>
    </div>
    <div v-else-if="(isVerifying && !verified) || success">
      <h2 class="text-h2 secondary--text pb-4">VERIFIZIERUNG GESTARTET</h2>
      <div v-if="editprofil">
        <p>
          Es kann einige Tage dauern, bis wir uns bei Ihnen melden. Nutzen Sie
          die Zeit gern, um Ihr Profil zu erstellen.
        </p>
        <v-btn color="secondary" class="my-4" to="/beratung/edit-profil"
          >Profil anlegen</v-btn
        >
      </div>
      <p>
        Sobald Ihr Profil vollständig ist und Sie verifiziert sind, stellen wir
        Ihr Profil online und Sie können mit der Beratung beginnen.
      </p>
    </div>
    <div v-else-if="verified">
      <h2 class="text-h2 secondary--text pb-4">VERIFIZIERUNG GESCHAFFT</h2>
    </div>
    <v-alert v-if="error">{{ error ? error : '' }}</v-alert>
  </div>
</template>

<script>
export default {
  props: {
    editprofil: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      validRef: false,
      success: false,
      error: null,
      verPhone: '',
      verEmail: '',
      verWeb: '',
      loading: false,
      rules: {
        phone: [
          (v) => !!v || 'Telefonnummer nicht vergessen',
          (v) =>
            /^(?:\+\d{2}|0|00\d{2})(?:\s*\d{3}){2}\s*\d{4,10}/.test(v) ||
            'Ungültiges Format',
        ],
        email: [
          (v) =>
            /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
            'Ungültiges Format',
        ],
      },
    }
  },
  computed: {
    verified() {
      return this.$store.getters['modules/user/verified']
    },
    isVerifying() {
      return this.$store.getters['modules/user/isVerifying']
    },
  },
  methods: {
    verifyProfil() {
      this.loading = true
      this.$store
        .dispatch('modules/user/requestVerify', {
          tel: this.verPhone,
          www: this.verWeb,
          email: this.verEmail,
        })
        .then(() => {
          this.loading = false
          this.success = true
        })
    },
  },
}
</script>
