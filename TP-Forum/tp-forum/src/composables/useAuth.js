import { ref, computed } from 'vue';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/firebase/config';

const user = ref(null);
const loading = ref(true);
const error = ref(null);

export const useAuth = () => {
  // État d'authentification
  const isAuthenticated = computed(() => !!user.value);
  const isModerator = computed(() => user.value?.role === 'moderator');

  // Initialiser l'observateur d'authentification
  const initAuth = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Récupérer les données utilisateur depuis Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          user.value = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            ...userDoc.data()
          };
        } else {
          user.value = {
            id: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'user',
            createdAt: new Date()
          };
        }
      } else {
        user.value = null;
      }
      loading.value = false;
    });
  };

  // Inscription
  const register = async (email, password, name) => {
    try {
      error.value = null;
      
      // Créer le compte Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Mettre à jour le profil
      await updateProfile(userCredential.user, { displayName: name });
      
      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name,
        email,
        role: 'user',
        bio: '',
        avatar: '',
        createdAt: new Date(),
        discussionCount: 0,
        replyCount: 0
      });

      return userCredential.user;
    } catch (err) {
      // Gestion des erreurs Firebase
      let errorMessage = 'Erreur lors de l\'inscription';
      
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'L\'adresse email n\'est pas valide.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'L\'inscription par email/mot de passe n\'est pas activée.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Le mot de passe est trop faible. Utilisez au moins 6 caractères.';
          break;
        default:
          errorMessage = err.message;
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    }
  };

  // Connexion
  const login = async (email, password) => {
    try {
      error.value = null;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      // Gestion des erreurs Firebase
      let errorMessage = 'Erreur lors de la connexion';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'L\'adresse email n\'est pas valide.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Ce compte a été désactivé.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte ne correspond à cet email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Mot de passe incorrect.';
          break;
        case 'auth/invalid-credential':
          errorMessage = 'Email ou mot de passe incorrect.';
          break;
        default:
          errorMessage = err.message;
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    }
  };

  // Déconnexion
  const logout = async () => {
    try {
      error.value = null;
      await signOut(auth);
      user.value = null;
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  // Réinitialiser le mot de passe
  const resetPassword = async (email) => {
    try {
      error.value = null;
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      let errorMessage = 'Erreur lors de la réinitialisation';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = 'L\'adresse email n\'est pas valide.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte ne correspond à cet email.';
          break;
        default:
          errorMessage = err.message;
      }
      
      error.value = errorMessage;
      throw new Error(errorMessage);
    }
  };

  // Mettre à jour le profil
  const updateUserProfile = async (updates) => {
    try {
      error.value = null;
      if (!user.value) throw new Error('Utilisateur non connecté');

      await updateDoc(doc(db, 'users', user.value.id), updates);
      
      if (updates.name) {
        await updateProfile(auth.currentUser, { displayName: updates.name });
      }

      user.value = { ...user.value, ...updates };
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isModerator,
    initAuth,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };
};