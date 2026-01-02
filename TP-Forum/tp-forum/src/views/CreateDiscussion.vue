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
                    <option value="">Sélectionnez une catégorie</option>
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
                <div v-if="error" class="alert alert-danger alert-dismissible fade show">
                  <i class="bi bi-exclamation-triangle-fill me-2"></i>
                  {{ error }}
                  <button type="button" class="btn-close" @click="error = ''"></button>
                </div>

                <!-- Succès -->
                <div v-if="success" class="alert alert-success">
                  <i class="bi bi-check-circle-fill me-2"></i>
                  Discussion créée avec succès ! Redirection...
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
                    @click.prevent="handleCancel"
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
         form.value.title.trim().length >= 5 &&
         form.value.content.trim().length >= 10;
});

const handleSubmit = async () => {
  console.log('=== DÉBUT handleSubmit ===');
  console.log('User:', user.value);
  console.log('Form:', form.value);

  // Validation
  if (!user.value) {
    error.value = 'Vous devez être connecté pour créer une discussion';
    console.error('Pas d\'utilisateur connecté');
    return;
  }

  if (!form.value.category) {
    error.value = 'Veuillez sélectionner une catégorie';
    console.error('Pas de catégorie sélectionnée');
    return;
  }

  if (form.value.title.trim().length < 5) {
    error.value = 'Le titre doit contenir au moins 5 caractères';
    console.error('Titre trop court:', form.value.title.length);
    return;
  }

  if (form.value.content.trim().length < 10) {
    error.value = 'Le contenu doit contenir au moins 10 caractères';
    console.error('Contenu trop court:', form.value.content.length);
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    success.value = false;

    console.log('✅ Validation OK - Création de la discussion...');
    console.log('Données à envoyer:', {
      title: form.value.title.trim(),
      content: form.value.content.trim(),
      category: form.value.category,
      userId: user.value.id,
      userName: user.value.name
    });

    const discussion = await createDiscussion(
      {
        title: form.value.title.trim(),
        content: form.value.content.trim(),
        category: form.value.category
      },
      user.value.id,
      user.value.name
    );

    console.log('✅ Discussion créée avec succès:', discussion);
    success.value = true;

    // Rediriger vers la discussion créée après 1 seconde
    setTimeout(() => {
      if (discussion && discussion.id) {
        console.log('Redirection vers:', `/discussion/${discussion.id}`);
        router.push(`/discussion/${discussion.id}`);
      } else {
        console.log('Redirection vers accueil (pas d\'ID)');
        router.push('/');
      }
    }, 1000);
  } catch (err) {
    console.error('❌ ERREUR lors de la création:', err);
    console.error('Code erreur:', err.code);
    console.error('Message:', err.message);
    
    // Messages d'erreur plus précis
    if (err.code === 'permission-denied') {
      error.value = 'Permission refusée. Vérifiez les règles Firestore.';
    } else if (err.code === 'unauthenticated') {
      error.value = 'Vous devez être connecté pour créer une discussion.';
    } else {
      error.value = err.message || 'Erreur lors de la création de la discussion. Veuillez réessayer.';
    }
  } finally {
    loading.value = false;
    console.log('=== FIN handleSubmit ===');
  }
};

const handleCancel = () => {
  const hasContent = form.value.title.trim() || form.value.content.trim();
  
  if (hasContent) {
    if (window.confirm('Êtes-vous sûr de vouloir quitter ? Vos modifications seront perdues.')) {
      router.push('/');
    }
  } else {
    router.push('/');
  }
};

const goBack = () => {
  handleCancel();
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