<template>
	<!---<UtilsSignupSignin :make-login="true" title="Einloggen" />-->
	<v-row class="ma-0">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" dark height="100%">
				<v-container style="max-width: 450px" class="ma-auto py-16">
					<h3 class="h2--text white--text text-uppercase pb-8">
						SICHERE ZUFLUCHT
					</h3>
					<UtilsOfferOverview />
				</v-container> </v-sheet
		></v-col>
		<v-col cols="12" md="6" class="pa-0">
			<v-container style="max-width: 450px" class="ma-auto py-16">
				<h1 class="text-h1 mt-4 primary--text">Passwort vergessen</h1>
				<v-form
					v-model="valid"
					style="width: 100%"
					class="mb-4"
					autocomplete="on"
					@submit.prevent="next"
				>
					<v-text-field
						v-model="email"
						type="email"
						:rules="rules.email"
						label="E-Mail-Adresse"
						required
						name="email"
						autocomplete="email"
					></v-text-field>
					<div class="d-flex justify-end pt-0">
						<v-btn plain class="grey--text" text to="/registration/signin"
							>Zum Login</v-btn
						><v-btn
							color="primary"
							:loading="loading"
							:disabled="!valid"
							@click="resetPassword"
							>Neues Passwort anfragen</v-btn
						>
					</div>
				</v-form>
				<v-alert
					v-if="success.status"
					type="success"
					color="success"
					class="my-4"
				>
					Die Anfrage wurde erfolgreich bearbeitet. In Kürze erhalten Sie eine
					eMail. Bitte folgen Sie den dort angegebenen Schritten.
				</v-alert>
				<v-alert v-if="error.status" type="info" color="secondary" class="my-4">
					{{ error.message }}
				</v-alert>
			</v-container>
		</v-col>
	</v-row>
</template>

<script>
	export default {
		middleware: 'authAlreadyLoggedin',
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
				success: {
					status: false,
				},
				loading: false,
			};
		},
		methods: {
			resetPassword() {
				this.loading = true;
				this.error.status = false;
				this.success.status = false;
				this.$func
					.forgotPassword({ email: this.email })
					.then(() => {
						this.loading = false;
						this.success.status = true;
					})
					.catch((error) => {
						this.error.status = true;
						this.error.message = error.code + ': ' + error.message;
						// ..
					});
			},
		},
	};
</script>
