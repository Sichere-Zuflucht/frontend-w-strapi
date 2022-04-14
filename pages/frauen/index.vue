<template>
  <v-sheet class="pb-0">
    <v-sheet color="secondary pa-8"
      ><h1 class="text-h1 white--text">
        Willkommen bei<br />Sichere Zuflucht
      </h1></v-sheet
    >
    <div v-if="responses">
      <v-container v-if="responses.length > 0">
        <h2 class="text-h4 font-weight-bold primary--text mb-3">
          Deine Korrespondenz
        </h2>
      </v-container>
      <v-container v-if="responses.length === 1">
        <CoachingContactStatus
          :coach="responses[0].coach"
          :response="responses[0]"
          :clickable="false"
          @cancel="responses = []"
        />
      </v-container>
      <v-slide-group
        v-else-if="responses.length > 1"
        show-arrows
        class="px-1 pb-4"
      >
        <v-slide-item v-for="(response, i) in responses" :key="i">
          <div
            v-if="
              response.acceptedDate
                ? new Date(
                    response.acceptedDate.date +
                      ' ' +
                      response.acceptedDate.time
                  ) >= newDate
                : true
            "
            style="width: 95vw; max-width: 300px; padding: 5px"
          >
            <CoachingContactStatus
              :coach="response.coach"
              :response="response"
              :clickable="false"
              :now="
                response.acceptedDate
                  ? new Date(
                      response.acceptedDate.date +
                        ' ' +
                        response.acceptedDate.time
                    ) <= new Date()
                  : false
              "
              @cancel="cancel(response)"
            />
          </div>
        </v-slide-item>
      </v-slide-group>
      <!-- <v-container>
        <nuxt-link to="info-berater" text color="primary" small
          >Wie läuft das Beratungsgespräch ab?
        </nuxt-link>
        <br />
        <nuxt-link to="info-frauen" text color="primary" small
          >Infos zur Termineinhaltung
        </nuxt-link>
        <br />
        <nuxt-link to="info-frauen" text color="primary" small
          >Infos zu Preisen</nuxt-link
        >
      </v-container> -->
      <UtilsBtn
        v-if="responses.length != 0"
        text="Beratungsangebote ansehen"
        link="/berater/suche"
      />
    </div>
    <v-container v-else>
      <v-sheet elevation="2" class="pa-2">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="list-item-avatar, list-item-three-line, list-item-three-line, actions"
        ></v-skeleton-loader>
      </v-sheet>
    </v-container>
    <v-sheet color="blue-grey lighten-5">
      <v-container>
        <v-alert
          v-model="newWoman"
          type="success"
          color="success"
          icon="mdi-check"
          dismissible
          >Geschafft! Ab jetzt sind alle Angebote von Sichere Zuflucht frei
          zugänglich.</v-alert
        >
        <SharedServiceOverview />
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      userData: null,
      responses: null,
      offers: [
        {
          title: 'Sichere Zuflucht-Magazin',
          img: 'le-buzz-tVnm9I9jb8I-unsplash.jpg',
          link: '/magazine',
          btntext: 'Zum Magazin',
        },
        {
          title: 'Berater*innen und Coaches',
          img: 'le-buzz-tVnm9I9jb8I-unsplash.jpg',
          link: '/berater/suche',
          btntext: 'Berater*innen Übersicht',
        },
      ],
      newWoman: false,
      newDate: new Date(new Date().setHours(new Date().getHours() - 2)),
    }
  },
  async fetch() {
    // these responses contain only communication where this user was involved
    const responses = (
      await this.$fire.functions.httpsCallable('request-getRequests')()
    ).data
    // get the data for each coach and add it to the response
    // then push it to the responses list
    const res = await Promise.all(
      responses.map(async (response) => {
        const coach = (
          await this.$fire.firestore
            .collection('users')
            .doc(response.coachId)
            .collection('public')
            .doc('data')
            .get()
        ).data()
        return { coach, ...response }
      })
    )

    this.responses = res.sort((a, b) => {
      return a.createdAt._seconds - b.createdAt._seconds
    })
  },
  fetchOnServer: false,
  mounted() {
    this.newWoman = window.localStorage.getItem('newWoman')
    window.localStorage.removeItem('newWoman')
  },
  methods: {
    cancel(response) {
      this.responses = this.responses.filter((r) => r !== response)
    },
  },
}
</script>
