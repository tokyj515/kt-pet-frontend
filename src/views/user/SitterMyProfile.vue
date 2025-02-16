<template>
  <div class="container">
    <h2>나의 펫시터 프로필</h2>

    <!-- ✅ 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 프로필 데이터 표시 -->
    <div v-else-if="profileData" class="profile-content">
      <!-- ✅ 기본 정보 -->
      <BaseCard>
        <template #header>
          <h3>기본 정보</h3>
        </template>
        <template #body>
          <BaseGrid :items="[
            { label: '이름', value: profileData.name || '-' },
            { label: '이메일', value: profileData.email || '-' },
            { label: '전화번호', value: profileData.phone || '미등록' }
          ]" />
        </template>
      </BaseCard>

      <!-- ✅ 시터 정보 -->
      <BaseCard>
        <template #header>
          <h3>시터 정보</h3>
        </template>
        <template #body>
          <BaseGrid :items="[
            { label: '활동 지역', value: profileData.location || '-' },
            { label: '시간당 요금', value: profileData.charge ? `${profileData.charge}원` : '-' }
          ]" />
        </template>
      </BaseCard>

      <!-- ✅ 돌봄 가능 동물 -->
      <BaseCard v-if="validCarePetList.length">
        <template #header>
          <h3>돌봄 가능 동물</h3>
        </template>
        <template #body>
          <BaseChip :chips="validCarePetList.map(pet => pet.petType)" />
        </template>
      </BaseCard>

      <!-- ✅ 돌봄 가능 시간 -->
      <BaseCard v-if="validCareTimeList.length">
        <template #header>
          <h3>돌봄 가능 시간</h3>
        </template>
        <template #body>
          <BaseChip
              :chips="validCareTimeList.map(time => `${time.day}: ${formatTime(time.startTime)} - ${formatTime(time.endTime)}`)"
          />
        </template>
      </BaseCard>
    </div>

    <!-- ✅ 데이터가 없는 경우 -->
    <div v-else class="no-data">
      <p>프로필 정보가 없습니다.</p>
    </div>

    <!-- ✅ 뒤로 가기 버튼 -->
    <BaseButton @click="goBack" :primary="2">뒤로 가기</BaseButton>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseChip from "@/components/base/BaseChip.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseGrid from "@/components/base/BaseGrid.vue"; // ✅ 프로필 정보 테이블 컴포넌트

const router = useRouter();
const profileData = ref(null);
const loading = ref(true);

// ✅ 현재 사용자의 펫시터 프로필 가져오기
const fetchSitterProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/sitter/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ API 응답을 프로필 데이터에 저장
    profileData.value = response.data.data;
  } catch (error) {
    console.error("🚨 펫시터 프로필 조회 실패:", error);
    alert("펫시터 정보를 불러오는데 실패했습니다.");
  } finally {
    loading.value = false;
  }
};

// ✅ 시간 포맷 함수
const formatTime = (time) => {
  return time && time !== "string" ? time : "";
};

// ✅ 유효한 돌봄 시간 필터링
const validCareTimeList = computed(() => {
  return profileData.value?.careTimeList?.filter(
      (time) => time.day !== "string" && time.startTime !== "string" && time.endTime !== "string"
  ) || [];
});

// ✅ 유효한 돌봄 동물 필터링
const validCarePetList = computed(() => {
  return profileData.value?.carePetList?.filter((pet) => pet.petType !== "string") || [];
});

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/");
};

// ✅ 컴포넌트 마운트 시 API 호출
onMounted(fetchSitterProfile);
</script>

<style scoped>

/* ✅ 프로필 내용 */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}

/* ✅ 데이터 없음 */
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
