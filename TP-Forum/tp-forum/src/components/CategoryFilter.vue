<template>
  <div class="category-filter">
    <h5 class="mb-3 fw-bold">Catégories</h5>
    <div class="row g-3">
      <div
        v-for="cat in categories"
        :key="cat.id"
        class="col-6 col-md-4 col-lg-6"
      >
        <div
          class="category-card"
          :class="{ active: modelValue === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <div class="category-icon">{{ cat.icon }}</div>
          <div class="category-name">{{ cat.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { categories } from '@/utils/categories';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'all'
  }
});

const emit = defineEmits(['update:modelValue']);

const selectCategory = (categoryId) => {
  emit('update:modelValue', categoryId);
};
</script>

<style scoped>
.category-filter {
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.category-card {
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.category-card:hover {
  border-color: var(--bs-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.category-card.active {
  border-color: var(--bs-primary);
  background-color: var(--bs-primary);
  color: white;
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.category-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.category-card.active .category-name {
  color: white;
}
</style>