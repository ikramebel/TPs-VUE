<template>
  <div class="reply-item">
    <div class="reply-header">
      <div class="reply-author">
        <UserAvatar :user="{ displayName: reply.authorName }" size="sm" />
        <div class="author-info">
          <router-link 
            :to="`/profile/${reply.authorId}`" 
            class="author-name"
          >
            {{ reply.authorName }}
          </router-link>
          <span class="reply-date">{{ formatRelativeTime(reply.createdAt) }}</span>
        </div>
      </div>

      <div v-if="canModify" class="reply-actions">
        <button 
          v-if="!editMode"
          class="btn-icon"
          @click="editMode = true"
          title="Modifier"
        >
          ✏️
        </button>
        <button 
          class="btn-icon text-danger"
          @click="$emit('delete', reply.id)"
          title="Supprimer"
        >
          🗑️
        </button>
      </div>
    </div>

    <div v-if="!editMode" class="reply-content">
      <p class="reply-text">{{ reply.content }}</p>
    </div>

    <form v-else @submit.prevent="handleUpdate" class="reply-edit-form">
      <textarea 
        v-model="editedContent"
        class="form-control-custom"
        rows="4"
        required
      ></textarea>
      
      <div class="edit-actions mt-2">
        <button type="submit" class="btn btn-sm btn-primary" :disabled="updateLoading">
          {{ updateLoading ? 'Enregistrement...' : 'Enregistrer' }}
        </button>
        <button 
          type="button" 
          class="btn btn-sm btn-secondary" 
          @click="cancelEdit"
        >
          Annuler
        </button>
      </div>
    </form>

    <div v-if="reply.updatedAt && reply.updatedAt !== reply.createdAt" class="reply-edited">
      <small class="text-muted">Modifié {{ formatRelativeTime(reply.updatedAt) }}</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { formatRelativeTime } from '@/utils/formatters'
import UserAvatar from '@/components/UserAvatar.vue'

const props = defineProps({
  reply: {
    type: Object,
    required: true
  },
  canModify: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'delete'])

const editMode = ref(false)
const editedContent = ref(props.reply.content)
const updateLoading = ref(false)

const handleUpdate = async () => {
  if (!editedContent.value.trim()) return

  updateLoading.value = true

  try {
    await emit('update', props.reply.id, editedContent.value)
    editMode.value = false
  } catch (err) {
    console.error('Erreur update:', err)
  } finally {
    updateLoading.value = false
  }
}

const cancelEdit = () => {
  editMode.value = false
  editedContent.value = props.reply.content
}
</script>

<style scoped>
.reply-item {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border-left: 3px solid var(--primary-color);
}

.reply-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.reply-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.95rem;
}

.author-name:hover {
  text-decoration: underline;
}

.reply-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.btn-icon:hover {
  background-color: var(--bg-hover);
}

.btn-icon.text-danger:hover {
  background-color: rgba(245, 101, 101, 0.1);
}

.reply-content {
  margin-top: 1rem;
}

.reply-text {
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.7;
  color: var(--text-primary);
  margin: 0;
}

.reply-edit-form {
  margin-top: 1rem;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
}

.reply-edited {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 768px) {
  .reply-item {
    padding: 1rem;
  }
}
</style>