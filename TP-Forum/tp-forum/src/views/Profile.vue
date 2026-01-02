<template>
  <div class="profile-view">
    <div class="container py-4">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-lg-4 mb-4">
          <div class="card">
            <div class="card-body text-center">
              <!-- Avatar -->
              <div class="avatar-lg mx-auto mb-3" :style="{ backgroundColor: userColor }">
                {{ userInitials }}
              </div>

              <!-- Nom -->
              <h4 class="mb-1">{{ user?.name }}</h4>
              <p class="text-muted mb-3">{{ user?.email }}</p>

              <!-- Badge rôle -->
              <span class="badge" :class="user?.role === 'moderator' ? 'bg-warning' : 'bg-primary'">
                <i :class="user?.role === 'moderator' ? 'bi bi-shield-fill-check' : 'bi bi-person-fill'"></i>
                {{ user?.role === 'moderator' ? 'Modérateur' : 'Membre' }}
              </span>

              <!-- Stats -->
              <div class="stats-grid mt-4">
                <div class="stat-item">
                  <div class="stat-value">{{ userDiscussions.length }}</div>
                  <div class="stat-label">Discussions</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ userReplies.length }}</div>
                  <div class="stat-label">Réponses</div>
                </div>
              </div>

              <!-- Membre depuis -->
              <div class="mt-4 pt-4 border-top text-muted">
                <small>
                  <i class="bi bi-calendar-check me-1"></i>
                  Membre depuis {{ formatDate(user?.createdAt) }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="col-lg-8">
          <!-- Onglets -->
          <ul class="nav nav-tabs mb-4" role="tablist">
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'profile' }"
                @click="activeTab = 'profile'"
              >
                <i class="bi bi-person-fill me-2"></i>
                Profil
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'discussions' }"
                @click="activeTab = 'discussions'"
              >
                <i class="bi bi-chat-left-text-fill me-2"></i>
                Mes discussions
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button 
                class="nav-link"
                :class="{ active: activeTab === 'replies' }"
                @click="activeTab = 'replies'"
              >
                <i class="bi bi-reply-fill me-2"></i>
                Mes réponses
              </button>
            </li>
          </ul>

          <!-- Tab: Profil -->
          <div v-if="activeTab === 'profile'" class="card">
            <div class="card-header bg-white">
              <h5 class="mb-0">Informations du profil</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleUpdateProfile">
                <div class="mb-3">
                  <label class="form-label">Nom d'utilisateur</label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    class="form-control"
                    required
                  />
                </div>

                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input
                    :value="user?.email"
                    type="email"
                    class="form-control"
                    disabled
                  />
                  <div class="form-text">L'email ne peut pas être modifié</div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Biographie</label>
                  <textarea
                    v-model="profileForm.bio"
                    class="form-control"
                    rows="4"
                    placeholder="Parlez-nous de vous..."
                  ></textarea>
                </div>

                <div v-if="updateSuccess" class="alert alert-success">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  Profil mis à jour avec succès !
                </div>

                <div v-if="updateError" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ updateError }}
                </div>

                <button 
                  type="submit" 
                  class="btn btn-primary"
                  :disabled="updating"
                >
                  <span v-if="updating" class="spinner-border spinner-border-sm me-2"></span>
                  <i v-else class="bi bi-save-fill me-2"></i>
                  Enregistrer les modifications
                </button>
              </form>
            </div>
          </div>

          <!-- Tab: Mes discussions -->
          <div v-if="activeTab === 'discussions'">
            <div v-if="loadingDiscussions" class="text-center py-5">
              <LoadingSpinner message="Chargement de vos discussions..." />
            </div>

            <div v-else-if="userDiscussions.length > 0">
              <DiscussionCard
                v-for="discussion in userDiscussions"
                :key="discussion.id"
                :discussion="discussion"
              />
            </div>

            <div v-else class="card">
              <div class="card-body text-center py-5">
                <i class="bi bi-chat-left-text fs-1 text-muted"></i>
                <p class="text-muted mt-3">Vous n'avez pas encore créé de discussion</p>
                <router-link to="/create-discussion" class="btn btn-primary">
                  <i class="bi bi-plus-circle me-2"></i>
                  Créer une discussion
                </router-link>
              </div>
            </div>
          </div>

          <!-- Tab: Mes réponses -->
          <div v-if="activeTab === 'replies'">
            <div v-if="loadingReplies" class="text-center py-5">
              <LoadingSpinner message="Chargement de vos réponses..." />
            </div>

            <div v-else-if="userReplies.length > 0" class="card">
              <div class="card-body">
                <div 
                  v-for="(reply, index) in userReplies" 
                  :key="reply.id"
                  class="reply-item"
                  :class="{ 'border-bottom': index < userReplies.length - 1 }"
                >
                  <div class="mb-2">
                    <small class="text-muted">
                      <i class="bi bi-clock-fill me-1"></i>
                      {{ formatDate(reply.createdAt) }}
                    </small>
                  </div>
                  <p class="mb-2">{{ reply.content }}</p>
                  <router-link 
                    :to="`/discussion/${reply.discussionId}`"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <i class="bi bi-arrow-right me-1"></i>
                    Voir la discussion
                  </router-link>
                </div>
              </div>
            </div>

            <div v-else class="card">
              <div class="card-body text-center py-5">
                <i class="bi bi-reply fs-1 text-muted"></i>
                <p class="text-muted mt-3">Vous n'avez pas encore répondu à une discussion</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useUsers } from '@/composables/useUsers';
import { formatDate, getInitials, stringToColor } from '@/utils/formatters';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import DiscussionCard from '@/components/DiscussionCard.vue';

const { user, updateUserProfile } = useAuth();
const { fetchUserDiscussions, fetchUserReplies } = useUsers();

const activeTab = ref('profile');
const profileForm = ref({
  name: user.value?.name || '',
  bio: user.value?.bio || ''
});

const updating = ref(false);
const updateSuccess = ref(false);
const updateError = ref('');

const userDiscussions = ref([]);
const userReplies = ref([]);
const loadingDiscussions = ref(false);
const loadingReplies = ref(false);

const userInitials = computed(() => getInitials(user.value?.name));
const userColor = computed(() => stringToColor(user.value?.name));

onMounted(async () => {
  if (user.value) {
    profileForm.value = {
      name: user.value.name || '',
      bio: user.value.bio || ''
    };

    // Charger les discussions et réponses
    await loadUserContent();
  }
});

const loadUserContent = async () => {
  try {
    loadingDiscussions.value = true;
    loadingReplies.value = true;

    const [discussions, replies] = await Promise.all([
      fetchUserDiscussions(user.value.id),
      fetchUserReplies(user.value.id)
    ]);

    userDiscussions.value = discussions;
    userReplies.value = replies;
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
  } finally {
    loadingDiscussions.value = false;
    loadingReplies.value = false;
  }
};

const handleUpdateProfile = async () => {
  try {
    updating.value = true;
    updateSuccess.value = false;
    updateError.value = '';

    await updateUserProfile(profileForm.value);
    updateSuccess.value = true;

    setTimeout(() => {
      updateSuccess.value = false;
    }, 3000);
  } catch (error) {
    updateError.value = 'Erreur lors de la mise à jour du profil';
    console.error('Erreur:', error);
  } finally {
    updating.value = false;
  }
};
</script>

<style scoped>
.profile-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.avatar-lg {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 2.5rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--bs-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
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

.nav-tabs .nav-link {
  color: #6b7280;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: var(--bs-primary);
  font-weight: 600;
}
</style>