import fr from './i18n/locales/fr.json'
import en from './i18n/locales/en.json'

export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'fr',
  availableLocales: ['fr', 'en'],
  messages: {
    fr: {
      language: {
        fr: 'Français',
        en: 'Anglais'
      },
      ...fr
    },
    en: {
      language: {
        fr: 'French',
        en: 'English'
      },
      ...en
    }
  }
})) 