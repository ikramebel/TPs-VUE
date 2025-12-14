<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero-title">🎯 Forum Communautaire</h1>
        <p class="hero-subtitle">Partagez vos idées, posez vos questions et apprenez ensemble</p>
        
        <!-- Barre de recherche -->
        <div class="search-container">
          <SearchBar @search="handleSearch" />
        </div>
      </div>
    </section>

    <!-- Section principale -->
    <div class="container mt-4">
      <div class="row">
        <!-- Sidebar Catégories -->
        <aside class="col-lg-3 mb-4">
          <div class="card-custom">
            <h5 class="mb-3">📂 Catégories</h5>
            <CategoryFilter 
              :categories="CATEGORIES" 
              :selected="selectedCategory"
              @select="handleCategorySelect" 
            />
          </div>

          <!-- Bouton créer discussion -->
          <div class="card-custom mt-3" v-if="isAuthenticated">
            <button 
              class="btn btn-primary w-100"
              @click="$router.push('/create-discussion')"
            >
              ✏️ Nouvelle Discussion
            </button>
          </div>
          <div class="card-custom mt-3" v-else>
            <p class="text-muted small mb-2">Connectez-vous pour créer des discussions</p>
            <button 
              class="btn btn-outline-primary w-100"
              @click="$router.push('/auth')"
            >
              Se connecter
            </button>
          </div>
        </aside>

        <!-- Liste des discussions -->
        <div class="col-lg-9">
          <!-- Filtres -->
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4>{{ pageTitle }}</h4>
            <select v-model="sortBy" class="form-select w-auto" @change="handleSort">
              <option value="recent">Plus récentes</option>
              <option value="popular">Plus populaires</option>
              <option value="replies">Plus de réponses</option>
            </select>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
          </div>

          <!-- Erreur -->
          <div v-else-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <!-- Aucune discussion -->
          <div v-else-if="displayedDiscussions.length === 0" class="text-center py-5">
            <p class="text-muted">Aucune discussion trouvée.</p>
            <button 
              v-if="isAuthenticated" 
              class="btn btn-primary mt-3"
              @click="$router.push('/create-discussion')"
            >
              Créer la première discussion
            </button>
          </div>

          <!-- Liste des discussions -->
          <div v-else class="discussions-list">
            <DiscussionCard 
              v-for="discussion in displayedDiscussions" 
              :key="discussion.id"
              :discussion="discussion"
              @click="goToDiscussion(discussion.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDiscussions } from '@/composables/useDiscussions'
import { CATEGORIES } from '@/utils/categories'

import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'

const router = useRouter()
const { user, isAuthenticated } = useAuth()
const { discussions, loading, error, fetchDiscussions, searchDiscussions } = useDiscussions()

const selectedCategory = ref('')
const sortBy = ref('recent')
const searchQuery = ref('')

const pageTitle = computed(() => {
  if (searchQuery.value) {
    return `Résultats pour "${searchQuery.value}"`
  }
  if (selectedCategory.value) {
    const category = CATEGORIES.find(c => c.id === selectedCategory.value)
    return category ? `Catégorie: ${category.name}` : 'Discussions'
  }
  return 'Toutes les discussions'
})

const displayedDiscussions = computed(() => {
  let result = [...discussions.value]
  
  // Tri
  if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.views || 0) - (a.views || 0))
  } else if (sortBy.value === 'replies') {
    result.sort((a, b) => (b.repliesCount || 0) - (a.repliesCount || 0))
  }
  // 'recent' est déjà trié par défaut
  
  return result
})

const handleCategorySelect = async (categoryId) => {
  selectedCategory.value = categoryId
  searchQuery.value = ''
  await fetchDiscussions(categoryId || null)
}

const handleSearch = async (query) => {
  searchQuery.value = query
  selectedCategory.value = ''
  
  if (query.trim()) {
    await searchDiscussions(query)
  } else {
    await fetchDiscussions()
  }
}

const handleSort = () => {
  // Le tri se fait automatiquement via le computed
}

const goToDiscussion = (id) => {
  router.push(`/discussion/${id}`)
}

onMounted(async () => {
  await fetchDiscussions()
})
</script>

<style scoped>
.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 0;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
}

.hero-subtitle {
  font-size: 1.2rem;
  text-align: center;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.discussions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>