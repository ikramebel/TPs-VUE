<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-container">
        <div class="auth-card card-custom">
          <!-- Tabs -->
          <div class="auth-tabs">
            <button 
              :class="['tab-btn', { active: activeTab === 'login' }]"
              @click="activeTab = 'login'"
            >
              Connexion
            </button>
            <button 
              :class="['tab-btn', { active: activeTab === 'signup' }]"
              @click="activeTab = 'signup'"
            >
              Inscription
            </button>
          </div>

          <!-- Login Form -->
          <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
            <h2 class="text-center mb-4">Connexion</h2>

            <div class="form-group-custom">
              <label class="form-label-custom">Email</label>
              <input 
                v-model="loginForm.email" 
                type="email" 
                class="form-control-custom"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div class="form-group-custom">
              <label class="form-label-custom">Mot de passe</label>
              <input 
                v-model="loginForm.password" 
                type="password" 
                class="form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <div v-if="error" class="alert-custom alert-error">
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>

            <div class="text-center mt-3">
              <a href="#" class="text-primary" @click.prevent="showResetPassword = true">
                Mot de passe oublié ?
              </a>
            </div>
          </form>

          <!-- Signup Form -->
          <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="auth-form">
            <h2 class="text-center mb-4">Inscription</h2>

            <div class="form-group-custom">
              <label class="form-label-custom">Nom d'utilisateur</label>
              <input 
                v-model="signupForm.displayName" 
                type="text" 
                class="form-control-custom"
                placeholder="John Doe"
                required
              />
            </div>

            <div class="form-group-custom">
              <label class="form-label-custom">Email</label>
              <input 
                v-model="signupForm.email" 
                type="email" 
                class="form-control-custom"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div class="form-group-custom">
              <label class="form-label-custom">Mot de passe</label>
              <input 
                v-model="signupForm.password" 
                type="password" 
                class="form-control-custom"
                placeholder="Min. 6 caractères"
                minlength="6"
                required
              />
            </div>

            <div class="form-group-custom">
              <label class="form-label-custom">Confirmer le mot de passe</label>
              <input 
                v-model="signupForm.confirmPassword" 
                type="password" 
                class="form-control-custom"
                placeholder="••••••••"
                required
              />
            </div>

            <div v-if="signupError" class="alert-custom alert-error">
              {{ signupError }}
            </div>

            <div v-if="error" class="alert-custom alert-error">
              {{ error }}
            </div>

            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              {{ loading ? 'Inscription...' : 'S\'inscrire' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Reset Password -->
    <div v-if="showResetPassword" class="modal-overlay" @click="showResetPassword = false">
      <div class="modal-content card-custom" @click.stop>
        <h3 class="mb-3">Réinitialiser le mot de passe</h3>
        <p class="text-muted mb-3">
          Entrez votre email pour recevoir un lien de réinitialisation.
        </p>

        <form @submit.prevent="handleResetPassword">
          <div class="form-group-custom">
            <input 
              v-model="resetEmail" 
              type="email" 
              class="form-control-custom"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div v-if="resetSuccess" class="alert-custom alert-success mb-3">
            Email de réinitialisation envoyé !
          </div>

          <div v-if="error" class="alert-custom alert-error mb-3">
            {{ error }}
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="loading">
              {{ loading ? 'Envoi...' : 'Envoyer' }}
            </button>
            <button type="button" class="btn btn-secondary" @click="showResetPassword = false">
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { login, signup, resetPassword, loading, error } = useAuth()

const activeTab = ref('login')
const showResetPassword = ref(false)
const resetEmail = ref('')
const resetSuccess = ref(false)
const signupError = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  displayName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const handleLogin = async () => {
  try {
    await login(loginForm.value.email, loginForm.value.password)
    
    // Rediriger vers la page d'origine ou l'accueil
    const redirect = route.query.redirect || '/'
    router.push(redirect)
  } catch (err) {
    console.error('Erreur login:', err)
  }
}

const handleSignup = async () => {
  signupError.value = ''
  
  // Vérifications
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    signupError.value = 'Les mots de passe ne correspondent pas'
    return
  }
  
  if (signupForm.value.password.length < 6) {
    signupError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  try {
    await signup(
      signupForm.value.email,
      signupForm.value.password,
      signupForm.value.displayName
    )
    
    router.push('/')
  } catch (err) {
    console.error('Erreur signup:', err)
  }
}

const handleResetPassword = async () => {
  resetSuccess.value = false
  
  try {
    await resetPassword(resetEmail.value)
    resetSuccess.value = true
    
    setTimeout(() => {
      showResetPassword.value = false
      resetSuccess.value = false
      resetEmail.value = ''
    }, 3000)
  } catch (err) {
    console.error('Erreur reset password:', err)
  }
}
</script>

<style scoped>
.auth-page {
  min-height: calc(100vh - 180px);
  display: flex;
  align-items: center;
  padding: 2rem 0;
}

.auth-container {
  max-width: 500px;
  margin: 0 auto;
}

.auth-card {
  padding: 2rem;
}

.auth-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  background: none;
  border: none;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.auth-form {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}
</style>