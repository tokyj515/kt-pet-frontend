<template>
  <div class="container">
    <h2>예약 목록</h2>

    <!-- ✅ 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 예약 목록 -->
    <div v-else-if="reservations.length">
      <p>📢 예약 데이터 개수: {{ reservations.length }}</p>
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
            { label: isSitter ? '예약자' : '펫시터', value: isSitter ? reservation.user?.name || '알 수 없음' : reservation.sitter?.name || '알 수 없음' },
            { label: '총 요금', value: reservation.totalCharge ? reservation.totalCharge + '원' : '정보 없음' }
          ]" />

          <!-- ✅ 예약한 시간 표시 (sitterCareTimeDtos가 null일 경우 빈 배열 처리) -->
          <BaseChip
              v-if="reservation.sitterCareTimeDtos?.length"
              :chips="reservation.sitterCareTimeDtos.map(time => `${time.day} ${time.startTime}~${time.endTime}`)"
          />

          <!-- ✅ 펫시터일 경우 승인 버튼 활성화 -->
          <BaseButton
              v-if="isSitter && (reservation.confirm === null || reservation.confirm === 0)"
              @click="confirmReservation(reservation.reservationId)"
              :primary="4"
          >
            승인하기
          </BaseButton>
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
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseChip from "@/components/base/BaseChip.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseGrid from "@/components/base/BaseGrid.vue";

const router = useRouter();
const reservations = ref([]);
const loading = ref(true);
const isSitter = ref(false); // ✅ 현재 로그인한 유저가 펫시터인지 여부

// ✅ 예약 상태 변환 함수
const getStatusLabel = (status) => {
  if (status === null) return "승인 대기"; // ✅ null인 경우 기본 값 설정
  return status === 0 ? "승인 대기" : "승인 완료";
};

// ✅ 현재 로그인한 유저의 역할 가져오기
const fetchUserRole = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/user/role", {
      headers: { Authorization: `Bearer ${token}` },
    });

    isSitter.value = response.data.data === "SITTER"; // 펫시터 여부 확인
    console.log("🟢 현재 사용자 역할:", response.data.data);
  } catch (error) {
    console.error("🚨 사용자 역할 조회 실패:", error);
  }
};

// ✅ 예약 목록 가져오기 (유저 타입에 따라 API 변경)
const fetchReservations = async () => {
  try {
    loading.value = true;
    const token = localStorage.getItem("token");
    const apiUrl = isSitter.value
        ? "http://localhost:8080/reservation/sitter/list"
        : "http://localhost:8080/reservation/user/list";

    const response = await axios.get(apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📌 API 응답 데이터:", response.data);
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

// ✅ 예약 승인 처리 (펫시터만 가능)
const confirmReservation = async (reservationId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(`http://localhost:8080/reservation/${reservationId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("✅ 승인 응답:", response.data);
    alert("예약이 승인되었습니다.");
    fetchReservations(); // ✅ 승인 후 목록 갱신
  } catch (error) {
    console.error("🚨 예약 승인 실패:", error);
    alert("예약 승인에 실패했습니다.");
  }
};

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/");
};

// ✅ 페이지 로딩 시 유저 역할 & 예약 목록 가져오기
onMounted(async () => {
  await fetchUserRole();
  await fetchReservations();
});
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
