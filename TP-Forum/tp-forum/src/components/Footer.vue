<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h6 class="footer-title">💬 Forum Communautaire</h6>
          <p class="footer-text">
            Une plateforme pour partager des idées, poser des questions et apprendre ensemble.
          </p>
        </div>

        <div class="footer-section">
          <h6 class="footer-title">Navigation</h6>
          <ul class="footer-links">
            <li>
              <router-link to="/">Accueil</router-link>
            </li>
            <li v-for="category in CATEGORIES.slice(0, 4)" :key="category.id">
              <router-link :to="`/category/${category.id}`">
                {{ category.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h6 class="footer-title">Informations</h6>
          <ul class="footer-links">
            <li><a href="#">À propos</a></li>
            <li><a href="#">Règles du forum</a></li>
            <li><a href="#">Confidentialité</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h6 class="footer-title">Statistiques</h6>
          <div class="footer-stats">
            <div class="stat-item">
              <span class="stat-label">Discussions:</span>
              <span class="stat-value">{{ stats.discussions }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Membres:</span>
              <span class="stat-value">{{ stats.members }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          © {{ currentYear }} Forum Communautaire. Propulsé par Vue.js & Firebase.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CATEGORIES } from '@/utils/categories'

const currentYear = computed(() => new Date().getFullYear())

const stats = ref({
  discussions: '100+',
  members: '50+'
})
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.footer-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.9rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: white;
  padding-left: 5px;
}

.footer-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.stat-value {
  color: white;
  font-weight: 600;
}

.footer-bottom {
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.footer-copyright {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>