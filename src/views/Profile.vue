<template>
  <div class="container">
    <h2>내 프로필</h2>
    <p><strong>아이디:</strong> {{ username }}</p>
    <p><strong>이메일:</strong> {{ email }}</p>

    <button @click="openModifyModal" class="btn btn-mint">회원 정보 수정</button>
    <button @click="openPasswordModal" class="btn btn-mint">비밀번호 변경</button>
    <button @click="withdraw" class="btn btn-gray">회원 탈퇴</button>
    <button @click="logout" class="btn btn-gray">로그아웃</button>

<!--    <div class="pet-actions">-->
<!--      <button @click="goToPetList" class="btn btn-pink">내 펫 목록 보기</button>-->
<!--      <button @click="goToPetRegister" class="btn btn-pink">펫 등록하기</button>-->
<!--    </div>-->

    <button @click="goBack" class="btn btn-gray">뒤로 가기</button>

    <!-- ✅ 회원 정보 수정 -->
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

    // ✅ 뒤로 가기
    const goBack = () => {
      router.push("/");
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
      goBack,
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




</style>