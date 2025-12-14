<template>
  <div class="discussion-page">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert-custom alert-error">
        {{ error }}
        <button class="btn btn-secondary mt-3" @click="$router.push('/')">
          Retour à l'accueil
        </button>
      </div>

      <!-- Discussion Content -->
      <div v-else-if="currentDiscussion">
        <!-- Breadcrumb -->
        <nav aria-label="breadcrumb" class="mb-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link to="/">Accueil</router-link>
            </li>
            <li class="breadcrumb-item">
              <router-link :to="`/category/${currentDiscussion.category}`">
                {{ getCategoryName(currentDiscussion.category) }}
              </router-link>
            </li>
            <li class="breadcrumb-item active">{{ currentDiscussion.title }}</li>
          </ol>
        </nav>

        <div class="row">
          <!-- Main Discussion -->
          <div class="col-lg-9">
            <!-- Discussion Card -->
            <div class="card-custom discussion-main">
              <!-- Header -->
              <div class="discussion-header">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span class="badge-custom badge-primary me-2">
                      {{ getCategoryIcon(currentDiscussion.category) }}
                      {{ getCategoryName(currentDiscussion.category) }}
                    </span>
                  </div>
                  
                  <!-- Actions (si auteur ou modérateur) -->
                  <div v-if="canModify" class="dropdown">
                    <button class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                            type="button" 
                            data-bs-toggle="dropdown">
                      ⚙️
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a class="dropdown-item" href="#" @click.prevent="editMode = true">
                          ✏️ Modifier
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" href="#" @click.prevent="handleDelete">
                          🗑️ Supprimer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <h1 class="discussion-title">{{ currentDiscussion.title }}</h1>

                <div class="discussion-meta">
                  <UserAvatar :user="{ displayName: currentDiscussion.authorName }" size="sm" />
                  <span class="ms-2">
                    Par 
                    <router-link :to="`/profile/${currentDiscussion.authorId}`" class="author-link">
                      {{ currentDiscussion.authorName }}
                    </router-link>
                  </span>
                  <span class="text-muted ms-2">
                    • {{ formatRelativeTime(currentDiscussion.createdAt) }}
                  </span>
                  <span class="text-muted ms-2">
                    • 👁️ {{ currentDiscussion.views || 0 }} vues
                  </span>
                </div>
              </div>

              <!-- Content -->
              <div v-if="!editMode" class="discussion-content">
                <p class="discussion-text">{{ currentDiscussion.content }}</p>
              </div>

              <!-- Edit Form -->
              <form v-else @submit.prevent="handleUpdate" class="mt-3">
                <div class="form-group-custom">
                  <label class="form-label-custom">Titre</label>
                  <input 
                    v-model="editForm.title" 
                    type="text" 
                    class="form-control-custom"
                    required
                  />
                </div>

                <div class="form-group-custom">
                  <label class="form-label-custom">Contenu</label>
                  <textarea 
                    v-model="editForm.content" 
                    class="form-control-custom"
                    rows="6"
                    required
                  ></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    {{ loading ? 'Modification...' : 'Enregistrer' }}
                  </button>
                  <button type="button" class="btn btn-secondary" @click="cancelEdit">
                    Annuler
                  </button>
                </div>
              </form>
            </div>

            <!-- Replies Section -->
            <div class="replies-section mt-4">
              <h4 class="mb-3">
                💬 {{ replies.length }} Réponse{{ replies.length > 1 ? 's' : '' }}
              </h4>

              <!-- Reply Form (si connecté) -->
              <div v-if="isAuthenticated" class="card-custom mb-4">
                <form @submit.prevent="handleReply">
                  <div class="form-group-custom">
                    <label class="form-label-custom">Votre réponse</label>
                    <textarea 
                      v-model="replyContent" 
                      class="form-control-custom"
                      rows="4"
                      placeholder="Écrivez votre réponse..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary" :disabled="replyLoading">
                    {{ replyLoading ? 'Publication...' : 'Publier la réponse' }}
                  </button>
                </form>
              </div>

              <!-- Message pour invités -->
              <div v-else class="alert-custom alert-info mb-4">
                <p class="mb-2">Vous devez être connecté pour répondre.</p>
                <button class="btn btn-sm btn-primary" @click="$router.push('/auth')">
                  Se connecter
                </button>
              </div>

              <!-- Replies List -->
              <div v-if="repliesLoading" class="loading-container">
                <div class="loading-spinner"></div>
              </div>

              <div v-else-if="replies.length === 0 && !isAuthenticated" class="text-center text-muted py-4">
                Aucune réponse pour le moment.
              </div>

              <div v-else class="replies-list">
                <ReplyItem 
                  v-for="reply in replies" 
                  :key="reply.id"
                  :reply="reply"
                  :can-modify="canModifyReply(reply)"
                  @update="handleUpdateReply"
                  @delete="handleDeleteReply"
                />
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <aside class="col-lg-3">
            <!-- Author Info -->
            <div class="card-custom mb-3">
              <h6 class="mb-3">👤 Auteur</h6>
              <div class="text-center">
                <UserAvatar :user="{ displayName: currentDiscussion.authorName }" size="lg" />
                <h6 class="mt-2">{{ currentDiscussion.authorName }}</h6>
                <router-link 
                  :to="`/profile/${currentDiscussion.authorId}`" 
                  class="btn btn-sm btn-outline-primary mt-2"
                >
                  Voir le profil
                </router-link>
              </div>
            </div>

            <!-- Discussion Stats -->
            <div class="card-custom">
              <h6 class="mb-3">📊 Statistiques</h6>
              <div class="stat-item">
                <span class="stat-label">Vues:</span>
                <span class="stat-value">{{ currentDiscussion.views || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Réponses:</span>
                <span class="stat-value">{{ currentDiscussion.repliesCount || 0 }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Créée:</span>
                <span class="stat-value">{{ formatDate(currentDiscussion.createdAt) }}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useDiscussions } from '@/composables/useDiscussions'
import { useReplies } from '@/composables/useReplies'
import { getCategoryName, getCategoryIcon } from '@/utils/categories'
import { formatDate, formatRelativeTime } from '@/utils/formatters'

import UserAvatar from '@/components/UserAvatar.vue'
import ReplyItem from '@/components/ReplyItem.vue'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated } = useAuth()
const { 
  currentDiscussion, 
  loading, 
  error, 
  fetchDiscussionById, 
  updateDiscussion, 
  deleteDiscussion 
} = useDiscussions()

const { 
  replies, 
  loading: repliesLoading, 
  fetchReplies, 
  createReply,
  updateReply,
  deleteReply 
} = useReplies()

const editMode = ref(false)
const editForm = ref({
  title: '',
  content: ''
})

const replyContent = ref('')
const replyLoading = ref(false)

const canModify = computed(() => {
  if (!user.value || !currentDiscussion.value) return false
  return user.value.uid === currentDiscussion.value.authorId || 
         user.value.role === 'moderator'
})

const canModifyReply = (reply) => {
  if (!user.value) return false
  return user.value.uid === reply.authorId || user.value.role === 'moderator'
}

const handleUpdate = async () => {
  try {
    await updateDiscussion(currentDiscussion.value.id, {
      title: editForm.value.title,
      content: editForm.value.content
    })
    
    editMode.value = false
    // Recharger la discussion
    await fetchDiscussionById(route.params.id)
  } catch (err) {
    console.error('Erreur update:', err)
    alert('Erreur lors de la modification')
  }
}

const handleDelete = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) {
    return
  }

  try {
    await deleteDiscussion(currentDiscussion.value.id)
    router.push('/')
  } catch (err) {
    console.error('Erreur delete:', err)
    alert('Erreur lors de la suppression')
  }
}

const cancelEdit = () => {
  editMode.value = false
  editForm.value = {
    title: currentDiscussion.value.title,
    content: currentDiscussion.value.content
  }
}

const handleReply = async () => {
  if (!replyContent.value.trim()) return

  replyLoading.value = true

  try {
    await createReply({
      discussionId: currentDiscussion.value.id,
      content: replyContent.value,
      authorId: user.value.uid,
      authorName: user.value.displayName
    })

    replyContent.value = ''
    // Recharger les réponses
    await fetchReplies(currentDiscussion.value.id)
    // Recharger la discussion pour mettre à jour le compteur
    await fetchDiscussionById(route.params.id)
  } catch (err) {
    console.error('Erreur reply:', err)
    alert('Erreur lors de la publication')
  } finally {
    replyLoading.value = false
  }
}

const handleUpdateReply = async (replyId, content) => {
  try {
    await updateReply(replyId, { content })
    await fetchReplies(currentDiscussion.value.id)
  } catch (err) {
    console.error('Erreur update reply:', err)
    alert('Erreur lors de la modification')
  }
}

const handleDeleteReply = async (replyId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
    return
  }

  try {
    await deleteReply(replyId, currentDiscussion.value.id)
    await fetchReplies(currentDiscussion.value.id)
    await fetchDiscussionById(route.params.id)
  } catch (err) {
    console.error('Erreur delete reply:', err)
    alert('Erreur lors de la suppression')
  }
}

onMounted(async () => {
  const discussionId = route.params.id
  
  try {
    await fetchDiscussionById(discussionId)
    
    if (currentDiscussion.value) {
      editForm.value = {
        title: currentDiscussion.value.title,
        content: currentDiscussion.value.content
      }
    }
    
    await fetchReplies(discussionId)
  } catch (err) {
    console.error('Erreur loading discussion:', err)
  }
})
</script>

<style scoped>
.discussion-page {
  padding: 2rem 0;
}

.breadcrumb {
  background: none;
  padding: 0;
  margin: 0;
}

.breadcrumb-item a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.discussion-main {
  padding: 2rem;
}

.discussion-header {
  border-bottom: 2px solid var(--border-color);
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
}

.discussion-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 1rem 0;
}

.discussion-meta {
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.author-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.author-link:hover {
  text-decoration: underline;
}

.discussion-content {
  line-height: 1.8;
}

.discussion-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.replies-section {
  margin-top: 2rem;
}

.replies-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  color: var(--text-primary);
  font-weight: 600;
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .discussion-title {
    font-size: 1.4rem;
  }
  
  .discussion-main {
    padding: 1rem;
  }
}
</style>