<template>
	<v-row
		><v-col v-for="(step, k) in steps" :key="k" cols="12" md="3">
			<v-card height="100%" class="d-flex flex-column">
				<v-sheet color="primary" class="pa-4"
					><v-icon color="white">{{ step.icon }}</v-icon></v-sheet
				>
				<v-card-title class="font-weight-bold primary--text pt-4 mb-0">
					{{ step.title }}
				</v-card-title>
				<v-card-text class="caption pb-8 flex-grow-1 flex-shrink-0">
					{{ step.text }}
				</v-card-text>

				<v-card-actions v-if="step.rule" class="flex-grow-0 flex-shrink-1"
					><nuxt-link v-if="step.textStyle" :to="step.link" class="caption"
						>{{ step.btn }} </nuxt-link
					><v-btn v-else color="secondary" :to="step.link">{{
						step.btn
					}}</v-btn></v-card-actions
				>
			</v-card>
		</v-col></v-row
	>
</template>

<script>
	export default {
		props: {
			noButton: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				steps: [
					{
						icon: 'mdi-login',
						title: '1. Registrieren',
						text: 'Um mit der beratenden Person Kontakt aufzunehmen, registriert sich die Frau auf unserer Plattform.',
						btn: 'Registrieren',
						link: '/registration/signup',
						textStyle: false,
						rule: this.noButton ? false : !this.$store.getters['getActiveUser'],
					},
					{
						icon: 'mdi-account-search',
						title: '2. Beratung suchen',
						text: 'Die Frau sucht sich eine passende Beratung aus und schreibt innerhalb unseres Portals eine Nachricht an die beratende Person.',
						btn: 'Berater*innen-Übersicht',
						link: '/berater',
						textStyle: true,
						rule: !this.$route.path.startsWith('/berater'),
					},
					{
						icon: 'mdi-message-text',
						title: '3. Bezahlen',
						text: 'Der/die Berater*in schickt der Frau 3 Terminvorschläge. Mit der Annahme eines Termins bezahlt die Frau die Beratung.',
					},
					{
						icon: 'mdi-calendar-check',
						title: '4. Loslegen',
						text: 'Nach der Bezahlung steht der Zugang zur online Beratung für den gewünschten Termin im eingeloggten Bereich zur Verfügung.',
					},
				],
			};
		},
	};
</script>
