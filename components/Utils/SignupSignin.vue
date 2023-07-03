<template>
	<v-row class="ma-0">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" dark height="100%">
				<v-container style="max-width: 450px" class="ma-auto py-16">
					<h3 class="h2--text white--text text-uppercase pb-8">
						NACH DER REGISTRIERUNG WERDEN<br />ALLE ANGEBOTE VON SICHERE<br />ZUFLUCHT
						FREIGESCHALTET.
					</h3>
					<UtilsOfferOverview />
				</v-container> </v-sheet></v-col
		><v-col cols="12" md="6" class="pa-0">
			<v-container style="max-width: 450px" class="ma-auto py-16">
				<h1 class="text-h1 mt-4 primary--text">{{ title }}</h1>
				<p v-if="subtitle" class="caption">{{ subtitle }}</p>
				<v-stepper v-model="step" :flat="true" style="box-shadow: none">
					<v-stepper-items>
						<v-stepper-content step="1" class="pa-0 mt-4">
							<h2 class="text-h3 secondary--text">Ihr Anliegen</h2>
							<p class="caption">Bitte wähle dein Anliegen aus:</p>
							<v-item-group v-model="membership" class="mt-2">
								<v-row>
									<v-col
										v-for="(n, i) in memberships"
										:key="i"
										cols="12"
										sm="6"
									>
										<v-item v-slot="{ active, toggle }" :value="n">
											<v-card
												:disabled="i == 0 ? true : false"
												:color="active ? 'primary' : 'blue-grey lighten-5'"
												class="d-flex flex-column justify-center align-center pa-8"
												:dark="active"
												height="200"
												@click="toggle"
											>
												<v-icon large class="pr-2">{{ n.icon }}</v-icon>
												<p class="ma-0 text-center" style="padding-top: 2px">
													{{ n.description }}<br /><span class="caption">{{
														n.notyet
													}}</span>
												</p>
											</v-card></v-item
										></v-col
									></v-row
								></v-item-group
							>
							<div class="d-flex justify-end pt-6">
								<v-btn color="primary" :disabled="!membership" @click="step++"
									>Weiter ></v-btn
								>
							</div>
						</v-stepper-content>
						<v-stepper-content step="2" class="pa-0 mt-4">
							<v-form
								v-model="valid.email"
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
									label="E-Mail-Adresse"
									required
									name="email"
									autocomplete="email"
								></v-text-field>
								<div class="d-flex justify-end pt-0">
									<p class="caption">
										Wir senden im nächsten Schritt eine E-Mail an die o.g.
										Adresse, um sie zu bestätigen.
										<b>Bitte auch im Spam-Ordner nachsehen.</b>
									</p>
									<v-btn
										color="primary"
										:loading="loading"
										:disabled="!valid.email"
										@click="next"
										>Weiter ></v-btn
									>
								</div>
							</v-form>
						</v-stepper-content>
						<v-stepper-content step="3" class="pa-0">
							<v-form
								v-model="valid.password"
								style="width: 100%"
								class="mb-8"
								autocomplete="on"
								@submit.prevent=""
							>
								<h2 class="text-h3 secondary--text mt-4">Account erstellen</h2>
								<v-text-field
									type="email"
									disabled
									name="username"
									autocomplete="off"
									v-model="email"
									class="mt-0 pt-0"
								/>
								<v-text-field
									v-model="password"
									label="Passwort"
									:rules="rules.passwordRules"
									:type="hidePassword ? 'password' : 'text'"
									:append-icon="hidePassword ? 'mdi-eye' : 'mdi-eye-off'"
									name="new-password"
									autocomplete="new-password"
									hint="Bitte beachten Sie folgende Passwortvorgaben"
									persistent-hint
									@click:append="() => (hidePassword = !hidePassword)"
								></v-text-field>
								<div>
									<v-chip
										v-for="(n, i) in chips"
										:key="i"
										:color="n.rule(password) ? 'success' : 'grey'"
										dark
										class="mt-1 mr-1"
										small
										filter
									>
										{{ n.title }}
									</v-chip>
									<v-text-field
										v-model="password2"
										:rules="rules.passwordRules2"
										label="Passwort wiederholen"
										:type="hidePassword2 ? 'password' : 'text'"
										:append-icon="hidePassword2 ? 'mdi-eye' : 'mdi-eye-off'"
										@click:append="() => (hidePassword2 = !hidePassword2)"
										name="new-password"
										autocomplete="off"
										class="mt-6"
									></v-text-field>
								</div>
								<div class="d-flex justify-end">
									<v-btn text color="grey" @click="back()" type="button">
										Zurück </v-btn
									><v-btn
										class="inline"
										color="success"
										:loading="loading"
										type="submit"
										:disabled="!valid.password"
										nuxt
										@click="register()"
										>Account erstellen</v-btn
									>
								</div>
								<v-alert v-if="error.status" type="error" class="mt-2">{{
									error.message
								}}</v-alert>
							</v-form>
						</v-stepper-content>
						<v-stepper-content step="4" class="pa-0">
							<h2 class="text-h1 primary--text mb-4">
								Danke für die Anmeldung!
							</h2>
							<h3 class="text-h2 secondary--text mb-8">
								Wir haben Ihnen eine Bestätigungsmail gesendet.
							</h3>
							<p>
								<b>{{ email }}</b>
							</p>
							<p class="caption">
								Bitte schauen Sie in Ihr E-Mail-Postfach. Kontrolliere ggf. auch
								den Spam Ordner.
							</p>
							<p class="caption">
								Sollte nichts angekommen sein, können Sie sich die E-mail noch
								einmal zusenden lassen.
							</p>
							<v-btn color="primary" class="mb-4" href="/registration/signin"
								>Einloggen</v-btn
							>
						</v-stepper-content>
					</v-stepper-items>
				</v-stepper>
			</v-container>
		</v-col></v-row
	>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: 'Registrieren, um Online-Beratung zu erhalten',
			},
			subtitle: {
				type: String,
				default: null,
			},
			buttonText: {
				type: String,
				default: 'Als Berater*in registrieren?',
			},
			buttonLink: {
				type: String,
				default: '/registration/signup-coach',
			},
		},
		data() {
			return {
				step: 1,
				valid: {
					email: false,
					password: false,
					membership: false,
				},
				email: '',
				password: '',
				password2: '',
				hidePassword: true,
				hidePassword2: true,
				rules: {
					passwordRules: [
						(v) => !!v || 'Passwort ist erforderlich',
						this.$rules.password,
					],
					passwordRules2: [
						(v) => !!v || 'Passwortwiederholung ist erforderlich',
						(v) =>
							(!!v && v === this.password) ||
							'Passwörter müssen übereinstimmen',
					],
					email: [(v) => !!v || 'E-Mail ist erforderlich', this.$rules.email],
				},
				chips: [
					{
						title: 'Großbuchstaben',
						rule: (v) => /^(?=.*?[A-Z]).{1,}$/.test(v),
					},
					{
						title: 'Kleinbuchstaben',
						rule: (v) => /^(?=.*?[a-z]).{1,}$/.test(v),
					},
					{
						title: 'Zahlen',
						rule: (v) => /^(?=.*?[0-9]).{1,}$/.test(v),
					},
					{
						title: 'Sonderzeichen (#?!@$ %^&*-)',
						rule: (v) => /^(?=.*?[#?!@$ %^&*-]).{1,}$/.test(v),
					},
					{
						title: 'mind. 8 Zeichen',
						rule: (v) => /^.{8,}$/.test(v),
					},
				],
				loading: false,
				error: {
					status: false,
					message: '',
				},
				resetLoading: false,
				memberships: [
					{
						description: 'Ich suche Beratung',
						notyet: '(wird demnächst freigeschaltet)',
						icon: 'mdi-face-woman',
						id: 'Woman',
						roleName: 'woman',
						name: 'Frau',
					},
					{
						description: 'Ich möchte Beratung anbieten',
						icon: 'mdi-message',
						id: 'Coach',
						roleName: 'coach',
						name: 'Beratung',
					},
				],
				membership: null,
			};
		},
		methods: {
			back() {
				this.step--;
			},
			next() {
				this.step++;
			},
			async register() {
				this.loading = true;

				this.$func
					.register({
						email: this.email,
						password: this.password,
						usertype: this.membership.roleName,
					})
					.then((reg) => {
						console.log('reg', reg);
						this.valid = false;
						this.loading = false;
						this.showConfirmation = true;
						this.step++;
					})
					.catch((err) => {
						console.log('error message', err);
						this.error.status = err.response.status;
						this.error.message = 'email: ' + err.response.data.errors.email[0];
						this.loading = false;
						this.$errorhandling(err);
					});
			},
		},
	};
</script>
