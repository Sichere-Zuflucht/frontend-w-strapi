<template>
  <v-row v-if="meetings">
    <v-col  v-for="(meeting, n) in meetings" :key="n" class="text-center">
      {{meeting.message}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'InspirePage',
  data(){
    return {
      meetings: null
    }
  },
  async mounted() {
    const m = await this.$axios.$get('meetings').data
    this.meetings = m
    console.log(m)
  },
}
</script>
