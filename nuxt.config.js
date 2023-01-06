import colors from 'vuetify/es5/util/colors'
import axios from 'axios'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Trying to overcome the problem of regenerating each time, if a new content comes from strapi
  mode: "spa",

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Maybe helpful to see the /favicon.ico in generated mode
  router: { base: '/' },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - sicherezuflucht',
    title: 'sicherezuflucht',
    htmlAttrs: {
      lang: 'de'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        href:
          'https://fonts.googleapis.com/css2?family=Exo:ital,wght@0,300;0,400;0,' +
          '600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap',
        rel: 'stylesheet',
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  env: {
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/cropper",
    "~/plugins/filepond",
  ],

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
  ],

  axios: {
    //baseURL: process.env.STRAPI_URL, // || 'http://localhost:1337', // Used as fallback if no runtime config is provided
  },
/*
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.STRAPI_URL + '/api' || 'http://localhost:1337/api',
    }
  }, */

  strapi: {
    url: 'http://localhost:1337/api', // process.env.STRAPI_URL, //process.env.STRAPI_URL, //|| 'http://localhost:1337/api', // erased + '/api'
    entities: ['meetings', 'users', 'magazines', 'tags', 'faq'],
    expires: '30d',
    cookie: {
      path: '/'
    }
  },

  markdownit: {
    runtime: true, // Support `$md()`
  },

  publicRuntimeConfig: {
    strapi: {
      url: process.env.STRAPI_URL,
    },
    redAPI: process.env.RED_API,
    test: process.env.TEST,
    stripe: {
      publishableKey:
        process.env.STRIPE_PK,
    },
  },

  generate: {
    // create an array of all routes for generating static pages
    // careful, this is only used by `npm run generate`. These must match SPA mode routes

    routes:
      async function () {
        const userRoute = await axios.get(process.env.STRAPI_URL+"/users")
          .then(async (response) => {
            let users = response.data.map((user) => {
                return {
                  route: '/berater/' + user.username,
                  payload: user
                }
            });
            return [...users]
        });
        const magazineRoute = await axios.get(process.env.STRAPI_URL+"/magazines")
          .then((response) => {
            let magazines = response.data.data.map((magazin) => {
                return {
                  route: '/magazine/' + magazin.attributes.slug,
                  payload: magazin
                }
            });
            return [...magazines]
          })
      return [...userRoute, ...magazineRoute]
      }
   },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
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
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  }
}
