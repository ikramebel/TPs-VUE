<template>
  <div class="loading-spinner">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Chargement...</span>
    </div>
    <p v-if="message" class="mt-3 text-muted">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>