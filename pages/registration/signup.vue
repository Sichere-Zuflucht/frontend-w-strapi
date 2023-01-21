<template>
  <UtilsSignupSignin title="Registrieren, um Online-Beratung zu erhalten" />
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
}
</script>