<template>
  <div class="navbar bg-base-100 shadow">
    <div class="navbar-start">
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl gap-2">
        <span>LGSM-WEB</span>
      </NuxtLink>
    </div>

    <div class="navbar-end gap-2">
      <div class="dropdown dropdown-end">
        <label tabindex="0" class="btn btn-ghost btn-sm gap-2">
          <img
            :src="`https://flagcdn.com/w40/${$i18n.locale === 'en' ? 'gb' : $i18n.locale}.png`"
            :alt="$i18n.locale"
            class="w-5 h-4 object-cover rounded"
          />
          <Icon name="ph:caret-down-bold" class="w-4 h-4" />
        </label>
        <ul
          tabindex="0"
          class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 z-50"
        >
          <li v-for="locale in localeOptions" :key="locale.code">
            <a
              @click="$i18n.locale = locale.code"
              :class="{ active: $i18n.locale === locale.code }"
              class="flex items-center gap-2"
            >
              <img
                :src="`https://flagcdn.com/w40/${locale.code === 'en' ? 'gb' : locale.code}.png`"
                :alt="locale.code"
                class="w-5 h-4 object-cover rounded"
              />
              {{ locale.label }}
            </a>
          </li>
        </ul>
      </div>

      <template v-if="user">
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
                {{ $t("navigation.logout") }}
              </a>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const route = useRoute();
const router = useRouter();
const user = useSupabaseUser();

// Configuration des locales
const localeOptions = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

const handleLogout = async () => {
  try {
    await supabase.auth.signOut();
    router.push("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};
</script>

<style scoped>
.dropdown-content {
  min-width: 8rem;
  z-index: 50;
}
</style>
