<template>
	<div>
		<UtilsBanner icon="mdi-account-question-outline" />
		<v-container>
			<div v-if="userdata" class="pa-3">
				<div v-if="!userdata.verified">
					<h2 class="text-h2 secondary--text pb-4">VERIFIZIERUNG GESTARTET</h2>
					<div v-if="!userdata.topic_areas">
						<p>
							Es kann einige Tage dauern, bis wir uns bei Ihnen melden. Nutzen
							Sie die Zeit gern, um Ihr Profil zu erstellen.
						</p>
						<v-btn color="secondary" class="my-4" to="/beratung/edit-profil"
							>Profil anlegen</v-btn
						>
					</div>
					<p>
						Sobald Ihr Profil vollständig ist und Sie verifiziert sind, stellen
						wir Ihr Profil online und Sie können mit der Beratung beginnen.
					</p>
				</div>
				<div v-else-if="userdata.verified">
					<h2 class="text-h2 secondary--text pb-4">VERIFIZIERUNG GESCHAFFT</h2>
				</div>
			</div></v-container
		>
	</div>
</template>

<script>
	export default {
		middleware: 'authCoach',
		computed: {
			userdata() {
				return this.$store.getters['getCurrentUser'];
			},
		},
	};
</script>
