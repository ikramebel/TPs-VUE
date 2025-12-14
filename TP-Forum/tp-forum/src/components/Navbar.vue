<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <span class="brand-icon">💬</span>
          <span class="brand-text">Forum</span>
        </router-link>

        <!-- Navigation Links -->
        <div class="navbar-links">
          <router-link to="/" class="nav-link">
            🏠 Accueil
          </router-link>

          <div class="dropdown">
            <button class="nav-link dropdown-toggle" type="button" data-bs-toggle="dropdown">
              📂 Catégories
            </button>
            <ul class="dropdown-menu">
              <li v-for="category in CATEGORIES" :key="category.id">
                <router-link 
                  :to="`/category/${category.id}`" 
                  class="dropdown-item"
                >
                  {{ category.icon }} {{ category.name }}
                </router-link>
              </li>
            </ul>
          </div>
        </div>

        <!-- User Actions -->
        <div class="navbar-actions">
          <!-- Si connecté -->
          <template v-if="isAuthenticated">
            <!-- Bouton créer discussion -->
            <router-link to="/create-discussion" class="btn btn-sm btn-primary">
              ✏️ Nouvelle Discussion
            </router-link>

            <!-- User Menu -->
            <div class="dropdown">
              <button class="user-menu-btn" type="button" data-bs-toggle="dropdown">
                <UserAvatar :user="user" size="sm" />
                <span class="user-name">{{ user?.displayName }}</span>
                <span class="dropdown-arrow">▼</span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end">
                <li>
                  <router-link :to="`/profile/${user?.uid}`" class="dropdown-item">
                    👤 Mon profil
                  </router-link>
                </li>
                <li v-if="isModerator">
                  <router-link to="/moderator" class="dropdown-item">
                    🛡️ Modération
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a href="#" class="dropdown-item text-danger" @click.prevent="handleLogout">
                    🚪 Déconnexion
                  </a>
                </li>
              </ul>
            </div>
          </template>

          <!-- Si non connecté -->
          <template v-else>
            <router-link to="/auth" class="btn btn-sm btn-outline-primary">
              🔐 Connexion
            </router-link>
          </template>

          <!-- Toggle mobile menu -->
          <button class="mobile-menu-toggle" @click="showMobileMenu = !showMobileMenu">
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <router-link to="/" class="mobile-link" @click="showMobileMenu = false">
          🏠 Accueil
        </router-link>

        <div class="mobile-categories">
          <div class="mobile-categories-title">📂 Catégories</div>
          <router-link 
            v-for="category in CATEGORIES" 
            :key="category.id"
            :to="`/category/${category.id}`" 
            class="mobile-link"
            @click="showMobileMenu = false"
          >
            {{ category.icon }} {{ category.name }}
          </router-link>
        </div>

        <template v-if="isAuthenticated">
          <router-link to="/create-discussion" class="mobile-link" @click="showMobileMenu = false">
            ✏️ Nouvelle Discussion
          </router-link>
          <router-link :to="`/profile/${user?.uid}`" class="mobile-link" @click="showMobileMenu = false">
            👤 Mon profil
          </router-link>
          <a href="#" class="mobile-link text-danger" @click.prevent="handleLogout">
            🚪 Déconnexion
          </a>
        </template>
        <template v-else>
          <router-link to="/auth" class="mobile-link" @click="showMobileMenu = false">
            🔐 Connexion
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { CATEGORIES } from '@/utils/categories'
import UserAvatar from '@/components/UserAvatar.vue'

const router = useRouter()
const { user, isAuthenticated, isModerator, logout } = useAuth()
const showMobileMenu = ref(false)

const handleLogout = async () => {
  try {
    await logout()
    showMobileMenu.value = false
    router.push('/')
  } catch (err) {
    console.error('Erreur logout:', err)
  }
}
</script>

<style scoped>
.navbar {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 70px;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.brand-icon {
  font-size: 2rem;
}

.brand-text {
  display: none;
}

@media (min-width: 768px) {
  .brand-text {
    display: inline;
  }
}

.navbar-links {
  display: none;
  gap: 1rem;
}

@media (min-width: 768px) {
  .navbar-links {
    display: flex;
  }
}

.nav-link {
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: var(--transition);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.nav-link:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.dropdown-toggle::after {
  display: none;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
}

.user-menu-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
}

.user-name {
  display: none;
}

@media (min-width: 768px) {
  .user-name {
    display: inline;
    font-weight: 500;
    color: var(--text-primary);
  }
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

.mobile-menu-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 1.5rem;
}

@media (min-width: 768px) {
  .mobile-menu-toggle {
    display: none;
  }
}

/* Mobile Menu */
.mobile-menu {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  background: white;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-link {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
}

.mobile-link:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.mobile-link.text-danger {
  color: var(--error);
}

.mobile-categories {
  display: flex;
  flex-direction: column;
}

.mobile-categories-title {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
}
</style>