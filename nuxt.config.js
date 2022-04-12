import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - sicherezuflucht',
    title: 'sicherezuflucht',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
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
    '@nuxtjs/axios'
  ],

/*  axios: {
    baseURL: process.env.STRAPI_URL || 'http://localhost:1337/api', // Used as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.STRAPI_URL + '/api' || 'http://localhost:1337/api',
    }
  }, */

  axios: {
    baseURL: process.env.STRAPI_URL, // Used as fallback if no runtime config is provided
  },

  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.BROWSER_STRAPI_URL
    }
  },

  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.STRAPI_URL
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
