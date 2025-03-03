// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/supabase'],
  ssr: false,
  devtools: { enabled: true },
  css: ['normalize.css', '@/assets/css/global.scss'],
  runtimeConfig: {
    public: {
      googleServiceAccountEmail: '',
      googlePrivateKey: '',
      spreadSheetId: '',
      supabaseRedirectUrl: '',
    },
  },
  compatibilityDate: '2024-11-01',
  eslint: {
    config: {
      stylistic: true,
    },
  },
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
  },
})
