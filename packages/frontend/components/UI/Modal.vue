<template>
  <TransitionRoot appear :show="modelValue" as="template">
    <Dialog
      as="div"
      class="relative z-[100]"
      @close="$emit('update:modelValue', false)"
    >
      <!-- Overlay -->
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50" />
      </TransitionChild>

      <!-- Modal Container -->
      <div class="fixed inset-0 overflow-y-auto z-[101]">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel 
              class="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-base-100 p-6 text-left align-middle shadow-xl transition-all z-[102]"
            >
              <!-- Header -->
              <DialogTitle 
                as="div" 
                class="flex items-center justify-between border-b border-base-200 pb-4"
              >
                <h3 class="text-lg font-bold">{{ title }}</h3>
                <button 
                  class="btn btn-ghost btn-sm btn-circle"
                  @click="$emit('update:modelValue', false)"
                >
                  <Icon name="ph:x-bold" class="w-5 h-5" />
                </button>
              </DialogTitle>

              <!-- Content -->
              <div class="mt-4">
                <slot></slot>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

defineProps<{
  modelValue: boolean;
  title: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();
</script>
