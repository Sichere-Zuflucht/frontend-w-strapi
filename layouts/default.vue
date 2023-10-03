<template>
	<v-app>
		<v-navigation-drawer
			v-model="drawer"
			app
			class="secondary"
			dark
			fixed
			disable-resize-watcher
		>
			<client-only>
				<v-list>
					<div v-for="(item, i) in noUser" :key="i">
						<v-list-group
							v-if="item.subgroup"
							:value="true"
							no-action
							:to="item.to"
							nuxt
							exact
							active-class="white--text"
						>
							<template #activator>
								<v-list-item-icon
									><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
								>
								<v-list-item-content>{{ item.title }}</v-list-item-content>
							</template>
							<v-list-item
								v-for="(sub, n) in item.subgroup"
								:key="n"
								:to="sub.to"
								nuxt
								exact
								active-class="white--text"
								@click="drawer = false"
							>
								<v-list-item-content>
									{{ sub.title }}
								</v-list-item-content>
							</v-list-item></v-list-group
						>
						<v-list-item v-else :to="item.to" @click="drawer = false">
							<v-list-item-icon
								><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
							>
							<v-list-item-content>
								{{ item.title }}
							</v-list-item-content>
						</v-list-item>
					</div>
				</v-list>
				<v-divider />
				<v-list v-if="user">
					<div v-if="user.usertype === 'woman'">
						<v-list-group
							v-for="(item, i) in loggedInWoman"
							:key="i"
							:value="true"
							no-action
							active-class="white--text"
						>
							<template #activator>
								<v-list-item-icon
									><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
								>
								<v-list-item-content>{{ item.title }}</v-list-item-content>
							</template>
							<v-list-item
								v-for="(sub, n) in item.subgroup"
								:key="n"
								:to="sub.to"
								nuxt
								exact
								active-class="white--text"
								@click="drawer = false"
							>
								<v-list-item-content>
									{{ sub.title }}
								</v-list-item-content>
							</v-list-item></v-list-group
						>
					</div>
					<div v-else>
						<v-list-group
							v-for="(item, i) in loggedInCoach"
							:key="i"
							:value="true"
							no-action
							active-class="white--text"
						>
							<template #activator>
								<v-list-item-icon
									><v-icon>{{ item.icon }}</v-icon></v-list-item-icon
								>
								<v-list-item-content>{{ item.title }}</v-list-item-content>
							</template>
							<v-list-item
								v-for="(sub, n) in item.subgroup"
								:key="n"
								:to="sub.appendUser ? sub.to + user.slug : sub.to"
								nuxt
								exact
								active-class="white--text"
								@click="drawer = false"
							>
								<v-list-item-content>
									{{ sub.title }}
								</v-list-item-content>
							</v-list-item></v-list-group
						>
					</div>
					<v-divider class="my-2" />
					<v-list-item>
						<v-btn block to="/" color="accent" @click="logout">Abmelden</v-btn>
					</v-list-item>
				</v-list>
				<v-list v-else>
					<v-spacer />
					<v-list-item>
						<v-btn
							to="/registration/signup"
							color="accent"
							exact
							nuxt
							block
							@click="drawer = false"
							>Registrieren</v-btn
						>
					</v-list-item>
					<v-list-item>
						<v-btn
							to="/registration/signin"
							exact
							nuxt
							block
							text
							@click="drawer = false"
							>Einloggen</v-btn
						>
					</v-list-item>
				</v-list>
			</client-only>
		</v-navigation-drawer>
		<v-app-bar app>
			<v-row no-gutters align-content="center">
				<v-col cols="1" sm="4" align-self="center"
					><v-app-bar-nav-icon @click.stop="drawer = !drawer"
				/></v-col>
				<v-col cols="10" sm="4" align-self="center"
					><v-toolbar-title class="pa-0 d-flex justify-center"
						><v-btn to="/" nuxt exact text plain :ripple="false"
							><v-img
								contain
								width="200"
								src="/Sichere-Zuflucht-Logo.svg" /></v-btn></v-toolbar-title
				></v-col>
				<v-col cols="1" sm="4" align-self="center" class="d-flex justify-end">
					<div
						v-if="!user && $vuetify.breakpoint.smAndUp"
						class="d-flex justify-end"
						style="max-width: 300px"
					>
						<v-btn
							v-if="$vuetify.breakpoint.mdAndUp"
							to="/registration/signin"
							exact
							nuxt
							text
							class="mr-1"
							>Einloggen</v-btn
						>
						<v-btn to="/registration/signup" color="accent" exact nuxt
							>Registrieren</v-btn
						>
					</div>
					<client-only>
						<v-btn v-if="user" nuxt exact icon plain @click="logout()">
							<v-icon>mdi-logout</v-icon></v-btn
						>
					</client-only>
				</v-col>
			</v-row>
		</v-app-bar>
		<v-card
			dark
			color="red"
			width="70"
			style="position: fixed; bottom: 50px; right: 0; z-index: 100"
			href="https://www.brigitte.de/"
			tile
		>
			<v-card-text class="pa-1 d-flex flex-column align-center">
				<v-icon small>mdi-eye-off</v-icon>
				<p style="font-size: 10px; line-height: 10px" class="text-center mb-0">
					Seite verstecken
				</p>
			</v-card-text>
		</v-card>
		<v-main style="hyphens: auto" class="pb-0">
			<nuxt />
		</v-main>
		<UtilsFooter></UtilsFooter>
	</v-app>
</template>

<script>
	export default {
		data() {
			return {
				drawer: false,
				loggedInWoman: [
					{
						icon: 'mdi-view-dashboard',
						title: 'Mein Bereich',
						subgroup: [
							{
								icon: 'mdi-account-box',
								title: 'Beratung',
								to: '/frauen',
							},
							{
								icon: 'mdi-cog',
								title: 'Konto',
								to: '/frauen/settings',
							},
							/* {
              icon: 'mdi-shield-home',
              title: 'Wohnungen',
              to: '/frauen/wohnungssuche',
            }, */
						],
					},
				],
				loggedInCoach: [
					{
						icon: 'mdi-view-dashboard',
						title: 'Mein Bereich',
						subgroup: [
							{
								icon: 'mdi-account-box',
								title: 'Beratung',
								to: '/beratung',
							},
							{
								icon: 'mdi-account-box',
								title: 'Mein Profil',
								to: '/berater/me?name=',
								appendUser: true,
							},
							{
								icon: 'mdi-cog',
								title: 'Konto',
								to: '/beratung/settings',
							},
							{
								icon: 'mdi-credit-card',
								title: 'Bezahlung',
								to: '/beratung/bezahlung',
							},
						],
					},
				],
				noUser: [
					{
						icon: 'mdi-newspaper-variant',
						title: 'Magazin',
						to: '/magazine',
					},
					{
						icon: 'mdi-face-woman',
						title: 'Für Frauen',
						subgroup: [
							{
								icon: 'mdi-information-variant',
								title: 'Informationen',
								to: '/info/frauen',
							},
							{
								icon: 'mdi-account-search',
								title: 'Beratung finden',
								to: '/berater',
							},
						],
					},
					{
						icon: 'mdi-hand-heart',
						title: 'Helfen Sie',
						subgroup: [
							{
								icon: 'mdi-hand-heart',
								title: 'Als Berater*innen',
								to: '/info/berater',
							},
							{
								icon: 'mdi-hand-heart',
								title: 'Mit einer Unterkunft',
								to: '/info/unterkunft',
							},
						],
					},
					{
						icon: 'mdi-gift',
						title: 'Spenden',
						to: '/footer/spenden',
					},
					{
						icon: 'mdi-account-group',
						title: 'Über uns',
						to: '/footer/ueber-uns',
					},
				],
				nuid: '',
			};
		},
		async fetch() {
			//this.$store.dispatch('checkAuth');
		},
		mounted() {
			this.$matomo.trackPageView();
		},
		computed: {
			user() {
				return this.$store.getters['getCurrentUser'];
			},
		},
		methods: {
			logout() {
				this.$func.logout();
			},
		},
	};
</script>
