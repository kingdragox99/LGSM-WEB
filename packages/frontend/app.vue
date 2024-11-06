<template>
  <div>
    <!-- Afficher la Navbar seulement si l'utilisateur est connecté -->
    <LayoutNavbar  v-if="user" />
    
    <!-- Contenu principal -->
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const user = useSupabaseUser()
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}
.page-leave-to,
.page-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
