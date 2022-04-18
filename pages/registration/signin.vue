<template>
  <UtilsSignupSignin :make-login="true" title="Einloggen" />
</template>

<script>
export default {
  middleware: 'authAlreadyLoggedin',
}
</script>
