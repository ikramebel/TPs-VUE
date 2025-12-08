import { createRouter, createWebHistory } from "vue-router";
import LoginRegister from "../views/LoginRegister.vue";
import Events from "../views/Events.vue";

const routes = [
  { path: "/", name: "LoginRegister", component: LoginRegister },
  { path: "/events", name: "Events", component: Events }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
