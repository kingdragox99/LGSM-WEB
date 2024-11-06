<template>
  <div>
    <Navbar />
    <NuxtPage />
    <UNotifications />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/Layout/Navbar.vue'
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
