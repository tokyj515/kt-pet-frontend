<template>
  <div class="container">
    <h2>내 프로필</h2>

    <!-- ✅ 데이터 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 프로필 정보 -->
    <div v-else class="profile-box">
      <div class="profile-row">
        <span class="label">이름</span>
        <span class="value">{{ profile.name }}</span>
      </div>
      <div class="profile-row">
        <span class="label">이메일</span>
        <span class="value">{{ profile.email }}</span>
      </div>
      <div class="profile-row">
        <span class="label">전화번호</span>
        <span class="value">{{ profile.phone }}</span>
      </div>
      <div class="profile-row">
        <span class="label">위치</span>
        <span class="value">{{ profile.location }}</span>
      </div>
      <div class="profile-row">
        <span class="label">요금</span>
        <span class="value">{{ profile.charge }}원</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/axios"; // axios.js 활용

const profile = ref({});
const loading = ref(true);

const fetchProfile = async () => {
  try {
    const response = await apiClient.get("/sitter/profile");
    profile.value = response.data;
  } catch (error) {
    console.error("🚨 프로필 불러오기 실패:", error);
    alert(error.response?.data?.message || "프로필을 불러오지 못했습니다.");
  } finally {
    loading.value = false;
  }
};

// 컴포넌트 마운트 시 API 호출
onMounted(fetchProfile);
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 50px auto;
  text-align: center;
}

.profile-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  background: #f9f9f9;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #555;
}

.loading {
  font-size: 18px;
  color: #777;
  text-align: center;
  margin-top: 20px;
}
</style>
