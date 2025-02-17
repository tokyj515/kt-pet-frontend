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

          <!-- ✅ 병합된 예약 시간 표시 -->
          <BaseChip
              v-if="mergedCareTimes(reservation.sitterCareTimeDtos).length"
              :chips="mergedCareTimes(reservation.sitterCareTimeDtos)"
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

const mergedCareTimes = (careTimes) => {
  if (!careTimes || careTimes.length === 0) return [];

  // ✅ 요일별 그룹화
  const groupedByDay = {};
  careTimes.forEach(({ day, startTime, endTime }) => {
    if (!groupedByDay[day]) groupedByDay[day] = [];
    groupedByDay[day].push({
      startTime: parseInt(startTime.replace("시", ""), 10),
      endTime: parseInt(endTime.replace("시", ""), 10),
    });
  });

  const merged = [];

  // ✅ 그룹별 시간 병합
  Object.entries(groupedByDay).forEach(([day, times]) => {
    // 🟢 시간 순으로 정렬
    times.sort((a, b) => a.startTime - b.startTime);

    let mergedStart = times[0].startTime;
    let mergedEnd = times[0].endTime;

    for (let i = 1; i < times.length; i++) {
      const currentStart = times[i].startTime;
      const currentEnd = times[i].endTime;

      if (currentStart === mergedEnd + 1) {
        // 🔹 연속된 시간이라면 병합
        mergedEnd = currentEnd;
      } else {
        // 🔹 병합된 결과 추가 후 새로운 블록 시작
        merged.push(`${day} ${mergedStart}시~${mergedEnd}시`);
        mergedStart = currentStart;
        mergedEnd = currentEnd;
      }
    }
    // 마지막 병합된 시간 추가
    merged.push(`${day} ${mergedStart}시~${mergedEnd}시`);
  });

  return merged;
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


/* ✅ 데이터 없음 */
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>
