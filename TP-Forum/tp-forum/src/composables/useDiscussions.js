import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy, 
  where,
  limit,
  increment,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useDiscussions = () => {
  const discussions = ref([])
  const currentDiscussion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Créer une discussion
  const createDiscussion = async (discussionData) => {
    loading.value = true
    error.value = null

    try {
      const docRef = await addDoc(collection(db, 'discussions'), {
        title: discussionData.title,
        content: discussionData.content,
        category: discussionData.category,
        authorId: discussionData.authorId,
        authorName: discussionData.authorName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        views: 0,
        repliesCount: 0
      })
      
      return docRef.id
    } catch (err) {
      console.error('Erreur création discussion:', err)
      error.value = 'Erreur lors de la création de la discussion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer toutes les discussions
  const fetchDiscussions = async (categoryFilter = null, limitCount = 50) => {
    loading.value = true
    error.value = null

    try {
      let q
      
      if (categoryFilter) {
        q = query(
          collection(db, 'discussions'),
          where('category', '==', categoryFilter),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
      } else {
        q = query(
          collection(db, 'discussions'),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )
      }

      const querySnapshot = await getDocs(q)
      discussions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return discussions.value
    } catch (err) {
      console.error('Erreur fetch discussions:', err)
      error.value = 'Erreur lors du chargement des discussions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer une discussion par ID
  const fetchDiscussionById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'discussions', id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // Incrémenter le compteur de vues
        await updateDoc(docRef, {
          views: increment(1)
        })

        currentDiscussion.value = {
          id: docSnap.id,
          ...docSnap.data()
        }
        
        return currentDiscussion.value
      } else {
        throw new Error('Discussion non trouvée')
      }
    } catch (err) {
      console.error('Erreur fetch discussion:', err)
      error.value = 'Discussion non trouvée'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les discussions d'un utilisateur
  const fetchUserDiscussions = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'discussions'),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      )

      const querySnapshot = await getDocs(q)
      discussions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return discussions.value
    } catch (err) {
      console.error('Erreur fetch user discussions:', err)
      error.value = 'Erreur lors du chargement des discussions'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les discussions populaires
  const fetchPopularDiscussions = async (limitCount = 10) => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'discussions'),
        orderBy('views', 'desc'),
        limit(limitCount)
      )

      const querySnapshot = await getDocs(q)
      discussions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return discussions.value
    } catch (err) {
      console.error('Erreur fetch popular discussions:', err)
      error.value = 'Erreur lors du chargement des discussions populaires'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Modifier une discussion
  const updateDiscussion = async (id, updatedData) => {
    loading.value = true
    error.value = null

    try {
      const docRef = doc(db, 'discussions', id)
      await updateDoc(docRef, {
        ...updatedData,
        updatedAt: serverTimestamp()
      })
      
      // Mettre à jour l'état local
      if (currentDiscussion.value && currentDiscussion.value.id === id) {
        currentDiscussion.value = {
          ...currentDiscussion.value,
          ...updatedData
        }
      }
    } catch (err) {
      console.error('Erreur update discussion:', err)
      error.value = 'Erreur lors de la modification de la discussion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Supprimer une discussion
  const deleteDiscussion = async (id) => {
    loading.value = true
    error.value = null

    try {
      // Supprimer la discussion
      await deleteDoc(doc(db, 'discussions', id))
      
      // Supprimer toutes les réponses associées
      const repliesQuery = query(
        collection(db, 'replies'),
        where('discussionId', '==', id)
      )
      const repliesSnapshot = await getDocs(repliesQuery)
      
      const deletePromises = repliesSnapshot.docs.map(replyDoc => 
        deleteDoc(doc(db, 'replies', replyDoc.id))
      )
      await Promise.all(deletePromises)
      
      // Mettre à jour l'état local
      discussions.value = discussions.value.filter(d => d.id !== id)
      if (currentDiscussion.value?.id === id) {
        currentDiscussion.value = null
      }
    } catch (err) {
      console.error('Erreur delete discussion:', err)
      error.value = 'Erreur lors de la suppression de la discussion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Rechercher des discussions
  const searchDiscussions = async (searchTerm) => {
    loading.value = true
    error.value = null

    try {
      // Note: Firestore ne supporte pas la recherche full-text nativement
      // Cette implémentation récupère toutes les discussions et filtre côté client
      const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const allDiscussions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      const searchTermLower = searchTerm.toLowerCase()
      discussions.value = allDiscussions.filter(discussion => 
        discussion.title.toLowerCase().includes(searchTermLower) ||
        discussion.content.toLowerCase().includes(searchTermLower)
      )
      
      return discussions.value
    } catch (err) {
      console.error('Erreur search discussions:', err)
      error.value = 'Erreur lors de la recherche'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    discussions,
    currentDiscussion,
    loading,
    error,
    createDiscussion,
    fetchDiscussions,
    fetchDiscussionById,
    fetchUserDiscussions,
    fetchPopularDiscussions,
    updateDiscussion,
    deleteDiscussion,
    searchDiscussions
  }
}