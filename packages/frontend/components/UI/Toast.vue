<template>
  <div class="toast toast-top toast-end z-[1000]">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="alert shadow-lg"
      :class="{
        'alert-success': toast.type === 'success',
        'alert-error': toast.type === 'error',
        'alert-warning': toast.type === 'warning',
        'alert-info': toast.type === 'info',
      }"
    >
      <div class="flex items-center gap-2">
        <Icon :name="getIcon(toast.type)" class="w-6 h-6" />
        <div>
          <h3 class="font-bold">{{ toast.title }}</h3>
          <div class="text-sm">{{ toast.message }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Toast {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const toasts = ref<Toast[]>([]);

const getIcon = (type: Toast['type']) => {
  switch (type) {
    case 'success':
      return 'ph:check-circle-bold';
    case 'error':
      return 'ph:x-circle-bold';
    case 'warning':
      return 'ph:warning-bold';
    case 'info':
      return 'ph:info-bold';
    default:
      return 'ph:info-bold';
  }
};

const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
  const id = Date.now();
  toasts.value.push({ id, title, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
};

defineExpose({
  toasts,
  addToast
});
</script>
