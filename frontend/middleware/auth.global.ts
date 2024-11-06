import { defineNuxtRouteMiddleware } from "nuxt/app";

export default defineNuxtRouteMiddleware((to) => {
  // Les composables sont disponibles globalement dans Nuxt 3
  const user = useSupabaseUser();

  // Liste des routes publiques
  const publicRoutes = ["/login"];

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une route protégée
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }

  // Si l'utilisateur est connecté et essaie d'accéder à la page de login
  if (user.value && to.path === "/login") {
    return navigateTo("/");
  }
});
