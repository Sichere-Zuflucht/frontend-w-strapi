<template>
	<div>
		<v-container class="py-md-8" style="max-width: 700px">
			<v-row>
				<v-col cols="12" sm="6">
					<div
						:class="`d-flex ${
							$vuetify.breakpoint.smAndUp ? 'justify-end' : 'justify-center'
						}`"
						style="position: relative"
					>
						<video
							id="antenne-bayern"
							:width="$vuetify.breakpoint.smAndUp ? '100%' : '250px'"
							class="align-right"
							:controls="videoplay"
							poster="/antenne-bayern-video-poster.png"
							data-poster="/antenne-bayern-video-poster.png"
						>
							<source
								src="https://edef3.pcloud.com/cBZunzAcjZh7cYaCZZZSuznykZQ5ZZXLXZkZ83DIZsVZU0ZXFZNVZsJZ25ZQXZH0ZWJZYVZvFZyXZ55ZW0ZTjKWZoqsA6JimBmQL68KA8t4fGVNDO4yX/SZ-Spot-Antenne-Bayern.mp4"
								type="video/mp4"
							/>
						</video>
						<div
							v-if="!videoplay"
							class="d-flex justify-center align-center"
							:style="`position: absolute; top: 0%; right: auto; left: auto; bottom: 0%; background-color: rgba(0, 0, 0, 0.3); width: ${
								$vuetify.breakpoint.smAndUp ? '100%' : '250px'
							}`"
						>
							<v-btn icon large @click="startVideo"
								><div
									class="pa-4"
									style="
										background-color: white;
										position: absolute;
										border-radius: 50%;
									"
								></div>
								<v-icon color="primary" x-large>mdi-play-circle</v-icon></v-btn
							>
						</div>
					</div>
				</v-col>
				<v-col
					cols="12"
					sm="6"
					class="d-flex flex-column justify-center align-start"
				>
					<v-img
						src="/antenne-bayern-logo.jpg"
						max-width="100"
						max-height="57.8"
					/>
					<p class="text-h1 mb-4 primary--text pt-4">
						DU HÖRST UNS AUF<br />ANTENNE BAYERN
					</p>
					<p>
						Danke Antenne Bayern, dass Ihr uns die Möglichkeit gebt, viele
						Frauen in eurem Senderadius zu erreichen!
						<br /><br />
						Du bist von häuslicher Gewalt betroffen? Dann kannst du dich hier
						individuell von einer unserer <b>Berater*innen</b> beraten lassen
						oder dich erst einmal in unserem <b>Magazin</b> umschauen, und dir
						einen Überblick über deine Situation verschaffen. <br /><br />
						<b>
							Toll, dass du diesen Schritt – dir selbst zu helfen – gegangen
							bist!
						</b>
					</p>
				</v-col>
			</v-row>
		</v-container>
		<v-container class="py-md-8" style="min-height: calc(50vh - 74px)">
			<h1 class="text-h1 mb-4 text-center primary--text pt-12">
				Niemand muss <br />häusliche Gewalt aushalten.
			</h1>
			<h2 class="text-center secondary--text subtitle-1 mb-8 mb-md-12">
				Auch du nicht
			</h2>
			<p class="text-center mx-auto pb-md-8" style="max-width: 530px">
				Wir bieten <b>Frauen und ihren Kindern aus Gewaltbeziehungen</b> Hilfe
				in Form einer persönlichen Online-Beratung an.
			</p>
		</v-container>
		<v-sheet color="grey lighten-5 py-md-16"
			><v-container>
				<v-row
					><v-col cols="12" md="6" class="text-center text-md-right">
						<h3 class="text-uppercase mb-4 secondary--text text-h1">
							<span style="font-size: 2.5em; line-height: 1em"
								>Wir<br />helfen<br />dir!</span
							>
						</h3>
						<p class="primary--text font-weight-bold">
							und lassen dich in deiner Situation nicht allein.
						</p>
						<p>
							Unsere Beratungsthemen:<b>
								<br />- Psychosoziale Beratung <br />- Rechtsberatung <br />-
								Coaching</b
							>
						</p>
					</v-col>
					<v-col cols="12" md="6">
						<v-card class="mx-auto" max-width="320">
							<v-img src="/le-buzz-tVnm9I9jb8I-unsplash.jpg" height="200px" />

							<v-card-title
								class="text-h3 secondary--text font-weight-bold mb-2"
								>Beratung und Hilfe
							</v-card-title>

							<v-card-subtitle>
								Hier kannst du dich <b>online beraten lassen</b>, wenn du von
								häuslicher Gewalt betroffen bist. Ganz
								<b>einfach, sicher und anonym</b> von überall aus, mit dem
								<b>Handy</b>.
								<v-btn color="secondary my-4" nuxt exact to="berater">
									Alle Berater*innen ansehen
								</v-btn>
							</v-card-subtitle>
						</v-card></v-col
					></v-row
				>
				<h2
					class="text-h3 text-md-h1 text-uppercase text-center primary--text mb-2 mt-16"
				>
					Unsere Berater*innen
				</h2>
			</v-container>
			<CoachingSlider />
		</v-sheet>
		<v-container class="pt-md-16">
			<h3
				class="text-h3 text-md-h1 text-uppercase text-center secondary--text pt-8"
				style="font-weight: bold"
			>
				Sichere Zuflucht-Magazin
			</h3>
		</v-container>
		<MagazineSlider />
		<v-divider class="mt-md-8" />
		<v-container class="pt-16">
			<v-row style="max-width: 700px" class="mx-auto">
				<v-col cols="12" md="6" class="text-center text-md-right">
					<h3 class="text-uppercase mb-4 primary--text text-md-h1 pt-md-5">
						<span style="font-size: 3em; line-height: 1em">Helfen Sie mit</span>
					</h3>
					<p class="secondary--text font-weight-bold">
						und beraten Sie Frauen in Not.
					</p>
					<p>
						Sie können beraten in:
						<br /><b
							>- Psychosoziale Beratung <br />- Rechtsberatung <br />-
							Coaching</b
						>
					</p>
				</v-col>
				<v-col cols="12" md="6">
					<v-card class="mx-auto" max-width="320">
						<v-img src="/AdobeStock_342417877.jpeg" height="200px"></v-img>

						<v-card-text>
							<h3 class="text-h3 primary--text font-weight-bold mb-2">
								Werden Sie ein Teil von<br />Sichere Zuflucht
							</h3>
							<p>
								Wir erweitern permanent unseren Pool an Berater*innen und freuen
								uns über alle, die
								<b>Frauen und ihre Kinder aktiv unterstützten</b> wollen.
							</p>
							<v-btn color="primary mt-2 mb-1" to="/registration/signup-coach">
								Als Berater*in registrieren
							</v-btn>
							<v-btn to="info/berater" class="secondary mb-1"
								>mehr erfahren</v-btn
							>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6" style="display: none">
					<v-card class="mx-auto" max-width="320">
						<v-img
							src="gleren-meneghin-VSLPOL9PwB8-unsplash.jpg"
							height="200px"
						></v-img>

						<v-card-title class="text-h3 primary--text font-weight-bold mb-2"
							>Liebe Unterkunfsbesitzer*innen, helfen Sie mit!
						</v-card-title>

						<v-card-subtitle>
							Vermieten Sie Ihr Ferienhaus, -wohnung, -bungalow was auch immer –
							neben der touristischen Vermietung und helfen Sie so aktiv mit,
							Frauen und Kinder aus Gewaltsituationen heraus zu holen. Wir
							freuen uns auch besonders über dauerhafte Angebote wie
							Mietwohnungen.
							<v-btn
								color="primary my-4"
								href="mailto:kontakt@sichere-zuflucht.de"
							>
								Ich biete meine Unterkunft an
							</v-btn>
						</v-card-subtitle>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
		<SharedQuotes />
		<UtilsDonation />
	</div>
</template>

<script>
	export default {
		data() {
			return {
				videoplay: false,
			};
		},
		methods: {
			startVideo() {
				var video = document.getElementById('antenne-bayern');
				this.videoplay = true;
				video.play();
			},
		},
	};
</script>
