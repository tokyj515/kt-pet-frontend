<template>
  <div class="auth-container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="아이디" required />
      <input type="password" v-model="password" placeholder="비밀번호" required />
      <button type="submit">로그인</button>
    </form>
    <p>계정이 없나요? <router-link to="/signup">회원가입</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "@/api/axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    const login = async () => {
      try {
        console.log("🟡 로그인 요청 시작:", username.value, password.value);
        const response = await axios.post("/user/login", {
          username: username.value,
          password: password.value,
        });

        console.log("✅ 로그인 성공, 응답 데이터:", response.data);

        // ✅ 응답 구조 확인 후 정확한 위치에서 accessToken 추출
        if (!response.data || !response.data.data || !response.data.data.token) {
          console.error("❌ 응답에 token 없음:", response.data);
          alert("로그인 실패: 서버 응답에 토큰이 없습니다.");
          return;
        }

        const token = response.data.data?.token?.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("username", response.data.data.username);
          localStorage.setItem("email", response.data.data.username);
          console.log("✅ 토큰 및 사용자 정보 저장 완료:", token);
          router.push("/profile");
        } else {
          console.error("❌ accessToken이 응답 데이터에서 확인되지 않음:", response.data);
          alert("로그인 실패: 서버 응답에서 accessToken을 찾을 수 없습니다.");
        }

        // ✅ localStorage 반영 후 프로필로 이동 (setTimeout 활용)
        setTimeout(() => {
          router.push("/profile");
        }, 100); // 약간의 지연 후 페이지 이동

      } catch (error) {
        console.error("❌ 로그인 실패:", error.response?.data || error.message);
        alert("로그인 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    };


    return { username, password, login };
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  padding: 8px;
  margin: 10px 0;
}
button {
  width: 100%;
  padding: 10px;
}
</style>
