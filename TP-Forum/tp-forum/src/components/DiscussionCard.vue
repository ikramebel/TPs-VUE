<template>
  <div class="discussion-card" @click="$emit('click')">
    <div class="discussion-card-header">
      <div class="discussion-info">
        <span class="category-badge">
          {{ getCategoryIcon(discussion.category) }}
          {{ getCategoryName(discussion.category) }}
        </span>
        <h3 class="discussion-title">{{ discussion.title }}</h3>
      </div>
    </div>

    <p class="discussion-excerpt">
      {{ truncateText(discussion.content, 150) }}
    </p>

    <div class="discussion-footer">
      <div class="discussion-meta">
        <UserAvatar :user="{ displayName: discussion.authorName }" size="xs" />
        <span class="author-name">{{ discussion.authorName }}</span>
        <span class="separator">•</span>
        <span class="date">{{ formatRelativeTime(discussion.createdAt) }}</span>
      </div>

      <div class="discussion-stats">
        <span class="stat-item">
          <span class="stat-icon">👁️</span>
          {{ discussion.views || 0 }}
        </span>
        <span class="stat-item">
          <span class="stat-icon">💬</span>
          {{ discussion.repliesCount || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCategoryName, getCategoryIcon } from '@/utils/categories'
import { formatRelativeTime, truncateText } from '@/utils/formatters'
import UserAvatar from '@/components/UserAvatar.vue'

defineProps({
  discussion: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])
</script>

<style scoped>
.discussion-card {
  background: white;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.discussion-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
}

.discussion-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.discussion-info {
  flex: 1;
}

.category-badge {
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.discussion-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  line-height: 1.4;
}

.discussion-excerpt {
  color: var(--text-secondary);
  margin: 1rem 0;
  line-height: 1.6;
}

.discussion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.discussion-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.author-name {
  font-weight: 500;
  color: var(--text-primary);
}

.separator {
  color: var(--text-muted);
}

.date {
  color: var(--text-muted);
}

.discussion-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.stat-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .discussion-card {
    padding: 1rem;
  }

  .discussion-title {
    font-size: 1.1rem;
  }

  .discussion-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
</style>