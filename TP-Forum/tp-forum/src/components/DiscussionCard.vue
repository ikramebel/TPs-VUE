<template>
  <div class="discussion-card" @click="goToDiscussion">
    <div class="d-flex align-items-start">
      <!-- Avatar -->
      <div class="avatar me-3" :style="{ backgroundColor: authorColor }">
        {{ authorInitials }}
      </div>

      <!-- Contenu -->
      <div class="flex-grow-1">
        <div class="d-flex align-items-center mb-2">
          <span class="category-badge me-2">
            {{ categoryIcon }}
          </span>
          <h5 class="discussion-title mb-0">
            <i v-if="discussion.isPinned" class="bi bi-pin-angle-fill text-warning me-1"></i>
            {{ discussion.title }}
            <i v-if="discussion.isLocked" class="bi bi-lock-fill text-muted ms-1"></i>
          </h5>
        </div>

        <p class="discussion-excerpt text-muted mb-2">
          {{ truncatedContent }}
        </p>

        <div class="discussion-meta d-flex align-items-center flex-wrap gap-3">
          <span class="meta-item">
            <i class="bi bi-person-fill"></i>
            {{ discussion.authorName }}
          </span>
          <span class="meta-item">
            <i class="bi bi-clock-fill"></i>
            {{ formattedDate }}
          </span>
          <span class="meta-item">
            <i class="bi bi-chat-fill"></i>
            {{ discussion.replyCount || 0 }} réponses
          </span>
          <span class="meta-item">
            <i class="bi bi-eye-fill"></i>
            {{ discussion.views || 0 }} vues
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate, truncateText, getInitials, stringToColor } from '@/utils/formatters';
import { getCategoryIcon } from '@/utils/categories';

const props = defineProps({
  discussion: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const authorInitials = computed(() => getInitials(props.discussion.authorName));
const authorColor = computed(() => stringToColor(props.discussion.authorName));
const categoryIcon = computed(() => getCategoryIcon(props.discussion.category));
const formattedDate = computed(() => formatDate(props.discussion.createdAt));
const truncatedContent = computed(() => truncateText(props.discussion.content, 120));

const goToDiscussion = () => {
  router.push(`/discussion/${props.discussion.id}`);
};
</script>

<style scoped>
.discussion-card {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 1rem;
}

.discussion-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
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

.category-badge {
  font-size: 1.5rem;
  line-height: 1;
}

.discussion-title {
  color: #1f2937;
  font-weight: 600;
  font-size: 1.125rem;
  transition: color 0.2s;
}

.discussion-card:hover .discussion-title {
  color: var(--bs-primary);
}

.discussion-excerpt {
  font-size: 0.938rem;
  line-height: 1.5;
}

.discussion-meta {
  font-size: 0.813rem;
  color: #6b7280;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.meta-item i {
  font-size: 0.875rem;
}
</style>