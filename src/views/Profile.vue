<template>
  <div class="profile-container">
    <h2>내 프로필</h2>
    <p><strong>아이디:</strong> {{ username }}</p>
    <p><strong>이메일:</strong> {{ email }}</p>
    <button @click="logout">로그아웃</button>
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
    const router = useRouter();

    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ JWT 토큰이 존재하지 않음.");
          alert("로그인이 필요합니다.");
          router.push("/login");
          return;
        }

        console.log("🟡 사용자 정보 요청 시작");
        const response = await axios.get("/user/profile", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ 토큰 포함해서 요청
        });

        console.log("✅ 응답 데이터:", response.data);
        username.value = response.data.data.username;
        email.value = response.data.data.email;
      } catch (error) {
        console.error("❌ 사용자 정보를 불러오지 못함:", error.response?.data || error.message);
        alert("사용자 정보를 불러올 수 없습니다.");
        router.push("/login");
      }
    };

    const logout = () => {
      console.log("🟡 로그아웃 실행");
      localStorage.removeItem("token");
      alert("로그아웃 되었습니다.");
      router.push("/login");
    };

    onMounted(fetchUserInfo);

    return { username, email, logout };
  },
};
</script>

<style scoped>
.profile-container {
  max-width: 300px;
  margin: auto;
  text-align: center;
}
button {
  width: 100%;
  padding: 10px;
}
</style>
