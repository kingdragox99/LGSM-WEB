import { useToast } from "#ui/composables";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      toast: {
        add: (options: {
          title: string,
          description?: string,
          color?: 'red' | 'green' | 'yellow' | 'blue',
          timeout?: number
        }) => {
          const { $ui } = useNuxtApp()
          $ui.notify({
            ...options,
            timeout: options.timeout || 5000
          })
        },
        clear: () => {
          const { $ui } = useNuxtApp()
          $ui.notifications.clear()
        }
      }
    }
  }
})
