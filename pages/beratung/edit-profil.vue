<template>
	<v-row v-if="user">
		<v-col cols="12" md="6" height="100%" class="pa-0">
			<v-sheet color="secondary" height="100%" dark>
				<v-container
					style="max-width: 450px; position: sticky; top: 100px"
					class="ma-auto"
				>
					<v-icon size="60" class="pb-4" color="white"
						>mdi-account-edit-outline</v-icon
					>
					<h1 class="h2--text text-uppercase">Zeigen Sie sich</h1>
					<p>In Ihrem Profil präsentieren Sie sich und Ihre Leistung.</p>
				</v-container>
			</v-sheet>
		</v-col>
		<v-col cols="12" md="6">
			<v-container>
				<v-stepper v-if="user" v-model="stepper" elevation="0">
					<v-stepper-header style="box-shadow: none">
						<v-stepper-step
							step="1"
							:complete="stepper > 1"
							:editable="stepper > 1"
							:color="stepper > 1 ? 'success' : 'primary'"
						>
							Profil
						</v-stepper-step>
						<v-divider v-if="!user.stripe_account_success"></v-divider>
						<v-stepper-step
							v-if="!user.stripe_account_success"
							step="2"
							editable
						>
							Zahlung aktivieren
						</v-stepper-step>
					</v-stepper-header>
					<v-stepper-items class="pb-4">
						<v-stepper-content v-if="!bioSaved" step="1" class="px-0">
							<h2 class="text-h2 secondary--text pb-4">
								IHR ÖFFENTLICHES PROFIL
							</h2>
							<p>
								Erstellen Sie ein sympathisches, fachlich ansprechendes Profil
								von sich und Ihrem Angebot. Dann können die Frauen besser
								abwägen, an wen sie sich wenden wollen.
							</p>
							<CoachingSelection
								:info="user"
								:avatar="avatarPreview ? avatarPreview : user.avatar"
								@selection="updateProfile"
							/>
							<v-btn
								text
								:to="
									user.stripe_account_success
										? '/berater/me?name=' + user.username
										: null
								"
								color="grey"
								@click="!user.stripe_account_success ? stepper++ : null"
								>{{
									!user.stripe_account_success
										? 'Später'
										: 'Weiter ohne Speichern'
								}}</v-btn
							>
						</v-stepper-content>
						<v-stepper-content v-else step="1">
							<h2 class="text-h2 secondary--text pb-4">PROFIL erstellt</h2>
							<p>
								Sie können sich Ihr Profil ansehen{{
									!user.stripe_account_success
										? ' oder direkt weiter zur Zahlungsanbindung gehen.'
										: '.'
								}}
							</p>
							<div class="d-flex flex-wrap">
								<v-btn
									color="secondary"
									class="mt-4 mr-3"
									outlined
									target="_blank"
									:to="'/berater/me?name=' + user.slug"
									>Profil ansehen</v-btn
								><v-btn
									v-if="!user.stripe_account_success"
									color="secondary"
									class="mt-4"
									@click="stepper++"
									>Zahlung einrichten</v-btn
								>
							</div>
						</v-stepper-content>
						<v-stepper-content step="2">
							<h2 class="text-h2 secondary--text pb-4">Bezahlungssystem</h2>
							<p>
								<b>Sie beraten nicht gratis!</b><br />
								Pro Beratungseinheit (Dauer: 50 min. ) zahlt jede Frau 50 Euro.
								Sie als Berater*in erhalten 40 Euro. Wir als Sichere Zuflucht
								behalten 10 Euro ein, um damit laufende Kosten zu decken. Damit
								das Geld Sie auch umgehend erreicht, arbeiten wir mit dem
								<b>Zahlungssystem Stripe.</b>
							</p>
							<p>
								Legen Sie sich deshalb bitte ein Stripe-Konto an. Das geht
								schnell und ist für Sie <b>kostenlos.</b>
							</p>

							<div class="d-flex flex-column align-center">
								<v-btn
									color="secondary"
									class="mt-4 mb-2"
									:loading="loading"
									:disabled="disabled"
									@click="addStripe"
									>Mein Stripe-Konto anlegen</v-btn
								>
								<p class="caption">Wir leiten Sie zu Stripe weiter.</p>
							</div>
							<v-alert
								v-if="stripeRegisterURL"
								color="secondary"
								class="caption"
								dark
							>
								Falls die Weiterleitung nicht funktioniert, kopiere und öffne
								bitte folgende URL:
								<a
									:href="stripeRegisterURL"
									target="_blank"
									style="color: white"
									>{{ stripeRegisterURL }}</a
								>
							</v-alert>
							<v-alert v-if="error" color="error" dark>
								{{ error }}
							</v-alert>
							<!--<h2 class="text-h2 secondary--text pb-4 pt-12">HÄUFIGE FRAGEN</h2>-->
							<!--<nuxt-link to="/footer/faq">
                Wie erstelle ich ein Konto bei Stripe?
              </nuxt-link>-->
						</v-stepper-content></v-stepper-items
					></v-stepper
				>
			</v-container></v-col
		></v-row
	>
</template>

<script>
	export default {
		middleware: 'authCoach',
		data() {
			return {
				select: true,
				stepper: 1,
				bioSaved: false,
				stripeRegisterURL: null,
				loading: false,
				disabled: false,
				error: null,
				avatarPreview: null,
				user: null,
			};
		},
		async mounted() {
			this.user = this.$store.getters['getCurrentUser'];
			this.avatarPreview = this.$store.getters['getCurrentUser'].avatar_url;
		},
		methods: {
			updateProfile(data) {
				this.$func
					.updateMe({
						topic_areas: data.topic_areas, // topic
						profession_line: data.profession_line,
						citation: data.citation,
						personal_background: data.personal_background,
						professional_background: data.professional_background,
					})
					.then(() => {
						this.loading = false;
						this.success = true;
						this.bioSaved = true;
					})
					.catch((e) => {
						e.location = 'edit-profil updateMe';
						this.$errorhandling(e);
					});
				// this.$router.push('/berater/' + this.user.public.uid)
			},
			addStripe() {
				this.loading = true;

				this.$func.createStripeAcc().then((url) => {
					this.stripeRegisterURL = url;
					this.loading = false;
					this.disabled = true;
				});
			},
		},
	};
</script>
