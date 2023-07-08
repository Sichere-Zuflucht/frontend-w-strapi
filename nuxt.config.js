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
	plugins: ['~/plugins/cropper', '~/plugins/functions'],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [
		// https://go.nuxtjs.dev/vuetify
		'@nuxtjs/vuetify',
	],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/strapi',
		'@nuxtjs/markdownit',
		'nuxt-stripe-module',
		'@dansmaculotte/nuxt-security',
	],

	security: {
		hsts: {
			maxAge: 31536000,
			includeSubDomains: true,
			preload: true,
		},
		referrer: 'same-origin',
		csp: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'"],
				objectSrc: ["'self'"],
			},
			reportOnly: false,
		},
		permissions: {
			notifications: ['none'],
		},
		securityFile: {
			contacts: ['mailto:support@sichere-zuflucht.de'],
			// or contacts: 'mailto:security@example.com'
			canonical: 'https://sichere-zuflucht.de/.well-know/security.txt',
			preferredLanguages: 'de',
			// or preferredLanguages: 'fr',
			encryptions: ['https://sichere-zuflucht.de/pgp-key.txt'],
			// or encryptions: 'https://example.com/pgp-key.txt',
			//acknowledgments: ['https://sichere-zuflucht.de/hall-of-fame.html'],
			// or acknowledgments: 'https://example.com/hall-of-fame.html',
			policies: ['https://sichere-zuflucht.de/footer/impressum'],
			// or policies: 'https://example.com/policy.html',
			//hirings: ['https://sichere-zuflucht.de/jobs.html']
			// or hirings: 'https://example.com/jobs.html'
		},
		additionalHeaders: true,
	},

	axios: {
		// WARNING: baseURL and proxy cannot be used at the same time,
		// so when the proxy option is in use, you need to define prefix
		// instead of baseURL
		baseURL: process.env.RUBY_URL, //'https://zuflucht.workspace-001.de/api/v1/', //'http://localhost:2901/api/v1/',

		// WARNING: proxy doesn't work with nuxt generate,
		// have to use a prefix and set an API_URL
		// prefix: 'http://localhost:2901/api/v1',
		// proxy: true,
		//baseURL: process.env.STRAPI_URL, // || 'http://localhost:1337', // Used as fallback if no runtime config is provided
	},

	strapi: {
		url: 'http://localhost:1337/api', // process.env.STRAPI_URL, //process.env.STRAPI_URL, //|| 'http://localhost:1337/api', // erased + '/api'
		entities: ['meetings', 'users', 'magazines', 'tags', 'faq'],
		expires: '1d',
		cookie: {
			path: '/',
		},
	},

	markdownit: {
		runtime: true, // Support `$md()`
	},

	publicRuntimeConfig: {
		rubyurl: process.env.RUBY_URL,
		strapi: {
			url: process.env.STRAPI_URL,
		},
		stripe: {
			publishableKey: process.env.STRIPE_PK,
		},
		slackUrl: process.env.SLACK_WEBHOOK,
		donate1: process.env.DONATION_1,
		donate2: process.env.DONATION_2,
		donate3: process.env.DONATION_3,
		donate4: process.env.DONATION_4,
		status: process.env.NODE_ENV,
	},

	generate: {
		// create an array of all routes for generating static pages
		// careful, this is only used by `npm run generate`. These must match SPA mode routes
		/*routes: async function () {
			const userRoute = await axios
				.get(process.env.STRAPI_URL + '/users')
				.then(async (response) => {
					let users = response.data.map((user) => {
						return {
							route: '/berater/' + user.username,
							payload: user,
						};
					});
					return [...users];
				});
			const magazineRoute = await axios
				.get(process.env.STRAPI_URL + '/magazines')
				.then((response) => {
					let magazines = response.data.data.map((magazin) => {
						return {
							route: '/magazine/' + magazin.attributes.slug,
							payload: magazin,
						};
					});
					return [...magazines];
				});
			return [...userRoute, ...magazineRoute];
		},*/
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
