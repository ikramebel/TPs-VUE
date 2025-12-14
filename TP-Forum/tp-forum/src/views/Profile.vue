<template>
  <div class="profile-page">
    <div class="container">
      <!-- Loading -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert-custom alert-error">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else-if="userData">
        <!-- Profile Header -->
        <div class="profile-header card-custom">
          <div class="row align-items-center">
            <div class="col-md-3 text-center">
              <UserAvatar :user="userData" size="xl" />
            </div>
            
            <div class="col-md-6">
              <h1 class="profile-name">{{ userData.displayName }}</h1>
              <p class="profile-email text-muted">{{ userData.email }}</p>
              
              <div v-if="userData.bio" class="profile-bio mt-3">
                <p>{{ userData.bio }}</p>
              </div>

              <div class="profile-badges mt-3">
                <span 
                  v-if="userData.role === 'moderator'" 
                  class="badge-custom badge-primary"
                >
                  🛡️ Modérateur
                </span>
                <span class="badge-custom badge-secondary">
                  👤 Membre depuis {{ formatDate(userData.createdAt) }}
                </span>
              </div>
            </div>

            <div class="col-md-3 text-center">
              <!-- Edit button (si c'est son profil) -->
              <button 
                v-if="isOwnProfile"
                class="btn btn-primary w-100 mb-2"
                @click="showEditModal = true"
              >
                ✏️ Modifier le profil
              </button>
              
              <!-- Stats -->
              <div class="profile-stats mt-3">
                <div class="stat-box">
                  <div class="stat-number">{{ userDiscussions.length }}</div>
                  <div class="stat-label">Discussions</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">{{ userReplies.length }}</div>
                  <div class="stat-label">Réponses</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="profile-tabs mt-4">
          <button 
            :class="['tab-btn', { active: activeTab === 'discussions' }]"
            @click="activeTab = 'discussions'"
          >
            💬 Discussions ({{ userDiscussions.length }})
          </button>
          <button 
            :class="['tab-btn', { active: activeTab === 'replies' }]"
            @click="activeTab = 'replies'"
          >
            💭 Réponses ({{ userReplies.length }})
          </button>
        </div>

        <!-- Tab Content -->
        <div class="tab-content mt-4">
          <!-- Discussions Tab -->
          <div v-if="activeTab === 'discussions'">
            <div v-if="discussionsLoading" class="loading-container">
              <div class="loading-spinner"></div>
            </div>
            
            <div v-else-if="userDiscussions.length === 0" class="no-content">
              <p class="text-muted text-center py-5">
                {{ isOwnProfile ? 'Vous n\'avez pas encore créé de discussion.' : 'Aucune discussion créée.' }}
              </p>
              <div v-if="isOwnProfile" class="text-center">
                <button class="btn btn-primary" @click="$router.push('/create-discussion')">
                  Créer ma première discussion
                </button>
              </div>
            </div>

            <div v-else class="discussions-list">
              <DiscussionCard 
                v-for="discussion in userDiscussions" 
                :key="discussion.id"
                :discussion="discussion"
                @click="$router.push(`/discussion/${discussion.id}`)"
              />
            </div>
          </div>

          <!-- Replies Tab -->
          <div v-if="activeTab === 'replies'">
            <div v-if="repliesLoading" class="loading-container">
              <div class="loading-spinner"></div>
            </div>
            
            <div v-else-if="userReplies.length === 0" class="no-content">
              <p class="text-muted text-center py-5">
                {{ isOwnProfile ? 'Vous n\'avez pas encore répondu à de discussion.' : 'Aucune réponse publiée.' }}
              </p>
            </div>

            <div v-else class="replies-list">
              <div 
                v-for="reply in userReplies" 
                :key="reply.id"
                class="reply-preview card-custom"
                @click="goToDiscussion(reply.discussionId)"
              >
                <div class="reply-content">
                  <p>{{ truncateText(reply.content, 200) }}</p>
                </div>
                <div class="reply-meta text-muted">
                  <small>{{ formatRelativeTime(reply.createdAt) }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content card-custom" @click.stop>
        <h3 class="mb-4">✏️ Modifier le profil</h3>

        <form @submit.prevent="handleUpdateProfile">
          <div class="form-group-custom">
            <label class="form-label-custom">Nom d'utilisateur</label>
            <input 
              v-model="editForm.displayName" 
              type="text" 
              class="form-control-custom"
              required
            />
          </div>

          <div class="form-group-custom">
            <label class="form-label-custom">Biographie</label>
            <textarea 
              v-model="editForm.bio" 
              class="form-control-custom"
              rows="4"
              placeholder="Parlez-nous de vous..."
              maxlength="500"
            ></textarea>
            <small class="text-muted">{{ editForm.bio?.length || 0 }}/500 caractères</small>
          </div>

          <div v-if="updateError" class="alert-custom alert-error mb-3">
            {{ updateError }}
          </div>

          <div v-if="updateSuccess" class="alert-custom alert-success mb-3">
            Profil mis à jour avec succès !
          </div>

          <div class="d-flex gap-2">
            <button type="submit" class="btn btn-primary" :disabled="updateLoading">
              {{ updateLoading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
            <button 
              type="button" 
              class="btn btn-secondary" 
              @click="showEditModal = false"
              :disabled="updateLoading"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useUsers } from '@/composables/useUsers'
import { useDiscussions } from '@/composables/useDiscussions'
import { useReplies } from '@/composables/useReplies'
import { formatDate, formatRelativeTime, truncateText } from '@/utils/formatters'

import UserAvatar from '@/components/UserAvatar.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'

const route = useRoute()
const router = useRouter()
const { user, updateUserProfile } = useAuth()
const { userData, loading, error, fetchUser } = useUsers()
const { fetchUserDiscussions } = useDiscussions()
const { fetchUserReplies } = useReplies()

const activeTab = ref('discussions')
const showEditModal = ref(false)

const userDiscussions = ref([])
const userReplies = ref([])
const discussionsLoading = ref(false)
const repliesLoading = ref(false)

const updateLoading = ref(false)
const updateError = ref(null)
const updateSuccess = ref(false)

const editForm = ref({
  displayName: '',
  bio: ''
})

const isOwnProfile = computed(() => {
  return user.value && userData.value && user.value.uid === userData.value.uid
})

const handleUpdateProfile = async () => {
  updateLoading.value = true
  updateError.value = null
  updateSuccess.value = false

  try {
    await updateUserProfile(user.value.uid, {
      displayName: editForm.value.displayName,
      bio: editForm.value.bio
    })

    updateSuccess.value = true
    
    // Recharger les données
    await fetchUser(route.params.id)
    
    // Fermer le modal après 2 secondes
    setTimeout(() => {
      showEditModal.value = false
      updateSuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Erreur update profile:', err)
    updateError.value = 'Erreur lors de la mise à jour du profil'
  } finally {
    updateLoading.value = false
  }
}

const goToDiscussion = (discussionId) => {
  router.push(`/discussion/${discussionId}`)
}

const loadUserContent = async (userId) => {
  // Charger les discussions
  discussionsLoading.value = true
  try {
    userDiscussions.value = await fetchUserDiscussions(userId)
  } catch (err) {
    console.error('Erreur loading discussions:', err)
  } finally {
    discussionsLoading.value = false
  }

  // Charger les réponses
  repliesLoading.value = true
  try {
    userReplies.value = await fetchUserReplies(userId)
  } catch (err) {
    console.error('Erreur loading replies:', err)
  } finally {
    repliesLoading.value = false
  }
}

onMounted(async () => {
  const userId = route.params.id

  try {
    await fetchUser(userId)
    
    if (userData.value) {
      editForm.value = {
        displayName: userData.value.displayName || '',
        bio: userData.value.bio || ''
      }
    }

    await loadUserContent(userId)
  } catch (err) {
    console.error('Erreur loading profile:', err)
  }
})
</script>

<style scoped>
.profile-page {
  padding: 2rem 0;
  min-height: calc(100vh - 180px);
}

.profile-header {
  padding: 2rem;
}

.profile-name {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.profile-email {
  font-size: 1rem;
  margin-bottom: 0;
}

.profile-bio {
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  border-left: 3px solid var(--primary-color);
}

.profile-bio p {
  margin: 0;
  color: var(--text-secondary);
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.profile-stats {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.stat-box {
  text-align: center;
  padding: 1rem;
  background-color: var(--bg-primary);
  border-radius: var(--radius-md);
  flex: 1;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.profile-tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid var(--border-color);
}

.tab-btn {
  padding: 1rem 2rem;
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

.discussions-list,
.replies-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reply-preview {
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
}

.reply-preview:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.reply-content p {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.reply-meta {
  font-size: 0.9rem;
}

.no-content {
  background: white;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.d-flex {
  display: flex;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 768px) {
  .profile-header {
    padding: 1.5rem;
  }

  .profile-name {
    font-size: 1.5rem;
  }

  .profile-stats {
    margin-top: 1rem;
  }

  .tab-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}
</style>