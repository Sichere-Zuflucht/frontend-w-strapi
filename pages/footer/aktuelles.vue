<template>
  <div>
    <v-row v-if="!ready && functionalCookieAccepted"
      ><v-col v-for="n in 4" :key="n" cols="12" md="3"
        ><v-card>
          <v-skeleton-loader
            class="mx-auto"
            max-width="300"
            type="card-avatar, article"
          ></v-skeleton-loader></v-card></v-col
    ></v-row>
    <div style="height: calc(100vh - 64px)">
      <iframe
        v-if="functionalCookieAccepted"
        class="airtable-embed"
        src="https://airtable.com/embed/shra2cMAHkEFvtgfI?backgroundColor=yellow&viewControls=on"
        frameborder="0"
        onmousewheel=""
        width="100%"
        height="100%"
        style="background: transparent; border: 1px solid #ccc"
        :onload="(ready = true)"
      ></iframe>
      <UtilsBanner v-if="!functionalCookieAccepted" icon='mdi-cookie-alert' />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ready: false,
    }
  },
  computed: {
    functionalCookieAccepted(){return this.$functionalCookieAccepted()},
  }
}
</script>
