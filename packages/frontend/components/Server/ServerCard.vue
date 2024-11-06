<template>
  <div class="card bg-base-100 shadow-xl">
    <div class="card-body p-6">
      <!-- En-tête avec nom et statut -->
      <div class="flex justify-between items-center mb-4">
        <div class="flex items-center gap-3">
          <div class="avatar">
            <div
              class="w-12 h-12 rounded-lg bg-base-200 flex items-center justify-center text-center p-1"
            >
              <Icon :name="gameIcon" class="h-full w-full" />
            </div>
          </div>
          <div>
            <h2 class="card-title mb-1">{{ server.name }}</h2>
            <div class="badge" :class="statusClass">
              {{ server.status }}
            </div>
          </div>
        </div>

        <!-- Menu d'actions rapides -->
        <div class="dropdown dropdown-end">
          <label tabindex="0" class="btn btn-sm btn-ghost btn-circle">
            <Icon name="ph:dots-three-vertical-bold" class="h-4 w-4" />
          </label>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button @click="emit('delete', server.id)" class="text-error">
                <Icon name="ph:trash-bold" class="h-4 w-4" />
                Supprimer
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- Informations du serveur -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div class="stat bg-base-200 rounded-box p-4">
          <div class="stat-title text-xs uppercase font-semibold mb-2">
            Connexion
          </div>
          <div class="flex items-center justify-center gap-2">
            <button
              class="btn btn-sm gap-2 tooltip tooltip-right"
              @click="copyToClipboard"
              :data-tip="copied ? 'Copié !' : 'Copier l\'IP'"
            >
              <Icon
                :name="copied ? 'ph:check-bold' : 'ph:copy-bold'"
                class="h-4 w-4"
              />
              Copier l'IP
            </button>
          </div>
        </div>
        <div class="stat bg-base-200 rounded-box p-4">
          <div class="stat-title text-xs uppercase font-semibold mb-2">
            Serveur SSH
          </div>
          <div class="font-medium">
            {{ sshServerName }}
          </div>
        </div>
      </div>

      <!-- Actions du serveur -->
      <div class="flex justify-end gap-2">
        <div class="join">
          <button
            @click="handleStart"
            class="btn btn-sm join-item"
            :class="{ 
              'btn-success': server.status !== 'running',
              'loading': isLoading && currentAction === 'start'
            }"
            :disabled="server.status === 'running' || (isLoading && currentAction !== 'start')"
          >
            <Icon v-if="!(isLoading && currentAction === 'start')" name="ph:play-fill" class="h-4 w-4" />
          </button>

          <button
            @click="handleStop"
            class="btn btn-sm join-item"
            :class="{ 
              'btn-error': server.status !== 'stopped',
              'loading': isLoading && currentAction === 'stop'
            }"
            :disabled="server.status === 'stopped' || (isLoading && currentAction !== 'stop')"
          >
            <Icon v-if="!(isLoading && currentAction === 'stop')" name="ph:stop-fill" class="h-4 w-4" />
          </button>

          <button
            @click="handleRestart"
            class="btn btn-sm join-item"
            :class="{ 
              'btn-warning': server.status !== 'stopped',
              'loading': isLoading && currentAction === 'restart'
            }"
            :disabled="server.status === 'stopped' || (isLoading && currentAction !== 'restart')"
          >
            <Icon v-if="!(isLoading && currentAction === 'restart')" name="ph:arrows-clockwise-bold" class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface GameServer {
  id: string
  name: string
  game: string
  ip: string
  port: number
  status?: string
  ssh_server_id: string
  user_id: string
}

const props = defineProps<{
  server: GameServer;
}>();

const supabase = useSupabaseClient();
const sshServerName = ref("");
const copied = ref(false);

// Ajout des états locaux pour le chargement
const isLoading = ref(false);
const currentAction = ref<'start' | 'stop' | 'restart' | null>(null);

// Définir les émissions d'événements avec les paramètres corrects
const emit = defineEmits<{
  (e: "start", serverId: string): void;
  (e: "stop", serverId: string): void;
  (e: "restart", serverId: string): void;
  (e: "delete", serverId: string): void;
  (e: "refresh"): void;
}>();

// Calculer l'icône du jeu
const gameIcon = computed(() => {
  switch (props.server.game.toLowerCase()) {
    case "csgo":
      return "simple-icons:counterstrike";
    case "minecraft":
      return "logos:minecraft";
    case "valheim":
      return "game-icons:viking-helmet";
    default:
      return "ph:game-controller-bold";
  }
});

// Calculer la classe du badge de statut
const statusClass = computed(() => ({
  "badge-success": props.server.status === "running",
  "badge-error": props.server.status === "error",
  "badge-ghost": props.server.status === "stopped",
}));

// Charger le nom du serveur SSH
onMounted(async () => {
  if (props.server.ssh_server_id) {
    try {
      const { data, error } = await supabase
        .from("ssh_servers")
        .select("name")
        .eq("id", props.server.ssh_server_id)
        .single();

      if (error) throw error;
      sshServerName.value = data.name;
    } catch (err) {
      console.error("Erreur lors du chargement du serveur SSH:", err);
    }
  }
});

const copyToClipboard = async () => {
  const ipAndPort = `${props.server.ip}:${props.server.port}`;

  try {
    await navigator.clipboard.writeText(ipAndPort);
    copied.value = true;

    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Erreur lors de la copie:", err);
  }
};

// Gestionnaires d'événements modifiés
const handleStart = async () => {
  if (isLoading.value) return;
  
  currentAction.value = 'start';
  isLoading.value = true;
  
  try {
    await emit('start', props.server.id);
  } finally {
    isLoading.value = false;
    currentAction.value = null;
  }
};

const handleStop = async () => {
  if (isLoading.value) return;
  
  currentAction.value = 'stop';
  isLoading.value = true;
  
  try {
    await emit('stop', props.server.id);
  } finally {
    isLoading.value = false;
    currentAction.value = null;
  }
};

const handleRestart = async () => {
  if (isLoading.value) return;
  
  currentAction.value = 'restart';
  isLoading.value = true;
  
  try {
    await emit('restart', props.server.id);
  } finally {
    isLoading.value = false;
    currentAction.value = null;
  }
};
</script>

<style scoped>
.tooltip {
  position: relative;
}

.tooltip:hover::before {
  content: attr(data-tip);
  position: absolute;
  top: 50%;
  left: 100%;
  transform: translateY(-50%);
  margin-left: 0.5rem;
  padding: 0.25rem 0.5rem;
  background: hsl(var(--n));
  color: hsl(var(--nc));
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  z-index: 10;
}
</style>
