<template>
  <!-- Afficher un message si aucun serveur SSH n'est configuré -->
  <div v-if="!sshServers || sshServers.length === 0" class="text-center py-8">
    <Icon name="ph:terminal-window-bold" class="w-16 h-16 mx-auto text-base-content/40 mb-4" />
    <h3 class="text-lg font-semibold mb-2">Aucun serveur SSH configuré</h3>
    <p class="text-base-content/60 mb-4">
      Vous devez d'abord configurer un serveur SSH pour pouvoir créer un serveur de jeu
    </p>
    <NuxtLink to="/settings" class="btn btn-primary">
      <Icon name="ph:plus-bold" class="w-5 h-5 mr-2" />
      Configurer un serveur SSH
    </NuxtLink>
  </div>

  <!-- Afficher le formulaire uniquement si des serveurs SSH sont disponibles -->
  <form v-else @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Nom du serveur -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Nom du serveur</span>
      </label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Mon serveur"
        class="input input-bordered w-full"
        required
      />
    </div>

    <!-- Sélection du jeu avec recherche -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Jeu</span>
      </label>
      <div class="relative">
        <div class="relative">
          <input
            v-model="searchGame"
            type="text"
            placeholder="Rechercher un jeu..."
            class="input input-bordered w-full pr-10"
            @focus="handleFocus"
          />
          <button 
            v-if="selectedGameName"
            type="button" 
            class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-sm btn-circle"
            @click="clearGameSelection"
          >
            <Icon name="ph:x-bold" class="w-4 h-4" />
          </button>
        </div>
        
        <!-- Liste des jeux filtrés -->
        <div v-if="showGamesList && !selectedGameName" class="absolute z-50 w-full mt-1 bg-base-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <ul class="menu menu-compact">
            <li v-if="filteredGames.length === 0" class="menu-item opacity-50">
              <span class="p-4">Aucun jeu trouvé</span>
            </li>
            <li v-for="(game, index) in filteredGames" :key="index">
              <button
                type="button"
                class="p-4 hover:bg-base-300 w-full text-left"
                @click="selectGame(gameServers[availableGames.indexOf(game)], game)"
              >
                {{ game }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Serveur SSH -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Serveur SSH</span>
      </label>
      <select
        v-model="form.ssh_server_id"
        class="select select-bordered w-full"
        required
      >
        <option value="">Sélectionnez un serveur SSH</option>
        <option
          v-for="server in sshServers"
          :key="server.id"
          :value="server.id"
        >
          {{ server.name }} ({{ server.host }})
        </option>
      </select>
    </div>

    <!-- Port -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Port</span>
      </label>
      <input
        v-model.number="form.port"
        type="number"
        :placeholder="getDefaultPort(form.game)"
        class="input input-bordered w-full"
        required
      />
    </div>

    <!-- Actions -->
    <div class="modal-action">
      <button type="button" class="btn" @click="$emit('cancel')">
        Annuler
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? "Création..." : "Créer" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
interface SSHServer {
  id: string;
  name: string;
  host: string;
}

interface ServerForm {
  name: string;
  game: string;
  ssh_server_id: string;
  port: number | null;
}

// Props
const props = defineProps<{
  loading?: boolean;
  sshServers: SSHServer[];
}>();

// Emits
const emit = defineEmits<{
  (e: "submit", data: ServerForm): void;
  (e: "cancel"): void;
}>();

// État local
const form = reactive<ServerForm>({
  name: "",
  game: "",
  ssh_server_id: "",
  port: null,
});

const availableGames = ref<string[]>([]);
const gameServers = ref<string[]>([]);

// États pour la recherche
const searchGame = ref('')
const showGamesList = ref(false)
const selectedGameName = ref('')

// Filtrer les jeux en fonction de la recherche
const filteredGames = computed(() => {
  if (!searchGame.value) return availableGames.value
  
  const search = searchGame.value.toLowerCase()
  return availableGames.value.filter(game => 
    game.toLowerCase().includes(search)
  )
})

// Sélectionner un jeu
const selectGame = (gameServer: string, gameName: string) => {
  form.game = gameServer
  selectedGameName.value = gameName
  searchGame.value = gameName
  showGamesList.value = false
}

// Effacer la sélection
const clearGameSelection = () => {
  form.game = ''
  selectedGameName.value = ''
  searchGame.value = ''
  showGamesList.value = true
}

// Gérer le focus de l'input
const handleFocus = () => {
  if (!selectedGameName.value) {
    showGamesList.value = true
  }
}

// Charger la liste des jeux au montage
onMounted(async () => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/BlueSquare23/web-lgsm/refs/heads/master/json/game_servers.json"
    );
    const data = await response.json();
    availableGames.value = data.server_names;
    gameServers.value = data.servers;
  } catch (err) {
    console.error("Erreur lors du chargement des jeux:", err);
  }

  // Fermer la liste quand on clique en dehors
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.form-control')) {
      showGamesList.value = false
    }
  })
});

// Nettoyer l'event listener
onUnmounted(() => {
  document.removeEventListener('click', () => {})
})

// Ports par défaut pour certains jeux
const defaultPorts = {
  csgoserver: 27015,
  minecraftserver: 25565,
  valheimserver: 2456,
};

const getDefaultPort = (game: string) => {
  return defaultPorts[game] || "";
};

const handleSubmit = () => {
  emit("submit", { ...form });
};

// Vérifier la présence de serveurs SSH
const hasSSHServers = computed(() => props.sshServers && props.sshServers.length > 0)
</script>

<style scoped>
.menu {
  border: 1px solid hsl(var(--b3));
}

.menu-item {
  border-bottom: 1px solid hsl(var(--b3));
}

.menu-item:last-child {
  border-bottom: none;
}
</style>
