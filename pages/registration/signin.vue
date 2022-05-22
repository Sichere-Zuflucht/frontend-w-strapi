<template>
  <UtilsSignupSignin :make-login="true" :title="isCreating ? 
  `Erfolgreich Registriert
  Bitte Einloggen` : 'Einloggen'" />
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
  data(){
    return {
      isCreating: null,
    }
  },
  mounted(){
    this.isCreating = window.localStorage.getItem("emailForSignIn");
  }
}
</script>
