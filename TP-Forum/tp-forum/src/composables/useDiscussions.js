import { ref, computed } from 'vue';
import { 
  collection, 
  addDoc, 
  updateDoc,
  deleteDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  getDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useDiscussions = () => {
  const discussions = ref([]);
  const currentDiscussion = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Récupérer toutes les discussions (avec tri côté client si nécessaire)
  const fetchDiscussions = async (filters = {}) => {
    try {
      loading.value = true;
      error.value = null;

      // STRATÉGIE : Récupérer toutes les discussions et filtrer/trier côté client
      // Cela évite les problèmes d'index Firestore
      let q;
      
      // Si on filtre par catégorie, utiliser une requête simple
      if (filters.category && filters.category !== 'all') {
        q = query(collection(db, 'discussions'), where('category', '==', filters.category));
      } else {
        // Sinon récupérer toutes les discussions
        q = query(collection(db, 'discussions'));
      }

      const querySnapshot = await getDocs(q);
      let discussionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt || Date.now())
      }));

      // Trier côté client selon le critère
      if (filters.sortBy === 'recent' || !filters.sortBy) {
        discussionsList.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB - dateA;
        });
      } else if (filters.sortBy === 'popular') {
        discussionsList.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
      } else if (filters.sortBy === 'views') {
        discussionsList.sort((a, b) => (b.views || 0) - (a.views || 0));
      }

      discussions.value = discussionsList;
      return discussions.value;
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la récupération des discussions:', err);
      
      // En cas d'erreur, retourner un tableau vide plutôt que de crasher
      discussions.value = [];
      return discussions.value;
    } finally {
      loading.value = false;
    }
  };

  // Récupérer une discussion par ID
  const fetchDiscussionById = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, 'discussions', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        currentDiscussion.value = {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
        };

        // Incrémenter les vues
        await updateDoc(docRef, {
          views: increment(1)
        });

        return currentDiscussion.value;
      } else {
        throw new Error('Discussion non trouvée');
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Créer une nouvelle discussion
  const createDiscussion = async (discussionData, userId, userName) => {
    try {
      loading.value = true;
      error.value = null;

      // Validation des données
      if (!discussionData.title || !discussionData.content || !discussionData.category) {
        throw new Error('Données manquantes pour créer la discussion');
      }

      if (!userId || !userName) {
        throw new Error('Utilisateur non authentifié');
      }

      const newDiscussion = {
        title: discussionData.title.trim(),
        content: discussionData.content.trim(),
        category: discussionData.category,
        authorId: userId,
        authorName: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replyCount: 0,
        views: 0,
        isPinned: false,
        isLocked: false
      };

      console.log('Envoi à Firestore:', newDiscussion);

      const docRef = await addDoc(collection(db, 'discussions'), newDiscussion);
      
      console.log('Discussion créée avec ID:', docRef.id);

      const created = {
        id: docRef.id,
        ...newDiscussion,
        createdAt: new Date()
      };

      // Ajouter la nouvelle discussion à la liste locale
      discussions.value.unshift(created);

      return created;
    } catch (err) {
      console.error('Erreur dans createDiscussion:', err);
      error.value = err.message;
      throw new Error(err.message || 'Erreur lors de la création de la discussion');
    } finally {
      loading.value = false;
    }
  };

  // Mettre à jour une discussion
  const updateDiscussion = async (id, updates) => {
    try {
      loading.value = true;
      error.value = null;

      const docRef = doc(db, 'discussions', id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      // Mettre à jour localement
      if (currentDiscussion.value?.id === id) {
        currentDiscussion.value = {
          ...currentDiscussion.value,
          ...updates
        };
      }

      const index = discussions.value.findIndex(d => d.id === id);
      if (index !== -1) {
        discussions.value[index] = {
          ...discussions.value[index],
          ...updates
        };
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Supprimer une discussion
  const deleteDiscussion = async (id) => {
    try {
      loading.value = true;
      error.value = null;

      await deleteDoc(doc(db, 'discussions', id));

      // Supprimer localement
      discussions.value = discussions.value.filter(d => d.id !== id);
      if (currentDiscussion.value?.id === id) {
        currentDiscussion.value = null;
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Rechercher des discussions
  const searchDiscussions = computed(() => {
    return (searchTerm) => {
      if (!searchTerm) return discussions.value;

      const term = searchTerm.toLowerCase();
      return discussions.value.filter(d => 
        d.title?.toLowerCase().includes(term) || 
        d.content?.toLowerCase().includes(term)
      );
    };
  });

  // Épingler/Désépingler une discussion
  const togglePin = async (id) => {
    const discussion = discussions.value.find(d => d.id === id);
    if (discussion) {
      await updateDiscussion(id, { isPinned: !discussion.isPinned });
    }
  };

  // Verrouiller/Déverrouiller une discussion
  const toggleLock = async (id) => {
    const discussion = discussions.value.find(d => d.id === id);
    if (discussion) {
      await updateDiscussion(id, { isLocked: !discussion.isLocked });
    }
  };

  return {
    discussions,
    currentDiscussion,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussionById,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    searchDiscussions,
    togglePin,
    toggleLock
  };
};