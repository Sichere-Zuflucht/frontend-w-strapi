<template>
	<div>
		<UtilsBanner url="/le-buzz-tVnm9I9jb8I-unsplash.jpg" pos="center 23%" />
		<v-container>
			<h1 class="text-h1 primary--text">Beratung und Hilfe</h1>
			<p class="mb-6">
				Hier, bei Sichere Zuflucht kannst du <b>Online-Besprechungen</b> mit
				Fachleuten zu deinen Themen machen. Diese kannst du von überall ganz
				<b>einfach, sicher und anonym</b> mit dem <b>Handy</b> machen.
			</p>
			<h2 class="text-h2 secondary--text mt-16">Berater*innen</h2>
		</v-container>
		<CoachingSlider />
		<v-sheet color="grey lighten-5">
			<v-container> <WomanPriceInfo /></v-container
		></v-sheet>
		<v-container class="py-16">
			<h3 class="text-h3 text-uppercase secondary--text pb-8 font-weight-bold">
				so laufen Terminfindung und Beratung ab
			</h3>
			<SharedSteps class="pb-16" />
			<SharedFaq
				coaches
				price
				coaching
			/><!-- filter="???price" price onlinecoaching />-->
		</v-container>
	</div>
</template>

<script>
	export default {
		name: 'FindCoach',
		data() {
			return {
				allCoaches: [],
				user: this.$store.getters['modules/user/user'],
				coachingTypes: [],
				tagsSelected: null,
				loading: true,
				error: null,
			};
		},
	};
</script>
