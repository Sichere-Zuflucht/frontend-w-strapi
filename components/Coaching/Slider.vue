<template>
  <v-slide-group v-if="!loading" show-arrows class="py-4">
    <v-slide-item v-for="(coaching, n) in allCoaches" :key="n" class="my-4">
      <CoachingProfileWrapper
        :pub-coach-data="coaching"
        :class="
          (n == 0
            ? 'ml-8 mr-2'
            : n == allCoaches.length - 1
            ? 'ml-2 mr-8'
            : 'mx-2') + ' my-2'
        "
      />
    </v-slide-item>
  </v-slide-group>
  <v-alert v-else-if="error.status" type="error">{{ error.text }}</v-alert>
  <div v-else class="d-flex">
    <v-card v-for="n in 3" :key="n" width="250" class="ma-2">
      <v-card-text
        ><v-skeleton-loader
          type="list-item-avatar, list-item-three-line" /></v-card-text
    ></v-card>
  </div>
</template>

<script>
export default {
  props: {
    withoutid: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      //allCoaches: [],
      loading: true,
      error: {
        status: false,
        text: '',
      },
    }
  },
  /*async asyncData({params, $strapi}){
    const allCoaches = await $strapi.$users
      .find({
        populate: "avatar",
        'filters[roleName]': 'coach',
        'filters[verification]': 'done',
      })
      .then((data) => {
        this.loading = false
        return data[0]
      })
    if(pubData === undefined) window.location.replace('/')
    const relatedCoaches = await $strapi.$users
      .find({
        populate: "avatar",
        "username_ncontains": params.beratung,
        "limit": 3,
      })
      .then((data) => data)
    console.log('relatedCoaches', relatedCoaches)
    return { allCoaches }
  },*/
  mounted() {
    this.withoutid 
      ? (
        this.$strapi.$users.find({
          populate: 'avatar',
          'filters[roleName]': 'coach',
          'filters[verification]': 'done',
          'filters[username][$ne]': this.withoutid ,
          'limit': 3,
        }).then((d) => {
          this.allCoaches = d
          /*d.forEach((single)=>{
            if (this.withoutid != single.id) this.allCoaches.push(single)
          })*/
          this.loading = false
        })
      ) : (
        this.$strapi.$users.find({
          populate: 'avatar',
          'filters[roleName]': 'coach',
          'filters[verification]': 'done',
        }).then((d) => {
          this.allCoaches = d
          /*d.forEach((single)=>{
            if (this.withoutid != single.id) this.allCoaches.push(single)
          })*/
          this.loading = false
        })
      )
  },
}
</script>

<style>
.v-slide-group__next,
.v-slide-group__prev {
  position: absolute;
  z-index: 2;
  height: 100%;
}
.v-slide-group__next {
  right: 0;
}
.v-slide-group__prev {
  left: 0;
}
</style>
