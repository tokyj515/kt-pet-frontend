<template>
  <div class="container">
    <h2>내 프로필</h2>

    <!-- ✅ 프로필 정보 (완전 중앙 정렬) -->
    <div class="profile-box">
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
    </div>

    <!-- ✅ 버튼 그룹 (정렬 개선) -->
    <div class="button-group">
      <button @click="openModifyModal" class="btn btn-mint">회원 정보 수정</button>
      <button @click="openPasswordModal" class="btn btn-mint">비밀번호 변경</button>
      <button @click="withdraw" class="btn btn-gray">회원 탈퇴</button>
      <button @click="logout" class="btn btn-gray">로그아웃</button>
      <button @click="goBack" class="btn btn-gray">뒤로 가기</button>
    </div>

    <!-- ✅ 회원 정보 수정 모달 -->
    <div v-if="isModifyModalOpen" class="modal">
      <div class="modal-content">
        <h3>회원 정보 수정</h3>
        <input v-model="modifyEmail" type="email" placeholder="새 이메일 입력" class="input-field" />
        <button @click="modifyInfo" class="btn btn-mint">저장</button>
        <button @click="closeModifyModal" class="btn btn-gray">닫기</button>
      </div>
    </div>

    <!-- ✅ 비밀번호 변경 모달 -->
    <div v-if="isPasswordModalOpen" class="modal">
      <div class="modal-content">
        <h3>비밀번호 변경</h3>
        <input v-model="modifyPassword" type="password" placeholder="새 비밀번호 입력" class="input-field" />
        <button @click="modifyPasswordFunc" class="btn btn-mint">변경</button>
        <button @click="closePasswordModal" class="btn btn-gray">닫기</button>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";

export default {
  setup() {
    const username = ref("");
    const name = ref("");
    const email = ref("");
    const modifyEmail = ref("");
    const modifyPassword = ref("");
    const isModifyModalOpen = ref(false);
    const isPasswordModalOpen = ref(false);
    const router = useRouter();

    // ✅ 뒤로 가기
    const goBack = () => {
      router.push("/");
    };

    // ✅ 회원 정보 수정
    const modifyInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.patch("/user/modify", { email: modifyEmail.value }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        alert("회원 정보가 수정되었습니다.");
        email.value = modifyEmail.value;
        closeModifyModal();
      } catch (error) {
        alert("회원 정보 수정에 실패했습니다.");
      }
    };

    // ✅ 비밀번호 변경
    const modifyPasswordFunc = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.patch("/user/modify", { newPassword: modifyPassword.value }, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        });
        alert("비밀번호가 변경되었습니다.");
        closePasswordModal();
      } catch (error) {
        alert("비밀번호 변경에 실패했습니다.");
      }
    };

    // ✅ 회원 탈퇴
    const withdraw = async () => {
      try {
        if (!confirm("정말 회원 탈퇴를 진행하시겠습니까?")) return;
        const token = localStorage.getItem("token");
        await axios.patch("/user/withdraw", null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("회원 탈퇴가 완료되었습니다.");
        logout();
      } catch (error) {
        alert("회원 탈퇴에 실패했습니다.");
      }
    };

    // ✅ 로그아웃
    const logout = () => {
      if (confirm("정말 로그아웃 하시겠습니까?")) {
        localStorage.removeItem("token");
        alert("로그아웃 되었습니다.");
        router.push("/login");
      }
    };

    // ✅ 모달 열고 닫기
    const openModifyModal = () => (isModifyModalOpen.value = true);
    const closeModifyModal = () => (isModifyModalOpen.value = false);
    const openPasswordModal = () => (isPasswordModalOpen.value = true);
    const closePasswordModal = () => (isPasswordModalOpen.value = false);

    // ✅ 유저 정보 가져오기
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
      } catch (error) {
        alert("사용자 정보를 불러올 수 없습니다.");
        router.push("/login");
      }
    };

    onMounted(fetchUserInfo);

    return {
      username,
      name,
      email,
      modifyEmail,
      modifyPassword,
      isModifyModalOpen,
      isPasswordModalOpen,
      goBack,
      modifyInfo,
      modifyPasswordFunc,
      withdraw,
      logout,
      openModifyModal,
      closeModifyModal,
      openPasswordModal,
      closePasswordModal,
    };
  },
};
</script>

<style scoped>
/* ✅ 프로필 박스 (너비 조정 & 중앙 정렬) */
.profile-box {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  width: 80%; /* ✅ 너비 조정 (기존 100% → 80%) */
  max-width: 350px; /* ✅ 최대 너비 제한 */
  margin: auto;
  text-align: left; /* ✅ 텍스트 정렬 */
}

/* ✅ 프로필 정보 행 */
.profile-row {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  font-size: 16px;
}

/* ✅ 라벨 스타일 */
.label {
  font-weight: bold;
  color: #333;
}

/* ✅ 값 스타일 */
.value {
  color: #000;
  text-align: right;
  flex: 1; /* ✅ 오른쪽 정렬 */
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  margin-top: 20px;
}
</style>
