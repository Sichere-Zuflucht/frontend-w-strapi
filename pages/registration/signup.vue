<template>
  <UtilsSignupSignin title="Registrieren" />
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
}
</script>