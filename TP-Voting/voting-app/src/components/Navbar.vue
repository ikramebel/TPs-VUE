<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/events" v-if="user">Événements</router-link>
    </div>

    <div class="nav-right">
      <template v-if="!user">
        <router-link to="/">Se connecter / S'inscrire</router-link>
      </template>

      <template v-else>
        <div class="profile-dropdown">
          <span class="profile-icon" @click="toggleDropdown">👤</span>
          <div v-if="dropdown" class="dropdown-content">
            <p>{{ user.email }}</p>
            <button @click="logout">Déconnexion</button>
          </div>
        </div>
      </template>
    </div>
  </nav>
</template>

<script>
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default {
  name: "AppNavbar",
  data() {
    return { user: null, dropdown: false };
  },
  mounted() {
    onAuthStateChanged(auth, (currentUser) => { this.user = currentUser; });
  },
  methods: {
    logout() {
      signOut(auth).then(() => { this.user = null; this.$router.push("/"); });
    },
    toggleDropdown() { this.dropdown = !this.dropdown; }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 25px;
  background: linear-gradient(to right, #5c6bc0, #2da0a8);
  color: white;
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.nav-left a,
.nav-right a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  transition: background 0.3s;
}

.nav-left a:hover,
.nav-right a:hover {
  background-color: rgba(255,255,255,0.2);
}

.nav-right {
  display: flex;
  align-items: center;
}

.profile-dropdown { position: relative; cursor: pointer; }
.profile-icon { font-size: 22px; }
.dropdown-content {
  position: absolute; right: 0; top: 35px;
  background: white; color: black;
  padding: 10px; border-radius: 10px;
  min-width: 180px;
  display: flex; flex-direction: column;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.dropdown-content p { margin: 0; font-weight: 500; word-break: break-all; }
.dropdown-content button {
  margin-top: 8px; padding: 6px 12px;
  border: none; background: linear-gradient(to right, #5c6bc0, #2da0a8);
  color: white; border-radius: 6px; cursor: pointer; font-weight: 500;
}
.dropdown-content button:hover { opacity: 0.9; }
</style>
