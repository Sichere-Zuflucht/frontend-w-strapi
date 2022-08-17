<template>
  <v-app>
    <v-app-bar app>
      <v-row no-gutters align-content="center">
        <v-col cols="12"  align-self="center"
          ><v-toolbar-title class="pa-0 d-flex justify-center"
            ><v-btn to="/" nuxt exact text plain :ripple="false"
              ><v-img
                contain
                width="200"
                src="/Sichere-Zuflucht-Logo.svg" /></v-btn></v-toolbar-title
        ></v-col>
      </v-row>
    </v-app-bar>
    <v-card
      dark
      color="red"
      width="70"
      style="position: fixed; bottom: 50px; right: 0; z-index: 100"
      href="https://www.brigitte.de/"
      tile
    >
      <v-card-text class="pa-1 d-flex flex-column align-center">
        <v-icon small>mdi-eye-off</v-icon>
        <p style="font-size: 10px; line-height: 10px" class="text-center mb-0">
          Seite verstecken
        </p>
      </v-card-text>
    </v-card>
    <v-main style="hyphens: auto" class="pb-0">
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
}
</script>
