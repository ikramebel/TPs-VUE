import { ref } from 'vue';
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
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const useReplies = () => {
  const replies = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Récupérer les réponses d'une discussion
  const fetchReplies = async (discussionId) => {
    try {
      loading.value = true;
      error.value = null;

      const q = query(
        collection(db, 'replies'),
        where('discussionId', '==', discussionId)
      );

      const querySnapshot = await getDocs(q);
      let repliesList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now())
        };
      });

      // Trier par date côté client
      repliesList.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateA - dateB;
      });

      replies.value = repliesList;
      return replies.value;
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la récupération des réponses:', err);
      replies.value = [];
      return replies.value;
    } finally {
      loading.value = false;
    }
  };

  // Créer une nouvelle réponse
  const createReply = async (discussionId, content, userId, userName) => {
    try {
      loading.value = true;
      error.value = null;

      // Validation
      if (!discussionId || !content || !userId || !userName) {
        throw new Error('Données manquantes pour créer la réponse');
      }

      if (content.trim().length < 3) {
        throw new Error('La réponse doit contenir au moins 3 caractères');
      }

      const newReply = {
        discussionId,
        content: content.trim(),
        authorId: userId,
        authorName: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isEdited: false
      };

      // Créer la réponse
      const docRef = await addDoc(collection(db, 'replies'), newReply);

      // Incrémenter le compteur de réponses de la discussion
      try {
        const discussionRef = doc(db, 'discussions', discussionId);
        await updateDoc(discussionRef, {
          replyCount: increment(1),
          lastReplyAt: serverTimestamp()
        });
      } catch (updateErr) {
        console.warn('Impossible de mettre à jour le compteur de réponses:', updateErr);
        // On continue quand même, la réponse a été créée
      }

      const createdReply = {
        id: docRef.id,
        ...newReply,
        createdAt: new Date()
      };

      replies.value.push(createdReply);
      return createdReply;
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la création de la réponse:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Mettre à jour une réponse
  const updateReply = async (id, content) => {
    try {
      loading.value = true;
      error.value = null;

      if (!content || content.trim().length < 3) {
        throw new Error('Le contenu doit contenir au moins 3 caractères');
      }

      const docRef = doc(db, 'replies', id);
      await updateDoc(docRef, {
        content: content.trim(),
        updatedAt: serverTimestamp(),
        isEdited: true
      });

      // Mettre à jour localement
      const index = replies.value.findIndex(r => r.id === id);
      if (index !== -1) {
        replies.value[index] = {
          ...replies.value[index],
          content: content.trim(),
          isEdited: true
        };
      }
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la modification:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Supprimer une réponse
  const deleteReply = async (id, discussionId) => {
    try {
      loading.value = true;
      error.value = null;

      await deleteDoc(doc(db, 'replies', id));

      // Décrémenter le compteur de réponses de la discussion
      try {
        const discussionRef = doc(db, 'discussions', discussionId);
        await updateDoc(discussionRef, {
          replyCount: increment(-1)
        });
      } catch (updateErr) {
        console.warn('Impossible de mettre à jour le compteur:', updateErr);
      }

      // Supprimer localement
      replies.value = replies.value.filter(r => r.id !== id);
    } catch (err) {
      error.value = err.message;
      console.error('Erreur lors de la suppression:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    replies,
    loading,
    error,
    fetchReplies,
    createReply,
    updateReply,
    deleteReply
  };
};