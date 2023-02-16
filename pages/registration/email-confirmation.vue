<template>
  <v-row class="ma-0">
    <v-col cols="12" md="6" height="100%" class="pa-0">
      <v-sheet color="secondary" dark height="100%">
        <v-container style="max-width: 450px" class="ma-auto py-16">
          <h3 class="h2--text white--text text-uppercase pb-8">
            Dieses Fenster schließen.
          </h3>
          <p>Sie haben Ihre E-Mail-Adresse erfolgreich bestätigt. Sie können dieses Fenster schließen und sich über Ihren Browser einloggen.</p>
        </v-container>
      </v-sheet></v-col
    ><v-col cols="12" md="6" class="pa-0">
      <v-container style="max-width: 450px" class="ma-auto py-16">
        <h1 class="text-h1 my-4 primary--text">Email erfolgreich bestätigt!</h1>
        <v-btn to="/registration/signin" color="primary">Einloggen</v-btn>
      </v-container>
    </v-col></v-row
  >
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
}
</script>