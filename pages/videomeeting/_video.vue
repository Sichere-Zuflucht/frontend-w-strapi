<template>
  <div>
    <iframe
      v-if="!error404"
      allow="camera; microphone; fullscreen; display-capture; autoplay"
      :src="videoUrl"
      style="height: calc(100vh - 56px); width: 100vw; border: 0px"
    ></iframe>
    <div
      style="height: calc(100vh - 56px); width: 100vw"
      class="d-flex align-center justify-center"
    >
      <v-card
        max-width="300"
        ><v-card-title class="text-h1 error--text"><v-icon>alert</v-icon> Not Found </v-card-title
        ><v-card-text
          >Es existiert kein Videomeeting unter diesem Link. Bei Problemen
          können Sie sich jederzeit bei uns melden unter:
          <a href="mailto:kontakt@sichere-zuflucht.de"
            >kontakt@sichere-zuflucht.de</a
          ></v-card-text
        >
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoUrl: null,
      error404: false,
    };
  },
  async fetch() {
    this.$getVideoMeeting(this.$route.params.video)
      .then((vData) => {
        if (vData.data.length == 0) return (this.error404 = true);
        this.videoUrl = vData.data[0].attributes.videoCoach;
      });
  },
};
</script>
