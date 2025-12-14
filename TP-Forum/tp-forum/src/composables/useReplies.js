import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  increment,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useReplies = () => {
  const replies = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Créer une réponse
  const createReply = async (replyData) => {
    loading.value = true
    error.value = null

    try {
      // Ajouter la réponse
      const docRef = await addDoc(collection(db, 'replies'), {
        discussionId: replyData.discussionId,
        content: replyData.content,
        authorId: replyData.authorId,
        authorName: replyData.authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      // Incrémenter le compteur de réponses de la discussion
      const discussionRef = doc(db, 'discussions', replyData.discussionId)
      await updateDoc(discussionRef, {
        repliesCount: increment(1),
        updatedAt: serverTimestamp()
      })

      return docRef.id
    } catch (err) {
      console.error('Erreur création réponse:', err)
      error.value = 'Erreur lors de la création de la réponse'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les réponses d'une discussion
  const fetchReplies = async (discussionId) => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'replies'),
        where('discussionId', '==', discussionId),
        orderBy('createdAt', 'asc')
      )

      const querySnapshot = await getDocs(q)
      replies.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return replies.value
    } catch (err) {
      console.error('Erreur fetch replies:', err)
      error.value = 'Erreur lors du chargement des réponses'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les réponses d'un utilisateur
  const fetchUserReplies = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'replies'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      replies.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return replies.value
    } catch (err) {
      console.error('Erreur fetch user replies:', err)
      error.value = 'Erreur lors du chargement des réponses'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Modifier une réponse
  const updateReply = async (id, updatedData) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'replies', id)
      await updateDoc(docRef, {
        content: updatedData.content,
        updatedAt: serverTimestamp()
      })
      
      // Mettre à jour l'état local
      const index = replies.value.findIndex(r => r.id === id)
      if (index !== -1) {
        replies.value[index] = {
          ...replies.value[index],
          ...updatedData
        }
      }
    } catch (err) {
      console.error('Erreur update reply:', err)
      error.value = 'Erreur lors de la modification de la réponse'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer une réponse
  const deleteReply = async (id, discussionId) => {
    loading.value = true
    error.value = null

    try {
      // Supprimer la réponse
      await deleteDoc(doc(db, 'replies', id))

      // Décrémenter le compteur de réponses
      const discussionRef = doc(db, 'discussions', discussionId)
      await updateDoc(discussionRef, {
        repliesCount: increment(-1)
      })
      
      // Mettre à jour l'état local
      replies.value = replies.value.filter(r => r.id !== id)
    } catch (err) {
      console.error('Erreur delete reply:', err)
      error.value = 'Erreur lors de la suppression de la réponse'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    replies,
    loading,
    error,
    createReply,
    fetchReplies,
    fetchUserReplies,
    updateReply,
    deleteReply
  }
}