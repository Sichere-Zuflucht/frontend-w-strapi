<template>
	<div>
		<UtilsBanner url="/header-frauen.jpg" />
		<v-sheet color="grey lighten-5"
			><v-container class="text-center">
				<h1 class="text-h1 primary--text pt-8">
					Für dein Leben ohne häusliche Gewalt
				</h1>
				<h2 class="text-h2 secondary--text pb-8">
					HIER BIST DU RICHTIG. WIR HELFEN DIR IN DEINER SCHWIERIGEN SITUATION.
				</h2>
				<p>
					Wir sammeln für dich Informationen und Berichte, die dich auf deinem
					Weg in ein Leben ohne Gewalt unterstützen können.
				</p>
			</v-container></v-sheet
		>

		<h2 class="text-h2 secondary--text text-center pt-16">
			Das Sichere Zuflucht-Magazin
		</h2>
		<MagazineSlider />
		<v-container class="pb-16 pt-0">
			<UtilsBtn text="Zum Magazin" link="/magazine" classname="pb-0" />
		</v-container>
		<v-divider />
		<v-container class="pb-16">
			<h2 class="text-h2 secondary--text text-center pt-16">
				Nutze unser Hilfsangebot
			</h2>
			<p class="pb-4 text-center">
				Wir wollen, dass du nicht alleine bist. Berater*innen stehen dir mit
				Ihrer Erfahrung zur Seite. Deine <b>Beratung</b> findet
				<b>sicher, online</b> und <b>anonym</b> statt.
			</p>
		</v-container>
		<CoachingSlider />
		<v-container>
			<UtilsBtn text="Berater*innen" link="/berater" classname="pb-0" />
			<h2 class="text-h2 secondary--text text-center pt-16">
				DU STEHST VOR DER TRENNUNG, HAST ABER VIELE FRAGEN?!
			</h2>
			<p>
				<b
					>Wir bieten dir die Möglichkeit deine Fragen von Fachleuten
					beantworten zu lassen.</b
				><br />
				In unseren Beratungsgesprächen und individuellen Coachings werden dir
				wichtige Fragen zuverlässig beantwortet, z.B.:
			</p>
			<ul>
				<li>Sorgerecht</li>
				<li>Finanzielle Möglichkeiten</li>
				<li>Scheidungsfragen</li>
				<li>Umgang mit dem sozialen Umfeld</li>
			</ul>
		</v-container>
		<v-container class="py-16">
			<h2 class="text-h2 text-center secondary--text pb-2">
				... Das ist doch noch keine Gewalt, oder?
			</h2>
			<h3 class="text-h5 text-center primary--text pb-8">
				WAS ERLEBST DU IN DEINEM ALLTAG. WIR WOLLEN DIR HELFEN, DEINE SITUATION
				EINZUORDNEN.
			</h3>
			<p>
				<b
					>Betroffenen fällt es oft nicht leicht die Gewalt zu erkennen.<br />
					Sie fängt häufig schleichend an.</b
				>
				<br /><br />
				Häusliche Gewalt kann viele Formen annehmen. Neben körperlicher und
				sexualisierter Gewalt, die absolut eindeutiges Fehlverhalten sind,
				solltest du auch auf subtilere Anzeigen achten:
			</p>
			<ul>
				<li>
					<b>Psychologische Gewalt: </b>z.B. ständige Kritik, Demütigung,
					Einschüchterung, Bedrohung oder Isolation. Wenn du ständig kritisiert
					oder abgewertet wirst.
				</li>
				<li>
					<b>Kontrollverhalten: </b>dein Partner greift in deine Entscheidungen
					ein, er überwacht deine Aktivitäten, verhindert Kontakte mit Freunden
					oder Familie oder er schränkt deine finanziellen Mittel ein.
				</li>
			</ul>
			<p>
				<br />
				Wichtig ist, sobald du in deiner Beziehung ständigem Druck ausgesetzt
				wirst, solltest du diese hinterfragen.
			</p>
			<p>
				Weitere Erfahrungen findest du in unserem
				<nuxt-link to="/magazine">Magazin</nuxt-link>.
			</p>
		</v-container>
		<v-divider />
		<SharedQuotes />
	</div>
</template>
