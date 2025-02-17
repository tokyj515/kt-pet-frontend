<template>
  <div class="container">
    <h2>펫시터로 등록</h2>

    <!-- ✅ 위치 선택 -->
    <BaseSelect v-model="sitterData.location" label="위치" :options="locationOptions" />

    <!-- ✅ 요금 입력 -->
    <BaseInput v-model="sitterData.charge" label="요금" type="number" placeholder="요금을 입력하세요" min="0" />

    <!-- ✅ 돌봄 가능 동물 선택 (체크박스 형태) -->
    <BaseCheckbox v-model="sitterData.carePetList" label="돌봄 가능 동물" :options="petTypeOptions" />

    <!-- ✅ 돌봄 가능 시간 설정 (BaseDayTime 사용) -->
    <BaseDayTime v-model="sitterData.careTimeList" label="돌봄 가능 시간" />

    <!-- ✅ 선택된 돌봄 가능 시간 칩 표시 (chipList가 있을 때만) -->
    <BaseChip v-if="chipList.length > 0" :chips="chipList" label="선택된 시간" removable="true" @remove-chip="removeChip" />


    <!-- ✅ 버튼 그룹 -->
    <div class="button-group">
      <BaseButton @click="goBack" >뒤로 가기</BaseButton>
      <BaseButton @click="registerSitter" :primary="4">시터 등록하기</BaseButton>
      <!-- ✅ 뒤로 가기 버튼 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import BaseDayTime from "@/components/base/BaseDayTime.vue";
import BaseChip from "@/components/base/BaseChip.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const router = useRouter();

// ✅ BaseSelect에 맞게 locationOptions을 수정
const locationOptions = [
  { label: "서울", value: "서울" },
  { label: "경기", value: "경기" },
  { label: "부산", value: "부산" },
  { label: "대구", value: "대구" },
  { label: "광주", value: "광주" },
  { label: "대전", value: "대전" },
  { label: "울산", value: "울산" },
  { label: "제주", value: "제주" }
];

// ✅ BaseCheckbox에 맞게 petTypeOptions을 수정
const petTypeOptions = [
  { label: "강아지", value: "강아지" },
  { label: "고양이", value: "고양이" },
  { label: "토끼", value: "토끼" },
  { label: "새", value: "새" },
  { label: "기타", value: "기타" }
];

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

// ✅ 칩 리스트 (computed로 관리)
const chipList = computed(() =>
    sitterData.value.careTimeList
        .filter((time) => time.startTime && time.endTime)
        .map((time) => `${time.day}: ${time.startTime} - ${time.endTime}`)
);

// ✅ 칩 삭제 (선택한 시간 삭제)
const removeChip = (chip) => {
  sitterData.value.careTimeList = sitterData.value.careTimeList.map((time) => {
    const chipText = `${time.day}: ${time.startTime} - ${time.endTime}`;
    return chipText === chip ? { ...time, startTime: "", endTime: "" } : time;
  });
};

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

    console.log("📌 서버 응답:", response.data);

    // ✅ 서버 응답에서 code가 200인지 확인
    if (response.data.code === 200) {
      alert("시터 등록이 완료되었습니다.");
      router.push("/"); // 정상적으로 메인 페이지로 이동
    } else {
      console.warn("❌ 서버 응답에서 code가 200이 아님:", response.data);
      alert(response.data.message || "시터 등록이 실패했습니다.");
      return router.push("/sitter/profile/me");
    }
  } catch (error) {
    console.error("🚨 시터 등록 실패:", error);
    alert(error.response?.data?.message || "시터 등록에 실패했습니다.");
    return router.push("/sitter/profile/me");
  }
};

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/");
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
