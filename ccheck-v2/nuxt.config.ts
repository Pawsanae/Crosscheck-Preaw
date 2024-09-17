// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  modules: ["@nuxt/ui"],
  devtools: { enabled: true },
  app: {
    pageTransition: { name: "page", mode: "out-in" },
  },
  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
  },
  runtimeConfig: {
    public: {
      BASE_API_URL: "http://127.0.0.1:8888",
    },
  },
  plugins: [
    '~/plugins/sigma.js'
  ]
}
);
