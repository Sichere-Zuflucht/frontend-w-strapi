<template>
  <v-slide-group :show-arrows="responses.length === 1 ? false : true" class="px-1 pb-4">
    <v-slide-item v-for="(response, i) in responses" :key="i">
      <div v-if="showold
        ? response.attributes.acceptedDate ? new Date(response.attributes.acceptedDate) >= newDate : false
        : response.attributes.acceptedDate ? new Date(response.attributes.acceptedDate) < newDate : true
      " style="width: 95vw; max-width: 300px; padding: 5px">
        <CoachingContactStatus :oldlist="oldlist" :showold="showold" :coach="response.coach" :response="response.attributes" :id="response.id"
          :clickable="false" :now="
            response.acceptedDate
              ? new Date(
                response.acceptedDate.date +
                ' ' +
                response.acceptedDate.time
              ) <= new Date()
              : false
          " @cancel="cancel(response)" />
      </div>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  props: {
    responses: {
      type: Array,
      default: [],
    },
    oldlist: {
      type: Boolean,
      default: false,
    },
    showold: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      newDate: new Date(new Date().setHours(new Date().getHours() - 2)),
    };
  },
  methods: {
    cancel(response) {
      this.responses = this.responses.filter((r) => r !== response);
    },
  },
};
</script>
