<template>
  <div>
    <h2 class="text-h2 text-center primary--text my-6">Unsere Angebote</h2>
    <v-row
      ><v-col
        v-for="(offer, i) in offers"
        :key="i"
        cols="12"
        :md="wrap ? '12' : '6'"
      >
        <v-card style="overflow: hidden"
          ><v-row
            ><v-col cols="4" class="pa-0"
              ><v-img
                :src="offer.img"
                width="100%"
                height="100%"
                cover /></v-col
            ><v-col cols="8" class="py-8 px-10"
              ><h3 class="text-h5 primary--text pb-4">{{ offer.title }}</h3>
              <p v-if="$strapi.user.roleName == 'coach'" class="caption pr-0">{{ offer.text }}</p>
              <p v-else class="caption pr-0">{{ offer.alternativText }}</p>
              
              <v-btn color="primary" outlined :to="offer.link" class="mb-3">{{
                offer.btntext
              }}</v-btn></v-col
            ></v-row
          ></v-card
        >
      </v-col></v-row
    >
  </div>
</template>
<script>
export default {
  props: {
    wrap: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      offers: [
        {
          title: 'Sichere Zuflucht-Magazin',
          text: 'Hier sammeln wir Erfahrungsberichte und Geschichten von betroffenen Frauen, um anderen Frauen Mut zu machen. Außerdem finden Sie hier Videos und Podcasts zum Thema häusliche Gewalt.',
          alternativText: 'Hier sammeln wir Erfahrungsberichte und Geschichten von betroffenen Frauen, um dir Mut zu machen. Außerdem findest du hier Videos und Podcasts zum Thema häusliche Gewalt.',
          img: '/le-buzz-tVnm9I9jb8I-unsplash.jpg',
          link: '/magazine',
          btntext: 'Zum Magazin',
        },
        {
          title: 'Berater*innen und Coaches',
          text: 'Schauen Sie sich gern um, welche Kolleg*innen noch ihre Hilfe anbieten.',
          alternativText: 'Schaue dich gerne um, welche Berater*innen dir noch zur Hilfe stehen.',
          img: '/le-buzz-tVnm9I9jb8I-unsplash.jpg',
          link: '/berater/suche',
          btntext: 'Berater*innen Übersicht',
        },
      ],
    }
  },
}
</script>
