<template>
  <div class="create-discussion-page">
    <div class="container">
      <div class="create-container">
        <!-- Header -->
        <div class="page-header mb-4">
          <h1>✏️ Créer une nouvelle discussion</h1>
          <p class="text-muted">Partagez vos idées et posez vos questions à la communauté</p>
        </div>

        <!-- Form -->
        <div class="card-custom">
          <form @submit.prevent="handleSubmit">
            <!-- Titre -->
            <div class="form-group-custom">
              <label class="form-label-custom">
                Titre <span class="text-danger">*</span>
              </label>
              <input 
                v-model="form.title" 
                type="text" 
                class="form-control-custom"
                placeholder="Donnez un titre clair et descriptif à votre discussion"
                maxlength="200"
                required
              />
              <small class="text-muted">{{ form.title.length }}/200 caractères</small>
            </div>

            <!-- Catégorie -->
            <div class="form-group-custom">
              <label class="form-label-custom">
                Catégorie <span class="text-danger">*</span>
              </label>
              <select v-model="form.category" class="form-control-custom" required>
                <option value="">-- Sélectionnez une catégorie --</option>
                <option 
                  v-for="category in CATEGORIES" 
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.icon }} {{ category.name }}
                </option>
              </select>
              <small class="text-muted">
                Choisissez la catégorie la plus appropriée pour votre discussion
              </small>
            </div>

            <!-- Contenu -->
            <div class="form-group-custom">
              <label class="form-label-custom">
                Contenu <span class="text-danger">*</span>
              </label>
              <textarea 
                v-model="form.content" 
                class="form-control-custom"
                rows="10"
                placeholder="Décrivez votre question ou sujet en détail..."
                maxlength="5000"
                required
              ></textarea>
              <small class="text-muted">{{ form.content.length }}/5000 caractères</small>
            </div>

            <!-- Preview -->
            <div v-if="showPreview" class="preview-section">
              <h5 class="mb-3">👁️ Aperçu</h5>
              <div class="card-custom preview-card">
                <div class="preview-header">
                  <span class="badge-custom badge-primary">
                    {{ getCategoryIcon(form.category) }}
                    {{ getCategoryName(form.category) }}
                  </span>
                  <h3 class="mt-2">{{ form.title || 'Titre de votre discussion' }}</h3>
                  <div class="text-muted">
                    Par {{ user?.displayName }} • À l'instant
                  </div>
                </div>
                <div class="preview-content mt-3">
                  <p class="preview-text">{{ form.content || 'Contenu de votre discussion...' }}</p>
                </div>
              </div>
            </div>

            <!-- Error -->
            <div v-if="error" class="alert-custom alert-error">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="form-actions">
              <button 
                type="button" 
                class="btn btn-outline-secondary"
                @click="showPreview = !showPreview"
              >
                {{ showPreview ? '📝 Masquer l\'aperçu' : '👁️ Voir l\'aperçu' }}
              </button>
              
              <div class="d-flex gap-2">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  @click="$router.back()"
                  :disabled="loading"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="loading || !isFormValid"
                >
                  {{ loading ? 'Publication...' : '🚀 Publier' }}
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Tips -->
        <div class="tips-section mt-4">
          <div class="card-custom">
            <h5 class="mb-3">💡 Conseils pour une bonne discussion</h5>
            <ul class="tips-list">
              <li>Choisissez un titre clair et descriptif</li>
              <li>Sélectionnez la bonne catégorie pour toucher le bon public</li>
              <li>Détaillez votre question ou sujet</li>
              <li>Relisez-vous avant de publier</li>
              <li>Soyez respectueux et courtois</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDiscussions } from '@/composables/useDiscussions'
import { CATEGORIES, getCategoryName, getCategoryIcon } from '@/utils/categories'

const router = useRouter()
const { user } = useAuth()
const { createDiscussion, loading, error } = useDiscussions()

const form = ref({
  title: '',
  category: '',
  content: ''
})

const showPreview = ref(false)

const isFormValid = computed(() => {
  return form.value.title.trim() !== '' &&
         form.value.category !== '' &&
         form.value.content.trim() !== ''
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  try {
    const discussionId = await createDiscussion({
      title: form.value.title.trim(),
      category: form.value.category,
      content: form.value.content.trim(),
      authorId: user.value.uid,
      authorName: user.value.displayName
    })

    // Rediriger vers la discussion créée
    router.push(`/discussion/${discussionId}`)
  } catch (err) {
    console.error('Erreur création discussion:', err)
  }
}
</script>

<style scoped>
.create-discussion-page {
  padding: 2rem 0;
  min-height: calc(100vh - 180px);
}

.create-container {
  max-width: 900px;
  margin: 0 auto;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid var(--border-color);
}

.preview-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid var(--border-color);
}

.preview-card {
  background-color: var(--bg-primary);
}

.preview-header h3 {
  font-size: 1.5rem;
  color: var(--text-primary);
}

.preview-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.8;
}

.tips-section {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tips-list li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.tips-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--success);
  font-weight: bold;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-actions > * {
    width: 100%;
  }
}
</style>