<template>
  <div :class="['user-avatar', `avatar-${size}`]" :title="user?.displayName">
    <img 
      v-if="user?.photoURL" 
      :src="user.photoURL" 
      :alt="user.displayName"
      class="avatar-img"
    />
    <div v-else class="avatar-placeholder">
      {{ getInitials(user?.displayName) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  }
})

const getInitials = (name) => {
  if (!name) return '?'
  
  const names = name.trim().split(' ')
  if (names.length >= 2) {
    return (names[0][0] + names[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
</script>

<style scoped>
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  flex-shrink: 0;
}

.avatar-xs {
  width: 24px;
  height: 24px;
  font-size: 0.65rem;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 0.75rem;
}

.avatar-md {
  width: 40px;
  height: 40px;
  font-size: 0.9rem;
}

.avatar-lg {
  width: 64px;
  height: 64px;
  font-size: 1.2rem;
}

.avatar-xl {
  width: 100px;
  height: 100px;
  font-size: 1.8rem;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  user-select: none;
}
</style>