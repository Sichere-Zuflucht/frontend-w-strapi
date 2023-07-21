<template>
	<div id="faq">
		<h3
			v-if="!simple"
			class="text-h3 text-uppercase secondary--text pt-16 pb-8 font-weight-bold"
		>
			HÄUFIGE FRAGEN
		</h3>
		<v-row id="faqwrapper" class="pb-8">
			<v-col
				v-for="(cat, i) in faqList"
				:key="i"
				cols="12"
				:sm="!simple ? 6 : 12"
				:md="!simple ? 4 : 12"
			>
				<p v-if="!simple" class="font-weight-bold">{{ cat.label }}</p>
				<v-expansion-panels style="box-shadow: none !important">
					<v-expansion-panel
						v-for="(faq, j) in cat.faqs"
						:key="j"
						:label="faq.slug"
						style="box-shadow: none !important"
					>
						<!----<nuxt-content :document="faq" />-->
						<v-expansion-panel-header class="primary--text align-start">
							{{ faq.question }}
						</v-expansion-panel-header>
						<v-expansion-panel-content class="caption bluegray--text">
							<nuxt-content :document="faq" />
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
			</v-col>
		</v-row>
		<!----<v-row v-if="faqList.length != 0" id="faqwrapper" class="pb-8">
			<v-col v-for="(cat, i) in faqList" :key="i" cols="12" sm="6" md="4">
				<div v-if="cat">
					<p class="font-weight-bold">{{ cat.catTitle }}</p>
					<v-expansion-panels style="box-shadow: none !important">
						<v-expansion-panel
							v-for="faq in cat.faqs"
							:key="faq.id"
							style="box-shadow: none !important"
						>
							<v-expansion-panel-header class="primary--text align-start">
								{{ faq.question }}
							</v-expansion-panel-header>
							<v-expansion-panel-content
								v-if="faq.answer"
								class="caption bluegray--text"
							>
								<p v-html="$md.render(faq.answer)"></p>
							</v-expansion-panel-content>
						</v-expansion-panel>
					</v-expansion-panels>
				</div>
			</v-col>
		</v-row>-->
	</div>
</template>

<script>
	export default {
		props: {
			coaches: {
				type: [Boolean, Array],
				default: false,
			},
			women: {
				type: [Boolean, Array],
				default: false,
			},
			price: {
				type: [Boolean, Array],
				default: false,
			},
			safety: {
				type: [Boolean, Array],
				default: false,
			},
			coaching: {
				type: [Boolean, Array],
				default: false,
			},
			simple: {
				type: Boolean,
				default: false,
			},
		},

		data() {
			return {
				faqList: [],
			};
		},

		computed: {
			allPropsFalse() {
				return (
					!this.coaches &&
					!this.women &&
					!this.price &&
					!this.safety &&
					!this.coaching
				);
			},
		},

		async mounted() {
			if (this.allPropsFalse) {
				this.loadFAQcatergory('women');
				this.loadFAQcatergory('coaches');
				this.loadFAQcatergory('price');
				this.loadFAQcatergory('coaching');
				this.loadFAQcatergory('safety');
			} else {
				if (this.women) this.loadFAQcatergory('women');
				if (this.coaches) this.loadFAQcatergory('coaches');
				if (this.price) this.loadFAQcatergory('price');
				if (this.coaching) this.loadFAQcatergory('coaching');
				if (this.safety) this.loadFAQcatergory('safety');
			}
		},
		methods: {
			async loadFAQcatergory(prop) {
				switch (prop) {
					case 'women':
						this.loadContent('Für Frauen', 'women', this.catTopics(this.women));
						break;
					case 'coaches':
						this.loadContent('Für Berater*innen', 'coaches');
						break;
					case 'price':
						this.loadContent('Bezahlung und Preise', 'price');
						break;
					case 'coaching':
						this.loadContent('Online-Beratung', 'coaching');
						break;
					case 'safety':
						this.loadContent('Sicherheit', 'safety');
						break;
				}
			},
			catTopics(cat) {
				console.log('cat', cat, typeof cat);
				return typeof cat != Boolean ? cat : null;
			},
			async loadContent(title, route, topics) {
				console.log(topics);
				const filter = topics ? { slug: { $in: topics } } : {};
				console.log(filter);
				this.faqList.push({
					label: title,
					faqs: await this.$content(`faq/${route}`)
						.where(filter)
						.sortBy('ranking')
						.fetch(),
				});
			},
		},
	};
</script>

<style>
	#faq .v-expansion-panel::before {
		box-shadow: none !important;
	}
	#faq .v-expansion-panel-header,
	#faq .v-expansion-panel-content__wrap {
		padding-right: 0;
		padding-left: 0;
	}
	#faq .v-expansion-panels .v-expansion-panel:not(:first-child)::after {
		border-color: transparent !important;
	}

	#faq .v-expansion-panel-header__icon i {
		color: #f48fb1 !important;
		opacity: 0.6;
	}

	#faq .v-expansion-panel-header__icon {
		margin-left: 0px;
	}
</style>
