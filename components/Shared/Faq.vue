<template>
  <div>
    <h3
      class="text-h3 text-uppercase secondary--text pt-16 pb-8 font-weight-bold"
    >
      HÄUFIGE FRAGEN
    </h3>
    <v-row class="pb-8"
      ><v-col v-if="price" cols="12" md="4"
        ><p class="caption font-weight-bold">Preise</p>
        <p v-for="(p, i) in priceQ" :key="i" class="caption">
          <nuxt-link :to="p.link">{{ p.text }}</nuxt-link>
        </p></v-col
      ><v-col v-if="onlinecoaching" cols="12" md="4"
        ><p class="caption font-weight-bold">Online-Beratung</p>
        <p v-for="(c, i) in onlinecoachQ" :key="i" class="caption">
          <nuxt-link :to="c.link">{{ c.text }}</nuxt-link>
        </p></v-col
      >
      <v-col v-if="forcoaches" cols="12" md="4"
        ><p class="caption font-weight-bold">Für Berater*innen</p>
        <p v-for="(c, i) in forcoachQ" :key="i" class="caption">
          <nuxt-link :to="c.link">{{ c.text }}</nuxt-link>
        </p></v-col
      ></v-row
    >
  </div>
</template>

<script>
export default {
  props: {
    price: {
      type: Boolean,
      default: false,
    },
    onlinecoaching: {
      type: Boolean,
      default: false,
    },
    forcoaches: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      priceQ: [
        {
          text: 'Was kostet eine Beratung?',
          link: '',
        },
        {
          text: 'Eine Beratung kostet 50 €. Jede Beratung dauert 50 Minuten.',
          link: '',
        },
        {
          text: 'Warum kosten alle Beratungen, unabhängig vom Thema, einheitlich 50 €?',
          link: '',
        },
        {
          text: 'Wie läuft das mit der Bezahlung ab?',
          link: '',
        },
        {
          text: 'Sichere Zuflucht behält einen prozentualen Anteil. Warum?',
          link: '',
        },
        {
          text: 'Wie erstelle ich ein Stripe-Konto?',
          link: '',
        },
      ],
      onlinecoachQ: [
        {
          text: 'Wie läuft die Terminfindung ab?',
          link: '',
        },
        {
          text: 'Wie ist das mit dem Datenschutz während der Online-Beratung?',
          link: '',
        },
        {
          text: 'Wer oder was ist Red?',
          link: '',
        },
        {
          text: 'Wer oder was ist jitsi?',
          link: '',
        },
      ],
      forcoachQ: [
        {
          text: 'Mit welcher Auslatung ist erstmal zu rechnen?',
          link: '',
        },
        {
          text: 'Wie kann ich meine Leistungen für Sichere Zuflucht steuerlich abrechnen?',
          link: '',
        },
      ],
    }
  },
}
</script>
