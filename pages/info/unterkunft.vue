<template>
  <div>
    <div style="position: relative">
      <div
        class="d-flex align-center justify-center"
        style="
          position: absolute;
          background-color: black;
          opacity: 0.5;
          width: 100%;
          height: 100%;
          z-index: 1;
        "
      >
        <h2 class="text-h1 white--text">in Arbeit</h2>
      </div>
      <UtilsBanner url="kara-eads-L7EwHkq1B2s-unsplash.jpeg" />
    </div>
    <v-sheet color="grey lighten-5"
      ><v-container class="text-center">
        <h1 class="text-h1 primary--text pt-8">SIE KÖNNEN HELFEN!</h1>
        <h2 class="text-h1 secondary--text pb-8">
          BIETEN SIE FRAUEN UND IHREN KINDERN EINE
          <br />SICHERE ZUFLUCHT.
        </h2>
        <div style="max-width: 600px" class="ma-auto">
          <p class="font-weight-bold">
            Aktuell bieten wir keine Unterkünfte an!<br />Perspektivisch wollen
            wir dies aber tun, deshalb suchen wir hier hilfsbereite
            Unterkunftsbesitzer*innen.
          </p>
          <p>
            Häufig ist Frauen schon geholfen, wenn sie wenigstens für kurze Zeit
            die Möglichkeit haben sich von ihrem Zuhause – und damit auch vom
            gewalttätigen Partner – zu entfernen.
          </p>
          <p>
            Wir sammeln Unterkunftsangebote in unserem Portal, um sie in Zukunft
            bei Bedarf Frauen in Not zur Verfügung stellen zu können.
          </p>
          <p>
            Nur Frauen, von deren Partnern keine Gefahr für Dritte ausgeht,
            können wir in eine Unterkunft vermitteln. Deshalb schauen wir uns
            die Frau und ihre Situation im Vorfeld genau an.
          </p>
        </div>
      </v-container></v-sheet
    >
    <v-container class="pb-16">
      <h2 class="text-h2 secondary--text text-center pt-16 pb-4">
        WELCHE UNTERKÜNFTE SIND GEEIGNET?
      </h2>
      <p class="pb-4 text-center">
        Egal ob Ferienhaus, Ferienwohnung, Bungalow, soziale Einrichtung,
        Appartements, kirchliche Wohnungen usw. Alles kann als Zuflucht
        funktionieren.
      </p>
      <v-row>
        <v-col v-for="(h, i) in houses" :key="i" cols="6" md="3">
          <v-card
            ><v-img :src="h.img" /><v-card-text
              class="subtitle-1 primary--text"
              >{{ h.title }}</v-card-text
            ></v-card
          >
        </v-col>
      </v-row>
      <h3 class="text-h3 text-center primary--text pt-16 pb-4">
        FÜR DIE SICHERHEIT IST WICHTIG:
      </h3>
      <ul class="font-weight-bold">
        <li>Die Unterkunft muss separat abschließbar sein</li>
        <li>
          Küche, Bad und Waschmaschine müssen sich innerhalb der abschließbaren
          Unterkunft befinden.
        </li>
        <li>
          Die Mietdauer beträgt mind. 14 Tage und kann bis zu 6 Monaten aber
          auch gern länger dauern. Sie entscheiden.
        </li>
        <li>
          Am schönsten wäre es dauerhafte Unterkünfte für Frauen und ihre Kinder
          finden zu können.
        </li>
      </ul>
      <p class="text-center pt-8">Sie wollen Ihre Unterkunft anbieten?</p>
      <UtilsBtn
        text="Schreiben Sie uns"
        link="mailto:kontakt@sichere-zuflucht.de"
        classname="pt-0"
        mailto
      />
    </v-container>
    <v-sheet color="grey lighten-5">
      <v-container class="py-16">
        <h2 class="text-h2 secondary--text text-center pb-4">IHRE VORTEILE</h2>
        <ul>
          <li>Sie können jemandem direkt helfen</li>
          <li>
            Als Ferienwohnungs-besitzer*in haben Sie keinen zusätzlichen Aufwand
          </li>
          <li>
            Sichere Zuflucht kann parallel zur touristischen Vermietung laufen
          </li>
        </ul>
      </v-container>
    </v-sheet>
    <SharedTargetGroup />
    <p class="text-center pt-8">Sie wollen Ihre Unterkunft anbieten?</p>
    <UtilsBtn
      text="Schreiben Sie uns"
      link="mailto:kontakt@sichere-zuflucht.de"
      classname="pb-16"
      mailto
    />
    <UtilsDonation />
    <SharedQuotes />
  </div>
</template>

<script>
export default {
  data() {
    return {
      houses: [
        {
          img: 'gleren-meneghin-VSLPOL9PwB8-unsplash.png',
          title: 'Stadtwohnung',
        },
        {
          img: 'adriana-carles-rSrpSgocsm0-unsplash.png',
          title: 'Bungalow',
        },
        {
          img: 'adriana-carles-rSrpSgocsm-1.png',
          title: 'kirchliche Räume',
        },
        {
          img: 'adriana-carles-rSrpSgocsm-2.png',
          title: 'große Wohnung',
        },
      ],
    }
  },
}
</script>
