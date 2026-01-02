<template>
  <div class="discussion-view">
    <div class="container py-4">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <LoadingSpinner message="Chargement de la discussion..." />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger">
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        {{ error }}
        <div class="mt-3">
          <router-link to="/" class="btn btn-primary">
            Retour à l'accueil
          </router-link>
        </div>
      </div>

      <!-- Discussion -->
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
            <li class="breadcrumb-item active" aria-current="page">
              {{ currentDiscussion.title }}
            </li>
          </ol>
        </nav>

        <!-- Discussion principale -->
        <div class="card mb-4">
          <div class="card-body">
            <div class="d-flex align-items-start justify-content-between mb-3">
              <div class="flex-grow-1">
                <div class="d-flex align-items-center mb-2">
                  <span class="category-badge me-2">
                    {{ getCategoryIcon(currentDiscussion.category) }}
                  </span>
                  <h1 class="h3 mb-0">
                    <i v-if="currentDiscussion.isPinned" class="bi bi-pin-angle-fill text-warning me-1"></i>
                    {{ currentDiscussion.title }}
                    <i v-if="currentDiscussion.isLocked" class="bi bi-lock-fill text-muted ms-1"></i>
                  </h1>
                </div>

                <div class="discussion-meta text-muted">
                  <span class="me-3">
                    <i class="bi bi-person-fill"></i>
                    {{ currentDiscussion.authorName }}
                  </span>
                  <span class="me-3">
                    <i class="bi bi-clock-fill"></i>
                    {{ formatDate(currentDiscussion.createdAt) }}
                  </span>
                  <span class="me-3">
                    <i class="bi bi-chat-fill"></i>
                    {{ replies.length }} réponses
                  </span>
                  <span>
                    <i class="bi bi-eye-fill"></i>
                    {{ currentDiscussion.views || 0 }} vues
                  </span>
                </div>
              </div>

              <!-- Actions modérateur -->
              <div v-if="isModerator" class="dropdown">
                <button 
                  class="btn btn-sm btn-outline-secondary dropdown-toggle" 
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="handleTogglePin">
                      <i class="bi bi-pin-angle-fill me-2"></i>
                      {{ currentDiscussion.isPinned ? 'Désépingler' : 'Épingler' }}
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="handleToggleLock">
                      <i class="bi bi-lock-fill me-2"></i>
                      {{ currentDiscussion.isLocked ? 'Déverrouiller' : 'Verrouiller' }}
                    </a>
                  </li>
                  <li><hr class="dropdown-divider"></li>
                  <li>
                    <a class="dropdown-item text-danger" href="#" @click.prevent="handleDeleteDiscussion">
                      <i class="bi bi-trash-fill me-2"></i>
                      Supprimer
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div class="discussion-content">
              <p class="mb-3">{{ currentDiscussion.content }}</p>
            </div>

            <div class="discussion-actions mt-3 pt-3 border-top">
              <button class="btn btn-sm btn-outline-secondary me-2">
                <i class="bi bi-flag-fill"></i>
                Signaler
              </button>
              <button 
                v-if="isAuthenticated && user?.id === currentDiscussion.authorId"
                class="btn btn-sm btn-outline-primary"
                @click="showEditModal = true"
              >
                <i class="bi bi-pencil-fill"></i>
                Modifier
              </button>
            </div>
          </div>
        </div>

        <!-- Réponses -->
        <div class="card mb-4">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="bi bi-chat-left-text-fill me-2"></i>
              Réponses ({{ replies.length }})
            </h5>
          </div>
          <div class="card-body">
            <!-- Loading des réponses -->
            <div v-if="repliesLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>

            <!-- Liste des réponses -->
            <div v-else-if="replies.length > 0" class="replies-list">
              <div 
                v-for="(reply, index) in replies" 
                :key="reply.id"
                class="reply-item"
                :class="{ 'border-bottom': index < replies.length - 1 }"
              >
                <div class="d-flex">
                  <div class="avatar me-3" :style="{ backgroundColor: stringToColor(reply.authorName) }">
                    {{ getInitials(reply.authorName) }}
                  </div>
                  <div class="flex-grow-1">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                      <div>
                        <strong>{{ reply.authorName }}</strong>
                        <span class="text-muted ms-2">
                          {{ formatDate(reply.createdAt) }}
                          <span v-if="reply.isEdited" class="badge bg-secondary ms-2">Modifié</span>
                        </span>
                      </div>
                      <div v-if="isAuthenticated && user?.id === reply.authorId" class="dropdown">
                        <button 
                          class="btn btn-sm btn-link text-muted" 
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li>
                            <a class="dropdown-item" href="#" @click.prevent="editReply(reply)">
                              <i class="bi bi-pencil-fill me-2"></i>
                              Modifier
                            </a>
                          </li>
                          <li>
                            <a class="dropdown-item text-danger" href="#" @click.prevent="handleDeleteReply(reply.id)">
                              <i class="bi bi-trash-fill me-2"></i>
                              Supprimer
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p class="mb-0">{{ reply.content }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Aucune réponse -->
            <div v-else class="text-center text-muted py-4">
              <i class="bi bi-chat-left-text fs-1"></i>
              <p class="mt-2">Aucune réponse pour le moment. Soyez le premier à répondre !</p>
            </div>
          </div>
        </div>

        <!-- Formulaire de réponse -->
        <div v-if="isAuthenticated && !currentDiscussion.isLocked" class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="bi bi-reply-fill me-2"></i>
              Votre réponse
            </h5>
          </div>
          <div class="card-body">
            <!-- Erreur de soumission -->
            <div v-if="submitError" class="alert alert-danger alert-dismissible fade show">
              <i class="bi bi-exclamation-triangle-fill me-2"></i>
              {{ submitError }}
              <button type="button" class="btn-close" @click="submitError = ''"></button>
            </div>

            <form @submit.prevent="handleSubmitReply">
              <div class="mb-3">
                <textarea
                  v-model="replyContent"
                  class="form-control"
                  rows="5"
                  placeholder="Écrivez votre réponse..."
                  required
                  minlength="3"
                  :disabled="submitting"
                ></textarea>
                <div class="form-text">{{ replyContent.length }} caractères (minimum 3)</div>
              </div>
              <div class="d-flex justify-content-end">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="!replyContent.trim() || replyContent.trim().length < 3 || submitting"
                >
                  <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-send-fill me-2"></i>
                  Publier la réponse
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Message si non connecté -->
        <div v-else-if="!isAuthenticated" class="card">
          <div class="card-body text-center py-4">
            <i class="bi bi-lock-fill fs-1 text-muted mb-3 d-block"></i>
            <h5>Connectez-vous pour participer</h5>
            <p class="text-muted">Vous devez être connecté pour répondre à cette discussion.</p>
            <router-link to="/auth" class="btn btn-primary">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Se connecter
            </router-link>
          </div>
        </div>

        <!-- Message si verrouillé -->
        <div v-else-if="currentDiscussion.isLocked" class="card">
          <div class="card-body text-center py-4">
            <i class="bi bi-lock-fill fs-1 text-warning mb-3 d-block"></i>
            <h5>Discussion verrouillée</h5>
            <p class="text-muted">Cette discussion a été verrouillée par un modérateur.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal d'édition de réponse -->
    <div v-if="editingReply" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Modifier la réponse</h5>
            <button type="button" class="btn-close" @click="cancelEdit"></button>
          </div>
          <div class="modal-body">
            <textarea
              v-model="editContent"
              class="form-control"
              rows="5"
              minlength="3"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="cancelEdit">
              Annuler
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="saveEdit"
              :disabled="!editContent.trim() || editContent.trim().length < 3"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editingReply" class="modal-backdrop show"></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useDiscussions } from '@/composables/useDiscussions';
import { useReplies } from '@/composables/useReplies';
import { formatDate, getInitials, stringToColor } from '@/utils/formatters';
import { getCategoryName, getCategoryIcon } from '@/utils/categories';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const route = useRoute();
const router = useRouter();
const { user, isAuthenticated, isModerator } = useAuth();
const { currentDiscussion, loading, error, fetchDiscussionById, togglePin, toggleLock, deleteDiscussion } = useDiscussions();
const { replies, loading: repliesLoading, fetchReplies, createReply, updateReply, deleteReply } = useReplies();

const replyContent = ref('');
const submitting = ref(false);
const submitError = ref('');
const editingReply = ref(null);
const editContent = ref('');
const showEditModal = ref(false);

onMounted(async () => {
  const discussionId = route.params.id;
  try {
    await fetchDiscussionById(discussionId);
    await fetchReplies(discussionId);
  } catch (err) {
    console.error('Erreur:', err);
  }
});

const handleSubmitReply = async () => {
  if (!replyContent.value.trim() || replyContent.value.trim().length < 3) {
    submitError.value = 'La réponse doit contenir au moins 3 caractères';
    return;
  }

  if (!user.value) {
    submitError.value = 'Vous devez être connecté pour répondre';
    return;
  }

  try {
    submitting.value = true;
    submitError.value = '';
    
    await createReply(
      currentDiscussion.value.id,
      replyContent.value,
      user.value.id,
      user.value.name
    );
    
    replyContent.value = '';
  } catch (err) {
    console.error('Erreur lors de la création de la réponse:', err);
    submitError.value = err.message || 'Erreur lors de la publication de la réponse';
  } finally {
    submitting.value = false;
  }
};

const editReply = (reply) => {
  editingReply.value = reply;
  editContent.value = reply.content;
};

const cancelEdit = () => {
  editingReply.value = null;
  editContent.value = '';
};

const saveEdit = async () => {
  if (!editContent.value.trim() || editContent.value.trim().length < 3) {
    alert('Le contenu doit contenir au moins 3 caractères');
    return;
  }

  try {
    await updateReply(editingReply.value.id, editContent.value);
    cancelEdit();
  } catch (err) {
    console.error('Erreur lors de la modification:', err);
    alert('Erreur lors de la modification');
  }
};

const handleDeleteReply = async (replyId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) return;

  try {
    await deleteReply(replyId, currentDiscussion.value.id);
  } catch (err) {
    console.error('Erreur lors de la suppression:', err);
    alert('Erreur lors de la suppression');
  }
};

const handleTogglePin = async () => {
  try {
    await togglePin(currentDiscussion.value.id);
  } catch (err) {
    console.error('Erreur:', err);
  }
};

const handleToggleLock = async () => {
  try {
    await toggleLock(currentDiscussion.value.id);
  } catch (err) {
    console.error('Erreur:', err);
  }
};

const handleDeleteDiscussion = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) return;

  try {
    await deleteDiscussion(currentDiscussion.value.id);
    router.push('/');
  } catch (err) {
    console.error('Erreur:', err);
    alert('Erreur lors de la suppression');
  }
};
</script>

<style scoped>
.discussion-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.category-badge {
  font-size: 1.75rem;
}

.discussion-meta {
  font-size: 0.875rem;
}

.discussion-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
}

.replies-list {
  display: flex;
  flex-direction: column;
}

.reply-item {
  padding: 1.5rem 0;
}

.reply-item:first-child {
  padding-top: 0;
}

.reply-item:last-child {
  padding-bottom: 0;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.modal.show {
  background-color: rgba(0, 0, 0, 0.5);
}

.breadcrumb {
  background-color: transparent;
  padding: 0;
  margin-bottom: 1rem;
}
</style>