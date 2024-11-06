<template>
  <div class="min-h-screen bg-base-200 p-4">
    <div class="container mx-auto">
      <!-- En-tête -->
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Mes serveurs de jeux</h1>
        <button class="btn btn-primary gap-2" @click="handleNewServer">
          <Icon name="ph:plus-bold" class="w-5 h-5" />
          Nouveau serveur
        </button>
      </div>

      <!-- Liste des serveurs -->
      <ClientOnly>
        <div v-if="servers.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServerCard
            v-for="server in servers"
            :key="server.id"
            :server="server"
            @start="handleStart"
            @stop="handleStop"
            @restart="handleRestart"
            @delete="handleDelete"
            @refresh="fetchServers"
          />
        </div>
        <div v-else class="text-center py-12">
          <!-- État vide -->
          <div class="mb-4">
            <Icon name="ph:game-controller-bold" class="w-16 h-16 mx-auto opacity-50" />
          </div>
          <h3 class="text-lg font-semibold mb-2">Aucun serveur de jeu</h3>
          <p class="text-base-content/60 mb-4">
            Commencez par créer votre premier serveur de jeu
          </p>
          <button class="btn btn-primary" @click="handleNewServer">
            Créer un serveur
          </button>
        </div>
      </ClientOnly>

      <!-- Modal de création -->
      <Modal v-model="showCreateModal" title="Créer un serveur de jeu">
        <ServerForm
          :loading="loading"
          :ssh-servers="sshServers"
          @submit="handleCreate"
          @cancel="showCreateModal = false"
        />
      </Modal>

      <UNotifications />
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports nécessaires
import Modal from "~/components/UI/Modal.vue";
import ServerCard from "~/components/Server/ServerCard.vue";
import ServerForm from "~/components/Server/ServerForm.vue";

// Middleware d'authentification
definePageMeta({
  middleware: "auth",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();

// Initialiser les refs avec des valeurs par défaut
const servers = ref<any[]>([]);
const sshServers = ref<any[]>([]);
const showCreateModal = ref(false);
const loading = ref(false);

const toast = useToast()

// Fonction utilitaire pour les notifications
const showNotification = (title: string, description: string, color: 'red' | 'green' | 'yellow' | 'blue') => {
  if (process.client) {
    toast.add({
      id: Date.now(),
      title,
      description,
      color,
      icon: color === 'red' ? 'i-heroicons-x-circle' 
           : color === 'green' ? 'i-heroicons-check-circle'
           : color === 'yellow' ? 'i-heroicons-exclamation-triangle'
           : 'i-heroicons-information-circle',
      timeout: 5000
    })
  }
}

// Fonction pour charger les données initiales
const fetchSSHServers = async () => {
  try {
    if (!user.value?.id) return;
    
    const { data, error } = await supabase
      .from("ssh_servers")
      .select("*")
      .eq("user_id", user.value.id);

    if (error) throw error;
    sshServers.value = data || [];
  } catch (err) {
    console.error("Erreur lors du chargement des serveurs SSH:", err);
    showNotification(
      "Erreur",
      "Erreur lors du chargement des serveurs SSH",
      "red"
    );
  }
};

const fetchServers = async () => {
  try {
    if (!user.value?.id) return;
    
    const { data, error } = await supabase
      .from("game_servers")
      .select("*")
      .eq("user_id", user.value.id);

    if (error) throw error;
    servers.value = data || [];
  } catch (err) {
    console.error("Erreur lors du chargement des serveurs:", err);
    showNotification(
      "Erreur",
      "Erreur lors du chargement des serveurs",
      "red"
    );
  }
};

// Gérer la création d'un serveur
const handleCreate = async (formData) => {
  loading.value = true;
  try {
    const sshServer = sshServers.value.find(
      (server) => server.id === formData.ssh_server_id
    );

    if (!sshServer) {
      throw new Error("Serveur SSH non trouvé");
    }

    const { error } = await supabase.from("game_servers").insert({
      ...formData,
      user_id: user.value?.id,
      status: "stopped",
      ip: sshServer.host,
    });

    if (error) throw error;

    await fetchServers();
    showCreateModal.value = false;
    showNotification(
      "Succès",
      "Serveur créé avec succès",
      "green"
    );
  } catch (err) {
    console.error("Erreur lors de la cration du serveur:", err);
    showNotification(
      "Erreur",
      "Erreur lors de la création du serveur",
      "red"
    );
  } finally {
    loading.value = false;
  }
};

// Gérer l'ouverture du modal
const handleNewServer = () => {
  if (!sshServers.value?.length) {
    showNotification(
      "Configuration requise",
      "Vous devez d'abord configurer un serveur SSH",
      "yellow"
    );
    // Rediriger vers la page des paramètres après un court délai
    setTimeout(() => {
      navigateTo('/settings');
    }, 1500);
    return;
  }
  showCreateModal.value = true;
};

// Gérer les actions sur les serveurs
const handleStart = async (serverId: string) => {
  try {
    const { error } = await supabase
      .from("game_servers")
      .update({ status: "running" })
      .eq("id", serverId);

    if (error) throw error;
    
    // Mettre à jour uniquement le serveur concerné
    servers.value = servers.value.map(server => 
      server.id === serverId 
        ? { ...server, status: "running" }
        : server
    );

    showNotification(
      "Succès",
      "Serveur démarré avec succès",
      "green"
    );
  } catch (err) {
    console.error("Erreur lors du démarrage du serveur:", err);
    showNotification(
      "Erreur",
      "Erreur lors du démarrage du serveur",
      "red"
    );
    throw err;
  }
};

const handleStop = async (serverId: string) => {
  try {
    const { error } = await supabase
      .from("game_servers")
      .update({ status: "stopped" })
      .eq("id", serverId);

    if (error) throw error;
    
    // Mettre à jour uniquement le serveur concerné
    servers.value = servers.value.map(server => 
      server.id === serverId 
        ? { ...server, status: "stopped" }
        : server
    );

    showNotification(
      "Succès",
      "Serveur arrêté avec succès",
      "green"
    );
  } catch (err) {
    console.error("Erreur lors de l'arrêt du serveur:", err);
    showNotification(
      "Erreur",
      "Erreur lors de l'arrêt du serveur",
      "red"
    );
    throw err;
  }
};

const handleRestart = async (serverId: string) => {
  try {
    // Mettre à jour le statut localement pour le redémarrage
    servers.value = servers.value.map(server => 
      server.id === serverId 
        ? { ...server, status: "stopped" }
        : server
    );
    
    await handleStop(serverId);
    
    servers.value = servers.value.map(server => 
      server.id === serverId 
        ? { ...server, status: "running" }
        : server
    );
    
    await handleStart(serverId);
    
    showNotification(
      "Succès",
      "Serveur redémarré avec succès",
      "green"
    );
  } catch (err) {
    console.error("Erreur lors du redémarrage du serveur:", err);
    showNotification(
      "Erreur",
      "Erreur lors du redémarrage du serveur",
      "red"
    );
    throw err;
  }
};

const handleDelete = async (serverId: string) => {
  try {
    const { error } = await supabase
      .from("game_servers")
      .delete()
      .eq("id", serverId);

    if (error) throw error;
    
    // Supprimer le serveur de la liste locale
    servers.value = servers.value.filter(server => server.id !== serverId);
    
    showNotification(
      "Succès",
      "Serveur supprimé avec succès",
      "green"
    );
  } catch (err) {
    console.error("Erreur lors de la suppression du serveur:", err);
    showNotification(
      "Erreur",
      "Erreur lors de la suppression du serveur",
      "red"
    );
  }
};

// Charger les données uniquement côté client
onMounted(async () => {
  await Promise.all([fetchServers(), fetchSSHServers()]);
});
</script>
