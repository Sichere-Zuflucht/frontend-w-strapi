<template>
	<div>
		<UtilsBanner url="/teaser-spenden.jpg" />
		<v-sheet color="grey lighten-5"
			><v-container class="text-center">
				<h1 class="text-h1 primary--text py-8">
					Ihr könnt die Frauen ganz direkt unterstützen
				</h1>
				<p>
					Häufig <b>möchte man gerne helfen</b>, weiß aber nicht genau wie. So
					geht es uns auch oft. Deshalb haben wir die Möglichkeit geschaffen,
					dass ihr unseren <b>Frauen direkt helfen</b> könnt, indem ihr z.B.
					<b>für ein Beratungsgespräch spendet.</b>
				</p>
			</v-container></v-sheet
		>
		<v-container id="paytitle" class="py-16">
			<h2 class="text-h2 text-center secondary--text pb-6">
				Hier könnt ihr wählen, wie ihr unterstüzen wollt.
			</h2>
			<v-row>
				<v-col
					v-for="(option, i) in donationOptions"
					:key="i"
					cols="12"
					sm="6"
					:md="!option.ownVal ? 4 : 12"
				>
					<v-card class="my-4 mx-2">
						<v-sheet
							color="success"
							class="pa-8 d-flex align-center justify-center"
						>
							<v-icon color="white" size="44">{{ option.icon }}</v-icon>
							<h3 class="white--text ml-2">{{ option.value }}€</h3>
						</v-sheet>
						<v-card-title class="primary--text text-h3 font-weight-bold mb-2">{{
							option.title
						}}</v-card-title>
						<v-card-subtitle
							><b>{{ option.value }}€ spenden</b> und eine
							{{ !option.ownVal ? option.title : 'Beratung' }} für eine von
							Gewalt betroffene Frau ermöglichen</v-card-subtitle
						>
						<v-card-actions>
							<v-btn
								v-if="!option.ownVal ? option.value : validValue"
								color="secondary"
								:href="option.link"
								target="_blank"
								>Spenden</v-btn
							></v-card-actions
						>
					</v-card></v-col
				></v-row
			>
			<!--<v-stepper v-model="donationStep" elevation="0">
        <v-stepper-items>
          <v-stepper-content step="1" class="pa-0">
            <v-card
              v-for="(option, i) in donationOptions"
              :key="i"
              class="my-4 mx-2"
            >
              <v-card-text>
                <v-row
                  ><v-col cols="3"
                    ><v-icon color="success" size="64">{{
                      option.icon
                    }}</v-icon></v-col
                  ><v-col cols="9" class="text-right"
                    ><h3 class="primary--text text-h3 font-weight-bold pb-2">
                      {{ option.title }}
                    </h3>
                    <h4
                      v-if="!option.ownVal"
                      class="primary--text text-h4 pb-4"
                    >
                      Wert: {{ option.value }}€
                    </h4>
                    <v-form v-else v-model="validValue">
                      <v-text-field
                        v-model="option.value"
                        outlined
                        :rules="numRule"
                        type="number"
                        append-icon="mdi-currency-eur"
                      ></v-text-field
                    ></v-form>
                    <v-btn
                      v-if="!option.ownVal ? option.value : validValue"
                      color="secondary"
                      @click="choose(option)"
                      >Spenden</v-btn
                    ></v-col
                  ></v-row
                ></v-card-text
              >
            </v-card>
          </v-stepper-content>
          <v-stepper-content step="2" class="pa-0">
            <div v-if="donationChosen">
            <p class="text-center">Sie haben ausgewählt:</p>
            <v-card class="my-4 mx-2" color="secondary">
              <v-card-text >
                <v-row
                  ><v-col cols="3"
                    ><v-icon size="64">mdi-check-circle-outline</v-icon></v-col
                  ><v-col cols="9" class="text-right"
                    ><h3 class="white--text text-h3 font-weight-bold pb-2">
                      {{ donationChosen.title }}
                    </h3>
                    <h4 class="white--text text-h4 pb-4">
                      Wert: {{ donationChosen.value }}€
                    </h4>

                    <v-btn text class="pr-0" @click="donationStep--"
                      >ändern</v-btn
                    >
                  </v-col></v-row
                ></v-card-text
              >
            </v-card>
            <v-btn color="success" class="float-right mr-2" target="_blank" :href="donationChosen.link">
              Spenden</v-btn
            >
            </div>
          </v-stepper-content>
          <v-stepper-content step="3" class="pa-0">
            <v-card class="my-4 mx-2" color="grey lighten-3">
              <v-card-text> Weiterleitung zum Bezahlungssystem </v-card-text>
            </v-card>
            <v-overlay color="black" opacity="0.8">
              <p>Weiterleitung zu Stripe. Bitte warten...</p>
            </v-overlay>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>-->
			<p class="pt-8 text-center">
				Ihr könnt für eure Spende direkt eine Spendenquittung erhalten.
			</p>
		</v-container>
		<v-divider />
		<v-container class="text-center class py-16">
			<h3 class="text-h3 primary--text pb-4">
				WAS PASSIERT MIT DEINEN SPENDENGELDERN?
			</h3>
			<p class="font-weight-bold">
				Wir sammeln eure Spenden und geben Sie direkt für eine Frau frei, wenn
				eine volle Stunde erreicht ist.
			</p>
			<p>
				Da wir nicht alle Frauen und ihre wirtschaftlichen Möglichkeiten kennen,
				die sich bei uns melden, wollen wir perspektivisch mit Beratungsstellen
				und Frauenhäusern zusammen arbeiten, die genau wissen, was sich die
				Frauen, die dort Hilfe suchen, leisten können. Diese sollen eure
				gespendeten Stunden dann zielgenau einsetzen.
			</p>
			<p>
				Eine Stunde Beratung kostet 50€. Das ist ein wesentlich geringerer
				Preis, als Beratungen auf dem freien Markt kosten. Berater*innen und
				Coach*innen spenden somit ihrerseits bei jeder Beratung eine Leistung.
			</p>
			<p>
				In den 50 € sind jeweils 10€ enthalten, die wir als Sichere Zuflucht
				einbehalten, um unser gemeinnütziges Unternehmen am Laufen halten zu
				können. Wir finanzieren damit Hostinggebühren, Entwicklungsgebühren,
				Software-Abos z.B. für die angeschlossenen Zahlungs- und
				Online-Beratungs-Dienste u.v.m. Wir arbeiten gemeinnützig. D.h. alle
				erwirtschafteten Gewinne fließen wieder direkt in Sichere Zuflucht. So
				gewährleisten wir, dass es hier immer voran geht und wir weiter helfen
				können.
			</p>
		</v-container>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				donationStep: 1,
				donationOptions: [
					{
						icon: 'mdi-help-circle',
						title: 'Freien Betrag',
						ownVal: true,
						value: 'x',
						link: this.$config.donate4,
					},
					{
						icon: 'mdi-heart-circle',
						title: 'ganze Beratung',
						value: '50',
						link: this.$config.donate1,
					},
					{
						icon: 'mdi-circle-slice-4',
						title: '1/2 Beratung',
						value: '25',
						link: this.$config.donate2,
					},
					{
						icon: 'mdi-circle-slice-2',
						title: '1/4 Beratung',
						value: '12.50',
						link: this.$config.donate3,
					},
				],
				donationChosen: null,
				numRule: [
					(v) => parseInt(v) > 0 || 'Betrag muss größer 0 sein.',
					(v) =>
						/^\d{0,5}([,.]\d{0,2})?$/.test(v) ||
						'ungültiger oder zu hoher Betrag.',
				],
				validValue: true,
			};
		},
		methods: {
			choose(chosen) {
				this.donationChosen = chosen;
				this.donationStep = 2;
				this.$vuetify.goTo('#paytitle');
			},
		},
	};
</script>
