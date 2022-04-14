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
          <v-btn to="/profile" color="secondary">Zum Profil</v-btn>
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
  name: 'Approved',
}
</script>
