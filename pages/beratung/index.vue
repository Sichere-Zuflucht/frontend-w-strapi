<template>
  <v-container v-if="user">
    <client-only>
      <p class="caption mb-0 font-weight-bold">Hallo</p>
      <h1 v-if="user" class="text-h1 secondary--text">
        {{ user.displayName }}
      </h1>
    </client-only>
    <CoachFulfilRegistration />
    <div
      v-if="
        user.topicArea &&
        stripeEnabled &&
        user.verification == 'done'
      "
    >
      <h2 class="primary--text mb-2">Anfragen</h2>

      <CoachingRequestList :user="user" />
      <div class="my-8 d-flex justify-center">
        <v-btn text color="grey" @click="showOld = !showOld"
          >vergangene Termine {{ showOld ? "verbergen" : "anzeigen" }}</v-btn
        >
      </div>
      <CoachingRequestList :user="user" :oldlist="true" :showold="showOld" />
    </div>
    <div v-else><v-skeleton-loader
          type="article"
    ></v-skeleton-loader></div>
  </v-container>
</template>

<script>
export default {
  middleware: "authCoach",
  data() {
    return {
      showOld: false,
      stripeEnabled: null,
    };
  },
  async mounted(){
    this.stripeEnabled = (await this.$getStripeAccData()).data.payouts_enabled
  },
  computed: {
    user() {
      return this.$store.getters["getActiveUser"];
    },
  },
};
</script>
