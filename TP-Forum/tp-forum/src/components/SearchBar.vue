<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <span class="search-icon">🔍</span>
      <input 
        v-model="searchQuery"
        type="text" 
        class="search-input"
        placeholder="Rechercher des discussions..."
        @input="handleInput"
        @keyup.enter="handleSearch"
      />
      <button 
        v-if="searchQuery"
        class="clear-btn"
        @click="clearSearch"
        title="Effacer"
      >
        ✕
      </button>
    </div>
    <button class="search-btn" @click="handleSearch">
      Rechercher
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search'])

const searchQuery = ref('')

const handleInput = () => {
  // Recherche en temps réel (optionnel)
  if (searchQuery.value.length > 2 || searchQuery.value.length === 0) {
    emit('search', searchQuery.value)
  }
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '')
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  font-size: 1.2rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 3rem;
  border: 2px solid white;
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: var(--transition);
  background: rgba(255, 255, 255, 0.95);
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.2rem;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: var(--transition);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--text-primary);
}

.search-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: var(--primary-color);
  border: 2px solid white;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.search-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
</style>