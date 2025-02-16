<template>
  <div class="container">
    <h2>펫 등록</h2>
    <form @submit.prevent="registerPet">
      <!-- ✅ 이름 입력 (BaseInput 적용) -->
      <BaseInput v-model="name" label="이름" placeholder="펫 이름" required />

      <!-- ✅ 펫 종류 선택 (BaseSelect 적용) -->
      <BaseSelect v-model="petType" label="펫 종류" :options="petOptions" required />

      <!-- ✅ 나이 선택 (BaseSelect 적용) -->
      <BaseSelect v-model="age" label="나이" :options="ageOptions" required />

      <!-- ✅ 등록 버튼 -->
      <BaseButton type="submit" class="mt-4" :primary="4">등록하기</BaseButton>
    </form>

    <!-- ✅ 취소 버튼 -->
    <BaseButton @click="goBack" class="mt-2" :primary="3">취소</BaseButton>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const name = ref("");
const petType = ref("고양이"); // 기본값
const age = ref(0);
const router = useRouter();

// ✅ 펫 종류 선택 옵션
const petOptions = [
  { label: "고양이", value: "고양이" },
  { label: "강아지", value: "강아지" },
];

// ✅ 나이 선택 옵션 (0~30살)
const ageOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i}살`,
  value: i,
}));

// ✅ 펫 등록 API 호출
const registerPet = async () => {
  try {
    const token = localStorage.getItem("token");

    const requestData = {
      name: name.value,
      petType: petType.value,
      age: age.value,
    };

    console.log("📤 요청 데이터:", JSON.stringify(requestData)); // ✅ 로그 확인

    const response = await axios.post("/pet/register", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ API 응답:", response.data);
    alert("펫 등록 성공!");
    router.push("/pet-list");
  } catch (error) {
    console.error("❌ 펫 등록 실패:", error.response?.data || error.message);
    alert("펫 등록 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
  }
};

// ✅ 취소 버튼 클릭 시 프로필 페이지로 이동
const goBack = () => {
  router.push("/pet-list");
};
</script>

<style scoped>
.container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>
