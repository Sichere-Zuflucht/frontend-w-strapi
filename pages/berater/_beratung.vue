<template>
  <div v-if="pubData">
    <v-sheet class="d-flex justify-center pt-8" style="position: relative"
      ><v-avatar :lazy-src="pubData.avatar" :src="pubData.avatar" size="162">
        <v-img :lazy-src="pubData.avatar" :src="pubData.avatar"></v-img
      ></v-avatar>
    </v-sheet>
    <v-container>
      <h1 class="text-center text-h1 primary--text text-uppercase">
        {{ pubData.firstName }} {{ pubData.lastName }}
      </h1>
      <h2 class="text-center text-h4 mb-4">
        {{ pubData.info.profession }}
      </h2>
      <div
        v-if="pubData.info.topicArea"
        class="d-flex flex-wrap justify-center mb-4"
      >
        <v-chip class="mx-1" color="primary">
          {{ pubData.info.topicArea }}
        </v-chip>
      </div>
      <div v-if="pubData.info.quote" class="text-center">
        <p>
          <b>"{{ pubData.info.quote }}"</b>
        </p>
      </div>

      <div v-if="pubData.info.since">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Ich bin Coach/Berater*in seit dem Jahr:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.since }}
        </div>
      </div>

      <div v-if="pubData.info.history">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Mein beruflicher Hintergrund:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.history }}
        </div>
      </div>
      <div v-if="pubData.info.focus">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Meine Schwerpunkte sind:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.focus }}
        </div>
      </div>
      <div v-if="pubData.info.coachingTopics">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Meine Beratungs-/Coaching-Themen sind:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.coachingTopics }}
        </div>
      </div>
      <div v-if="pubData.info.description">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Etwas Persönliches über mich:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.description }}
        </div>
      </div>
      <div v-if="pubData.info.assistance">
        <p class="font-weight-bold mb-0 mt-4 caption">
          Ich kann diese konkrete Hilfestellung anbieten:
        </p>
        <div class="d-flex flex-wrap">
          {{ pubData.info.assistance }}
        </div>
      </div>
    </v-container>
    <div
      v-if="
        $route.params.beratung !== $store.getters['modules/user/uid'] &&
        $store.getters['modules/user/membership'] !== 'Coach'
      "
    >
      <v-container>
        <v-card
          outlined
          class="mt-8"
          :style="'border: 1px solid ' + $vuetify.theme.themes.light.secondary"
          elevation="2"
        >
          <v-card-title class="text-h2 secondary--text"
            >online-beratungstermin anfragen</v-card-title
          >
          <v-card-text v-if="$store.getters['modules/user/isAuthenticated']">
            <p>
              Fülle bitte die beiden Felder aus. Unser/e Berater*in sendet dir
              dann passende Terminvorschläge für euren Beratungstermin.
            </p>

            <v-form
              v-if="!showConfirmation"
              ref="form"
              v-model="requestForm"
              class="pb-8 pt-4"
              @submit="
                (e) => {
                  e.preventDefault()
                }
              "
            >
              <v-text-field
                v-model="msgTitle"
                outlined
                color="secondary"
                placeholder="Dein Anliegen"
                label="Thema"
                counter="100"
                persistent-hint
                hint="Bitte nenne uns ein konkretes Thema für dein Anliegen"
                class="mb-4"
              ></v-text-field>
              <v-textarea
                v-model="message"
                outlined
                color="secondary"
                placeholder="Beschreibe bitte dein Anliegen."
                value="Jemand möchte mit Ihnen Kontakt aufnehmen."
                label="persönliche Anfrage schreiben"
                counter="500"
              ></v-textarea>

              <p class="font-weight-bold">
                Preis pro Beratungseinheit (50 Min.): 50 €
              </p>
              <v-row
                ><v-col cols="12" md="8">
                  <p class="font-weight-bold mb-0">Ablauf:</p>
                  <ol class="mb-6">
                    <li>Du sendest deine Anfrage an den/die Bearater*in</li>
                    <li>Der/Die Berater*in sendet dir 3 Terminvorschläge</li>
                    <li>
                      Nimmst du einen Terminvorschlag an, wirst du direkt in den
                      Zahlungsprozess weitergeleitet
                    </li>
                    <li>
                      Mit deiner Zahlung buchst du diesen Termin verbindlich und
                      euer Online-Beratungsraum wird reserviert.
                    </li>
                  </ol>
                  <p class="caption">
                    <nuxt-link to=""
                      >Wie läuft das Beratungsgespräch ab?</nuxt-link
                    ><br /><nuxt-link to="">
                      Infos zur Termineinhaltung </nuxt-link
                    ><br /><nuxt-link to=""> zu Preisen</nuxt-link>
                  </p></v-col
                ><v-col cols="12" md="4"
                  ><div class="d-flex flex-row-reverse mb-4">
                    <v-btn
                      color="secondary"
                      :loading="loading"
                      :disabled="isDisabled"
                      @click="sendRequest"
                      >{{ buttonText }}
                    </v-btn>
                  </div></v-col
                ></v-row
              >
            </v-form>
            <v-alert
              v-else
              color="success"
              dark
              icon="mdi-check"
              class="mt-4 d-flex flex-column justify-center"
            >
              <p class="mb-0">
                Fertig! Deine Anfrage wurde gesendet, {{ coachName }} wird sich
                in den nächsten Tagen bei dir melden. <br />Sieh bitte auch in
                deinem Spam-Ordner nach.
              </p>
            </v-alert>
            <v-alert v-if="error.status" color="error" class="white--text mt-4"
              >{{ error.message }}
            </v-alert>
          </v-card-text>
          <v-card-text v-else
            ><p class="font-weight-bold my-2 caption">
              Melde dich bei Sichere Zuflucht an, um diese/n Berater*in
              kontaktieren zu können.
            </p>
            <v-btn nuxt to="/registration/signup" color="secondary"
              >Registrieren</v-btn
            ><v-btn nuxt to="/registration/signin" text
              >Einloggen</v-btn
            ></v-card-text
          >
        </v-card>
      </v-container>
      <v-sheet color="grey lighten-5"
        ><v-container> <WomanPriceInfo /></v-container
      ></v-sheet>
      <v-container>
        <SharedFaq price onlinecoaching />
      </v-container>
      <v-divider class="mt-16 mb-6" />
      <v-container>
        <h2 class="text-h2 mt-8 secondary--text">weitere Berater*innen</h2>
        <p class="caption">
          <b>Per Online-Beratung</b> werden dir Berater*innen und Coaches
          zuhören und weiter helfen. Schau dich um, Sie beraten in vielen
          Themen. Per Online-Beratung werden dir Berater*innen zuhören und
          weiter helfen. Schau dich um. Sie beraten in vielen Themen. Die
          Beratung findet digital und anonym statt.
        </p>
      </v-container>
      <CoachingSlider :withoutid="$route.params.beratung" />
    </div>
    <v-container v-else class="mt-16">
      <v-btn to="/beratung/edit-profil" outlined nuxt color="primary"
        >Profil bearbeiten</v-btn
      >
      <v-btn outlined nuxt color="primary" @click="copy">Profil teilen</v-btn>
      <v-alert v-if="copied" type="success" text class="mt-4"
        >Link in Zwischenablage kopiert</v-alert
      >
      <v-text-field
        ref="link"
        style="opacity: 0"
        readonly
        :value="linkVal"
        @click="copy"
      ></v-text-field>
    </v-container>
  </div>
  <div v-else-if="pubData !== false">
    <v-container>
      <v-skeleton-loader
        class="mx-auto"
        max-width="300"
        type="avatar, article, list-item-two-line, list-item-two-line, actions"
      ></v-skeleton-loader>
    </v-container>
  </div>
  <div v-else>
    <v-container class="mt-16">
      <h1 class="text-h1 secondary--text mb-4">Unbekannt</h1>
      <v-alert type="error" dark color="red">
        Dieser/diese Berater*in scheint nicht zu existieren.
      </v-alert>
      <p>
        Es tut uns leid, da muss wohl ein Fehler vorliegen. Der/die Berater*in
        unter dieser URL scheint nicht oder nicht mehr zu existieren. Bitte
        überprüfen Sie die Korrektheit der URL oder wenden Sie sich an uns unter
        <a href="mailto:kontakt@sichere-zuflucht.de"
          >kontakt@sichere-zuflucht.de</a
        >
      </p>
      <SharedServiceOverview class="pb-16" />
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestForm: false,
      message: '',
      msgTitle: '',
      showAddInfo: false,
      loading: false,
      isDisabled: false,
      buttonText: 'Anfrage senden',
      showConfirmation: false,
      error: {
        status: false,
        message: '',
      },
      allCoaches: [],
      filteredCoaches: [],
      dialog: false,
      linkVal: this.$config.baseUrl + '/berater/' + this.$route.params.beratung,
      copied: false,
      pubData: undefined,
    }
  },
  async fetch() {
    if (
      this.$route.params.beratung === this.$store.getters['modules/user/uid']
    ) {
      this.pubData = this.$store.getters['modules/user/public']
    } else {
      this.pubData = (
        await this.$fire.firestore
          .collection('users')
          .doc(this.$route.params.beratung)
          .collection('public')
          .doc('data')
          .get()
      ).data()
      if (this.pubData === undefined) this.pubData = false
    }
  },
  fetchOnServer: false,
  computed: {
    coachName() {
      return this.pubData.firstName + ' ' + this.pubData.lastName
    },
  },
  methods: {
    sendRequest() {
      this.loading = true
      this.$fire.functions
        .httpsCallable('request-sendRequest')({
          coachName: this.coachName,
          message: this.msgTitle + ': ' + this.message,
          coachUID: this.$route.params.beratung,
          coachEmail: this.$store.getters['modules/user/private'].email,
          createdAt: new Date(),
          isDev: this.$config.isDev,
        })
        .then(() => {
          this.buttonText = 'versendet'
          this.loading = false
          this.showConfirmation = true
          this.isDisabled = true
        })
        .catch((err) => {
          this.error.status = true
          this.error.message = err.message
        })
    },
    copy() {
      const markup = this.$refs.link
      markup.focus()
      document.execCommand('selectAll', false, null)
      this.copied = document.execCommand('copy')
    },
  },
}
</script>
