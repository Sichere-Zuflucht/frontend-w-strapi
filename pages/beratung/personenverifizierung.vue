<template>
  <div>
    <UtilsBanner icon="mdi-account-question-outline" />
    <v-container>
      <SharedVerificationPage :editprofil="false" :userdata="$strapi.user"/>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: 'authCoach',
}
</script>