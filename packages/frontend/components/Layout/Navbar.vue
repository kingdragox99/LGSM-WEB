<template>
  <div class="navbar bg-base-100 shadow">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl gap-2">
        <span>LGSM-WEB</span>
      </NuxtLink>
    </div>

    <div class="navbar-end gap-2">
      <NuxtLink
        to="/settings"
        class="btn btn-ghost btn-circle"
        :class="{ 'btn-active': route.path === '/settings' }"
      >
        <Icon name="ph:gear-fill" class="h-6 w-6" />
      </NuxtLink>

      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <Icon name="ph:user-circle-fill" class="h-10 w-10" />
          </div>
        </label>
        <ul
          tabindex="0"
          class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <a @click="handleLogout" class="text-error">
              <Icon name="ph:sign-out-bold" class="h-5 w-5" />
              Déconnexion
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    router.push("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};
</script>
