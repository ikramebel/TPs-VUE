import { ref } from 'vue'
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useUsers = () => {
  const userData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Récupérer les données d'un utilisateur
  const fetchUser = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (userDoc.exists()) {
        userData.value = {
          id: userDoc.id,
          ...userDoc.data()
        }
        return userData.value
      } else {
        throw new Error('Utilisateur non trouvé')
      }
    } catch (err) {
      console.error('Erreur fetch user:', err)
      error.value = 'Utilisateur non trouvé'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer plusieurs utilisateurs
  const fetchUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const querySnapshot = await getDocs(collection(db, 'users'))
      const users = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return users
    } catch (err) {
      console.error('Erreur fetch users:', err)
      error.value = 'Erreur lors du chargement des utilisateurs'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les modérateurs
  const fetchModerators = async () => {
    loading.value = true
    error.value = null

    try {
      const q = query(
        collection(db, 'users'),
        where('role', '==', 'moderator')
      )
      
      const querySnapshot = await getDocs(q)
      const moderators = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      return moderators
    } catch (err) {
      console.error('Erreur fetch moderators:', err)
      error.value = 'Erreur lors du chargement des modérateurs'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    userData,
    loading,
    error,
    fetchUser,
    fetchUsers,
    fetchModerators
  }
}