<template>
  <div class="container">
    <h2>내 프로필</h2>

    <!-- ✅ 프로필 카드 -->
    <div class="profile-card">
      <div class="profile-row">
        <span class="label">아이디</span>
        <span class="value">{{ username }}</span>
      </div>
      <div class="profile-row">
        <span class="label">이름</span>
        <span class="value">{{ name }}</span>
      </div>
      <div class="profile-row">
        <span class="label">이메일</span>
        <span class="value">{{ email }}</span>
      </div>
      <div class="profile-row">
        <span class="label">전화번호</span>
        <span class="value">{{ phone }}</span>
      </div>
    </div>

    <!-- ✅ 버튼 그룹 -->
    <div class="button-group">
      <BaseButton @click="isModifyModalOpen = true" :primary="2">정보 수정</BaseButton>
      <BaseButton @click="isPasswordModalOpen = true" :primary="2">비밀번호 변경</BaseButton>
      <BaseButton @click="withdraw" :primary="3">회원 탈퇴</BaseButton>
      <BaseButton @click="logout" :primary="3">로그아웃</BaseButton>
      <BaseButton @click="goToSitterRegister" :primary="4">펫시터 등록</BaseButton>
      <BaseButton @click="goBack">뒤로 가기</BaseButton>
    </div>

    <!-- ✅ 회원 정보 수정 모달 -->
    <BaseModal :isOpen="isModifyModalOpen" title="회원 정보 수정" @close="isModifyModalOpen = false">
      <BaseInput v-model="modifyEmail" placeholder="새 이메일 입력" />
      <BaseButton @click="modifyInfo" class="w-full" :primary="4">저장</BaseButton>
    </BaseModal>

    <!-- ✅ 비밀번호 변경 모달 -->
    <BaseModal :isOpen="isPasswordModalOpen" title="비밀번호 변경" @close="isPasswordModalOpen = false">
      <BaseInput v-model="modifyPassword" type="password" placeholder="새 비밀번호 입력" />
      <BaseButton @click="modifyPasswordFunc" class="w-full" :primary="4">변경</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseModal from "@/components/base/BaseModal.vue"; // ✅ 추가

const username = ref("");
const name = ref("");
const email = ref("");
const phone = ref("");
const modifyEmail = ref("");
const modifyPassword = ref("");
const isModifyModalOpen = ref(false);
const isPasswordModalOpen = ref(false);
const router = useRouter();

// ✅ 이동 및 기능 정의
const goToSitterRegister = () => router.push("/sitter-register");
const goBack = () => router.push("/");

const modifyInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch("/user/modify", { email: modifyEmail.value }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    alert("회원 정보가 수정되었습니다.");
    email.value = modifyEmail.value;
    isModifyModalOpen.value = false;
  } catch (error) {
    alert("회원 정보 수정 실패");
  }
};

const modifyPasswordFunc = async () => {
  try {
    const token = localStorage.getItem("token");
    await axios.patch("/user/modify", { newPassword: modifyPassword.value }, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
    alert("비밀번호 변경 완료");
    isPasswordModalOpen.value = false;
  } catch (error) {
    alert("비밀번호 변경 실패");
  }
};

const withdraw = async () => {
  if (!confirm("정말 회원 탈퇴하시겠습니까?")) return;
  try {
    const token = localStorage.getItem("token");
    await axios.patch("/user/withdraw", null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert("회원 탈퇴 완료");
    logout();
  } catch (error) {
    alert("회원 탈퇴 실패");
  }
};

const logout = () => {
  if (confirm("로그아웃 하시겠습니까?")) {
    localStorage.removeItem("token");
    alert("로그아웃 완료");
    router.push("/login");
  }
};

const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    const response = await axios.get("/user/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });
    username.value = response.data.data.username;
    name.value = response.data.data.name;
    email.value = response.data.data.email;
    phone.value = response.data.data.phone;
  } catch (error) {
    alert("사용자 정보를 불러올 수 없습니다.");
    router.push("/login");
  }
};

onMounted(fetchUserInfo);
</script>

<style scoped>

/* ✅ 프로필 카드 */
.profile-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px 20px 10px; /* ⬅ 기존 padding-bottom 줄이기 */
  max-width: 400px;
  margin: auto;
}


.profile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  color: #492815;
}

.value {
  color: #BB937A; /* 살구색 */
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}
</style>
