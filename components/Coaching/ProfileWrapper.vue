<template>
  <v-card
    elevation="2"
    nuxt
    :ripple="false"
    width="300"
    class="d-flex flex-column pb-2"
  >
    <v-card-text class="pt-0 flex-grow-1 flex-shrink-0">
      <nuxt-link :to="'/berater/' + pubCoachData.username">
        <v-avatar color="primary" class="my-5" size="80"
          ><v-img 
            v-if="pubCoachData.avatar"
            :lazy-src="(pubCoachData.avatar.url.includes('https') ? '' : 'http://localhost:1337') + pubCoachData.avatar.url"
            :src="(pubCoachData.avatar.url.includes('https') ? '' : 'http://localhost:1337') + pubCoachData.avatar.url"
          /></v-avatar
      ></nuxt-link>
      <div class="d-flex flex-column justify-center">
        <nuxt-link
          :to="'/berater/' + pubCoachData.username"
          style="text-decoration: none"
          ><h2 class="secondary--text text-h2">
            {{ pubCoachData.displayName }}
          </h2>
          <h3 class="text-h5">
            {{ pubCoachData.profession }}
          </h3></nuxt-link
        >
      </div>
      <v-divider class="my-3" />
      <p class="font-weight-bold mb-1 mt-2 caption">Fachgebiet</p>
      <div class="d-flex flex-wrap">
        <v-chip outlined color="primary" class="mr-1 mb-1 caption">
          <p class="black--text ma-0 pa-0">{{ pubCoachData.topicArea }}</p>
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions class="my-4 flex-grow-0 flex-shrink-1">
      <v-btn absolute right color="primary" :to="'/berater/' + pubCoachData.username"
        >Profil ansehen</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Coaching',
  props: {
    pubCoachData: {
      type: Object,
      default: () => {},
    },
    response: {
      type: Object,
      default: () => {},
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      acceptText: this.response
        ? this.response.payed
          ? 'Bezahlt'
          : 'Bezahlen'
        : null,
      acceptLoading: false,
      acceptDisable: true,
      date: null,
      payButtonLoading: false,
      isDelete: false,
    }
  },
}
</script>
