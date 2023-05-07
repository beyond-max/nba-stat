export default {
  target: 'static', // default is 'server'
  head: {
    title: "Sport Betting",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      {
        charset: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: "",
      },
      {
        name: "format-detection",
        content: "telephone=no",
      },
    ],
    link: [
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/favicon.ico",
      },
    ],
  },

  css: [
    // "~/assets/css/index.css",
    // "~/assets/css/index.scss",
    // "~/assets/css/variables/variables.scss",
  ],

  plugins: [
  ],
  components: true,
  buildModules: [],
  modules: [
    [
      "nuxt-fontawesome",
      {
        imports: [
          {
            set: "@fortawesome/free-solid-svg-icons",
            icons: ["fas"],
          },
          {
            set: "@fortawesome/free-brands-svg-icons",
            icons: ["fab"],
          },
        ],
      },
    ],
    '@nuxtjs/style-resources',
    // "@nuxtjs/auth",
    'bootstrap-vue/nuxt',
    '@nuxtjs/toast',
  ],
  toast: {
    position: 'top-center',
    duration: 3000,
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  },
  styleResources: {
    scss: ['~/assets/variables/*.scss']
  },
  server: {
      port: 4500,
  },
  build: {
    babel: {
      plugins: [
          "@babel/plugin-proposal-logical-assignment-operators"
      ],
  }
  },
  vue: {
    config: {
      productionTip: false,
      devtools: true,
    },
  },
};
