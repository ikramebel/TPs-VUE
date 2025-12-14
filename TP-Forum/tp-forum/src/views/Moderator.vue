<template>
  <div class="moderator-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header mb-4">
        <h1>🛡️ Panneau de Modération</h1>
        <p class="text-muted">Gérer le contenu et surveiller l'activité du forum</p>
      </div>

      <!-- Stats Cards -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="stat-card card-custom">
            <div class="stat-icon">💬</div>
            <div class="stat-info">
              <div class="stat-value">{{ allDiscussions.length }}</div>
              <div class="stat-label">Total Discussions</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="stat-card card-custom">
            <div class="stat-icon">💭</div>
            <div class="stat-info">
              <div class="stat-value">{{ allReplies.length }}</div>
              <div class="stat-label">Total Réponses</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="stat-card card-custom">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <div class="stat-value">{{ allUsers.length }}</div>
              <div class="stat-label">Utilisateurs</div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="stat-card card-custom">
            <div class="stat-icon">⚠️</div>
            <div class="stat-info">
              <div class="stat-value text-danger">0</div>
              <div class="stat-label">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="moderator-tabs">
        <button 
          :class="['tab-btn', { active: activeTab === 'discussions' }]"
          @click="activeTab = 'discussions'"
        >
          💬 Discussions
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'users' }]"
          @click="activeTab = 'users'"
        >
          👥 Utilisateurs
        </button>
        <button 
          :class="['tab-btn', { active: activeTab === 'reports' }]"
          @click="activeTab = 'reports'"
        >
          ⚠️ Signalements
        </button>
      </div>

      <!-- Tab Content -->
      <div class="tab-content mt-4">
        <!-- Discussions Tab -->
        <div v-if="activeTab === 'discussions'">
          <div class="card-custom">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Toutes les discussions</h5>
              <input 
                v-model="discussionSearch"
                type="text" 
                class="form-control w-auto"
                placeholder="Rechercher..."
              />
            </div>

            <div v-if="loading" class="loading-container">
              <div class="loading-spinner"></div>
            </div>

            <div v-else-if="filteredDiscussions.length === 0" class="text-center text-muted py-4">
              Aucune discussion trouvée.
            </div>

            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th>Vues</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="discussion in filteredDiscussions" :key="discussion.id">
                    <td>
                      <router-link 
                        :to="`/discussion/${discussion.id}`"
                        class="discussion-link"
                      >
                        {{ truncateText(discussion.title, 60) }}
                      </router-link>
                    </td>
                    <td>{{ discussion.authorName }}</td>
                    <td>
                      <span class="badge-custom badge-secondary">
                        {{ getCategoryName(discussion.category) }}
                      </span>
                    </td>
                    <td>{{ formatDate(discussion.createdAt) }}</td>
                    <td>{{ discussion.views || 0 }}</td>
                    <td>
                      <button 
                        class="btn btn-sm btn-danger"
                        @click="handleDeleteDiscussion(discussion.id)"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Users Tab -->
        <div v-if="activeTab === 'users'">
          <div class="card-custom">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h5 class="mb-0">Tous les utilisateurs</h5>
              <input 
                v-model="userSearch"
                type="text" 
                class="form-control w-auto"
                placeholder="Rechercher..."
              />
            </div>

            <div v-if="usersLoading" class="loading-container">
              <div class="loading-spinner"></div>
            </div>

            <div v-else-if="filteredUsers.length === 0" class="text-center text-muted py-4">
              Aucun utilisateur trouvé.
            </div>

            <div v-else class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Inscrit le</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="userItem in filteredUsers" :key="userItem.id">
                    <td>
                      <div class="d-flex align-items-center gap-2">
                        <UserAvatar :user="userItem" size="sm" />
                        <router-link 
                          :to="`/profile/${userItem.id}`"
                          class="user-link"
                        >
                          {{ userItem.displayName }}
                        </router-link>
                      </div>
                    </td>
                    <td>{{ userItem.email }}</td>
                    <td>
                      <span 
                        :class="[
                          'badge-custom', 
                          userItem.role === 'moderator' ? 'badge-primary' : 'badge-secondary'
                        ]"
                      >
                        {{ userItem.role === 'moderator' ? '🛡️ Modérateur' : '👤 Utilisateur' }}
                      </span>
                    </td>
                    <td>{{ formatDate(userItem.createdAt) }}</td>
                    <td>
                      <router-link 
                        :to="`/profile/${userItem.id}`"
                        class="btn btn-sm btn-outline-primary"
                      >
                        Voir profil
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Reports Tab -->
        <div v-if="activeTab === 'reports'">
          <div class="card-custom">
            <h5 class="mb-3">Signalements</h5>
            
            <div class="text-center text-muted py-5">
              <p class="mb-0">Aucun signalement pour le moment.</p>
              <small>Les contenus signalés apparaîtront ici.</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content card-custom" @click.stop>
        <h4 class="mb-3">⚠️ Confirmer la suppression</h4>
        <p>Êtes-vous sûr de vouloir supprimer cette discussion ?</p>
        <p class="text-muted small">Cette action est irréversible.</p>

        <div class="d-flex gap-2 mt-4">
          <button 
            class="btn btn-danger"
            @click="confirmDelete"
            :disabled="deleteLoading"
          >
            {{ deleteLoading ? 'Suppression...' : 'Supprimer' }}
          </button>
          <button 
            class="btn btn-secondary"
            @click="showDeleteModal = false"
            :disabled="deleteLoading"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDiscussions } from '@/composables/useDiscussions'
import { useUsers } from '@/composables/useUsers'
import { useReplies } from '@/composables/useReplies'
import { formatDate, truncateText } from '@/utils/formatters'
import { getCategoryName } from '@/utils/categories'

import UserAvatar from '@/components/UserAvatar.vue'

const { fetchDiscussions, deleteDiscussion, loading } = useDiscussions()
const { fetchUsers, loading: usersLoading } = useUsers()
const { replies: allRepliesData, fetchReplies } = useReplies()

const activeTab = ref('discussions')
const discussionSearch = ref('')
const userSearch = ref('')

const allDiscussions = ref([])
const allUsers = ref([])
const allReplies = ref([])

const showDeleteModal = ref(false)
const deleteLoading = ref(false)
const discussionToDelete = ref(null)

const filteredDiscussions = computed(() => {
  if (!discussionSearch.value) return allDiscussions.value
  
  const search = discussionSearch.value.toLowerCase()
  return allDiscussions.value.filter(d => 
    d.title.toLowerCase().includes(search) ||
    d.authorName.toLowerCase().includes(search)
  )
})

const filteredUsers = computed(() => {
  if (!userSearch.value) return allUsers.value
  
  const search = userSearch.value.toLowerCase()
  return allUsers.value.filter(u => 
    u.displayName.toLowerCase().includes(search) ||
    u.email.toLowerCase().includes(search)
  )
})

const handleDeleteDiscussion = (discussionId) => {
  discussionToDelete.value = discussionId
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true

  try {
    await deleteDiscussion(discussionToDelete.value)
    
    // Retirer de la liste
    allDiscussions.value = allDiscussions.value.filter(
      d => d.id !== discussionToDelete.value
    )
    
    showDeleteModal.value = false
    discussionToDelete.value = null
  } catch (err) {
    console.error('Erreur suppression:', err)
    alert('Erreur lors de la suppression')
  } finally {
    deleteLoading.value = false
  }
}

const loadData = async () => {
  try {
    // Charger discussions
    allDiscussions.value = await fetchDiscussions(null, 100)
    
    // Charger utilisateurs
    allUsers.value = await fetchUsers()
    
    // Pour les réponses, on pourrait les charger toutes,
    // mais pour l'instant on affiche juste le compte
    allReplies.value = []
  } catch (err) {
    console.error('Erreur loading data:', err)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.moderator-page {
  padding: 2rem 0;
  min-height: calc(100vh - 180px);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.stat-icon {
  font-size: 3rem;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.moderator-tabs {
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

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead {
  background-color: var(--bg-primary);
}

.table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 2px solid var(--border-color);
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.table tbody tr:hover {
  background-color: var(--bg-hover);
}

.discussion-link,
.user-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.discussion-link:hover,
.user-link:hover {
  text-decoration: underline;
}

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
  max-width: 450px;
  width: 100%;
  padding: 2rem;
  animation:slideUp 0.3s ease;
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
.stat-card {
padding: 1rem;
}
.stat-icon {
font-size: 2rem;
}
.stat-value {
font-size: 1.5rem;
}
.table-responsive {
overflow-x: auto;
}
.table {
min-width: 700px;
}
}
</style>

