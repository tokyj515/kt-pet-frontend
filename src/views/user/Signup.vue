<template>
  <div class="container">
    <h2>회원가입</h2>
    <form @submit.prevent="signup">
      <input type="text" v-model="username" placeholder="아이디" class="input-field" required />
      <input type="password" v-model="password" placeholder="비밀번호" class="input-field" required />
      <input type="text" v-model="name" placeholder="이름" class="input-field" required />
      <input type="text" v-model="email" placeholder="이메일" class="input-field" required />
      <button type="submit" class="btn btn-mint">가입하기</button>
    </form>
    <p>이미 계정이 있나요? <router-link to="/login">로그인</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "@/api/axios.js";
import { useRouter } from "vue-router";

export default {
  setup() {
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

    return { username, password, name, email, signup };
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 350px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}




/* 회원가입 링크 스타일 */
p {
  margin-top: 10px;
}
router-link {
  color: #40E0D0;
  font-weight: bold;
  text-decoration: none;
}

router-link:hover {
  text-decoration: underline;
}
</style>
