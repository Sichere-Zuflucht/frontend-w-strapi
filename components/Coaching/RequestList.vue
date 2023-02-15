<template>
  <div v-if="list != null">
    <v-expansion-panels v-if="list.length != 0">
      <v-expansion-panel v-for="(item, i) in list" :key="i">
          <CoachingRequestSingleTab v-if="!oldlist" :item="item.attributes" :id="item.id"/>
          <CoachingRequestSingleTab v-else-if="oldlist && showold" :item="item.attributes" postponed/>
      </v-expansion-panel>
    </v-expansion-panels>
    <p v-else-if="list.length == 0 && !oldlist" class="caption">
      <b>Noch keine existierenden Anfragen.</b><br />
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
  async mounted() {
    const res = (await this.$strapi.find("users-permissions/roles")).roles;
    res.forEach((role) => {
      if (role.type == "coach") this.roleTypes.push(role);
      if (role.type == "woman") this.roleTypes.push(role);
    });
  },
};
</script>