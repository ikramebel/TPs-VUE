<template>
  <div class="home-view">
    <div class="container py-4">
      <!-- Barre de recherche -->
      <SearchBar v-model="filters" />

      <div class="row">
        <!-- Sidebar - Catégories -->
        <div class="col-lg-3 mb-4">
          <CategoryFilter v-model="filters.category" />
        </div>

        <!-- Liste des discussions -->
        <div class="col-lg-9">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-5">
            <LoadingSpinner />
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            {{ error }}
          </div>

          <!-- Discussions -->
          <div v-else-if="filteredDiscussions.length > 0">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h4 class="fw-bold">
                {{ filteredDiscussions.length }} 
                {{ filteredDiscussions.length > 1 ? 'discussions' : 'discussion' }}
              </h4>
            </div>

            <DiscussionCard
              v-for="discussion in filteredDiscussions"
              :key="discussion.id"
              :discussion="discussion"
            />
          </div>

          <!-- Aucune discussion -->
          <div v-else class="text-center py-5">
            <i class="bi bi-inbox fs-1 text-muted"></i>
            <p class="text-muted mt-3">Aucune discussion trouvée</p>
            <router-link 
              v-if="isAuthenticated" 
              to="/create-discussion" 
              class="btn btn-primary"
            >
              <i class="bi bi-plus-circle me-2"></i>
              Créer la première discussion
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useDiscussions } from '@/composables/useDiscussions';
import SearchBar from '@/components/SearchBar.vue';
import CategoryFilter from '@/components/CategoryFilter.vue';
import DiscussionCard from '@/components/DiscussionCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const { isAuthenticated } = useAuth();
const { discussions, loading, error, fetchDiscussions, searchDiscussions } = useDiscussions();

const filters = ref({
  search: '',
  category: 'all',
  sortBy: 'recent'
});

// Charger les discussions au montage
onMounted(async () => {
  await fetchDiscussions({
    category: filters.value.category,
    sortBy: filters.value.sortBy
  });
});

// Recharger quand les filtres changent
watch(() => [filters.value.category, filters.value.sortBy], async () => {
  await fetchDiscussions({
    category: filters.value.category,
    sortBy: filters.value.sortBy
  });
}, { deep: true });

// Filtrer les discussions par recherche
const filteredDiscussions = computed(() => {
  if (!filters.value.search) {
    return discussions.value;
  }
  return searchDiscussions.value(filters.value.search);
});
</script>

<style scoped>
.home-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}
</style>