import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { useAuth } from './composables/useAuth';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import Bootstrap Bundle JS (inclut Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Import CSS personnalisé
import './assets/styles/main.css';

const app = createApp(App);

// Initialiser l'authentification avant de monter l'app
const { initAuth } = useAuth();
initAuth();

app.use(router);
app.mount('#app');