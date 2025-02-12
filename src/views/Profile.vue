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

    <!-- ✅ 펫 등록 페이지로 이동하는 버튼 -->
    <button @click="goToPetRegister" class="pet-btn">펫 등록하기</button>

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
    const router = useRouter();

    // ✅ 펫 등록 페이지로 이동하는 함수
    const goToPetRegister = () => {
      router.push("/pet-register");
    };

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

    onMounted(fetchUserInfo);

    return { username, email, goToPetRegister };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}

/* 기본 버튼 스타일 (민트색) */
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

/* ✅ 펫 관련 버튼 스타일 (핑크색) */
button.pet-btn {
  background-color: #FACCD9; /* ✅ 기본 연한 핑크 */
}

button.pet-btn:hover {
  background-color: #FE80A2; /* ✅ 호버 시 진한 핑크 */
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
