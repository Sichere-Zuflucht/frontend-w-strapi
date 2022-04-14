<template>
  <div>
    <v-container class="py-md-8" style="min-height: calc(50vh - 74px)">
      <h1 class="text-h1 mb-4 text-center primary--text pt-12">
        Niemand muss <br />häusliche Gewalt aushalten.
      </h1>
      <h2 class="text-center secondary--text subtitle-1 mb-8 mb-md-12">
        Auch du nicht
      </h2>
      <p class="text-center mx-auto pb-md-8" style="max-width: 530px">
        Wir bieten <b>Frauen und ihren Kindern aus Gewaltbeziehungen</b> Hilfe
        in Form einer persönlichen Online-Beratung an.
      </p>
    </v-container>
    <v-img
      src="paige-cody-bOVZ_f3fbQM-unsplash.jpg"
      min-height="50vh"
      max-height="300px"
      :style="
        'border-bottom: 3px solid ' + $vuetify.theme.themes.light.secondary
      "
    ></v-img>
    <v-sheet color="grey lighten-5 py-md-16"
      ><v-container>
        <v-row
          ><v-col cols="12" md="6" class="text-center text-md-right">
            <h3 class="text-uppercase mb-4 secondary--text text-h1">
              <span style="font-size: 2.5em; line-height: 1em"
                >Wir<br />helfen<br />dir!</span
              >
            </h3>
            <p class="primary--text font-weight-bold">
              und lassen dich in deiner Situation nicht allein.
            </p>
            <p>
              Unsere Beratungsthemen:<b>
                <br />- Psychosoziale Beratung <br />- Rechtsberatung <br />-
                Coaching</b
              >
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="mx-auto" max-width="320">
              <v-img src="le-buzz-tVnm9I9jb8I-unsplash.jpg" height="200px" />

              <v-card-title
                class="text-h3 secondary--text font-weight-bold mb-2"
                >Beratung und Hilfe
              </v-card-title>

              <v-card-subtitle>
                in Form von <b>Online-Besprechungen</b> mit Fachleuten zu deinen
                Themen. Diese kannst du von überall ganz
                <b>einfach, sicher und anonym</b> mit deinem
                <b>Handy</b> machen.
                <v-btn color="secondary my-4" nuxt exact to="berater/suche">
                  Berater*innen ansehen
                </v-btn>
              </v-card-subtitle>
            </v-card></v-col
          ></v-row
        >
      </v-container>
    </v-sheet>
    <v-container class="pt-md-16">
      <h3
        class="text-h3 text-md-h1 text-uppercase text-center secondary--text pt-8"
        style="font-weight: bold"
      >
        Sichere Zuflucht-Magazin
      </h3>
    </v-container>
    <MagazineSlider :list="magazineList" :change="true" />
    <v-divider class="mt-md-8" />
    <v-container class="pt-16">
      <v-row style="max-width: 700px" class="mx-auto">
        <v-col cols="12" md="6" class="text-center text-md-right">
          <h3 class="text-uppercase mb-4 primary--text text-md-h1 pt-md-5">
            <span style="font-size: 3em; line-height: 1em">Helfen Sie mit</span>
          </h3>
          <p class="secondary--text font-weight-bold">
            und beraten Sie Frauen in Not.
          </p>
          <p>
            Sie können beraten in:
            <br /><b
              >- Psychosoziale Beratung <br />- Rechtsberatung <br />-
              Coaching</b
            >
          </p>
        </v-col>
        <v-col cols="12" md="6">
          <v-card class="mx-auto" max-width="320">
            <v-img src="AdobeStock_342417877.jpeg" height="200px"></v-img>

            <v-card-text
              ><h3 class="text-h3 primary--text font-weight-bold mb-2">
                Werden Sie ein Teil von<br />Sichere Zuflucht
              </h3>
              <p>
                Wir erweitern permanent unseren Pool an Berater*innen und freuen
                uns über alle, die
                <b>Frauen und ihre Kinder aktiv unterstützten</b> wollen.
              </p>
              <v-btn color="primary mt-2 mb-1" to="registration/signup">
                Als Berater*in registrieren
              </v-btn>
              <v-btn to="info-berater" class="secondary mb-1"
                >mehr erfahren</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" style="display: none">
          <v-card class="mx-auto" max-width="320">
            <v-img
              src="gleren-meneghin-VSLPOL9PwB8-unsplash.jpg"
              height="200px"
            ></v-img>

            <v-card-title class="text-h3 primary--text font-weight-bold mb-2"
              >Liebe Unterkunfsbesitzer*innen, helfen Sie mit!
            </v-card-title>

            <v-card-subtitle>
              Vermieten Sie Ihr Ferienhaus, -wohnung, -bungalow was auch immer –
              neben der touristischen Vermietung und helfen Sie so aktiv mit,
              Frauen und Kinder aus Gewaltsituationen heraus zu holen. Wir
              freuen uns auch besonders über dauerhafte Angebote wie
              Mietwohnungen.
              <v-btn
                color="primary my-4"
                href="mailto:kontakt@sichere-zuflucht.de"
              >
                Ich biete meine Unterkunft an
              </v-btn>
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <SharedQuotes />
    <UtilsDonation />
  </div>
</template>

<script>
export default {
  data() {
    return {
      magazineList: null,
      test: null,
    }
  },
  async mounted() {
    this.magazineList = (await this.$strapi.$magazines.find({'populate': '*'})).data
  },
}
</script>
