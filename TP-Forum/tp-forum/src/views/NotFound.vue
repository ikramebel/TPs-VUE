<template>
  <div class="notfound-view">
    <div class="container">
      <div class="text-center">
        <div class="error-code">404</div>
        <h1 class="error-title mb-3">Page non trouvée</h1>
        <p class="error-description text-muted mb-4">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <router-link to="/" class="btn btn-primary btn-lg">
          <i class="bi bi-house-fill me-2"></i>
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // Log pour le débogage
  console.log('Page 404 - Route non trouvée');
});
</script>

<style scoped>
.notfound-view {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f9fafb;
  padding: 2rem 0;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  color: var(--bs-primary);
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.error-description {
  font-size: 1.125rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .error-code {
    font-size: 5rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
}
</style>