<template>
  <v-container>
    <h2 class="text-h2 secondary--text text-center py-8">
      An wen richtet sich Sichere Zuflucht?
    </h2>
    <p class="text-center pb-0 mb-0 mx-auto">
      Jede von Gewalt betroffene Frau – <b>egal</b> in welchem <b>Alter</b>,
      welcher <b>Herkunft</b> oder <b>Religion</b>, unabhängig von
      <b>Bildungsstand</b> und <b>Einkommen</b> – verdient ein für sie leicht
      erreichbares <b>Unterstützungsangebot.</b>
    </p>
    <v-slide-group show-arrows class="pt-4 mx-auto" style="max-width: 1000px">
      <v-slide-item v-for="(example, i) in allExamples" :key="i" class="my-4">
        <v-card width="150" class="mx-2">
          <v-img :src="example.src" />
          <v-card-text class="text-center">
            <p class="subtitle-2 primary--text mb-1">{{ example.name }}</p>
            <p class="caption mb-0">{{ example.job }}</p>
          </v-card-text>
        </v-card></v-slide-item
      ></v-slide-group
    >
    <p class="caption pt-3 text-center grey--text">
      Diese Frauen und Kinder stehen beispielhaft für die Vielfalt aller
      betroffenen.
    </p></v-container
  >
</template>

<script>
export default {
  data() {
    return {
      allExamples: [
        {
          src: 'beispiel-frau-1.jpg',
          name: 'Katrin (30) + Leni (3) ',
          job: 'Krankenschwester ',
        },
        {
          src: 'beispiel-frau-2.jpg',
          name: 'Heidi (73) ',
          job: 'Rentnerin ',
        },
        {
          src: 'beispiel-frau-3.jpg',
          name: 'Angelika (43) ',
          job: 'Anwältin ',
        },
        {
          src: 'beispiel-frau-4.jpg',
          name: 'Nasrin (17) ',
          job: 'Abiturientin',
        },
        {
          src: 'beispiel-frau-5.jpg',
          name: 'Sanya (34) + Sam (8) ',
          job: 'Köchin ',
        },
        {
          src: 'beispiel-frau-6.jpg',
          name: 'Llian (29) + Xi (4)',
          job: 'Sekretärin',
        },
      ],
    }
  },
}
</script>
