<template>
  <div class="moderator-view">
    <div class="container py-4">
      <!-- En-tête -->
      <div class="card mb-4 border-warning">
        <div class="card-body">
          <div class="d-flex align-items-center">
            <i class="bi bi-shield-fill-check fs-1 text-warning me-3"></i>
            <div>
              <h2 class="mb-1">Panneau de Modération</h2>
              <p class="text-muted mb-0">Gérez le contenu et les utilisateurs du forum</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistiques -->
      <div class="row mb-4">
        <div class="col-md-3 mb-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-primary">
                  <i class="bi bi-chat-left-text-fill"></i>
                </div>
                <div class="ms-3">
                  <h3 class="mb-0">{{ totalDiscussions }}</h3>
                  <small class="text-muted">Total Discussions</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-success">
                  <i class="bi bi-reply-fill"></i>
                </div>
                <div class="ms-3">
                  <h3 class="mb-0">{{ totalReplies }}</h3>
                  <small class="text-muted">Total Réponses</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-warning">
                  <i class="bi bi-flag-fill"></i>
                </div>
                <div class="ms-3">
                  <h3 class="mb-0">0</h3>
                  <small class="text-muted">Signalements</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="stat-icon bg-info">
                  <i class="bi bi-people-fill"></i>
                </div>
                <div class="ms-3">
                  <h3 class="mb-0">-</h3>
                  <small class="text-muted">Utilisateurs</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglets -->
      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item">
          <button 
            class="nav-link"
            :class="{ active: activeTab === 'discussions' }"
            @click="activeTab = 'discussions'"
          >
            <i class="bi bi-chat-left-text-fill me-2"></i>
            Discussions
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link"
            :class="{ active: activeTab === 'reports' }"
            @click="activeTab = 'reports'"
          >
            <i class="bi bi-flag-fill me-2"></i>
            Signalements
            <span class="badge bg-danger ms-1">0</span>
          </button>
        </li>
        <li class="nav-item">
          <button 
            class="nav-link"
            :class="{ active: activeTab === 'users' }"
            @click="activeTab = 'users'"
          >
            <i class="bi bi-people-fill me-2"></i>
            Utilisateurs
          </button>
        </li>
      </ul>

      <!-- Tab: Discussions -->
      <div v-if="activeTab === 'discussions'">
        <div class="card">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Toutes les discussions</h5>
            <div class="input-group" style="max-width: 300px;">
              <span class="input-group-text bg-white">
                <i class="bi bi-search"></i>
              </span>
              <input
                type="text"
                v-model="searchQuery"
                class="form-control"
                placeholder="Rechercher..."
              />
            </div>
          </div>
          <div class="card-body p-0">
            <div v-if="loading" class="text-center py-5">
              <LoadingSpinner />
            </div>

            <div v-else-if="filteredDiscussions.length > 0" class="table-responsive">
              <table class="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Auteur</th>
                    <th>Catégorie</th>
                    <th>Réponses</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="discussion in filteredDiscussions" :key="discussion.id">
                    <td>
                      <router-link :to="`/discussion/${discussion.id}`" class="text-decoration-none">
                        <i v-if="discussion.isPinned" class="bi bi-pin-angle-fill text-warning me-1"></i>
                        {{ discussion.title }}
                        <i v-if="discussion.isLocked" class="bi bi-lock-fill text-muted ms-1"></i>
                      </router-link>
                    </td>
                    <td>{{ discussion.authorName }}</td>
                    <td>
                      <span class="badge bg-secondary">
                        {{ getCategoryName(discussion.category) }}
                      </span>
                    </td>
                    <td>{{ discussion.replyCount || 0 }}</td>
                    <td>{{ formatDate(discussion.createdAt) }}</td>
                    <td>
                      <div class="btn-group btn-group-sm">
                        <button 
                          class="btn btn-outline-warning"
                          :title="discussion.isPinned ? 'Désépingler' : 'Épingler'"
                          @click="handleTogglePin(discussion.id)"
                        >
                          <i class="bi bi-pin-angle-fill"></i>
                        </button>
                        <button 
                          class="btn btn-outline-secondary"
                          :title="discussion.isLocked ? 'Déverrouiller' : 'Verrouiller'"
                          @click="handleToggleLock(discussion.id)"
                        >
                          <i class="bi bi-lock-fill"></i>
                        </button>
                        <button 
                          class="btn btn-outline-danger"
                          title="Supprimer"
                          @click="handleDelete(discussion.id)"
                        >
                          <i class="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div v-else class="text-center py-5">
              <p class="text-muted">Aucune discussion trouvée</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Signalements -->
      <div v-if="activeTab === 'reports'">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-flag fs-1 text-muted"></i>
            <p class="text-muted mt-3">Aucun signalement en attente</p>
          </div>
        </div>
      </div>

      <!-- Tab: Utilisateurs -->
      <div v-if="activeTab === 'users'">
        <div class="card">
          <div class="card-body text-center py-5">
            <i class="bi bi-people fs-1 text-muted"></i>
            <p class="text-muted mt-3">Gestion des utilisateurs à venir</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useDiscussions } from '@/composables/useDiscussions';
import { formatDate } from '@/utils/formatters';
import { getCategoryName } from '@/utils/categories';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

const { discussions, loading, fetchDiscussions, togglePin, toggleLock, deleteDiscussion } = useDiscussions();

const activeTab = ref('discussions');
const searchQuery = ref('');

const totalDiscussions = computed(() => discussions.value.length);
const totalReplies = computed(() => {
  return discussions.value.reduce((sum, d) => sum + (d.replyCount || 0), 0);
});

const filteredDiscussions = computed(() => {
  if (!searchQuery.value) return discussions.value;

  const query = searchQuery.value.toLowerCase();
  return discussions.value.filter(d =>
    d.title.toLowerCase().includes(query) ||
    d.authorName.toLowerCase().includes(query)
  );
});

onMounted(async () => {
  await fetchDiscussions({ sortBy: 'recent' });
});

const handleTogglePin = async (id) => {
  try {
    await togglePin(id);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'opération');
  }
};

const handleToggleLock = async (id) => {
  try {
    await toggleLock(id);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de l\'opération');
  }
};

const handleDelete = async (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) return;

  try {
    await deleteDiscussion(id);
  } catch (error) {
    console.error('Erreur:', error);
    alert('Erreur lors de la suppression');
  }
};
</script>

<style scoped>
.moderator-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.stat-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.table td {
  vertical-align: middle;
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