<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm sticky-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <i class="bi bi-chat-square-text-fill text-primary fs-3 me-2"></i>
        <span class="fw-bold">Forum Communautaire</span>
      </router-link>

      <button 
        class="navbar-toggler" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="bi bi-house-fill me-1"></i>
              Accueil
            </router-link>
          </li>

          <template v-if="isAuthenticated">
            <li class="nav-item">
              <router-link 
                to="/create-discussion" 
                class="btn btn-primary btn-sm ms-2"
              >
                <i class="bi bi-plus-circle me-1"></i>
                Nouvelle discussion
              </router-link>
            </li>

            <li class="nav-item dropdown ms-2">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="navbarDropdown" 
                role="button" 
                data-bs-toggle="dropdown"
              >
                <div class="avatar-sm me-2" :style="{ backgroundColor: userColor }">
                  {{ userInitials }}
                </div>
                <span>{{ user.name }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link to="/profile" class="dropdown-item">
                    <i class="bi bi-person-fill me-2"></i>
                    Mon profil
                  </router-link>
                </li>
                <li v-if="isModerator">
                  <router-link to="/moderator" class="dropdown-item">
                    <i class="bi bi-shield-fill-check me-2"></i>
                    Modération
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a href="#" @click.prevent="handleLogout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i>
                    Déconnexion
                  </a>
                </li>
              </ul>
            </li>
          </template>

          <template v-else>
            <li class="nav-item">
              <router-link to="/auth" class="btn btn-primary btn-sm ms-2">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Se connecter
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { getInitials, stringToColor } from '@/utils/formatters';

const router = useRouter();
const { user, isAuthenticated, isModerator, logout } = useAuth();

const userInitials = computed(() => getInitials(user.value?.name));
const userColor = computed(() => stringToColor(user.value?.name));

const handleLogout = async () => {
  try {
    await logout();
    router.push('/');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  }
};
</script>

<style scoped>
.avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
}

.navbar-brand {
  font-size: 1.25rem;
}

.nav-link {
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--bs-primary) !important;
}
</style>