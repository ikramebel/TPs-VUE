<template>
  <div id="app">
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<style>
:root {
  --bs-primary: #6366f1;
  --bs-primary-rgb: 99, 102, 241;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f9fafb;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>