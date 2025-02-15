<template>
  <div class="container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <BaseInput v-model="username" label="아이디" placeholder="아이디를 입력하세요" required />
      <BaseInput v-model="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" required />
      <BaseButton type="submit" class="mt-4">로그인</BaseButton>
    </form>
    <p>계정이 없나요? <router-link to="/signup" class="router-link">회원가입</router-link></p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

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

    if (!response.data?.data?.token) {
      alert("로그인 실패: 서버 응답에 토큰이 없습니다.");
      return;
    }

    const token = response.data.data.token.accessToken;
    localStorage.setItem("token", token);
    localStorage.setItem("username", response.data.data.username);
    localStorage.setItem("email", response.data.data.username);
    console.log("✅ 토큰 및 사용자 정보 저장 완료:", token);

    router.push("/");
  } catch (error) {
    console.error("❌ 로그인 실패:", error.response?.data || error.message);
    alert("로그인 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
  }
};
</script>

<style scoped>


p {
  margin-top: 10px;
}


</style>
