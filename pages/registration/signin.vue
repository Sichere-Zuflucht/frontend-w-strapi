<template>
  <UtilsSignupSignin :make-login="true" :title="isCreating ? 'Erfolgreich Registriert<br>Bitte Einloggen' : 'Einloggen'" />
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
  mounted(){
    const isCreating = window.localStorage.getItem("emailForSignIn");
  }
}
</script>
