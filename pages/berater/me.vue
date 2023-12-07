<template>
	<div v-if="coachData">
		<v-sheet class="d-flex justify-center pt-8" style="position: relative"
			><v-avatar color="primary" size="162">
				<v-img
					v-if="coachData.avatar_content_url"
					:lazy-src="`${coachData.avatar_content_url}?${Date.now()}`"
					:src="`${coachData.avatar_content_url}?${Date.now()}`"
					data-cookiescript="accepted"
					data-cookiecategory="functionality"
			/></v-avatar>
		</v-sheet>
		<v-container>
			<h1 class="text-center text-h1 primary--text text-uppercase">
				{{ coachData.display_name }}
			</h1>
			<h2 class="text-center text-h4 mb-4">
				{{ coachData.profession_line }}
			</h2>
			<div
				v-if="coachData.topic_areas"
				class="d-flex flex-wrap justify-center mb-4"
			>
				<v-chip class="mx-1" color="primary">
					{{ coachData.topic_areas }}
				</v-chip>
			</div>
			<div v-if="coachData.quote" class="text-center">
				<p>
					<b>"{{ coachData.citation }}"</b>
				</p>
			</div>
			<div v-if="coachData.professional_background" class="coach-box">
				<label class="mb-0 caption"> Mein beruflicher Hintergrund: </label>
				<div class="d-flex flex-wrap">
					<div v-html="coachData.professional_background"></div>
				</div>
			</div>
			<div v-if="coachData.personal_background" class="coach-box">
				<label class="mb-0 caption"> Etwas Persönliches über mich: </label>
				<div class="d-flex flex-wrap">
					<div v-html="coachData.personal_background"></div>
				</div>
			</div>
		</v-container>
		<div
			v-if="
				!$store.getters['getCurrentUser'] ||
				$store.getters['getCurrentUser'].usertype === 'woman'
			"
		>
			<v-container>
				<v-card
					outlined
					class="mt-8"
					:style="'border: 1px solid ' + $vuetify.theme.themes.light.secondary"
					elevation="2"
				>
					<v-card-title class="text-h2 secondary--text"
						>online-beratungstermin anfragen</v-card-title
					>
					<v-card-text v-if="$store.getters['getCurrentUser']">
						<p>
							Fülle bitte die beiden Felder aus. Unser/e Berater*in sendet dir
							dann passende Terminvorschläge für euren Beratungstermin.
						</p>

						<v-form
							v-if="!showConfirmation"
							ref="form"
							v-model="requestForm"
							class="pb-8 pt-4"
							@submit="
								(e) => {
									e.preventDefault();
								}
							"
						>
							<v-text-field
								v-model="msgTitle"
								outlined
								color="secondary"
								placeholder="Dein Anliegen"
								label="Thema"
								counter="100"
								persistent-hint
								hint="Bitte nenne uns ein konkretes Thema für dein Anliegen"
								class="mb-4"
							></v-text-field>
							<v-textarea
								v-model="message"
								outlined
								color="secondary"
								placeholder="Beschreibe bitte dein Anliegen."
								value="Jemand möchte mit Ihnen Kontakt aufnehmen."
								label="persönliche Anfrage schreiben"
								counter="500"
							></v-textarea>

							<p class="font-weight-bold">
								Preis pro Beratungseinheit (50 Min.): 50 €
							</p>
							<v-row
								><v-col cols="12" md="8">
									<p class="font-weight-bold mb-0">Ablauf:</p>
									<ol class="mb-6">
										<li>Du sendest deine Anfrage an den/die Bearater*in</li>
										<li>Der/Die Berater*in sendet dir 3 Terminvorschläge</li>
										<li>
											Nimmst du einen Terminvorschlag an, wirst du direkt in den
											Zahlungsprozess weitergeleitet
										</li>
										<li>
											Mit deiner Zahlung buchst du diesen Termin verbindlich und
											euer Online-Beratungsraum wird reserviert.
										</li>
									</ol>
									<SharedFaq
										simple
										:price="['costs']"
										:coaches="['how']"
										:women="['emergency']"
									/> </v-col
								><v-col cols="12" md="4">
									<div class="d-flex flex-row-reverse mb-4">
										<v-btn
											color="secondary"
											:loading="loading"
											:disabled="isDisabled"
											@click="createMeeting"
											>{{ buttonText }}
										</v-btn>
									</div>
								</v-col></v-row
							>
						</v-form>
						<v-alert
							v-else
							color="success"
							dark
							icon="mdi-check"
							class="mt-4 d-flex flex-column justify-center"
						>
							<p class="mb-0">
								Fertig! Deine Anfrage wurde gesendet,
								{{ coachData.display_name }} wird sich in den nächsten Tagen bei
								dir melden. Suche daher bitte regelmäßig nach Updates.
							</p>
							<v-btn to="/beratung" class="mt-2" color="secondary"
								>Mein Bereich</v-btn
							>
						</v-alert>
						<v-alert v-if="error.status" color="error" class="white--text mt-4"
							>{{ error.message }}
						</v-alert>
					</v-card-text>
					<v-card-text v-else>
						<p class="font-weight-bold my-2 caption">
							Melde dich bei Sichere Zuflucht an, um diese/n Berater*in
							kontaktieren zu können.
						</p>
						<v-btn nuxt to="/registration/signup" color="secondary"
							>Registrieren</v-btn
						><v-btn nuxt to="/registration/signin" text>Einloggen</v-btn>
					</v-card-text>
				</v-card>
			</v-container>
			<v-sheet color="grey lighten-5"
				><v-container> <WomanPriceInfo /> </v-container
			></v-sheet>
			<v-container>
				<SharedFaq />
			</v-container>
			<v-divider class="mt-16 mb-6" />
			<v-container>
				<h2 class="text-h2 mt-8 secondary--text">weitere Berater*innen</h2>
				<p class="caption">
					<b>Per Online-Beratung</b> werden dir Berater*innen und Coaches
					zuhören und weiter helfen. Schau dich um, Sie beraten in vielen
					Themen. Per Online-Beratung werden dir Berater*innen zuhören und
					weiter helfen. Schau dich um. Sie beraten in vielen Themen. Die
					Beratung findet digital und anonym statt.
				</p>
			</v-container>
			<CoachingSlider :withoutid="$route.query.name" />
		</div>
		<v-container v-else class="mt-16">
			<v-btn
				v-if="ownProfil"
				to="/beratung/edit-profil"
				outlined
				nuxt
				color="primary"
				>Profil bearbeiten</v-btn
			>
			<v-btn outlined nuxt color="primary" @click="copy">Profil teilen</v-btn>
			<v-alert v-if="copied" type="success" text class="mt-4"
				>Link in Zwischenablage kopiert</v-alert
			>
			<v-text-field
				ref="link"
				style="opacity: 0"
				readonly
				:value="linkVal"
				@click="copy"
			></v-text-field>
		</v-container>
	</div>
	<!----<div v-else-if="coachData !== false">
		<v-container>
			<v-skeleton-loader
				class="mx-auto"
				max-width="300"
				type="avatar, article, list-item-two-line, list-item-two-line, actions"
			></v-skeleton-loader>
		</v-container>
	</div>-->
	<div v-else>
		<v-container class="mt-16">
			<h1 class="text-h1 secondary--text mb-4">
				Unbekannt: {{ $route.query.name }}
			</h1>
			<v-alert type="error" dark color="primary">
				Dieser/diese Berater*in scheint nicht zu existieren.
			</v-alert>
			<p class="mb-16">
				Es tut uns leid, da muss wohl ein Fehler vorliegen. Der/die Berater*in
				unter dieser URL scheint nicht oder nicht mehr zu existieren. Bitte
				überprüfen Sie die Korrektheit der URL oder wenden Sie sich an uns unter
				<a href="mailto:kontakt@sichere-zuflucht.de"
					>kontakt@sichere-zuflucht.de</a
				>
			</p>
			<SharedServiceOverview class="pb-16" />
		</v-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				requestForm: false,
				message: '',
				msgTitle: '',
				showAddInfo: false,
				loading: false,
				isDisabled: false,
				buttonText: 'Anfrage senden',
				showConfirmation: false,
				error: {
					status: false,
					message: '',
				},
				allCoaches: [],
				filteredCoaches: [],
				dialog: false,
				linkVal: window.location.href, //this.$route.fullPath,
				copied: false,
				Latinise: {},
			};
		},
		async asyncData({ query, $func, store }) {
			//{ params, $func, store }
			var coachData = null;
			var ownProfil = false;
			if (
				store.getters['getCurrentUser'] &&
				query.name == store.getters['getCurrentUser'].slug
			) {
				coachData = store.getters['getCurrentUser'];
				ownProfil = true;
			} else
				try {
					const coach = await $func.loadSingleCoach(query.name);
					coachData = {
						id: coach.id,
						...coach.attributes,
					};
				} catch (err) {
					//window.location.replace('/');

					console.log('noCoach', err);
					//coachData = false;
				}
			return { coachData, ownProfil };
		},
		methods: {
			createMeeting() {
				this.loading = true;
				const coach = this.coachData; //this.$route.params.beratung)
				const data = {
					message: this.msgTitle + ': ' + this.message,
					coach_id: coach.id,
				};

				this.$func
					.womanCreatesNewMeeting(data)
					.then(() => {
						this.buttonText = 'versendet';
						this.loading = false;
						this.showConfirmation = true;
						this.isDisabled = true;
					})
					.catch((error) => {
						this.$errorhandling(error);
					});
			},
			copy() {
				const markup = this.$refs.link;
				markup.focus();
				document.execCommand('selectAll', false, null);
				this.copied = document.execCommand('copy');
			},
		},
	};
</script>

<style lang="scss" scoped>
	.coach-box {
		border: 1px solid lightgrey;
		border-radius: 5px;
		margin-bottom: 15px;
		padding: 15px 10px 12px;
		position: relative;
	}
	.coach-box label {
		position: absolute;
		top: -10px;
		background-color: white;
		padding: 0 2px;
		color: grey;
	}
</style>
