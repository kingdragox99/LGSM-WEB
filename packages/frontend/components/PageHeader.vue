<template>
  <header
    class="flex justify-between items-center mb-8 p-4 bg-base-100 rounded-lg shadow-md"
  >
    <h1 class="text-3xl font-bold text-primary">Mes serveurs de jeux</h1>
    <button
      class="btn btn-primary gap-2 hover:shadow-lg transition-all"
      @click="isModalOpen = true"
    >
      <Icon name="ph:plus-bold" class="w-5 h-5" />
      Ajouter un serveur
    </button>
  </header>

  <!-- Modal -->
  <div
    v-if="isModalOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-orange-500 w-[900px] h-[600px] rounded-lg p-6 relative">
      <button
        @click="isModalOpen = false"
        class="absolute top-4 right-4 text-white hover:text-gray-200"
      >
        <Icon name="ph:x-bold" class="w-6 h-6" />
      </button>

      <!-- Contenu de la modal -->
      <h2 class="text-2xl font-bold text-white mb-4">
        Ajouter un nouveau serveur
      </h2>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(["add-server"]);
const isModalOpen = ref(false);
</script>
