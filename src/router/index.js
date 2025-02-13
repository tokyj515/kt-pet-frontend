import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Login from "@/views/Login.vue";
import Signup from "@/views/Signup.vue";
import Profile from "@/views/Profile.vue";
import PetRegister from "@/views/PetRegister.vue";
import PetList from "@/views/PetList.vue";
import Shopping from "@/views/Shopping.vue";
import PetInfo from "@/views/PetInfo.vue"; // ✅ 펫 상세정보 페이지 추가

const routes = [
    { path: "/", component: Main },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/profile", component: Profile },
    { path: "/pet-register", component: PetRegister },
    { path: "/pet-list", component: PetList },
    { path: "/shopping", component: Shopping },
    { path: "/pet/:petId", component: PetInfo }, // ✅ 동적 라우트 추가
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
