<template>
  <v-row>
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="success" height="100%" dark>
        <v-container
          style="max-width: 450px; position: sticky; top: 100px"
          class="ma-auto"
        >
          <v-icon size="60" class="pb-4" color="white">mdi-check</v-icon>
          <h1 class="h2--text text-uppercase">Geschafft!</h1>
          <p>Ihr Stripe-Prozess war erfolgreich!</p>
          <v-btn to="/beratung" color="secondary">Zum Profil</v-btn>
        </v-container>
      </v-sheet></v-col
    >
    <v-col cols="12" md="6">
      <v-container>
        <SharedServiceOverview wrap class="py-16" /> </v-container></v-col
  ></v-row>
</template>

<script>
export default {
  name: "Approved",
  mounted() {
    if (this.$store.getters["getActiveUser"].roleName != "woman") {
      this.$getStripeAccData()
        .then((body) => {
          this.$console(body);
          //just proof, if account is valid due to having content
          if (body.data.capabilities) {
            this.$strapi.$users
              .update(this.$strapi.user.id, {
                stripe: {
                  payouts_enabled: body.data.payouts_enabled,
                  //id: body.data.id,
                  charges_enabled: body.data.charges_enabled,
                },
              })
              .then((newUser) => {
                this.$console(newUser);
                this.$store.dispatch("changeData", newUser);
              });
          }
        });
    } else {
      const meetingID = window.localStorage.getItem("meetingID");
      const sessionID = window.localStorage.getItem("sessionID");
      if (!sessionID) return;
      this.$getStripePaymentSession(sessionID)
        .then((sessionData) => {
          const data = {
            payed: sessionData.payment_status == "paid" ? true : false,
          };
          this.$strapi.$meetings
            .update(meetingID, {
              data,
            })
            .then(() => {
              window.localStorage.removeItem("meetingID");
              window.localStorage.removeItem("sessionID");
            });
        });
    }
  },
};
</script>
