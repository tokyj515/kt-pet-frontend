<template>
  <div class="auth-container">
    <h2>회원가입</h2>
    <form @submit.prevent="signup">
      <BaseInput v-model="username" label="아이디" placeholder="아이디를 입력하세요" required />
      <BaseInput v-model="password" label="비밀번호" type="password" placeholder="비밀번호를 입력하세요" required />
      <BaseInput v-model="name" label="이름" placeholder="이름을 입력하세요" required />
      <BaseInput v-model="email" label="이메일" placeholder="이메일을 입력하세요" required />
      <BaseButton type="submit" class="mt-4">가입하기</BaseButton>
    </form>
    <p>이미 계정이 있나요? <router-link to="/login" class="router-link">로그인</router-link></p>
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
const name = ref("");
const email = ref("");
const router = useRouter();

const signup = async () => {
  try {
    await axios.post("/user/signup", {
      username: username.value,
      password: password.value,
      name: name.value,
      email: email.value,
    });
    alert("회원가입 성공! 로그인 해주세요.");
    router.push("/login");
  } catch (error) {
    alert("회원가입 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

p {
  margin-top: 10px;
}


</style>