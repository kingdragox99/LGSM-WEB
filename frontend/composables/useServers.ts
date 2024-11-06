import { ref } from 'vue'
import type { SSHServer, GameServer } from '~/types/server.types'

export function useServers() {
  const sshServers = ref<SSHServer[]>([])
  const gameServers = ref<GameServer[]>([])
  const loading = ref(false)
  const isLoading = ref(true)

  // Méthodes de fetch et de gestion des serveurs...

  return {
    sshServers,
    gameServers,
    loading,
    isLoading,
    fetchSSHServers,
    fetchGameServers,
    addGameServer,
    deleteGameServer
  }
} 