import { ref, computed } from 'vue'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

const user = ref(null)
const error = ref(null)
const loading = ref(false)

export const useAuth = () => {
  
  const isAuthenticated = computed(() => !!user.value)
  const isModerator = computed(() => user.value?.role === 'moderator')

  // Inscription
  const signup = async (email, password, displayName) => {
    error.value = null
    loading.value = true
    
    try {
      // Créer l'utilisateur dans Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid
      
      // Mettre à jour le profil
      await updateProfile(userCredential.user, {
        displayName: displayName
      })
      
      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', userId), {
        uid: userId,
        email: email,
        displayName: displayName,
        photoURL: '',
        bio: '',
        role: 'user',
        createdAt: new Date(),
        discussionsCount: 0,
        repliesCount: 0
      })
      
      return userCredential.user
    } catch (err) {
      console.error('Erreur inscription:', err)
      
      // Messages d'erreur en français
      switch (err.code) {
        case 'auth/email-already-in-use':
          error.value = 'Cette adresse email est déjà utilisée'
          break
        case 'auth/invalid-email':
          error.value = 'Adresse email invalide'
          break
        case 'auth/weak-password':
          error.value = 'Le mot de passe doit contenir au moins 6 caractères'
          break
        default:
          error.value = 'Une erreur est survenue lors de l\'inscription'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  // Connexion
  const login = async (email, password) => {
    error.value = null
    loading.value = true
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (err) {
      console.error('Erreur connexion:', err)
      
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          error.value = 'Email ou mot de passe incorrect'
          break
        case 'auth/too-many-requests':
          error.value = 'Trop de tentatives. Réessayez plus tard'
          break
        default:
          error.value = 'Une erreur est survenue lors de la connexion'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  // Déconnexion
  const logout = async () => {
    error.value = null
    loading.value = true
    
    try {
      await signOut(auth)
      user.value = null
    } catch (err) {
      console.error('Erreur déconnexion:', err)
      error.value = 'Erreur lors de la déconnexion'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Réinitialisation du mot de passe
  const resetPassword = async (email) => {
    error.value = null
    loading.value = true
    
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      console.error('Erreur reset password:', err)
      
      switch (err.code) {
        case 'auth/user-not-found':
          error.value = 'Aucun compte associé à cette adresse email'
          break
        case 'auth/invalid-email':
          error.value = 'Adresse email invalide'
          break
        default:
          error.value = 'Erreur lors de l\'envoi de l\'email'
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }

  // Mettre à jour le profil utilisateur
  const updateUserProfile = async (userId, data) => {
    error.value = null
    loading.value = true
    
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      })
      
      // Mettre à jour l'état local
      if (user.value && user.value.uid === userId) {
        user.value = {
          ...user.value,
          ...data
        }
      }
    } catch (err) {
      console.error('Erreur update profile:', err)
      error.value = 'Erreur lors de la mise à jour du profil'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Récupérer les données utilisateur depuis Firestore
  const getUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        return userDoc.data()
      }
      return null
    } catch (err) {
      console.error('Erreur get user data:', err)
      return null
    }
  }

  // Initialiser l'authentification (observer l'état)
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer les données complètes depuis Firestore
        const userData = await getUserData(firebaseUser.uid)
        
        user.value = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          ...userData
        }
      } else {
        user.value = null
      }
      
      loading.value = false
    })
  }

  return {
    user,
    error,
    loading,
    isAuthenticated,
    isModerator,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    getUserData,
    initAuth
  }
}