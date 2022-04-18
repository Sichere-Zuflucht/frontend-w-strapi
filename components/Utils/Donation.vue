<template>
  <v-row style="max-width: 1185px" class="mx-auto pa-0 pa-md-8 mb-md-16">
    <v-col cols="12" md="6" class="pa-0">
      <v-img
        src="/teaser-spenden.jpg"
        class="pa-8 d-flex align-center justify-center"
        max-height="300"
      >
        <div v-if="!$vuetify.breakpoint.mdAndUp">
          <h2 class="white--text text-h2 text-center">
            Sie möchten uns unterstützen!
          </h2>
          <p
            class="caption white--text text-center mx-auto pt-4"
            style="max-width: 300px"
          >
            Sichere Zuflucht ist ein Team aus Freiwilligen. Dieses Hilfsangebot
            entwickeln wir in unserer Freizeit und finanzieren es aus unseren
            privaten Mitteln. Deshalb sind wir für jede Spende dankbar!
          </p>
          <UtilsBtn text="Jetzt spenden" classname="py-2" link="spenden" />
        </div>
      </v-img> </v-col
    ><v-col v-if="$vuetify.breakpoint.mdAndUp" cols="12" md="6" class="pa-0"
      ><v-sheet
        color="primary"
        height="100%"
        class="d-flex flex-column justify-center"
      >
        <h2 class="white--text text-h2 text-center">
          Sie möchten uns unterstützen!
        </h2>
        <p
          class="caption white--text text-center mx-auto pt-4"
          style="max-width: 300px"
        >
          Sichere Zuflucht ist ein Team aus Freiwilligen. Dieses Hilfsangebot
          entwickeln wir in unserer Freizeit und finanzieren es aus unseren
          privaten Mitteln. Deshalb sind wir für jede Spende dankbar!
        </p>
        <UtilsBtn
          text="Jetzt spenden"
          classname="py-2"
          link="spenden" /></v-sheet
    ></v-col>
  </v-row>
</template>
