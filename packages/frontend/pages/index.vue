<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <PageHeader @add-server="showAddServerModal = true" />

    <!-- Main Content -->
    <main class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <LoadingState v-if="loading" />
      <NoUserState v-else-if="!user" />
      <EmptyState v-else-if="gameServers.length === 0" />
      <ServerList v-else :servers="gameServers" @refresh="fetchGameServers" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useSupabaseClient } from "#imports";
import { useRouter } from "vue-router";
import Modal from "~/components/UI/Modal.vue";

// Composables
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

// State
const showAddServerModal = ref(false);
const loading = ref(false);
const isLoading = ref(true);
const sshServers = ref([]);
const gameServers = ref([]);

// Fetch Methods
const fetchSSHServers = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await supabase
      .from("ssh_servers")
      .select("*")
      .eq("user_id", user.value?.id)
      .order("name");

    if (error) throw error;
    sshServers.value = data || [];
  } catch (err) {
    console.error("Erreur lors du chargement des serveurs SSH:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchGameServers = async () => {
  if (!user.value?.id) return;

  loading.value = true;
  try {
    const { data, error } = await supabase
      .from("game_servers")
      .select("*")
      .eq("user_id", user.value.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    gameServers.value = data || [];
  } catch (err) {
    console.error("Erreur lors du chargement des serveurs de jeu:", err);
  } finally {
    loading.value = false;
  }
};

// Handlers
const handleAddServer = async (formData) => {
  if (!user.value?.id) {
    console.error("Utilisateur non connecté");
    return;
  }

  loading.value = true;
  try {
    const selectedServer = sshServers.value.find(
      (server) => server.id === formData.ssh_server_id
    );

    if (!selectedServer) {
      throw new Error("Serveur SSH non trouvé");
    }

    const { error } = await supabase.from("game_servers").insert([
      {
        ...formData,
        user_id: user.value.id,
        ip: selectedServer.host,
      },
    ]);

    if (error) throw error;

    await fetchGameServers();
    showAddServerModal.value = false;
  } catch (err) {
    console.error("Erreur lors de la création du serveur:", err);
  } finally {
    loading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  if (user.value) {
    fetchGameServers();
  }
});

// Watchers
watch(user, (newUser) => {
  if (newUser) {
    fetchGameServers();
  } else {
    gameServers.value = [];
  }
});

watch(showAddServerModal, (newValue) => {
  if (newValue) {
    fetchSSHServers();
  }
});
</script>
