import { createRouter, createWebHistory } from "vue-router";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";
import Profile from "@/views/Profile.vue";
import PetRegister from "@/views/PetRegister.vue";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/signup", component: Signup },
    { path: "/login", component: Login },
    { path: "/profile", component: Profile },
    { path: "/pet-register", component: PetRegister },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
