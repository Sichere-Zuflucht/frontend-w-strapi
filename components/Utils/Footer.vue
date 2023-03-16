<template>
  <v-footer inset app class="d-flex flex-column mt-0 pt-8" style="position: relative">
    <v-icon color="primary">mdi-heart</v-icon>
    <p class="text-uppercase primary--text">du bist nicht allein!</p>
    <v-row class="pa-2 caption" style="width: 100%"><v-col class="mt-6 d-flex align-center justify-center" cols="12"
        md="4">
        <div style="max-width: 300px">
          <p class="text-center">Partner</p>
          <v-row><v-col class="d-flex flex-column align-center"><v-img contain max-width="100"
                src="/partner/project-together-logo.png" /></v-col><v-col class="d-flex flex-column align-center"><v-img
                contain max-width="100" src="/partner/solution-enabler.png" /></v-col><v-col
              class="d-flex flex-column align-center"><v-img contain max-width="100"
                src="/partner/mompreneurs-logo.png" /></v-col></v-row>
        </div>
      </v-col>
      <v-col class="mt-6 d-flex align-center justify-center" cols="12" md="4">
        <div style="max-width: 300px">
          <p class="text-center">Diese Webseite und ihre Services sind sicher</p>
          <v-row><v-col cols="4" class="d-flex flex-column align-center"><v-img class="mb-2" width="30" contain
                src="/ssl-zertifiziert.svg" /><b style="line-height: 1em">SSL</b>zertifiziert</v-col><v-col cols="4"
              class="d-flex flex-column align-center"><v-img class="mb-2" width="30" contain
                src="/serverstandort-deutschland.svg" /><b
                style="line-height: 1em">Serverstandort</b>Deutschland</v-col><v-col cols="4"
              class="d-flex flex-column align-center"><v-img class="mb-2" width="50" contain src="/dsgvo.svg" />
              <b style="line-height: 1em">DSGVO</b>konform</v-col></v-row>
        </div>
      </v-col>
      <v-col class="mt-6 d-flex align-center justify-center" cols="12" md="4">
        <div style="max-width: 300px">
          <p class="text-center">Zahlungsanbieter</p>
          <v-img contain max-width="100" src="/partner/stripe.png" class="mx-auto" />
        </div>
      </v-col>
    </v-row>
    <v-row class="
        d-flex
        flex-wrap flex-column flex-sm-row
        align-center
        justify-center
      ">
      <v-img contain max-width="60" src="/android-chrome-512x512.png" class="mt-4 mb-8" />
    </v-row>
    <v-row class="
        d-flex
        flex-wrap flex-column flex-sm-row
        align-center
        justify-center
      ">
      <div class="d-flex flex-wrap flex-column flex-sm-row justify-center">
        <v-btn v-for="(item, i) in footer" :key="i" :to="item.to" text plain>
          <p v-text="item.title"></p>
        </v-btn>
      </div>
    </v-row>
    <v-row class="
        d-flex
        flex-wrap flex-column flex-sm-row
        align-center
        justify-center
        pb-4
      ">
      <SharedShare />
      <span class="mt-0 caption">&copy; {{ new Date().getFullYear() }} Sichere Zuflucht gemeinnützige
        GmbH</span>
    </v-row>
    <!--<v-banner v-if="!aktiveCookieBanner" color="primary" class="white--text" rounded
      style="position: fixed; bottom: 10px;">
      <v-avatar slot="icon" size="40">
        <v-icon icon="mdi-lock" color="white">
          mdi-cookie
        </v-icon>
      </v-avatar>

      Wir nutzen ausschließlich funktionale Cookies.


      <v-btn class="mx-4" @click="closeCookieBanner">
        Verstanden
      </v-btn>
    </v-banner>-->
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      footer: [
        {
          title: "Magazin",
          to: "/magazine",
        },
        {
          title: "Über uns",
          to: "/footer/ueber-uns",
        },
        {
          title: "Unterstützen",
          to: "/footer/spenden",
        },
        {
          title: "Impressum",
          to: "/footer/impressum",
        },
        {
          title: "Datenschutz",
          to: "/footer/datenschutz",
        },
        {
          title: "AGB",
          to: "/footer/agb",
        },
        {
          title: "Kontakt",
          to: "/footer/kontakt",
        },
        {
          title: "FAQ",
          to: "/footer/faq",
        },
       /*{
          title: "Hilfe",
          to: "/footer/hilfe",
        },*/
      ],
      aktiveCookieBanner: true
    };
  },
  mounted() {
    this.aktiveCookieBanner = (this.getCookieBanner('cookiebanner') === "true")
  },
  methods: {
    closeCookieBanner() {
      const d = new Date();
      d.setTime(d.getTime() + (14 * 24 * 60 * 60 * 1000));
      let expires = "expires=" + d.toUTCString();
      document.cookie = 'cookiebanner=true;' + expires + ";path=/";
      this.aktiveCookieBanner = true
    },
    getCookieBanner(cname) {
      let name = cname + "=";
      let decodedCookie = decodeURIComponent(document.cookie);
      let ca = decodedCookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }
};
</script>
