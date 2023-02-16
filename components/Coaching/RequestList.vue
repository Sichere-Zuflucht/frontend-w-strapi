<template>
  <div v-if="list != null">
    <v-expansion-panels v-if="list.length != 0">
      <v-expansion-panel v-for="(item, i) in upcomingResponses" :key="i">
          <CoachingRequestSingleTab v-if="!oldlist" :item="item.attributes" :id="item.id"/>
      </v-expansion-panel>
      <v-expansion-panel v-for="(item, i) in oldResponses" :key="i">
          <CoachingRequestSingleTab v-if="oldlist && showold" :item="item.attributes" oldlist/>
      </v-expansion-panel>
    </v-expansion-panels>
    <p v-else-if="list.length == 0 && !oldlist" class="caption">
      <b>Noch existieren keine Anfragen.</b><br />
      Sobald eine Frau eine Anfrage an Sie stellt, wird diese hier angezeigt.
    </p>
  </div>
  <v-sheet v-else-if="list == null && !oldlist" elevation="2" class="pa-2"
    ><v-skeleton-loader
      class="mx-auto"
      max-width="300"
      type="text, text, text, text"
    ></v-skeleton-loader
  ></v-sheet>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: null,
    },
    oldlist: {
      type: Boolean,
      default: false,
    },
    showold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      roleTypes: [],
    };
  },
  computed: {
    upcomingResponses(){
      return this.list.filter(r => {
        if (r.attributes.acceptedDate){
          const startTime = new Date(r.attributes.acceptedDate)
          const endTime = (new Date).setTime(startTime.getTime() + 60*60*1000);
          const now = new Date
          return now < endTime
        }
        return true
      })
    },
    oldResponses(){
      return this.list.filter(r => {
        if (r.attributes.acceptedDate){
          const startTime = new Date(r.attributes.acceptedDate)
          const endTime = (new Date).setTime(startTime.getTime() + 60*60*1000);
          const now = new Date
          return now >= endTime
        }
        return false
      })
    },
  },
  async mounted() {
    const res = (await this.$strapi.find("users-permissions/roles")).roles;
    res.forEach((role) => {
      if (role.type == "coach") this.roleTypes.push(role);
      if (role.type == "woman") this.roleTypes.push(role);
    });
  },
};
</script>