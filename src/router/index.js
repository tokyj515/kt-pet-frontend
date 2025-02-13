import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Profile from "@/views/Profile.vue";
import PetRegister from "@/views/PetRegister.vue";
import PetList from "@/views/PetList.vue";

const routes = [
    { path: "/", component: Main }, // ✅ 메인 페이지
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/profile", component: Profile },
    { path: "/pet-register", component: PetRegister },
    { path: "/pet-list", component: PetList },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
