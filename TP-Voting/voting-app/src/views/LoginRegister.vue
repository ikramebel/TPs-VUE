<template>
  <div class="container" :class="{ active: isSignUp }">

    <div class="form-container sign-in">
      <form @submit.prevent="login">
        <h2>Connexion</h2>

        <input type="email" v-model="email" placeholder="Email universitaire" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />

        <button type="submit">Se connecter</button>

        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>

    <div class="form-container sign-up">
      <form @submit.prevent="register">
        <h2>Créer un compte</h2>

        <input type="email" v-model="email" placeholder="Email universitaire" required />
        <input type="password" v-model="password" placeholder="Mot de passe" required />

        <button type="submit">S'inscrire</button>

        <p class="error" v-if="error">{{ error }}</p>
      </form>
    </div>

    <div class="toggle-container">
      <div class="toggle">

        <div class="toggle-panel toggle-right">
          <h3>Nouvel utilisateur ?</h3>
          <p>Inscrivez-vous pour voter pour les événements.</p>
          <button @click="toggleForm">S'inscrire</button>
        </div>

        <div class="toggle-panel toggle-left">
          <h3>Déjà un compte ?</h3>
          <p>Connectez-vous pour accéder aux événements.</p>
          <button @click="toggleForm">Se connecter</button>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
      isSignUp: false
    };
  },

  methods: {
    toggleForm() {
      this.error = "";
      this.isSignUp = !this.isSignUp;
    },

    isUcaEmail(email) {
      return email.endsWith("@uca.ac.ma");
    },

    async register() {
      try {
        if (!this.isUcaEmail(this.email)) {
          this.error = "Vous devez utiliser un email universitaire (@uca.ac.ma)";
          return;
        }

        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/events");

      } catch (err) {
        this.error = err.message;
      }
    },

    async login() {
      try {
        if (!this.isUcaEmail(this.email)) {
          this.error = "Email non autorisé. Utilisez votre email universitaire (@uca.ac.ma)";
          return;
        }

        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/events");

      } catch (err) {
        this.error = err.message;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:'Montserrat',sans-serif;
}

body{
  background-color:#c9d6ff;
  background:linear-gradient(to right,#e2e2e2,#c9d6ff);
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  height:100vh;
}

.container{
  background-color:#fff;
  border-radius:30px;
  box-shadow:0 5px 15px rgba(0,0,0,0.35);
  position:relative;
  overflow:hidden;
  width:768px;
  max-width:100%;
  min-height:480px;
}

.container p{
  font-size:14px;
  line-height:20px;
  letter-spacing:0.3px;
  margin:20px 0;
}

.container button{
  background-color:#2da0a8;
  color:#fff;
  font-size:12px;
  padding:10px 45px;
  border:1px solid transparent;
  border-radius:8px;
  font-weight:600;
  letter-spacing:0.5px;
  text-transform:uppercase;
  margin-top:10px;
  cursor:pointer;
}

.container form{
  background-color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  padding:0 40px;
  height:100%;
}

.container input{
  background-color:#eee;
  border:none;
  margin:8px 0;
  padding:10px 15px;
  font-size:13px;
  border-radius:8px;
  width:100%;
  outline:none;
}

.form-container{
  position:absolute;
  top:0;
  height:100%;
  transition: all 0.6s ease-in-out;
}

.sign-in{
  left:0;
  width:50%;
  z-index:2;
}

.container.active .sign-in{
  transform: translateX(100%);
}

.sign-up{
  left:0;
  width:50%;
  opacity:0;
  z-index:1;
}

.container.active .sign-up{
  transform: translateX(100%);
  opacity:1;
  z-index:5;
  animation: move 0.6s;
}

@keyframes move{
  0%,49.99%{ opacity:0; z-index:1; }
  50%,100%{ opacity:1; z-index:5; }
}

.toggle-container{
  position:absolute;
  top:0;
  left:50%;
  width:50%;
  height:100%;
  overflow:hidden;
  transition: all 0.6s ease-in-out;
  border-radius:150px 0 0 100px;
  z-index:1000;
}

.container.active .toggle-container{
  transform: translateX(-100%);
  border-radius:0 150px 100px 0;
}

.toggle{
  background-color:#2da0a8;
  background:linear-gradient(to right,#5c6bc0,#2da0a8);
  color:#fff;
  position:relative;
  left:-100%;
  height:100%;
  width:200%;
  transform:translateX(0);
  transition: all 0.6s ease-in-out;
}

.container.active .toggle{
  transform:translateX(50%);
}

.toggle-panel{
  position:absolute;
  width:50%;
  height:100%;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
  padding:0 30px;
  text-align:center;
  top:0;
  transform:translateX(0);
  transition: all 0.6s ease-in-out;
}

.toggle-left{
  transform:translateX(-200%);
}

.container.active .toggle-left{
  transform:translateX(0);
}

.toggle-right{
  right:0;
}

.container.active .toggle-right{
  transform:translateX(200%);
}

.error{
  color:red;
  margin-top:10px;
  font-size:14px;
}
</style>
