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

  // Récupérer toutes les discussions
  const fetchDiscussions = async (filters = {}) => {
    try {
      loading.value = true;
      error.value = null;

      let q = collection(db, 'discussions');
      
      // Si on filtre par catégorie ET tri, on doit créer une requête composée
      if (filters.category && filters.category !== 'all') {
        if (filters.sortBy === 'recent') {
          q = query(q, where('category', '==', filters.category), orderBy('createdAt', 'desc'));
        } else if (filters.sortBy === 'popular') {
          q = query(q, where('category', '==', filters.category), orderBy('replyCount', 'desc'));
        } else if (filters.sortBy === 'views') {
          q = query(q, where('category', '==', filters.category), orderBy('views', 'desc'));
        } else {
          q = query(q, where('category', '==', filters.category));
        }
      } else {
        // Sans filtre de catégorie, on peut trier directement
        if (filters.sortBy === 'recent') {
          q = query(q, orderBy('createdAt', 'desc'));
        } else if (filters.sortBy === 'popular') {
          q = query(q, orderBy('replyCount', 'desc'));
        } else if (filters.sortBy === 'views') {
          q = query(q, orderBy('views', 'desc'));
        }
      }

      const querySnapshot = await getDocs(q);
      discussions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }));

      return discussions.value;
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la récupération des discussions:', err);
      
      // Si l'erreur est liée aux index, récupérer sans filtre et trier côté client
      if (err.message.includes('index')) {
        console.warn('Index manquant, tri côté client...');
        const simpleQuery = filters.category && filters.category !== 'all' 
          ? query(collection(db, 'discussions'), where('category', '==', filters.category))
          : query(collection(db, 'discussions'));
        
        const querySnapshot = await getDocs(simpleQuery);
        discussions.value = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
        }));
        
        // Trier côté client
        if (filters.sortBy === 'recent') {
          discussions.value.sort((a, b) => b.createdAt - a.createdAt);
        } else if (filters.sortBy === 'popular') {
          discussions.value.sort((a, b) => (b.replyCount || 0) - (a.replyCount || 0));
        } else if (filters.sortBy === 'views') {
          discussions.value.sort((a, b) => (b.views || 0) - (a.views || 0));
        }
        
        return discussions.value;
      }
      
      throw err;
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
        currentDiscussion.value = {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate ? docSnap.data().createdAt.toDate() : new Date()
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

      const newDiscussion = {
        ...discussionData,
        authorId: userId,
        authorName: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        replyCount: 0,
        views: 0,
        isPinned: false,
        isLocked: false
      };

      const docRef = await addDoc(collection(db, 'discussions'), newDiscussion);
      
      return {
        id: docRef.id,
        ...newDiscussion,
        createdAt: new Date()
      };
    } catch (err) {
      error.value = err.message;
      throw err;
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
        d.title.toLowerCase().includes(term) || 
        d.content.toLowerCase().includes(term)
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