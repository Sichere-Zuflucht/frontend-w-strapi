<template>
	<v-row class="ma-0">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" dark height="100%">
				<v-container
					style="max-width: 450px; position: sticky; top: 100px"
					class="ma-auto"
				>
					<h1 class="text-h2 white--text text-uppercase pb-8">
						SCHÖN, DASS DU DA BIST! <br />DU KANNST DIREKT LOSLEGEN.
					</h1>
					<p>{{ email }}</p>
					<p>Bitte schließe als erstes deine Registrierung ab.</p>
					<v-icon large>mdi-arrow-right-thin</v-icon></v-container
				></v-sheet
			></v-col
		><v-col cols="12" md="6" class="pa-0">
			<v-container>
				<v-stepper v-model="stepper" elevation="0">
					<v-stepper-header style="box-shadow: none">
						<v-stepper-step
							step="1"
							:complete="stepper > 1"
							:editable="stepper > 1 && stepper < 2"
							:color="stepper > 1 ? 'success' : 'primary'"
						>
							Benutzername
						</v-stepper-step>
						<v-divider />
						<v-stepper-step step="2" :complete="stepper > 2">
							Verifizierung
						</v-stepper-step>
					</v-stepper-header>
					<v-stepper-items>
						<v-stepper-content step="1">
							<h2 class="text-h2 secondary--text pb-4">Anmeldung</h2>
							<p>
								Ihr Vor- und Nachname werden in Ihrem Profil öffentlich sichtbar
								sein.
							</p>
							<v-form
								ref="form"
								v-model="validMem"
								class="pt-8"
								autocomplete="on"
								@submit.prevent="updateProfile"
							>
								<v-text-field
									v-model="firstName"
									class="secondary--text font-weight-bold"
									:rules="rules.textRules"
									label="Vorname"
									type="name"
									name="fname"
									autocomplete="given-name"
								></v-text-field>
								<v-text-field
									v-model="lastName"
									class="secondary--text font-weight-bold"
									:rules="rules.textRules"
									label="Nachname"
									type="name"
									name="lname"
									autocomplete="family-name"
								></v-text-field>
								<v-btn
									color="secondary"
									class="mt-4"
									style="float: right"
									:loading="loading"
									:disabled="!validMem"
									@click="updateProfile"
									>Weiter</v-btn
								></v-form
							>
						</v-stepper-content></v-stepper-items
					>
					<v-stepper-items>
						<v-stepper-content step="2">
							<SharedVerificationPage
								editprofile
								:userdata="userdata"
							/> </v-stepper-content
					></v-stepper-items>
				</v-stepper>
				<v-alert v-if="alert.isActive" type="alert" color="error">{{
					alert.message
				}}</v-alert>
			</v-container></v-col
		></v-row
	>
</template>

<script>
	export default {
		name: 'UpdateProfile',
		middleware: 'authNew',
		data() {
			return {
				validMem: false,
				stepper: 1,
				email: null, //this.$store.getters['modules/user/user'].claims.email,
				lastName: null,
				firstName: null,
				rules: {
					textRules: [
						// (v) => !!v || 'Bitte ausfüllen',
						(v) => (v && v.length >= 3) || 'mind. 3 Zeichen lang',
					],
					passwordRules: [
						(v) =>
							/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/.test(
								v
							) || 'Ihr Passwort erfüllt nicht alle Vorgaben.',
					],
					passwordRules2: [
						(v) => !!v || 'Passwortüberprüfung nicht vergessen',
						(v) =>
							(!!v && v === this.password) ||
							'Passwörter müssen übereinstimmen',
					],
				},
				password: '',
				hidePassword: true,
				password2: '',
				showError: false,
				loading: false,
				roleTypes: [],
				userdata: null,
				alert: {
					isActive: false,
					message: '',
				},
			};
		},
		async mounted() {
			// on the register function its not possible (any more?!) to add the variable roleName -> maybe change to role: authenticated
			if (this.$strapi.user.roleName != 'authenticated') {
				if (this.$strapi.user.roleName == 'woman') this.$router.push('/frauen');
				this.userdata = this.$store.getters['getActiveUser'];
				this.stepper = 2;
			}
			this.email = this.$store.getters['getActiveUser'].email;
		},
		methods: {
			updateProfile() {
				this.loading = true;
				const d = new Date();

				var username =
					this.firstName.toLowerCase().replace(' ', '-') +
					'-' +
					this.lastName.toLowerCase().replace(' ', '-');
				this.$strapi
					.count('users', {
						username: username,
					})
					.then(async (res) => {
						this.$console('res', res);
						username = res == 0 ? username : username + '-' + res++;

						var getCoach = null;
						const roles = (await this.$strapi.find('users-permissions/roles'))
							.roles;
						roles.forEach((role) => {
							if (role.type == 'coach') getCoach = role;
						});

						const data = {
							roleName: 'coach',
							role: getCoach.id,
							displayName: this.firstName + ' ' + this.lastName,
							username: username,
						};

						this.$strapi.$users
							.update(this.$strapi.user.id, data)
							.then((newU) => {
								this.$console('newU', newU);
								this.alert.isActive = false;
								this.$store.dispatch('changeData', newU).then(() => {
									this.loading = false;
									this.userdata = this.$store.getters['getActiveUser'];
									this.stepper++;
								});
							})
							.catch((err) => {
								this.alert.isActive = true;
								this.alert.message = err.response.data.error.message;
								this.loading = false;
								this.$store.dispatch('errorhandling', err);
							});
					});
			},
		},
	};
</script>
