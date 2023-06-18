<template>
	<!---<UtilsSignupSignin :make-login="true" title="Einloggen" />-->
	<v-row class="ma-0">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" dark height="100%">
				<v-container style="max-width: 450px" class="ma-auto py-16">
					<h3 class="h2--text white--text text-uppercase pb-8">
						LOGIN<br />SICHERE ZUFLUCHT
					</h3>
					<UtilsOfferOverview />
				</v-container> </v-sheet
		></v-col>
		<v-col cols="12" md="6" class="pa-0">
			<v-container style="max-width: 450px" class="ma-auto py-16">
				<h1 class="text-h1 mt-4 primary--text">Einloggen</h1>
				<v-form
					v-model="valid"
					style="width: 100%"
					class="mb-4"
					autocomplete="on"
					@submit.prevent="next"
				>
					<h2 class="text-h3 secondary--text">E-Mail-Adresse</h2>
					<v-text-field
						v-model="email"
						type="email"
						:rules="rules.email"
						label="E-mail-Adresse"
						required
						name="email"
						autocomplete="email"
					></v-text-field>
					<v-text-field
						:disabled="!email"
						v-model="password"
						:rules="rules.password"
						label="Passwort"
						:type="hidePassword ? 'password' : 'text'"
						:append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
						name="current-password"
						required
						autocomplete="current-password"
						@click:append="() => (hidePassword = !hidePassword)"
					></v-text-field>
					<div class="d-flex justify-end pt-0">
						<v-btn plain class="grey--text" text to="/registration/signup"
							>Registrieren?</v-btn
						><v-btn
							color="primary"
							:loading="loading"
							:disabled="!valid"
							@click="login"
							>Einloggen</v-btn
						>
					</div>
				</v-form>
				<v-alert v-if="error.status" type="info" color="secondary" class="my-4">
					{{ error.message }}
				</v-alert>
			</v-container>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		data() {
			return {
				valid: false,
				email: '',
				password: '',
				hidePassword: true,
				rules: {
					email: [
						(v) => !!v || 'E-Mail ist erforderlich',
						this.$rules.email,
						/*(v) =>
							/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v) ||
							'E-Mail muss gültig sein',*/
					],
					password: [(v) => !!v || 'Password ist erforderlich'],
				},
				error: {
					status: false,
					message: '',
				},
				loading: false,
			};
		},
		methods: {
			login() {
				this.loading = true;
				if (!process.client) return;
				this.$func
					.login({
						email: this.email,
						password: this.password,
					})
					.catch((err) => {
						this.loading = false;
						this.error.status = true;
						this.error.message = err;
					});
			},
		},
	};
</script>
