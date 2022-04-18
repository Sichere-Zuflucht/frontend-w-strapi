<template>
  <div>
    <UtilsBanner icon="mdi-account-question-outline" />
    <v-container>
      <SharedVerificationPage :editprofil="false" />
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: 'authCoach',
}
</script>