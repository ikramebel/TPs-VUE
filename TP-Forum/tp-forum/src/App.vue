<template>
  <div id="app">
    <!-- Navbar -->
    <Navbar />
    
    <!-- Contenu principal avec transitions -->
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>
    
    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
</script>

<style>
/* Reset global */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Main Content */
.main-content {
  flex: 1;
  padding-top: 70px; /* Hauteur de la navbar */
  min-height: calc(100vh - 70px - 200px); /* viewport - navbar - footer */
}

/* Transitions entre pages */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar personnalisée */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-muted);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* Bootstrap overrides */
.dropdown-menu {
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-md);
}

.dropdown-item {
  padding: 0.75rem 1rem;
  transition: var(--transition);
}

.dropdown-item:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid var(--border-color);
}

/* Utility classes */
.text-muted {
  color: var(--text-muted) !important;
}

.text-primary {
  color: var(--primary-color) !important;
}

.text-danger {
  color: var(--error) !important;
}

.text-success {
  color: var(--success) !important;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding-top: 70px;
  }
}
</style>