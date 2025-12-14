<template>
  <div class="category-filter">
    <button 
      :class="['category-btn', { active: !selected }]"
      @click="$emit('select', '')"
    >
      <span class="category-icon">📋</span>
      <span class="category-name">Toutes</span>
    </button>

    <button 
      v-for="category in categories" 
      :key="category.id"
      :class="['category-btn', { active: selected === category.id }]"
      @click="$emit('select', category.id)"
    >
      <span class="category-icon">{{ category.icon }}</span>
      <span class="category-name">{{ category.name }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    required: true
  },
  selected: {
    type: String,
    default: ''
  }
})

defineEmits(['select'])
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition);
  text-align: left;
  width: 100%;
}

.category-btn:hover {
  background-color: var(--bg-hover);
  border-color: var(--primary-color);
  transform: translateX(5px);
}

.category-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  border-color: var(--primary-color);
  font-weight: 600;
}

.category-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.category-name {
  flex: 1;
  font-size: 0.95rem;
}

.category-btn.active .category-name {
  font-weight: 600;
}
</style>