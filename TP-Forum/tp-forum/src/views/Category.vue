<template>
  <div class="category-view">
    <div class="container py-4">
      <!-- En-tête de la catégorie -->
      <div class="category-header card mb-4">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <div class="category-icon-lg me-4">
              {{ categoryData?.icon }}
            </div>
            <div class="flex-grow-1">
              <h1 class="mb-2">{{ categoryData?.name }}</h1>
              <p class="text-muted mb-0">{{ categoryData?.description }}</p>
            </div>
            <router-link 
              v-if="isAuthenticated"
              to="/create-discussion" 
              class="btn btn-primary"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Nouvelle discussion
            </router-link>
          </div>
        </div>
      </div>

      <!-- Filtres et recherche -->
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-8">
              <div class="input-group">
                <span class="input-group-text bg-white">
                  <i class="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  v-model="searchQuery"
                  class="form-control"
                  placeholder="Rechercher dans cette catégorie..."
                />
              </div>
            </div>
            <div class="col-md-4">
              <select v-model="sortBy" class="form-select">
                <option value="recent">Plus récent</option>
                <option value="popular">Plus populaire</option>
                <option value="views">Plus de vues</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <LoadingSpinner message="Chargement des discussions..." />
      </div>

      <!-- Discussions -->
      <div v-else-if="filteredDiscussions.length > 0">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">
            {{ filteredDiscussions.length }} 
            {{ filteredDiscussions.length > 1 ? 'discussions' : 'discussion' }}
          </h5>
        </div>

        <DiscussionCard
          v-for="discussion in filteredDiscussions"
          :key="discussion.id"
          :discussion="discussion"
        />
      </div>

      <!-- Aucune discussion -->
      <div v-else class="card">
        <div class="card-body text-center py-5">
          <i class="bi bi-inbox fs-1 text-muted"></i>
          <p class="text-muted mt-3 mb-0">
            {{ searchQuery ? 'Aucune discussion trouvée pour cette recherche' : 'Aucune discussion dans cette catégorie' }}
          </p>
          <router-link 
            v-if="isAuthenticated && !searchQuery" 
            to="/create-discussion" 
            class="btn btn-primary mt-3"
          >
            <i class="bi bi-plus-circle me-2"></i>
            Créer la première discussion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useDiscussions } from '@/composables/useDiscussions';
import { getCategoryById } from '@/utils/categories';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import DiscussionCard from '@/components/DiscussionCard.vue';

const route = useRoute();
const { isAuthenticated } = useAuth();
const { discussions, loading, fetchDiscussions } = useDiscussions();

const searchQuery = ref('');
const sortBy = ref('recent');

const categoryData = computed(() => getCategoryById(route.params.categoryId));

const filteredDiscussions = computed(() => {
  let filtered = discussions.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(query) ||
      d.content.toLowerCase().includes(query)
    );
  }

  return filtered;
});

onMounted(async () => {
  await loadDiscussions();
});

watch([sortBy], async () => {
  await loadDiscussions();
});

const loadDiscussions = async () => {
  await fetchDiscussions({
    category: route.params.categoryId,
    sortBy: sortBy.value
  });
};
</script>

<style scoped>
.category-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.category-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.category-header .card-body {
  padding: 2rem;
}

.category-header h1 {
  color: white;
}

.category-header .text-muted {
  color: rgba(255, 255, 255, 0.9) !important;
}

.category-icon-lg {
  font-size: 4rem;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
}
</style>