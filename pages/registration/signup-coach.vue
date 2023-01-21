<template>
  <UtilsSignupSignin title="Als Berater*in Registrieren" buttonText="Registrieren, um Online-Beratung zu erhalten?" buttonLink="/registration/signup"/>
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
}
</script>