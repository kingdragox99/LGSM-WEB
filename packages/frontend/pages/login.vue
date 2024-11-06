<template>
  <div
    class="min-h-screen bg-base-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold">LGSM-WEB</h2>
        <p class="mt-2 text-base-content/60">
          {{ isLogin ? $t('auth.loginTitle') : $t('auth.registerTitle') }}
        </p>
      </div>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Email -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('auth.email') }}</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                :placeholder="$t('auth.email')"
                class="input input-bordered w-full"
                :class="{ 'input-error': error && error.includes('email') }"
                required
              />
            </div>

            <!-- Mot de passe -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">{{ $t('auth.password') }}</span>
                <span v-if="!isLogin" class="label-text-alt text-base-content/60">
                  {{ $t('auth.passwordMinLength') }}
                </span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="input input-bordered w-full pr-10"
                  :class="{ 'input-error': error && error.includes('password') }"
                  required
                />
                <button
                  type="button"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  @click="showPassword = !showPassword"
                  :title="$t('auth.showPassword')"
                >
                  <Icon
                    :name="showPassword ? 'ph:eye-slash' : 'ph:eye'"
                    class="h-5 w-5 text-base-content/60"
                  />
                </button>
              </div>
            </div>

            <!-- Message de succès/erreur -->
            <div 
              v-if="error || success" 
              class="alert shadow-lg mb-4"
              :class="{
                'alert-error': !success,
                'alert-success': success
              }"
            >
              <div class="flex items-center gap-2">
                <Icon 
                  :name="success ? 'ph:check-circle-bold' : 'ph:warning-bold'" 
                  class="h-6 w-6 flex-shrink-0" 
                />
                <span class="text-sm">{{ success || error }}</span>
              </div>
            </div>

            <!-- Bouton de soumission -->
            <button
              type="submit"
              class="btn btn-primary w-full"
              :class="{ loading: loading }"
              :disabled="loading"
            >
              {{ isLogin ? $t('auth.login') : $t('auth.register') }}
            </button>

            <!-- Lien de basculement -->
            <div class="text-center">
              <button
                type="button"
                class="btn btn-link"
                @click="isLogin = !isLogin"
              >
                {{ isLogin ? $t('auth.register') : $t('auth.login') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const router = useRouter();

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);

const formData = reactive({
  email: "",
  password: "",
});

const handleSubmit = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  try {
    if (isLogin.value) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        if (authError.message === "Invalid login credentials") {
          throw new Error("Email ou mot de passe incorrect");
        }
        throw authError;
      }

      if (data?.user) {
        router.push("/");
      }
    } else {
      if (formData.password.length < 6) {
        throw new Error("Le mot de passe doit contenir au moins 6 caractères");
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        if (authError.message.includes("User already registered")) {
          throw new Error("Cet email est déjà utilisé");
        }
        throw authError;
      }

      if (data?.user) {
        success.value = "Un email de confirmation vous a été envoyé.";
        formData.email = "";
        formData.password = "";
      }
    }
  } catch (err) {
    console.error("Erreur d'authentification:", err);
    error.value =
      err instanceof Error
        ? err.message
        : "Une erreur est survenue lors de l'authentification";
  } finally {
    loading.value = false;
  }
};

// Rediriger si déjà connecté
const user = useSupabaseUser();
watch(
  user,
  (newUser) => {
    if (newUser) {
      router.push("/");
    }
  },
  { immediate: true }
);
</script>
