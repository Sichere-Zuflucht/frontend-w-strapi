<template>
	<div>
		<v-container class="py-md-8" style="min-height: calc(50vh - 74px)">
			<v-btn @click="login">Login</v-btn>
			<v-btn @click="me">me</v-btn>
			u: {{ user }}
			<v-btn @click="logout">logout</v-btn>
		</v-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				user: null,
			};
		},
		methods: {
			login() {
				this.$func.login({
					email: 'coach@zuio.de',
					password: 'zuiozui',
				});
			},
			async me() {
				this.user = await this.$func.me();
			},
			logout() {
				this.$func.logout();
			},
		},
	};
</script>
