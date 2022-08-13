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
        user.stripe.payouts_enabled &&
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
  </v-container>
</template>

<script>
export default {
  middleware: "authCoach",
  data() {
    return {
      showOld: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters["getActiveUser"];
    },
  },
};
</script>
