<template>
  <div class="min-h-screen bg-base-200 p-4">
    <div class="container mx-auto max-w-4xl">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold">Serveurs SSH</h1>
        <button 
          @click="showAddServer = true"
          class="btn btn-primary gap-2"
        >
          <Icon name="ph:plus-bold" class="h-5 w-5" />
          Ajouter un serveur SSH
        </button>
      </div>

      <!-- État de chargement -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <!-- Message d'erreur -->
      <div v-else-if="error" class="alert alert-error shadow-lg">
        <Icon name="ph:warning-bold" class="h-6 w-6" />
        <span>{{ error }}</span>
      </div>

      <!-- Liste des serveurs SSH -->
      <div v-else class="grid gap-6">
        <!-- Message si aucun serveur -->
        <div v-if="!servers?.length" class="card bg-base-100 shadow-xl">
          <div class="card-body items-center text-center">
            <Icon 
              name="ph:terminal-window-bold" 
              class="h-16 w-16 text-base-content/40"
            />
            <h2 class="card-title">Aucun serveur SSH</h2>
            <p class="text-base-content/60">Ajoutez un serveur SSH pour commencer</p>
          </div>
        </div>

        <!-- Liste des serveurs -->
        <div 
          v-else
          v-for="server in servers" 
          :key="server.id"
          class="card bg-base-100 shadow-xl"
        >
          <div class="card-body">
            <div class="flex justify-between items-start">
              <h2 class="card-title flex items-center gap-2">
                <Icon name="ph:terminal-window-bold" class="h-6 w-6" />
                {{ server.name }}
              </h2>
              <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-ghost btn-circle">
                  <Icon name="ph:dots-three-vertical-bold" class="h-5 w-5" />
                </label>
                <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button @click="editServer(server)">
                      <Icon name="ph:pencil-bold" class="h-4 w-4" />
                      Modifier
                    </button>
                  </li>
                  <li>
                    <button @click="deleteServer(server)" class="text-error">
                      <Icon name="ph:trash-bold" class="h-4 w-4" />
                      Supprimer
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div class="stat bg-base-200 rounded-box">
                <div class="stat-title">Hôte</div>
                <div class="stat-value text-lg font-mono">{{ server.host }}</div>
              </div>
              <div class="stat bg-base-200 rounded-box">
                <div class="stat-title">Utilisateur</div>
                <div class="stat-value text-lg font-mono">{{ server.username }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout/modification -->
    <UIModal
      v-model="showAddServer"
      :title="editingServer ? 'Modifier le serveur SSH' : 'Ajouter un serveur SSH'"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="form-control">
          <label class="label">
            <span class="label-text">Nom du serveur</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Serveur principal"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Hôte</span>
          </label>
          <input
            v-model="form.host"
            type="text"
            placeholder="exemple.com"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Nom d'utilisateur</span>
          </label>
          <input
            v-model="form.username"
            type="text"
            placeholder="root"
            class="input input-bordered w-full"
            required
          />
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">Mot de passe</span>
          </label>
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="••••••••"
            class="input input-bordered w-full"
            required
          />
          <label class="label cursor-pointer justify-end">
            <span class="label-text-alt mr-2">Afficher le mot de passe</span>
            <input 
              type="checkbox" 
              v-model="showPassword" 
              class="checkbox checkbox-sm"
            />
          </label>
        </div>

        <div class="modal-action">
          <button 
            type="button" 
            class="btn" 
            @click="closeModal"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            class="btn btn-primary"
            :class="{ 'loading': loading }"
            :disabled="loading"
          >
            {{ loading ? 'Enregistrement...' : editingServer ? 'Modifier' : 'Ajouter' }}
          </button>
        </div>
      </form>
    </UIModal>
  </div>
</template>

<script setup lang="ts">
interface SSHServer {
  id?: string
  name: string
  host: string
  username: string
  password: string
}

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const loading = ref(false)
const error = ref<string | null>(null)
const showPassword = ref(false)
const showAddServer = ref(false)
const servers = ref<SSHServer[]>([])
const editingServer = ref<SSHServer | null>(null)

const form = ref<SSHServer>({
  name: '',
  host: '',
  username: '',
  password: ''
})

// Charger les serveurs au montage
onMounted(async () => {
  loading.value = true
  try {
    await loadServers()
  } finally {
    loading.value = false
  }
})

const loadServers = async () => {
  if (!user.value) return

  try {
    const { data, error: err } = await supabase
      .from('ssh_servers')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })

    if (err) throw err
    servers.value = data || []
  } catch (err) {
    console.error('Erreur lors du chargement des serveurs:', err)
    error.value = 'Impossible de charger les serveurs'
  }
}

const handleSubmit = async () => {
  if (!user.value) {
    error.value = 'Vous devez être connecté pour effectuer cette action'
    return
  }

  loading.value = true
  error.value = null
  
  try {
    if (editingServer.value) {
      // Modification
      const { error: err } = await supabase
        .from('ssh_servers')
        .update({
          name: form.value.name,
          host: form.value.host,
          username: form.value.username,
          password: form.value.password,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingServer.value.id)
        .eq('user_id', user.value.id)

      if (err) throw err
    } else {
      // Ajout
      const { error: err } = await supabase
        .from('ssh_servers')
        .insert([{
          ...form.value,
          user_id: user.value.id
        }])

      if (err) throw err
    }

    await loadServers()
    closeModal()
  } catch (err) {
    console.error('Erreur lors de l\'enregistrement:', err)
    error.value = 'Impossible d\'enregistrer le serveur'
  } finally {
    loading.value = false
  }
}

const editServer = (server: SSHServer) => {
  editingServer.value = server
  form.value = { ...server }
  showAddServer.value = true
}

const deleteServer = async (server: SSHServer) => {
  if (!user.value) return
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce serveur ?')) return

  loading.value = true
  try {
    const { error: err } = await supabase
      .from('ssh_servers')
      .delete()
      .eq('id', server.id)
      .eq('user_id', user.value.id)

    if (err) throw err
    await loadServers()
  } catch (err) {
    console.error('Erreur lors de la suppression:', err)
    error.value = 'Impossible de supprimer le serveur'
  } finally {
    loading.value = false
  }
}

const closeModal = () => {
  showAddServer.value = false
  editingServer.value = null
  form.value = {
    name: '',
    host: '',
    username: '',
    password: ''
  }
}
</script>
