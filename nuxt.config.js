import colors from 'vuetify/es5/util/colors';
import axios from 'axios';

export default {
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: true,

	// Trying to overcome the problem of regenerating each time, if a new content comes from strapi
	mode: 'spa',

	// Target: https://go.nuxtjs.dev/config-target
	target: 'static',

	// Maybe helpful to see the /favicon.ico in generated mode
	router: { base: '/', middleware: 'global' },

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		titleTemplate: '%s - sicherezuflucht',
		title: 'sicherezuflucht',
		htmlAttrs: {
			lang: 'de',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: '' },
			{ name: 'format-detection', content: 'telephone=no' },
			{ name: 'referrer', content: 'no-referrer' },
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
			{ rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
			{ rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
		],
		/*script: [
			{
				src: '//cdn.cookie-script.com/s/82dfb0411595d1e11442ab034e524cac.js',
				type: 'text/javascript',
				charset: 'UTF-8',
			},
		],*/
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: [],

	env: {
		RUBY_URL: process.env.RUBY_URL,
	},

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: ['~/plugins/croppa', '~/plugins/functions'],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: ['@nuxtjs/axios', '@nuxt/content', 'nuxt-stripe-module'],

	axios: {
		baseURL: process.env.RUBY_URL,
	},

	publicRuntimeConfig: {
		rubyurl: process.env.RUBY_URL,
		stripe: {
			publishableKey: process.env.STRIPE_PK,
		},
		slackUrl: process.env.SLACK_WEBHOOK,
		donate1: process.env.DONATION_1,
		donate2: process.env.DONATION_2,
		donate3: process.env.DONATION_3,
		donate4: process.env.DONATION_4,
	},

	// Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
	vuetify: {
		customVariables: ['~/assets/variables.scss'],
		treeShake: true,
		defaultAssets: {
			font: false,
			icons: 'mdi',
		},
		options: {
			customProperties: true,
		},

		theme: {
			dark: false,
			themes: {
				light: {
					primary: colors.pink.lighten3, // purple.lighten3,
					accent: colors.pink.darken4, // grey.darken3,
					secondary: colors.yellow.darken3, // amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.teal.darken1,
				},
				dark: {
					primary: colors.purple.lighten4,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.teal.darken1,
				},
			},
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {},
};
