<template>
	<div>
		<v-container class="py-md-8" style="min-height: calc(50vh - 74px)">
			<v-btn @click="login">Login</v-btn>
			u: {{ user }}
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
				this.$loginUser({
					email: 'woman@asdf.de',
					password: 'asdfasdf',
				}).then((userdata) => {
					console.log('userdata', userdata);
					this.user = userdata;
				});
			},
			async loadAllCoaches() {
				this.user = await this.$loadAllCoaches();
			},
		},
	};
</script>
