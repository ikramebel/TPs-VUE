<template>
  <div class="category-page">
    <div class="container">
      <!-- Category Header -->
      <div v-if="currentCategory" class="category-header">
        <div class="d-flex align-items-center justify-content-between">
          <div>
            <h1 class="category-title">
              <span class="category-icon">{{ currentCategory.icon }}</span>
              {{ currentCategory.name }}
            </h1>
            <p class="category-description">{{ currentCategory.description }}</p>
          </div>
          
          <button 
            v-if="isAuthenticated"
            class="btn btn-primary"
            @click="$router.push('/create-discussion')"
          >
            ✏️ Nouvelle Discussion
          </button>
        </div>

        <!-- Sub-categories -->
        <div v-if="currentCategory.subCategories.length > 0" class="sub-categories mt-3">
          <h6 class="mb-2">Sous-catégories:</h6>
          <div class="sub-categories-list">
            <span 
              v-for="subCat in currentCategory.subCategories" 
              :key="subCat.id"
              class="badge-custom badge-secondary me-2 mb-2"
            >
              {{ subCat.name }}
            </span>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <!-- Discussions List -->
        <div class="col-lg-9">
          <!-- Filters -->
          <div class="filters-bar mb-3">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">
                {{ discussions.length }} Discussion{{ discussions.length > 1 ? 's' : '' }}
              </h5>
              
              <select v-model="sortBy" class="form-select w-auto" @change="handleSort">
                <option value="recent">Plus récentes</option>
                <option value="popular">Plus populaires</option>
                <option value="replies">Plus de réponses</option>
              </select>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="alert-custom alert-error">
            {{ error }}
          </div>

          <!-- No discussions -->
          <div v-else-if="discussions.length === 0" class="no-discussions">
            <div class="text-center py-5">
              <p class="text-muted mb-3">Aucune discussion dans cette catégorie.</p>
              <button 
                v-if="isAuthenticated"
                class="btn btn-primary"
                @click="$router.push('/create-discussion')"
              >
                Créer la première discussion
              </button>
              <button 
                v-else
                class="btn btn-outline-primary"
                @click="$router.push('/auth')"
              >
                Se connecter pour créer une discussion
              </button>
            </div>
          </div>

          <!-- Discussions -->
          <div v-else class="discussions-list">
            <DiscussionCard 
              v-for="discussion in sortedDiscussions" 
              :key="discussion.id"
              :discussion="discussion"
              @click="$router.push(`/discussion/${discussion.id}`)"
            />
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="col-lg-3">
          <!-- About Category -->
          <div class="card-custom mb-3">
            <h6 class="mb-3">À propos</h6>
            <p class="text-muted small">
              {{ currentCategory?.description || 'Catégorie de discussions' }}
            </p>
          </div>

          <!-- Other Categories -->
          <div class="card-custom">
            <h6 class="mb-3">Autres catégories</h6>
            <div class="categories-list">
              <router-link 
                v-for="cat in otherCategories" 
                :key="cat.id"
                :to="`/category/${cat.id}`"
                class="category-link"
              >
                <span class="category-icon">{{ cat.icon }}</span>
                {{ cat.name }}
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDiscussions } from '@/composables/useDiscussions'
import { CATEGORIES, getCategoryById } from '@/utils/categories'

import DiscussionCard from '@/components/DiscussionCard.vue'

const route = useRoute()
const { isAuthenticated } = useAuth()
const { discussions, loading, error, fetchDiscussions } = useDiscussions()

const sortBy = ref('recent')
const currentCategory = ref(null)

const otherCategories = computed(() => {
  return CATEGORIES.filter(cat => cat.id !== route.params.category)
})

const sortedDiscussions = computed(() => {
  const result = [...discussions.value]
  
  if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.views || 0) - (a.views || 0))
  } else if (sortBy.value === 'replies') {
    result.sort((a, b) => (b.repliesCount || 0) - (a.repliesCount || 0))
  }
  // 'recent' est déjà trié par défaut
  
  return result
})

const handleSort = () => {
  // Le tri se fait automatiquement via computed
}

const loadCategoryDiscussions = async () => {
  const categoryId = route.params.category
  currentCategory.value = getCategoryById(categoryId)
  
  if (currentCategory.value) {
    await fetchDiscussions(categoryId)
  }
}

// Watch route changes
watch(() => route.params.category, () => {
loadCategoryDiscussions()
})
onMounted(() => {
loadCategoryDiscussions()
})
</script>
<style scoped>
.category-page {
  padding: 2rem 0;
}

.category-header {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  margin-bottom: 2rem;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.category-icon {
  font-size: 2.5rem;
}

.category-description {
  color: var(--text-secondary);
  margin-bottom: 0;
}

.sub-categories h6 {
  font-weight: 600;
  color: var(--text-primary);
}

.sub-categories-list {
  display: flex;
  flex-wrap: wrap;
}

.filters-bar {
  background: white;
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.no-discussions {
  background: white;
  padding: 3rem 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition);
}

.category-link:hover {
  background-color: var(--bg-hover);
  color: var(--primary-color);
}

.category-link .category-icon {
  font-size: 1.2rem;
}

.d-flex {
  display: flex;
}

@media (max-width: 768px) {
  .category-header {
    padding: 1.5rem;
  }
  
  .category-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
