<template>
  <div v-if="userdata" class="pa-3">
    <div v-if="!success && userdata.verification == 'false'" >
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
          hint="Wir werden Sie telefonisch kontaktieren."
        ></v-text-field>
        <v-checkbox
          v-if="!userAltEmail"
          v-model="userAltEmail"
          label="Alterative Email nutzen"
          :hint="'Nutze zur Verifizierung eine alternative Emailadresse, anstatt ' + userdata.email"
          persistent-hint
        ></v-checkbox>
        <v-text-field
          v-else
          v-model="verEmail"
          class="secondary--text font-weight-bold mt-4"
          :rules="rules.email"
          label="E-Mail-Adresse (optional)"
          type="email"
          persistent-hint
          append-icon="mdi-close"
          hint="Wir werden Sie eventuell per Email kontaktieren."
          @click:append="userAltEmail = !userAltEmail"
        ></v-text-field>
        <v-checkbox
          v-if="!useWeb"
          v-model="useWeb"
          label="Webseite hinzufügen"
          hint="Geben Sie Ihre offizielle Webseite an, um Ihre Seriösität zu beweisen."
          persistent-hint
        ></v-checkbox>
        <v-text-field
          v-if="useWeb"
          v-model="verWeb"
          class="secondary--text font-weight-bold mt-4"
          label="Webseite (optional)"
          append-icon="mdi-close"
          @click:append="useWeb = !useWeb"
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
    <div v-else-if="userdata.verification == 'inprogress' || success">
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
    <div v-else-if="userdata.verification == 'done'">
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
    userdata: {
      type: Object,
    }
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
      userAltEmail: false,
      useWeb: false,
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
  methods: {
    verifyProfil() {
      this.loading = true
      const data = {
        verification: 'inprogress',
        tel: this.verPhone,
        www: this.verWeb,
        altEmail: this.verEmail,
      }
      this.$strapi.$users
        .update(this.$strapi.user.id, data)
        .then((r) => {
          console.log('updated',r)
          this.loading = false
          this.success = true
        })
    },
  },
}
</script>
