<template>
	<UtilsSignupSignin />
</template>

<script>
	export default {
		middleware: 'authAlreadyLoggedin',
	};
</script>
