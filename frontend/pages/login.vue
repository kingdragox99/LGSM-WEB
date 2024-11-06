<template>
  <div
    class="min-h-screen bg-base-200 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold">LGSM-WEB</h2>
        <p class="mt-2 text-base-content/60">
          {{ isLogin ? $t("auth.loginTitle") : $t("auth.registerTitle") }}
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
                <span class="label-text">{{ $t("auth.email") }}</span>
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
              <label class="label flex flex-col items-start">
                <span class="label-text">{{ $t("auth.password") }}</span>
                <span
                  v-if="!isLogin"
                  class="label-text-alt text-base-content/60"
                >
                  {{ $t("auth.passwordRequirements") }}
                </span>
              </label>
              <div class="relative">
                <input
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="input input-bordered w-full pr-10"
                  :class="{
                    'input-error': error && error.includes('password'),
                  }"
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
                'alert-success': success,
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
              {{ isLogin ? $t("auth.login") : $t("auth.register") }}
            </button>

            <!-- Lien de basculement -->
            <div class="text-center">
              <button
                type="button"
                class="btn btn-link"
                @click="isLogin = !isLogin"
              >
                {{ isLogin ? $t("auth.register") : $t("auth.login") }}
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
const { t } = useI18n();

const isLogin = ref(true);
const loading = ref(false);
const error = ref("");
const success = ref("");
const showPassword = ref(false);

const formData = reactive({
  email: "",
  password: "",
});

// Ajouter cette fonction de validation
const isStrongPassword = (password: string): boolean => {
  const hasLowerCase = /[a-z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?/`~]/.test(password);
  
  return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
};

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
          throw new Error(t('auth.errors.invalidCredentials'));
        }
        throw authError;
      }

      if (data?.user) {
        router.push("/");
      }
    } else {
      if (formData.password.length < 8) {
        throw new Error(t('auth.errors.passwordLength'));
      }

      if (!isStrongPassword(formData.password)) {
        throw new Error(t('auth.errors.passwordRequirements'));
      }

      const { data, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: new URL('/login', window.location.origin).toString(),
          data: {
            email: formData.email,
          }
        },
      });

      if (authError) {
        console.error('Détails de l\'erreur:', authError);
        
        switch (authError.message) {
          case "User already registered":
          case "Email already taken":
            throw new Error(t('auth.errors.emailTaken'));
          case "Email rate limit exceeded":
            throw new Error(t('auth.errors.rateLimit'));
          case "Password should contain at least one character of each":
            throw new Error(t('auth.errors.passwordRequirements'));
          default:
            throw new Error(`${t('auth.errors.default')} (${authError.message})`);
        }
      }

      if (data?.user) {
        success.value = t('auth.success.confirmationEmail');
        formData.email = "";
        formData.password = "";
      }
    }
  } catch (err) {
    console.error("Erreur d'authentification:", err);
    error.value = err instanceof Error ? err.message : t('auth.errors.default');
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
