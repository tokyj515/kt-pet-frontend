import { createRouter, createWebHistory } from "vue-router";
import Main from "@/views/Main.vue";
import Login from "@/views/user/Login.vue";
import Signup from "@/views/user/Signup.vue";
import Profile from "@/views/user/Profile.vue";
import PetRegister from "@/views/pet/PetRegister.vue";
import PetList from "@/views/pet/PetList.vue";
import Shopping from "@/views/shopping/Shopping.vue";
import PetInfo from "@/views/pet/PetInfo.vue";
import SitterRegister from "@/views/sitter/SitterRegister.vue";
import SitterProfile from "@/views/sitter/SitterProfile.vue"; // ✅ 펫 상세정보 페이지 추가
import SitterList from "@/views/sitter/SitterList.vue";
import PaymentTest from "@/views/payment/PaymentTest.vue";
import ComponentTest from "@/views/ComponentTest.vue";
import SitterMyProfile from "@/views/user/SitterMyProfile.vue";
import CodeManage from "@/views/code/CodeManage.vue";
import ReservationRegister from "@/views/reservation/ReservationRegister.vue";
import ReservationList from "@/views/reservation/ReservationList.vue";  // 추가

const routes = [
    { path: "/", component: Main },
    { path: "/login", component: Login },
    { path: "/signup", component: Signup },
    { path: "/profile", component: Profile },
    { path: "/pet-register", component: PetRegister },
    { path: "/pet-list", component: PetList },
    { path: "/shopping", component: Shopping },
    { path: "/pet/:petId", component: PetInfo }, // ✅ 동적 라우트 추가
    { path: "/sitter-register", component: SitterRegister }, // ✅ 동적 라우트 추가
    { path: "/sitter/profile/:sitterId", component: SitterProfile },
    { path: "/sitter/profile/me", component: SitterMyProfile },
    { path: "/sitter-list", component: SitterList },
    { path: "/payment-test", component: PaymentTest },
    { path: "/code-manage", component: CodeManage },
    { path: "/component-test", component: ComponentTest },
    { path: "/reservation/register/:sitterId", component: ReservationRegister },
    { path: "/reservation/list", component: ReservationList },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
