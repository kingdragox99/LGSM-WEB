<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="modelValue" class="modal-wrapper">
        <!-- Overlay -->
        <div 
          class="fixed inset-0 bg-black/50" 
          @click="$emit('update:modelValue', false)"
        />

        <!-- Modal Container -->
        <div class="fixed inset-0 overflow-y-auto z-[101]">
          <div class="flex min-h-full items-center justify-center p-4">
            <Transition name="modal">
              <div 
                class="relative w-full max-w-3xl transform rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl z-[102]"
              >
                <!-- Header -->
                <div class="flex items-center justify-between border-b border-base-200 pb-4">
                  <h3 class="text-lg font-bold">{{ title }}</h3>
                  <button 
                    class="btn btn-ghost btn-sm btn-circle"
                    @click="$emit('update:modelValue', false)"
                  >
                    <Icon name="ph:x-bold" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Content -->
                <div class="mt-4">
                  <slot></slot>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
  title: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>

<style scoped>
.modal-wrapper {
  position: fixed;
  inset: 0;
  z-index: 100;
}

/* Fade transition pour l'overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
