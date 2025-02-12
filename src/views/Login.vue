<template>
  <div class="container">
    <h2>로그인</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="아이디" class="input-field" required />
      <input type="password" v-model="password" placeholder="비밀번호" class="input-field" required />
      <button type="submit" class="btn btn-mint">로그인</button>
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
  max-width: 350px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 입력 필드 스타일 */
input {
  display: block;
  width: calc(100% - 20px); /* ✅ 버튼과 같은 너비 유지 */
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box; /* ✅ 패딩 포함하여 크기 맞추기 */
}

/* 버튼 스타일 */
button {
  width: 100%; /* ✅ 버튼도 동일한 너비 */
  padding: 10px;
  margin: 10px 0;
  background-color: #40E0D0; /* ✅ 기본 민트색 */
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box; /* ✅ 패딩 포함하여 크기 맞추기 */
}

button:hover {
  background-color: #008B8B; /* ✅ 호버 시 더 짙은 민트색 */
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
