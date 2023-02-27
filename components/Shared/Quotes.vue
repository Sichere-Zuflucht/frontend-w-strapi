<template>
  <v-sheet color="grey lighten-5">
    <v-container class="pt-12">
      <h2 class="text-h2 text-center secondary--text pt-4">
        Stimmen zu diesem Projekt
      </h2>
    </v-container>
    <v-carousel hide-delimiters height="auto" class="pb-12" :show-arrows="quotes.length > 1">
      <v-carousel-item v-for="(quote, n) in quotes" :key="n" class="px-4"
        ><v-row
          class="fill-height py-5 px-16 text-center black--text"
          align="center"
          justify="center"
          height="100%"
        >
          <p style="max-width: 500px">
            <i class="font-italic">"{{ quote.text }}"</i><br />
            <span class="caption">{{ quote.by }}</span>
          </p>
        </v-row></v-carousel-item
      ></v-carousel
    >
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      quotes: [
        {
          text: 'Ein Projekt wie dieses hätte mir geholfen, mich schneller aus der schwersten Zeit meines Lebens zu befreien. Es ist unbedingt notwendig, dass ein Anker wie dieser geschaffen wird!',
          by: 'Jessica Verfürth | Bosslady Consulting',
        },
      ],
    }
  },
}
</script>
