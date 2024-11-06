import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  // Redirection de /setting vers /settings
  if (to.path === '/setting') {
    return navigateTo('/settings')
  }
}) 