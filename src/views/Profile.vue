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

    <!-- 회원 정보 수정 모달 -->
    <div v-if="isModifyModalOpen" class="modal">
      <div class="modal-content">
        <h3>회원 정보 수정</h3>
        <input v-model="modifyEmail" type="email" placeholder="새 이메일 입력" />
        <button @click="modifyInfo">저장</button>
        <button @click="closeModifyModal">닫기</button>
      </div>
    </div>

    <!-- 비밀번호 수정 모달 -->
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
import { onMounted, ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";

export default {
  setup() {
    const username = ref("");
    const email = ref("");

    const modifyEmail = ref(""); // 이메일 수정
    const modifyPassword = ref(""); // 비밀번호 수정

    const isModifyModalOpen = ref(false); // 회원 정보 수정 모달
    const isPasswordModalOpen = ref(false); // 비밀번호 수정 모달

    const router = useRouter();

    // 유저 정보 가져오기
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

    // 회원 정보 수정 API 호출
    const modifyInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("📤 이메일 수정 요청 보내는 중:", modifyEmail.value);

        const response = await axios.patch(
            "/user/modify", // ✅ JSON 형식으로 요청
            { email: modifyEmail.value },
            { headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"  // ✅ JSON 형식 설정
              }}
        );

        console.log("✅ 수정 완료 응답:", response.data);
        alert("회원 정보가 수정되었습니다.");

        // ✅ 최신 정보 다시 불러오기
        await fetchUserInfo();
        await nextTick(); // ✅ UI 강제 업데이트

        closeModifyModal();
      } catch (error) {
        console.error("❌ 회원 정보 수정 실패:", error.response?.data || error.message);
        alert("회원 정보 수정에 실패했습니다.");
      }
    };

    // 비밀번호 변경 API 호출
    const modifyPasswordFunc = async () => {
      try {
        const token = localStorage.getItem("token");
        await axios.patch(
            "/user/modify",
            { password: modifyPassword.value }, // ✅ JSON 형식으로 요청
            { headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }}
        );

        alert("비밀번호가 변경되었습니다.");
        closePasswordModal();
      } catch (error) {
        alert("비밀번호 변경에 실패했습니다.");
      }
    };

    // 회원 탈퇴 API 호출
    const withdraw = async () => {
      try {
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

    // 로그아웃 처리
    const logout = () => {
      if (confirm("정말 로그아웃 하시겠습니까?")) { // ✅ 확인 창 추가
        localStorage.removeItem("token");
        alert("로그아웃 되었습니다."); // ✅ 로그아웃 완료 알림
        router.push("/login");
      }
    };


    // 모달 열고 닫기
    const openModifyModal = () => (isModifyModalOpen.value = true);
    const closeModifyModal = () => (isModifyModalOpen.value = false);
    const openPasswordModal = () => (isPasswordModalOpen.value = true);
    const closePasswordModal = () => (isPasswordModalOpen.value = false);

    onMounted(fetchUserInfo);

    return {
      username,
      email,
      logout,
      modifyEmail,
      modifyPassword,
      isModifyModalOpen,
      isPasswordModalOpen,
      openModifyModal,
      closeModifyModal,
      openPasswordModal,
      closePasswordModal,
      modifyInfo,
      modifyPasswordFunc,
      withdraw,
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
button {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background-color: #40e0d0;
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background-color: #008b8b;
}

/* 모달 스타일 */
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

/* ✅ 입력창과 버튼 간격 조정 */
.modal-content input {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: block;
}

/* ✅ 버튼 스타일 조정 */
.modal-content button {
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  font-size: 16px;
}
</style>
