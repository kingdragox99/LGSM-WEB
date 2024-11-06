<template>
  <div
    :model-value="modelValue"
    title="Ajouter un nouveau serveur"
    class="modal-box max-w-3xl w-full p-6"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div
      v-if="isLoading"
      class="flex justify-center items-center min-h-[200px]"
    >
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div
      v-else-if="!sshServers.length"
      class="alert alert-warning shadow-lg p-6 min-h-[200px] flex items-center"
    >
      <Icon name="ph:warning-circle-bold" class="w-6 h-6" />
      <div class="flex flex-col gap-4">
        <span class="font-medium text-lg"
          >Vous devez d'abord ajouter un serveur SSH</span
        >
        <button class="btn btn-primary w-fit" @click="router.push('/settings')">
          Ajouter un serveur SSH
        </button>
      </div>
    </div>

    <div v-else class="py-4">
      <ServerForm
        :loading="loading"
        :ssh-servers="sshServers"
        @submit="$emit('add-server', $event)"
        @cancel="$emit('update:modelValue', false)"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: Boolean,
  loading: Boolean,
  isLoading: Boolean,
  sshServers: {
    type: Array,
    default: () => [],
  },
});

defineEmits(["update:modelValue", "add-server"]);

const router = useRouter();
</script>
