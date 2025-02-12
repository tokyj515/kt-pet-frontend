<template>
  <div class="auth-container">
    <h2>회원가입</h2>
    <form @submit.prevent="signup">
      <input type="text" v-model="username" placeholder="아이디" required />
      <input type="password" v-model="password" placeholder="비밀번호" required />
      <input type="text" v-model="name" placeholder="이름" required />
      <button type="submit">가입하기</button>
    </form>
    <p>이미 계정이 있나요? <router-link to="/login">로그인</router-link></p>
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
    const name = ref("");
    const router = useRouter();

    const signup = async () => {
      try {
        await axios.post("/signup", {
          username: username.value,
          password: password.value,
          name: name.value,
        });
        alert("회원가입 성공! 로그인 해주세요.");
        router.push("/login");
      } catch (error) {
        alert("회원가입 실패: " + error.response?.data?.message || "알 수 없는 오류");
      }
    };

    return { username, password, name, signup };
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
