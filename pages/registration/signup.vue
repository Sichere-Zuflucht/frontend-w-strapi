<template>
	<p>Aktuell ist keine Registrierung möglich.</p>
	<!--<UtilsSignupSignin />-->
</template>

<script>
	export default {
		middleware: 'authAlreadyLoggedin',
	};
</script>
