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
          :response="responses[0].attributes"
          :id="responses[0].id"
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
              :response="response.attributes"
              :id="response.id"
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
  middleware: "authWoman",
  data() {
    return {
      userData: null,
      coachDeleted: false,
      responses: [],
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
          link: "/berater/suche",
          btntext: "Berater*innen Übersicht",
        },
      ],
      newWoman: false,
      newDate: new Date(new Date().setHours(new Date().getHours() - 2)),
    };
  },
  async mounted() {
    this.$strapi.$meetings
      .find({
        populate: "users_permissions_users, suggestions",
        "filters[users_permissions_users]": this.$strapi.user.id,
      })
      .then(async (res) => {
        //if Coach still existed and didn't deleted the account, search for coach
        res.data.forEach((response) => {
          console.log('id', response.attributes.users_permissions_users.data[1])
          if (!response.attributes.users_permissions_users.data[1])
            return this.responses.push({
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
              this.responses.push({
                coach,
                ...response,
              });
            });
        });
        const oldRes = this.responses;
        this.responses = oldRes.sort((a, b) => {
          return a.createdAt._seconds - b.createdAt._seconds;
        });
      });

    this.newWoman = window.localStorage.getItem("newWoman");
    window.localStorage.removeItem("newWoman");
  },
  fetchOnServer: false,
  methods: {
    cancel(response) {
      this.responses = this.responses.filter((r) => r !== response);
    },
  },
};
</script>
