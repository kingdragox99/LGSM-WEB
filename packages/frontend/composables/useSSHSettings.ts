import { useSupabaseClient, useSupabaseUser } from '#imports'
import { useEncryption } from '~/utils/encryption'

interface SSHSettings {
  id?: string
  host: string
  username: string
  password: string
}

export const useSSHSettings = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()
  const { encrypt, decrypt } = useEncryption()

  const saveSettings = async (settings: SSHSettings) => {
    if (!user.value) throw new Error('Non authentifié')

    const encryptedData = {
      user_id: user.value.id,
      host: encrypt(settings.host),
      username: encrypt(settings.username),
      password: encrypt(settings.password),
      updated_at: new Date().toISOString()
    }

    const { data, error } = await client
      .from('ssh_settings')
      .upsert([encryptedData])
      .select()

    if (error) throw error
    return data
  }

  const getSettings = async () => {
    if (!user.value) throw new Error('Non authentifié')

    const { data, error } = await client
      .from('ssh_settings')
      .select('*')
      .eq('user_id', user.value.id)
      .single()

    if (error) throw error
    return data ? {
      ...data,
      host: decrypt(data.host),
      username: decrypt(data.username),
      password: decrypt(data.password)
    } : null
  }

  return {
    saveSettings,
    getSettings
  }
} 