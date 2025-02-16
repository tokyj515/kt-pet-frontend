<template>
  <div class="container">
    <h2>펫시터 등록</h2>

    <!-- ✅ 위치 선택 -->
    <BaseSelect v-model="sitterData.location" label="위치" :options="locations" />

    <!-- ✅ 요금 입력 -->
    <BaseInput v-model="sitterData.charge" label="요금" type="number" placeholder="요금을 입력하세요" min="0" />

    <!-- ✅ 돌봄 가능 동물 선택 (체크박스 형태) -->
    <BaseCheckbox v-model="sitterData.carePetList" label="돌봄 가능 동물" :options="petTypes" />

    <!-- ✅ 돌봄 가능 시간 설정 (BaseDayTime 사용) -->
    <BaseDayTime v-model="sitterData.careTimeList" label="돌봄 가능 시간" />

    <!-- ✅ 버튼 그룹 -->
    <div class="button-group">
      <BaseButton @click="registerSitter" :primary="4">시터 등록하기</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import BaseDayTime from "@/components/base/BaseDayTime.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

// ✅ 위치 옵션 (BaseSelect에 전달)
const locations = ["서울", "경기", "부산", "대구", "광주", "대전", "울산", "제주"];

// ✅ 돌봄 가능 동물 옵션 (BaseCheckbox에 전달)
const petTypes = ["강아지", "고양이", "토끼", "새", "기타"];

const sitterData = ref({
  location: "",
  charge: "",
  carePetList: [],
  careTimeList: ["월", "화", "수", "목", "금", "토", "일"].map(day => ({
    day,
    startTime: "",
    endTime: "",
  })),
});

// ✅ 시터 등록 요청
const registerSitter = async () => {
  try {
    if (!sitterData.value.location) {
      alert("위치를 선택해주세요.");
      return;
    }
    if (!sitterData.value.charge) {
      alert("요금을 입력해주세요.");
      return;
    }
    if (sitterData.value.carePetList.length === 0) {
      alert("돌봄 가능한 동물을 선택해주세요.");
      return;
    }
    if (!sitterData.value.careTimeList.some(time => time.startTime && time.endTime)) {
      alert("돌봄 가능 시간을 최소 1개 이상 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("token");

    const requestData = {
      location: sitterData.value.location,
      charge: Number(sitterData.value.charge),
      carePetList: sitterData.value.carePetList,
      careTimeList: sitterData.value.careTimeList
          .filter(time => time.startTime && time.endTime)
          .map(time => ({
            day: time.day,
            startTime: time.startTime,
            endTime: time.endTime,
          })),
    };

    const response = await axios.post("/sitter/register", requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.data.success) {
      alert("시터 등록이 완료되었습니다.");
      router.push("/sitter-profile");
    }
  } catch (error) {
    console.error("🚨 시터 등록 실패:", error);
    alert(error.response?.data?.message || "시터 등록에 실패했습니다.");
  }
};
</script>

<style scoped>
.container {
  text-align: center;
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}
</style>
