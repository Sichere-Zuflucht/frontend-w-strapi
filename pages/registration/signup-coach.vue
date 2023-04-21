<template>
	<UtilsSignupSignin
		title="Als Berater*in Registrieren"
		subtitle="Die Registrierung kann einige Zeit beanspruchen. Bitte planen Sie Zeit ein, um ein Profil sowie eine Bezahlung einzurichten."
		buttonText="Registrieren, um Online-Beratung zu erhalten?"
		buttonLink="/registration/signup"
	/>
</template>

<script>
	export default {
		middleware: 'authAlreadyLoggedin',
	};
</script>
