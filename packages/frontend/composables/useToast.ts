import { type Ref } from 'vue'

interface ToastMethods {
  addToast: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => void
}

const ToastSymbol = Symbol('CustomToast')

export function provideCustomToast(toastRef: Ref<any>) {
  const toast = {
    addToast: (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info') => {
      if (toastRef.value?.addToast) {
        toastRef.value.addToast(title, message, type)
      }
    }
  }
  provide(ToastSymbol, toast)
}

export function useCustomToast(): ToastMethods {
  const toast = inject<ToastMethods>(ToastSymbol)
  if (!toast) {
    throw new Error('No toast provided!')
  }
  return toast
} 