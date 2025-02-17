<template>
  <div class="container">
    <h2>내 예약 목록</h2>

    <!-- ✅ 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 예약 목록 -->
    <div v-else-if="reservations.length">
      <BaseCard v-for="reservation in reservations" :key="reservation.reservationId">
        <template #header>
          <h3>
            {{ reservation.pet?.name || "정보 없음" }}
            [{{ reservation.pet?.petType || "미정" }}]
          </h3>
        </template>

        <template #body>
          <BaseGrid :items="[
            { label: '예약 ID', value: reservation.reservationId },
            { label: '예약 상태', value: getStatusLabel(reservation.confirm) },
            { label: '펫시터', value: reservation.sitter?.name || '정보 없음' },
            { label: '총 요금', value: reservation.totalCharge ? reservation.totalCharge + '원' : '정보 없음' }
          ]" />

          <!-- ✅ 예약한 시간 표시 (sitterCareTimeDtos가 null일 경우 빈 배열 처리) -->
          <BaseChip
              v-if="reservation.sitterCareTimeDtos?.length"
              :chips="reservation.sitterCareTimeDtos.map(time => `${time.day} ${time.startTime}~${time.endTime}`)"
          />
        </template>
      </BaseCard>
    </div>

    <!-- ✅ 데이터 없음 -->
    <div v-else class="no-data">
      <p>예약 내역이 없습니다.</p>
    </div>

    <BaseButton @click="goBack">뒤로 가기</BaseButton>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseChip from "@/components/base/BaseChip.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseGrid from "@/components/base/BaseGrid.vue";

const router = useRouter();
const reservations = ref([]);
const loading = ref(true);

// ✅ 예약 상태 변환 함수
const getStatusLabel = (status) => {
  if (status === null) return "승인 대기"; // ✅ null인 경우 기본 값 설정
  return status === 0 ? "승인 대기" : "승인 완료";
};

// ✅ 예약 목록 가져오기 (사용자가 예약한 목록)
const fetchReservations = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    const apiUrl = "http://localhost:8080/reservation/user/list"; // ✅ 사용자 예약 내역 API

    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📌 내 예약 API 응답 데이터:", response.data);
    reservations.value = (response.data.data || []).map(reservation => ({
      ...reservation,
      pet: reservation.pet || { name: "정보 없음", petType: "미정" }, // ✅ 기본 값 추가
      sitter: reservation.sitter || { sitterId: null, name: "정보 없음" }, // ✅ sitter 기본 값 설정
      sitterCareTimeDtos: reservation.sitterCareTimeDtos || [] // ✅ 빈 배열 추가
    }));
  } catch (error) {
    console.error("🚨 예약 목록 조회 실패:", error);
  } finally {
    loading.value = false;
  }
};

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/");
};

// ✅ 페이지 로딩 시 예약 목록 가져오기
onMounted(fetchReservations);
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

/* ✅ 데이터 없음 */
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
