import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'

// Styles personnalisés
import './assets/styles/main.css'

// Créer l'application
const app = createApp(App)

// Utiliser le router
app.use(router)

// Monter l'application
app.mount('#app')

// Initialiser Firebase Auth après le montage
import { useAuth } from './composables/useAuth'
const { initAuth } = useAuth()
initAuth()