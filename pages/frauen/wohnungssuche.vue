<template>
  <v-container>
    <!--<h1 class="text-h1 primary--text mb-4">Wohnungssuche</h1>
    <SharedVerificationPage v-if="!$store.getters['modules/user/verified']" />
    <v-form v-else ref="housing" v-model="valid" class="mb-8">
      <h2 class="text-h2 secondary--text">Deine Daten sind sicher</h2>
      <p>
        Deine Angaben werden nur von uns eingesehen. Wir werden für dich
        passende Wohnungen suchen und dir maximal 3 Vorschläge geben.
      </p>
      <v-row>
        <v-col cols="9" md="7">
          <v-text-field
            v-model="location"
            type="name"
            :rules="[rules.required, rules.length(2)]"
            label="*Ort der Unterkunft"
            prepend-icon="mdi-map-marker"
          ></v-text-field>
        </v-col>
        <v-col cols="3" md="5">
          <v-text-field
            v-model="plz"
            type="number"
            counter="5"
            :rules="[rules.required, rules.length(5)]"
            label="*Plz."
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="personAmount"
            type="number"
            :rules="[rules.required]"
            label="*Anzahl Personen"
            prepend-icon="mdi-account-group"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="price"
            type="number"
            :rules="[rules.required]"
            label="*Preis"
            prepend-icon="mdi-currency-eur"
          >
            <v-sheet slot="append" class="d-flex grey--text pt-1"
              >/Monat</v-sheet
            ></v-text-field
          >
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="dates"
            persistent
            width="290px"
          >
            <template #activator="{ on, attrs }">
              <v-text-field
                v-model="dateRangeText"
                label="Einzug Zeitraum"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              >
              </v-text-field>
            </template>
            <v-date-picker
              v-model="dates"
              :min="new Date().toISOString().substr(0, 10)"
              range
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">
                Schließen
              </v-btn>
              <v-btn text color="primary" @click="$refs.dialog.save(dates)">
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
      </v-row>
      <v-divider class="py-4" />
      <p>
        <v-icon class="pr-2">mdi-checkbox-multiple-marked-outline</v-icon
        >Zusätzliche Einrichtungen
      </p>
      <v-row class="pl-8">
        <v-col v-for="(check, i) in checkboxes" :key="i" cols="6">
          <v-checkbox
            v-model="selected"
            :label="check.label"
            :value="check.value"
          />
        </v-col>
      </v-row>
      <v-divider class="py-4" />
      <v-row>
        <v-col cols="12">
          <v-textarea
            outlined
            label="Weitere Informationen"
            placeholder="Ergänze hier mit wichtigen Infos, Hinweisen, Wünschen oder Anliegen deinerseits."
            prepend-icon="mdi-comment"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-btn
            color="success"
            :loading="loading"
            :disabled="!valid"
            class="float-right"
            @click="validate()"
            >{{ buttonText }}</v-btn
          >
        </v-col>
        <v-col class="pt-0">
          <v-alert v-if="showConfirmation" type="info" color="success"
            >Deine Anfrage wurde erfolgreich an Sichere Zuflucht verschickt. Wir
            werden uns so bald wie möglich via E-Mail bei dir melden.</v-alert
          >
          <v-alert v-if="error.status" type="error" color="error">{{
            error.message
          }}</v-alert>
        </v-col>
      </v-row>
    </v-form>-->
  </v-container>
</template>

<script>
export default {
  middleware: 'authWoman',
  data() {
    return {
      valid: false,
      location: '',
      personAmount: '',
      plz: '',
      rules: {
        email: (v) => !!(v || '').match(/@/) || 'Keine gültige E-Mail',
        length: (len) => (v) =>
          (v || '').length >= len ||
          `Ungültige Zeichenlänge, ${len} erforderlich`,
        required: (v) => !!v || 'Bitte ausfüllen',
      },
      dates: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      modal: false,
      selected: [],
      price: '',
      checkboxes: [
        {
          label: 'Türspion',
          value: 'door spion',
        },
        {
          label: 'Barrierefrei',
          value: 'barrier free',
        },
        {
          label: 'Sprechanlage',
          value: 'door speaker',
        },
        {
          label: 'Nichtraucher',
          value: 'non-smoker',
        },
        {
          label: 'Kein Erdgeschoss',
          value: 'no ground',
        },
        {
          label: 'Internet/W-Lan',
          value: 'internet',
        },
        {
          label: 'separater Eingang',
          value: 'second door',
        },
        {
          label: 'Öffentliche Verkehrsmittel',
          value: 'public transport',
        },
      ],
      loading: false,
      showConfirmation: false,
      buttonText: 'Anfrage versenden',
      error: {
        status: false,
        message: '',
      },
    }
  },
  computed: {
    dateRangeText() {
      return this.dates.join(' – ')
    },
  },
  methods: {
    /*validate() {
      if (!this.$refs.housing.validate()) return
      this.loading = true
      this.$fire.functions
        .httpsCallable('email-sendReqHousingMail')({
          message: this.message,
          place: this.location,
          zip: this.plz,
          amount: this.personAmount,
          monthprice: this.price,
          range: this.dates,
          features: this.selected,
          createdAt: new Date(),
        })
        .then(() => {
          this.buttonText = 'Versendet'
          this.loading = false
          this.showConfirmation = true
          this.valid = false
        })
        .catch((err) => {
          this.error.status = true
          this.error.message = err.message
        })
    },*/
  },
}
</script>
