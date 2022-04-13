<template>
  <v-row v-if="meetings">
    <v-col  v-for="(meeting, n) in meetings" :key="n" class="text-center">
      {{meeting.attributes.message}}
    </v-col>
  </v-row>
</template>

<script>
export default {
  middleware: 'auth',
  data(){
    return {
      meetings: null
    }
  },
  async mounted() {
    const {data} = await this.$strapi.$meetings.find()
    this.meetings = data
    console.log(data)
  },
}
</script>
