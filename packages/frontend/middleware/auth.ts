export default defineNuxtRouteMiddleware(async (to) => {
  const user = useSupabaseUser()
  const { path } = to

  // Permettre l'accès à la page de connexion
  if (path === '/login') {
    // Rediriger vers la page d'accueil si déjà connecté
    if (user.value) {
      return navigateTo('/')
    }
    return
  }

  // Rediriger vers la page de connexion si non connecté
  if (!user.value) {
    return navigateTo('/login')
  }
}) 