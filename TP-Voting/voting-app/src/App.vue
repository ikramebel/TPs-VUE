<template>
  <div id="app">
    <Navbar v-if="showNavbar" />
    <RouterView />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import Navbar from './components/Navbar.vue'

const route = useRoute();
const showNavbar = computed(() => route.path !== "/");
</script>

<style scoped>
#app {
  font-family: 'Montserrat', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
