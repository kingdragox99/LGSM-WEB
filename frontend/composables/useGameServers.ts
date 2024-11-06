import type { GameServer } from '~/types/server'

export const useGameServers = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const createServer = async (serverData: Omit<GameServer, 'id' | 'status' | 'user_id'>) => {
    if (!user.value) throw new Error('Non authentifié')
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await client
        .from('game_servers')
        .insert([{
          ...serverData,
          user_id: user.value.id,
          status: 'stopped'
        }])
        .select()
        .single()

      if (err) throw err
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getServers = async () => {
    if (!user.value) throw new Error('Non authentifié')
    loading.value = true
    error.value = null

    try {
      const { data, error: err } = await client
        .from('game_servers')
        .select('*')
        .eq('user_id', user.value.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      return data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateServerStatus = async (serverId: string, status: 'running' | 'stopped' | 'error') => {
    if (!user.value) throw new Error('Non authentifié')
    
    try {
      const { error: err } = await client
        .from('game_servers')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', serverId)
        .eq('user_id', user.value.id)

      if (err) throw err
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      throw err
    }
  }

  const deleteServer = async (serverId: string) => {
    if (!user.value) throw new Error('Non authentifié')
    
    try {
      const { error: err } = await client
        .from('game_servers')
        .delete()
        .eq('id', serverId)
        .eq('user_id', user.value.id)

      if (err) throw err
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue'
      throw err
    }
  }

  return {
    createServer,
    getServers,
    updateServerStatus,
    deleteServer,
    loading,
    error
  }
} 