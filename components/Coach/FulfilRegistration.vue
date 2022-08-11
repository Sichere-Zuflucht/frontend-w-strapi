<template>
  <div class="pt-4">
    <client-only v-if="userData">
      <v-alert v-if="!userData.topicArea" dark color="error">
        <v-row align="center">
          <v-col class="shrink">
            <v-icon>mdi-account-question</v-icon>
          </v-col>
          <v-col class="grow"> Es existiert noch kein Profil von Ihnen. </v-col>
          <v-col cols="12" sm="auto" class="shrink">
            <v-btn to="edit-profil" append>Profil anlegen</v-btn>
          </v-col>
        </v-row></v-alert
      >
      <v-alert v-if="!userData.stripe.payouts_enabled" dark color="error"
        ><v-row align="center">
          <v-col class="shrink">
            <v-icon>mdi-credit-card-off-outline</v-icon>
          </v-col>
          <v-col class="grow">
            Es wurde noch kein Stripe Account eingerichtet.
          </v-col>
          <v-col cols="12" sm="auto" class="shrink">
            <v-btn to="bezahlung" append>Stripe anlegen</v-btn>
          </v-col>
        </v-row></v-alert
      >

      <v-alert
        v-if="userData.verification != 'done'"
        dark
        color="error"
      >
        <v-row align="center">
          <v-col class="shrink">
            <v-icon>mdi-account-clock</v-icon>
          </v-col>
          <v-col class="grow">
            Sie wurden von uns noch nicht verifiziert.
          </v-col>
          <v-col cols="12" sm="auto" class="shrink">
            <v-btn to="personenverifizierung" append
              >Verifizierung ansehen</v-btn
            >
          </v-col>
        </v-row></v-alert
      >
      <p
        v-if="
          !userData.topicArea && !userData.stripe.payouts_enabled && userData.verification != 'done'
        "
        class="caption"
      >
        Solange Sie nicht
        {{
          userData.verification != 'done'
            ? 'von uns verifiziert wurden, '
            : null
        }}{{
          !userData.stripe.payouts_enabled
            ? 'Stripe eingerichtet haben, '
            : null
        }}
        {{ !userData.info ? 'Profildaten eingerichtet haben, ' : null }}
        ist Ihr Profil nicht öffentlich einsehbar und somit können auch keine
        Anfragen an Sie gestellt werden.
      </p>
    </client-only>
  </div>
</template>

<script>
export default {
  computed: {
    userData() {
      return this.$store.getters['getActiveUser']
    },
  },
}
</script>
