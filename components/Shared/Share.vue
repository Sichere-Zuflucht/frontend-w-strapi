<template>
  <div :class="'d-flex flex-wrap justify-' + justify">
    <v-btn
      icon
      href="https://www.facebook.com/sichere.zuflucht"
      target="_blank"
      :color="color ? '#3b5998' : null"
      ><v-icon>mdi-facebook</v-icon>
    </v-btn>
    <v-btn
      icon
      href="https://twitter.com/SichereZuflucht"
      target="_blank"
      :color="color ? '#1DA1F2' : null"
      ><v-icon>mdi-twitter</v-icon>
    </v-btn>
    <v-btn
      icon
      href="https://www.instagram.com/sicherezuflucht/"
      target="_blank"
      :color="color ? '#C13584' : null"
      ><v-icon>mdi-instagram</v-icon>
    </v-btn>
    <!--<v-btn icon href="https://www.youtube.com/" target="_blank"
          ><v-icon>mdi-youtube</v-icon>
        </v-btn>-->
  </div>
</template>

<script>
export default {
  props: {
    justify: {
      type: String,
      default: 'center',
    },
    color: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
