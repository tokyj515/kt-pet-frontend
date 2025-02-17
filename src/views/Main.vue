<template>
  <div class="container">
    <h2>MY PET</h2>

    <div class="grid-container">
      <!-- 프로필 이동 카드 -->
      <div class="card" @click="goToProfile">
        <UserIcon class="icon" />
        <p>내 프로필</p>
      </div>

      <!-- 펫 목록 이동 카드 -->
      <div class="card" @click="goToPetList">
        <PawPrintIcon class="icon" />
        <p>내 펫 목록</p>
      </div>

      <!-- 쇼핑몰 이동 카드 -->
      <div class="card" @click="goToShopping">
        <ShoppingCartIcon class="icon" />
        <p>쇼핑몰</p>
      </div>

      <!-- 펫시터 목록은 모든 사용자에게 보임 -->
      <div class="card" @click="goToSitterList">
        <UsersIcon class="icon" />
        <p>펫시터 목록</p>
      </div>

      <!-- 사용자가 예약한 목록 -->
      <div class="card" @click="goToReservationMyList">
        <UsersIcon class="icon" />
        <p>내 목록</p>
      </div>


      <!-- 🟢 ROLE_ADMIN 권한이 있을 때만 보이는 카드 -->
      <div v-if="isAdmin" class="card" @click="goToSitterProfile">
        <HomeIcon class="icon" />
        <p>펫시터 프로필</p>
      </div>

      <div v-if="isAdmin" class="card" @click="goToReservationRequestList">
        <UsersIcon class="icon" />
        <p>펫시터 예약 목록</p>
      </div>

      <!-- 🟢 ROLE_ADMIN 전용 기능 -->
      <div v-if="isAdmin" class="card" @click="goToPaymentTest">
        <CreditCardIcon class="icon" />
        <p>결제하기 예제</p>
      </div>

      <div v-if="isAdmin" class="card" @click="goToCodeManage">
        <AxeIcon class="icon" />
        <p>코드 관리</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { User as UserIcon, PawPrint as PawPrintIcon, ShoppingCart as ShoppingCartIcon, Home as HomeIcon, Users as UsersIcon, CreditCard as CreditCardIcon, Axe as AxeIcon } from "lucide-vue-next";

const router = useRouter();
const isAdmin = ref(false); // 🟢 관리자 여부 저장

// ✅ 로컬스토리지에서 role 확인
const checkAdminRole = () => {
  const userRole = localStorage.getItem("role"); // 🟢 로그인 시 저장된 role 가져오기
  console.log("🟢 현재 사용자 역할:", userRole);

  if (userRole === "ROLE_ADMIN") {
    isAdmin.value = true;
  }
};

// ✅ 페이지 로딩 시 역할 체크
onMounted(checkAdminRole);

// ✅ 페이지 이동 함수들
const goToProfile = () => router.push("/profile");
const goToPetList = () => router.push("/pet-list");
const goToShopping = () => router.push("/shopping");
const goToSitterProfile = () => router.push("/sitter/profile/me");
const goToSitterList = () => router.push("/sitter-list");
const goToPaymentTest = () => router.push("/payment-test");
const goToCodeManage = () => router.push("/code-manage");
const goToReservationRequestList = () => router.push("/reservation/request/list");
const goToReservationMyList = () => router.push("/reservation/list");

</script>

<style scoped>
.container {
  text-align: center;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  max-width: 400px;
  margin: auto;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: scale(1.05);
}

/* 🟤 아이콘 기본 색상 - 갈색 (#492815) */
.icon {
  width: 48px;
  height: 48px;
  margin-bottom: 8px;
  color: #492815;
}

/* 🎨 호버 시 살구색 (#FED7C3) */
.card:hover .icon {
  color: #FED7C3;
}

.card p {
  font-size: 14px;
  font-weight: bold;
  color: #492815; /* 텍스트도 갈색으로 */
}
</style>
