<template>
  <div class="auth-view">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-card">
            <!-- Logo et titre -->
            <div class="text-center mb-4">
              <i class="bi bi-chat-square-text-fill text-primary fs-1 mb-3 d-block"></i>
              <h2 class="fw-bold">Forum Communautaire</h2>
              <p class="text-muted">
                {{ mode === 'login' ? 'Bon retour parmi nous !' : 'Rejoignez notre communauté' }}
              </p>
            </div>

            <!-- Onglets -->
            <div class="nav nav-pills nav-fill mb-4" role="tablist">
              <button
                class="nav-link"
                :class="{ active: mode === 'login' }"
                @click="switchMode('login')"
              >
                Connexion
              </button>
              <button
                class="nav-link"
                :class="{ active: mode === 'register' }"
                @click="switchMode('register')"
              >
                Inscription
              </button>
            </div>

            <!-- Formulaire de connexion -->
            <form v-if="mode === 'login'" @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  class="form-control"
                  placeholder="votre@email.com"
                  required
                  :disabled="authLoading"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  :disabled="authLoading"
                />
              </div>

              <div class="mb-3">
                <a href="#" @click.prevent="showResetPassword = true" class="text-primary text-decoration-none">
                  Mot de passe oublié ?
                </a>
              </div>

              <div v-if="authError" class="alert alert-danger alert-dismissible fade show">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ authError }}
                <button type="button" class="btn-close" @click="authError = ''"></button>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="authLoading">
                <span v-if="authLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                Se connecter
              </button>
            </form>

            <!-- Formulaire d'inscription -->
            <form v-else @submit.prevent="handleRegister">
              <div class="mb-3">
                <label class="form-label">Nom</label>
                <input
                  v-model="registerForm.name"
                  type="text"
                  class="form-control"
                  placeholder="Votre nom"
                  required
                  minlength="3"
                  :disabled="authLoading"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="registerForm.email"
                  type="email"
                  class="form-control"
                  placeholder="votre@email.com"
                  required
                  :disabled="authLoading"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mot de passe</label>
                <input
                  v-model="registerForm.password"
                  type="password"
                  class="form-control"
                  placeholder="••••••••"
                  required
                  minlength="6"
                  :disabled="authLoading"
                />
                <div class="form-text">Au moins 6 caractères</div>
              </div>

              <div v-if="authError" class="alert alert-danger alert-dismissible fade show">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                {{ authError }}
                <button type="button" class="btn-close" @click="authError = ''"></button>
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="authLoading">
                <span v-if="authLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-person-plus-fill me-2"></i>
                S'inscrire
              </button>
            </form>

            <!-- Lien invité -->
            <div class="text-center mt-4">
              <router-link to="/" class="text-muted text-decoration-none">
                <i class="bi bi-arrow-left me-1"></i>
                Continuer en tant qu'invité
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de réinitialisation de mot de passe -->
    <div v-if="showResetPassword" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Réinitialiser le mot de passe</h5>
            <button type="button" class="btn-close" @click="closeResetModal"></button>
          </div>
          <div class="modal-body">
            <p class="text-muted">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
            
            <input
              v-model="resetEmail"
              type="email"
              class="form-control"
              placeholder="votre@email.com"
              required
            />

            <div v-if="resetError" class="alert alert-danger mt-3 mb-0">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ resetError }}
            </div>

            <div v-if="resetSuccess" class="alert alert-success mt-3 mb-0">
              <i class="bi bi-check-circle-fill me-2"></i>
              Email de réinitialisation envoyé avec succès !
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeResetModal">
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="handleResetPassword"
              :disabled="!resetEmail || resetLoading"
            >
              <span v-if="resetLoading" class="spinner-border spinner-border-sm me-2"></span>
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showResetPassword" class="modal-backdrop show"></div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const router = useRouter();
const { login, register, resetPassword } = useAuth();

const mode = ref('login');
const authLoading = ref(false);
const authError = ref('');
const showResetPassword = ref(false);
const resetEmail = ref('');
const resetLoading = ref(false);
const resetError = ref('');
const resetSuccess = ref(false);

const loginForm = reactive({
  email: '',
  password: ''
});

const registerForm = reactive({
  name: '',
  email: '',
  password: ''
});

const switchMode = (newMode) => {
  mode.value = newMode;
  authError.value = '';
};

const handleLogin = async () => {
  try {
    authLoading.value = true;
    authError.value = '';
    
    await login(loginForm.email, loginForm.password);
    router.push('/');
  } catch (error) {
    authError.value = error.message;
  } finally {
    authLoading.value = false;
  }
};

const handleRegister = async () => {
  try {
    authLoading.value = true;
    authError.value = '';
    
    await register(registerForm.email, registerForm.password, registerForm.name);
    router.push('/');
  } catch (error) {
    authError.value = error.message;
  } finally {
    authLoading.value = false;
  }
};

const handleResetPassword = async () => {
  try {
    resetLoading.value = true;
    resetError.value = '';
    resetSuccess.value = false;
    
    await resetPassword(resetEmail.value);
    resetSuccess.value = true;
    
    setTimeout(() => {
      closeResetModal();
    }, 2000);
  } catch (error) {
    resetError.value = error.message;
  } finally {
    resetLoading.value = false;
  }
};

const closeResetModal = () => {
  showResetPassword.value = false;
  resetEmail.value = '';
  resetError.value = '';
  resetSuccess.value = false;
  resetLoading.value = false;
};
</script>

<style scoped>
.auth-view {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.auth-card {
  background: white;
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.nav-pills .nav-link {
  color: #6b7280;
  font-weight: 600;
  transition: all 0.2s;
}

.nav-pills .nav-link.active {
  background-color: var(--bs-primary);
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.alert-dismissible .btn-close {
  padding: 0.5rem;
}
</style>