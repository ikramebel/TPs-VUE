<template>
  <div class="create-discussion-view">
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- En-tête -->
          <div class="d-flex align-items-center mb-4">
            <button @click="goBack" class="btn btn-outline-secondary me-3">
              <i class="bi bi-arrow-left"></i>
            </button>
            <h2 class="mb-0">
              <i class="bi bi-plus-circle-fill me-2"></i>
              Nouvelle Discussion
            </h2>
          </div>

          <!-- Formulaire -->
          <div class="card">
            <div class="card-body p-4">
              <form @submit.prevent="handleSubmit">
                <!-- Catégorie -->
                <div class="mb-4">
                  <label class="form-label fw-bold">
                    <i class="bi bi-folder-fill me-2"></i>
                    Catégorie
                  </label>
                  <select 
                    v-model="form.category" 
                    class="form-select form-select-lg"
                    required
                  >
                    <option value="" disabled>Sélectionnez une catégorie</option>
                    <option 
                      v-for="cat in categories" 
                      :key="cat.id" 
                      :value="cat.id"
                    >
                      {{ cat.icon }} {{ cat.name }}
                    </option>
                  </select>
                  <div class="form-text">
                    Choisissez la catégorie la plus appropriée pour votre discussion
                  </div>
                </div>

                <!-- Titre -->
                <div class="mb-4">
                  <label class="form-label fw-bold">
                    <i class="bi bi-card-heading me-2"></i>
                    Titre
                  </label>
                  <input
                    v-model="form.title"
                    type="text"
                    class="form-control form-control-lg"
                    placeholder="Donnez un titre clair et descriptif à votre discussion"
                    required
                    minlength="5"
                    maxlength="200"
                  />
                  <div class="form-text">
                    {{ form.title.length }}/200 caractères (minimum 5)
                  </div>
                </div>

                <!-- Contenu -->
                <div class="mb-4">
                  <label class="form-label fw-bold">
                    <i class="bi bi-textarea-t me-2"></i>
                    Contenu
                  </label>
                  <textarea
                    v-model="form.content"
                    class="form-control"
                    rows="12"
                    placeholder="Décrivez votre sujet en détail. Plus votre description est claire, plus vous obtiendrez de réponses pertinentes."
                    required
                    minlength="10"
                  ></textarea>
                  <div class="form-text">
                    {{ form.content.length }} caractères (minimum 10)
                  </div>
                </div>

                <!-- Erreur -->
                <div v-if="error" class="alert alert-danger">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error }}
                </div>

                <!-- Succès -->
                <div v-if="success" class="alert alert-success">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  Discussion créée avec succès !
                </div>

                <!-- Boutons -->
                <div class="d-flex gap-3">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg flex-grow-1"
                    :disabled="loading || !isFormValid"
                  >
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-send-fill me-2"></i>
                    Publier la discussion
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary btn-lg"
                    @click="goBack"
                    :disabled="loading"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Conseils -->
          <div class="card mt-4 border-info">
            <div class="card-body">
              <h6 class="card-title">
                <i class="bi bi-lightbulb-fill text-info me-2"></i>
                Conseils pour une bonne discussion
              </h6>
              <ul class="mb-0 text-muted">
                <li>Choisissez un titre clair et descriptif</li>
                <li>Soyez précis et détaillé dans votre description</li>
                <li>Vérifiez que votre sujet n'a pas déjà été abordé</li>
                <li>Restez courtois et respectueux</li>
                <li>Utilisez la bonne catégorie pour faciliter les recherches</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useDiscussions } from '@/composables/useDiscussions';
import { categories } from '@/utils/categories';
import { validateDiscussionTitle, validateDiscussionContent } from '@/utils/validators';

const router = useRouter();
const { user } = useAuth();
const { createDiscussion } = useDiscussions();

const form = ref({
  category: '',
  title: '',
  content: ''
});

const loading = ref(false);
const error = ref('');
const success = ref(false);

const isFormValid = computed(() => {
  return form.value.category &&
         validateDiscussionTitle(form.value.title) &&
         validateDiscussionContent(form.value.content);
});

const handleSubmit = async () => {
  if (!isFormValid.value || !user.value) return;

  try {
    loading.value = true;
    error.value = '';
    success.value = false;

    const discussion = await createDiscussion(
      {
        title: form.value.title,
        content: form.value.content,
        category: form.value.category
      },
      user.value.id,
      user.value.name
    );

    success.value = true;

    // Rediriger vers la discussion créée après 1 seconde
    setTimeout(() => {
      router.push(`/discussion/${discussion.id}`);
    }, 1000);
  } catch (err) {
    error.value = 'Erreur lors de la création de la discussion. Veuillez réessayer.';
    console.error('Erreur:', err);
  } finally {
    loading.value = false;
  }
};

const goBack = () => {
  if (confirm('Êtes-vous sûr de vouloir quitter ? Vos modifications seront perdues.')) {
    router.back();
  }
};
</script>

<style scoped>
.create-discussion-view {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px);
}

.form-control:focus,
.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(99, 102, 241, 0.1);
}

.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

textarea.form-control {
  resize: vertical;
  min-height: 200px;
}
</style>