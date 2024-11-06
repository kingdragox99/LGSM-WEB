import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  // Nom de l'application
  app: {
    head: {
      title: "LGSM-WEB",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Linux Game Server Manager Web Interface",
        },
      ],
    },
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },

  // Configuration TypeScript
  typescript: {
    strict: true,
    typeCheck: false,
  },

  // Modules recommandés pour LGSM-WEB
  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "@nuxtjs/supabase",
    "@nuxt/icon",
    "@nuxtjs/i18n",
  ],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: [],
    },
    redirect: false,
  },

  // Configuration du dev server
  devServer: {
    port: 3000,
  },

  // Variables d'environnement
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || "http://localhost:3000",
      encryptionKey: process.env.ENCRYPTION_KEY,
    },
  },

  routeRules: {
    "/login": { ssr: false },
  },

  devtools: { enabled: true },

  ui: {
    notifications: {
      // Position des notifications
      position: "top-right",
      // Configuration par défaut
      default: {
        timeout: 5000,
        showIcon: true,
      },
      // Styles pour chaque type de notification
      notifications: {
        success: {
          color: "green",
        },
        error: {
          color: "red",
        },
        warning: {
          color: "yellow",
        },
        info: {
          color: "blue",
        },
      },
    },
  },

  i18n: {
    vueI18n: './i18n.config.ts'
  },
});
