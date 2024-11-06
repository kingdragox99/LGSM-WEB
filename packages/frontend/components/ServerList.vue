<template>
  <ServerCard
    v-for="server in servers"
    :key="server.id"
    :server="server"
    @start="handleStart"
    @stop="handleStop"
    @restart="handleRestart"
    @delete="handleDelete"
    @refresh="$emit('refresh')"
  />
</template>

<script setup>
import { useSupabaseClient } from '#imports'

defineProps({
  servers: {
    type: Array,
    required: true
  }
})

defineEmits(['refresh'])

const handleStart = async (serverId) => {
  console.log('Démarrage du serveur:', serverId)
}

const handleStop = async (serverId) => {
  console.log('Arrêt du serveur:', serverId)
}

const handleRestart = async (serverId) => {
  console.log('Redémarrage du serveur:', serverId)
}

const handleDelete = async (serverId) => {
  const supabase = useSupabaseClient()
  try {
    const { error } = await supabase
      .from('game_servers')
      .delete()
      .eq('id', serverId)

    if (error) throw error
    emit('refresh')
  } catch (err) {
    console.error('Erreur lors de la suppression du serveur:', err)
  }
}
</script> 