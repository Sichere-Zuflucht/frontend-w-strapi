<template>
  <div>
    <v-sheet color="error d-flex justify-center">
      <v-icon size="60" class="pa-12" color="white">mdi-alert</v-icon>
    </v-sheet>
    <v-container>
      <h1 class="text-h1 error--text my-8">Fehler!</h1>
      <p>
        Es ist ein Fehler aufgetreten, bitte versuchen Sie sich erneut bei
        Stripe zu registrieren.
      </p>
      <v-btn to="/beratung/bezahlung" color="secondary" class="mb-8"
        >Zur Registrierung</v-btn
      >
      <p>
        Falls dies öfters passieren sollte, können Sie uns gerne unter
        <a href="mailto:kontakt@sichere-zuflucht.de"
          >kontakt@sichere-zuflucht.de</a
        >
        kontaktieren.
      </p>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Error',
}
</script>
