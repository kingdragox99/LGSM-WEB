export default defineNuxtPlugin(() => {
  const toast = useToast()

  return {
    provide: {
      notify: (title: string, description: string, color: 'red' | 'green' | 'yellow' | 'blue') => {
        toast.add({
          title,
          description,
          color,
          timeout: 5000
        })
      }
    }
  }
}) 