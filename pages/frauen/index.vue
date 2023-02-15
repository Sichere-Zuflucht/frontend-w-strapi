<template>
  <v-sheet class="pb-0">
    <v-sheet color="secondary pa-8">
      <h1 class="text-h1 white--text">
        Willkommen bei<br />Sichere Zuflucht
      </h1>
    </v-sheet>
    <div v-if="responses">
      <v-container v-if="responses.length > 0">
        <h2 class="text-h4 font-weight-bold primary--text mb-3">
          Deine Korrespondenz
        </h2>
        <v-btn outlined color="primary" @click="loadMeetings"><v-icon small class="mr-1">mdi-update</v-icon>Nach Updates
          suchen</v-btn>
      </v-container>
      <v-sheet class="mx-auto">
        <v-slide-group :show-arrows="responses.length > 1" class="px-1 pb-4">
          <v-slide-item v-for="(response, i) in upcomingResponses" :key="i">
            <CoachingContactStatus :coach="response.coach" :response="response.attributes" :id="response.id"
              :clickable="false" @cancel="cancel(response)" />
          </v-slide-item>
        </v-slide-group>
        <div v-if="oldResponses.length > 0" class="d-flex align-center">
          <v-btn text class="mx-auto" @click="showOld = !showOld">Alte Anfragen {{ !showOld ? 'anzeigen': 'verbergen' }}</v-btn>
        </div>

        <v-slide-group v-if="showOld" :show-arrows="responses.length > 1" class="px-1 pb-4">
          <v-slide-item v-for="(response, i) in oldResponses" :key="i">
            <CoachingContactStatus :coach="response.coach" :response="response.attributes" :id="response.id"
              :clickable="false" oldlist @cancel="cancel(response)" />
          </v-slide-item>
        </v-slide-group>
      </v-sheet>
      <UtilsBtn v-if="responses.length != 0" text="Beratungsangebote ansehen" link="/berater" />
    </div>
    <v-container v-else-if="responses == null">
      <v-sheet elevation="2" class="pa-2">
        <v-skeleton-loader class="mx-auto" max-width="300"
          type="list-item-avatar, list-item-three-line, list-item-three-line, actions"></v-skeleton-loader>
      </v-sheet>
    </v-container>
    <v-sheet color="blue-grey lighten-5">
      <v-container>
        <v-alert v-model="newWoman" type="success" color="success" icon="mdi-check" dismissible>Geschafft! Ab jetzt sind
          alle Angebote von Sichere Zuflucht frei
          zugänglich.</v-alert>
        <SharedServiceOverview />
      </v-container>
    </v-sheet>
  </v-sheet>
</template>

<script>
export default {
  middleware: "authWoman",
  data() {
    return {
      userData: null,
      coachDeleted: false,
      responses: null,
      offers: [
        {
          title: "Sichere Zuflucht-Magazin",
          img: "le-buzz-tVnm9I9jb8I-unsplash.jpg",
          link: "/magazine",
          btntext: "Zum Magazin",
        },
        {
          title: "Berater*innen und Coaches",
          img: "le-buzz-tVnm9I9jb8I-unsplash.jpg",
          link: "/berater",
          btntext: "Berater*innen Übersicht",
        },
      ],
      newWoman: false,
      showOld: false,
    };
  },
  async mounted() {
    this.loadMeetings()

    this.newWoman = window.localStorage.getItem("newWoman");
    window.localStorage.removeItem("newWoman");
  },
  computed: {
    upcomingResponses(){
      return this.responses.filter(r => {
        if (r.attributes.acceptedDate){
          const startTime = new Date(r.attributes.acceptedDate)
          const endTime = (new Date).setTime(startTime.getTime() + 60*60*1000);
          const now = new Date
          return now < endTime
        }
        return true
      })
    },
    oldResponses(){
      return this.responses.filter(r => {
        if (r.attributes.acceptedDate){
          const startTime = new Date(r.attributes.acceptedDate)
          const endTime = (new Date).setTime(startTime.getTime() + 60*60*1000);
          const now = new Date
          return now >= endTime
        }
        return false
      })
    },
  },
  methods: {
    cancel(response) {
      this.responses = this.responses.filter((r) => r !== response);
    },
    loadMeetings() {
      this.responses = null
      this.$strapi.$meetings
        .find({
          populate: "users_permissions_users, suggestions",
          "filters[users_permissions_users]": this.$strapi.user.id,
        })
        .then(async (res) => {
          //if Coach still existed and didn't deleted the account, search for coach
          const collection = []
          res.data.forEach((response) => {
            if (!response.attributes.users_permissions_users.data[1])
              return collection.push({
                coach: { noCoach: true },
                ...response,
              });
            this.$strapi.$users
              .find({
                populate: "avatar",
                "filters[id]":
                  response.attributes.users_permissions_users.data[1].id,
              })
              .then((thisCoach) => {
                const coach = thisCoach[0];
                collection.push({
                  coach,
                  ...response,
                });
              });
          });
          const oldCollection = collection;
          this.responses = oldCollection.sort((a, b) => {
            return a.createdAt._seconds - b.createdAt._seconds;
          });
        });
    }
  },
};
</script>
