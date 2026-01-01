<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <span class="brand-icon">💬</span>
          <span class="brand-text">Forum</span>
        </router-link>

        <!-- Navigation Links (Desktop) -->
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

            <!-- User Menu Dropdown -->
            <div class="dropdown">
              <button class="user-menu-btn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
                  <a 
                    href="#" 
                    class="dropdown-item text-danger" 
                    @click.prevent="handleLogout"
                  >
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
          <button class="mobile-menu-toggle" @click="toggleMobileMenu">
            ☰
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <transition name="slide-down">
        <div v-if="showMobileMenu" class="mobile-menu">
          <router-link to="/" class="mobile-link" @click="closeMobileMenu">
            🏠 Accueil
          </router-link>

          <div class="mobile-categories">
            <div class="mobile-categories-title">📂 Catégories</div>
            <router-link 
              v-for="category in CATEGORIES" 
              :key="category.id"
              :to="`/category/${category.id}`" 
              class="mobile-link mobile-link-sub"
              @click="closeMobileMenu"
            >
              {{ category.icon }} {{ category.name }}
            </router-link>
          </div>

          <template v-if="isAuthenticated">
            <router-link to="/create-discussion" class="mobile-link" @click="closeMobileMenu">
              ✏️ Nouvelle Discussion
            </router-link>
            <router-link :to="`/profile/${user?.uid}`" class="mobile-link" @click="closeMobileMenu">
              👤 Mon profil
            </router-link>
            <router-link v-if="isModerator" to="/moderator" class="mobile-link" @click="closeMobileMenu">
              🛡️ Modération
            </router-link>
            <a href="#" class="mobile-link text-danger" @click.prevent="handleLogout">
              🚪 Déconnexion
            </a>
          </template>
          <template v-else>
            <router-link to="/auth" class="mobile-link" @click="closeMobileMenu">
              🔐 Connexion
            </router-link>
          </template>
        </div>
      </transition>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { CATEGORIES } from '@/utils/categories'
import UserAvatar from '@/components/UserAvatar.vue'

const { user, isAuthenticated, isModerator, logout } = useAuth()
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = async () => {
  console.log('🎯 [NAVBAR] Clic sur déconnexion')
  console.log('👤 [NAVBAR] User avant logout:', user.value)
  
  // Fermer le menu mobile si ouvert
  closeMobileMenu()
  
  try {
    console.log('🚪 [NAVBAR] Appel de logout()...')
    await logout()
    console.log('✅ [NAVBAR] Logout terminé')
    
  } catch (err) {
    console.error('❌ [NAVBAR] Erreur lors de la déconnexion:', err)
    alert('Erreur lors de la déconnexion. Veuillez réessayer.')
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

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

/* Logo / Brand */
.navbar-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  transition: var(--transition);
}

.navbar-brand:hover {
  color: var(--secondary-color);
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

/* Navigation Links (Desktop) */
.navbar-links {
  display: none;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 992px) {
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
  white-space: nowrap;
}

.nav-link:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.dropdown {
  position: relative;
}

.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  min-width: 200px;
}

/* User Actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  text-decoration: none;
  transition: var(--transition);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-outline-primary {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline-primary:hover {
  background: var(--primary-color);
  color: white;
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
}

/* User Menu Button */
.user-menu-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
}

.user-menu-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
}

.user-name {
  display: none;
  font-weight: 500;
  color: var(--text-primary);
}

@media (min-width: 768px) {
  .user-name {
    display: inline;
  }
}

.dropdown-arrow {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin-left: 0.25rem;
}

/* Dropdown Items */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: var(--transition);
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.dropdown-item.text-danger {
  color: var(--error);
}

.dropdown-item.text-danger:hover {
  background-color: rgba(245, 101, 101, 0.1);
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid var(--border-color);
}

/* Mobile Menu Toggle */
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
  color: var(--text-primary);
  transition: var(--transition);
}

.mobile-menu-toggle:hover {
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
}

@media (min-width: 992px) {
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

@media (min-width: 992px) {
  .mobile-menu {
    display: none !important;
  }
}

.mobile-link {
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 500;
  transition: var(--transition);
  display: block;
}

.mobile-link:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.mobile-link.text-danger {
  color: var(--error);
}

.mobile-link.text-danger:hover {
  background-color: rgba(245, 101, 101, 0.1);
}

.mobile-link-sub {
  padding-left: 2rem;
  font-size: 0.9rem;
}

.mobile-categories {
  display: flex;
  flex-direction: column;
}

.mobile-categories-title {
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .navbar-actions .btn-primary {
    display: none;
  }
}

@media (max-width: 576px) {
  .navbar-brand {
    font-size: 1.2rem;
  }

  .brand-icon {
    font-size: 1.5rem;
  }

  .btn-sm {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }
}
</style>