<template>
	<v-row class="ma-0" v-if="userdata">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" dark height="100%">
				<v-container
					style="max-width: 450px; position: sticky; top: 100px"
					class="ma-auto"
				>
					<h1 class="text-h2 white--text text-uppercase pb-8">
						SCHÖN, DASS DU DA BIST! <br />DU KANNST DIREKT LOSLEGEN.
					</h1>
					<p>{{ userdata.email }}</p>
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
							:editable="stepper > 1 && stepper < 3"
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
								v-model="valid.username"
								class="pt-8"
								autocomplete="on"
								@submit.prevent="() => stepper++"
							>
								<v-text-field
									v-model="input.firstName"
									class="secondary--text font-weight-bold"
									:rules="rules.textRules"
									label="Vorname"
									type="name"
									name="fname"
									autocomplete="given-name"
								></v-text-field>
								<v-text-field
									v-model="input.lastName"
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
									:disabled="!valid.username"
									@click="() => stepper++"
									>Weiter</v-btn
								></v-form
							>
						</v-stepper-content>
						<v-stepper-content step="2">
							<div>
								<h2 class="text-h2 secondary--text pb-4">Verifizierung</h2>
								<p>
									Da häusliche Gewalt ein sehr sensibles Thema ist, möchten wir
									Sie kennen lernen, um Sichere Zuflucht zu einem sicheren Raum
									zu machen. Deshalb nehmen wir in den nächsten Tagen über die
									unten angegebenen Informationen Kontakt mit Ihnen auf, um mehr
									über Sie zu erfahren und offene Fragen zu klären.
								</p>
								<v-form
									ref="verify"
									v-model="valid.phone"
									class="pt-8"
									autocomplete="on"
									@submit.prevent="updateProfile"
								>
									<v-text-field
										v-model="input.phone"
										class="secondary--text font-weight-bold"
										:rules="rules.phone"
										label="Telefonnummer"
										type="tel"
										persistent-hint
										hint="Wir werden Sie telefonisch kontaktieren."
										name="mobile"
										autocomplete="tel"
									></v-text-field>
									<v-checkbox
										v-if="!check.altEmail"
										v-model="check.altEmail"
										label="Alterative E-Mail-Adresse nutzen"
										:hint="
											'Nutze zur Verifizierung eine alternative Emailadresse, anstatt ' +
											userdata.email
										"
										persistent-hint
									></v-checkbox>
									<v-text-field
										v-else
										v-model="input.altEmail"
										class="secondary--text font-weight-bold mt-4"
										:rules="rules.email"
										label="E-Mail-Adresse (optional)"
										type="email"
										persistent-hint
										append-icon="mdi-close"
										hint="Wir werden Sie eventuell per Email kontaktieren."
										name="email"
										autocomplete="email"
										@click:append="check.altEmail = !check.altEmail"
									></v-text-field>
									<v-checkbox
										v-if="!check.www"
										v-model="check.www"
										label="Webseite hinzufügen"
										hint="Geben Sie Ihre offizielle Webseite an, um Ihre Seriösität zu beweisen."
										persistent-hint
									></v-checkbox>
									<v-text-field
										v-if="check.www"
										v-model="input.www"
										class="secondary--text font-weight-bold mt-4"
										label="Webseite (optional)"
										append-icon="mdi-close"
										@click:append="check.www = !check.www"
									></v-text-field>
									<v-btn
										color="secondary"
										:loading="loading"
										:disabled="!valid.phone"
										class="mt-4"
										style="float: right"
										@click="updateProfile"
										>Verifizierung starten</v-btn
									>
								</v-form>
							</div></v-stepper-content
						>
						<v-stepper-content step="3">
							<h2 class="text-h2 secondary--text pb-4">
								VERIFIZIERUNG GESTARTET
							</h2>
							<div>
								<p>
									Es kann einige Tage dauern, bis wir uns bei Ihnen melden.
									Nutzen Sie die Zeit gern, um Ihr Profil zu erstellen.
								</p>
								<v-btn color="secondary" class="my-4" to="/beratung/edit-profil"
									>Profil anlegen</v-btn
								>
							</div>
							<p>
								Sobald Ihr Profil vollständig ist und Sie verifiziert sind,
								stellen wir Ihr Profil online und Sie können mit der Beratung
								beginnen.
							</p>
						</v-stepper-content></v-stepper-items
					>
				</v-stepper>
				<v-alert v-if="error.status" type="alert" color="error">{{
					error.message
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
				valid: { username: false, phone: false },
				stepper: 1,
				input: {
					lastName: null,
					firstName: null,
					phone: null,
					altEmail: null,
					www: null,
				},
				check: {
					altEmail: false,
					www: false,
				},
				rules: {
					textRules: [
						// (v) => !!v || 'Bitte ausfüllen',
						(v) => (v && v.length >= 3) || 'mind. 3 Zeichen lang',
					],
					phone: [
						(v) => !!v || 'Telefonnummer nicht vergessen',
						this.$rules.phone,
					],
					email: [this.$rules.email],
				},

				showError: false,
				loading: false,
				roleTypes: [],
				userdata: null,
				error: {
					status: false,
					message: '',
				},
			};
		},
		async mounted() {
			this.userdata = this.$store.getters['getCurrentUser'];
		},
		methods: {
			updateProfile() {
				this.loading = true;
				const data = {
					display_name: `${this.input.firstName} ${this.input.lastName}`,
					phone: this.input.phone,
					website: this.input.www,
					alt_email: this.input.altEmail,
				};
				this.$func
					.updateMe(data)
					.then((updatedUser) => {
						this.$store.dispatch('changeData', updatedUser).then(() => {
							window.location.href = '/beratung';
						});
					})
					.catch((err) => {
						this.error.status = err.response.status;
						this.error.message = err.response.data.errors[0].message;
						this.loading = false;
						this.$errorhandling(err);
					});

				//this.$func.updateCurrentCoachProfil();
				/*this.$strapi
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
							display_name: this.firstName + ' ' + this.lastName,
							username: username,
						};

						this.$strapi.$users
							.update(this.$strapi.user.id, data)
							.then((newU) => {
								this.$console('newU', newU);
								this.alert.isActive = false;
								this.$store.dispatch('changeData', newU).then(() => {
									this.loading = false;
									this.userdata = this.$store.getters['getCurrentUser'];
									this.stepper++;
								});
							})
							.catch((err) => {
								this.alert.isActive = true;
								this.alert.message = err.response.data.error.message;
								this.loading = false;
								this.$errorhandling(err);
							});
					});*/
			},
		},
	};
</script>
