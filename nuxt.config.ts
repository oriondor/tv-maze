// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  components: [
    {
      path: "~/components/Components",
      pathPrefix: true,
      prefix: "base",
    },
    {
      path: "~/components/DashboardComponents",
      pathPrefix: false,
    },
  ],
  modules: [],
  css: [
    "~/assets/css/theme.css",
    "~/assets/css/main.css",
    "~/assets/css/scroll.css",
  ],
});
