<template>
  <div class="profile-container">
    <h2>내 프로필</h2>
    <p><strong>아이디:</strong> {{ username }}</p>
    <p><strong>이메일:</strong> {{ email }}</p>

    <!-- 회원 정보 수정 -->
    <button @click="openModifyModal">회원 정보 수정</button>

    <!-- 비밀번호 수정 -->
    <button @click="openPasswordModal">비밀번호 변경</button>

    <!-- 회원 탈퇴 -->
    <button @click="withdraw">회원 탈퇴</button>

    <!-- 로그아웃 -->
    <button @click="logout">로그아웃</button>

    <!-- ✅ 내 펫 목록 & 펫 등록 버튼 -->
    <div class="pet-actions">
      <button @click="goToPetList" class="pet-btn">내 펫 목록 보기</button>
      <button @click="goToPetRegister" class="pet-btn">펫 등록하기</button>
    </div>

    <!-- ✅ 회원 정보 수정 모달 -->
    <div v-if="isModifyModalOpen" class="modal">
      <div class="modal-content">
        <h3>회원 정보 수정</h3>
        <input v-model="modifyEmail" type="email" placeholder="새 이메일 입력" />
        <button @click="modifyInfo">저장</button>
        <button @click="closeModifyModal">닫기</button>
      </div>
    </div>

    <!-- ✅ 비밀번호 수정 모달 -->
    <div v-if="isPasswordModalOpen" class="modal">
      <div class="modal-content">
        <h3>비밀번호 변경</h3>
        <input v-model="modifyPassword" type="password" placeholder="새 비밀번호 입력" />
        <button @click="modifyPasswordFunc">변경</button>
        <button @click="closePasswordModal">닫기</button>
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
    const email = ref("");
    const modifyEmail = ref(""); // 이메일 수정용
    const modifyPassword = ref(""); // 비밀번호 수정용
    const isModifyModalOpen = ref(false);
    const isPasswordModalOpen = ref(false);
    const router = useRouter();

    // ✅ 내 펫 목록 보기
    const goToPetList = () => {
      router.push("/pet-list");
    };

    // ✅ 펫 등록 페이지로 이동
    const goToPetRegister = () => {
      router.push("/pet-register");
    };

    // ✅ 회원정보 수정
    const modifyInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(
            "/user/modify",
            { email: modifyEmail.value },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        alert("회원 정보가 수정되었습니다.");
        email.value = modifyEmail.value; // UI 업데이트
        closeModifyModal();
      } catch (error) {
        alert("회원 정보 수정에 실패했습니다.");
      }
    };

    // ✅ 비밀번호 변경
    const modifyPasswordFunc = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
            "/user/modify",
            { newPassword: modifyPassword.value },
            { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        alert("비밀번호가 변경되었습니다.");
        closePasswordModal();
      } catch (error) {
        alert("비밀번호 변경에 실패했습니다.");
      }
    };

    // ✅ 회원 탈퇴
    const withdraw = async () => {
      try {
        const confirmWithdraw = confirm("정말 회원 탈퇴를 진행하시겠습니까?");
        if (!confirmWithdraw) return;

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
        email.value = response.data.data.email;
      } catch (error) {
        alert("사용자 정보를 불러올 수 없습니다.");
        router.push("/login");
      }
    };

    onMounted(fetchUserInfo);

    return {
      username,
      email,
      modifyEmail,
      modifyPassword,
      isModifyModalOpen,
      isPasswordModalOpen,
      goToPetList,
      goToPetRegister,
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
.profile-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}

/* ✅ 내 펫 관련 버튼을 묶는 컨테이너 */
.pet-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

/* ✅ 펫 관련 버튼 (핑크색) */
button.pet-btn {
  width: 100%;
  padding: 10px;
  background-color: #FACCD9; /* ✅ 기본 연한 핑크 */
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button.pet-btn:hover {
  background-color: #FE80A2; /* ✅ 호버 시 진한 핑크 */
}

/* ✅ 기본 버튼 스타일 (회원정보 관련 버튼 - 민트색 유지) */
button {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #40e0d0; /* ✅ 기본 민트색 */
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #008b8b; /* ✅ 호버 시 짙은 민트색 */
}

/* ✅ 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}

/* ✅ 통일된 입력 필드 스타일 */
.modal-content input {
  display: block;
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px auto; /* 가운데 정렬 */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  text-align: center;
}

/* ✅ 버튼 스타일 통일 */
.modal-content button {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  font-size: 16px;
}
</style>