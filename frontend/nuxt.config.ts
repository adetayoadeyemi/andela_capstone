// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2025-12-21',
  devtools: { enabled: true },
  modules: ['@nuxt/fonts', 'vuetify-nuxt-module', '@nuxtjs/supabase', '@vueuse/nuxt'],

  vuetify: {
    moduleOptions: {
      styles: { configFile: 'assets/styles/settings.scss' },
    },
    vuetifyOptions: {
      theme: {
        defaultTheme: 'dark', // default 'system' requires `ssr: false` to avoid hydration warnings
      },
    },
  },
  runtimeConfig:{
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }
  },
  
  supabase:{
    redirectOptions:{
      login: '/auth/login',
      callback: '/auth/callback',
      exclude:[
        '/',
        '/auth/login',
      ],
      saveRedirectToCookie: true,
    },
    cookiePrefix:'capstone-frontend',
  }
})

