<template>
  <div class="container">
    <h2>펫시터 목록</h2>

    <!-- ✅ 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 펫시터 목록 -->
    <div v-else class="sitter-list">
      <BaseCard
          v-for="sitter in sitters"
          :key="sitter.sitterId"
          class="clickable-card"
          @click="viewDetail(sitter.sitterId)"
      >
        <template #header>
          <div class="card-header">
            <h3 class="sitter-name">{{ sitter.name }}</h3>
            <span class="location">{{ sitter.location || "위치 정보 없음" }}</span>
          </div>
        </template>

        <template #body>
          <!-- 돌봄 가능 동물 -->
          <BaseChip
              :chips="filterValidPets(sitter.carePetList).map(pet => pet.petType)"
              label="돌봄 가능 동물"
          />

          <!-- 돌봄 가능 시간 -->
          <BaseChip
              :chips="filterValidTimes(sitter.careTimeList).map(time => `${time.day}: ${time.startTime} - ${time.endTime}`)"
              label="돌봄 가능 시간"
          />

          <!-- ✅ 요금 정보 (서비스 컬러 적용) -->
          <div class="charge">
            <span class="label">시간당 요금</span>
            <span class="value">{{ sitter.charge ? `${sitter.charge}원` : "미등록" }}</span>
          </div>
        </template>
      </BaseCard>
    </div>

    <!-- ✅ 데이터가 없는 경우 -->
    <div v-if="!loading && sitters.length === 0" class="no-data">
      <p>등록된 펫시터가 없습니다.</p>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseChip from "@/components/base/BaseChip.vue";

const router = useRouter();
const sitters = ref([]);
const loading = ref(true);

// ✅ 펫시터 목록 조회
const fetchSitters = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/sitter/profile/list", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    sitters.value = response.data.data;
  } catch (error) {
    console.error("🚨 펫시터 목록 조회 실패:", error);
    alert("펫시터 목록을 불러오는데 실패했습니다.");
  } finally {
    loading.value = false;
  }
};

// ✅ 유효한 돌봄 동물 필터링
const filterValidPets = (pets) => {
  return pets.filter(pet => pet.petType !== "string");
};

// ✅ 유효한 돌봄 시간 필터링
const filterValidTimes = (times) => {
  return times.filter(time => time.day !== "string" && time.startTime !== "string" && time.endTime !== "string");
};

// ✅ 상세 페이지로 이동
const viewDetail = (sitterId) => {
  router.push(`/sitter/profile/${sitterId}`);
};

onMounted(fetchSitters);
</script>

<style scoped>
/* ✅ 시터 리스트 스타일 */
.sitter-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ✅ 카드 전체 클릭 가능 */
.clickable-card {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.clickable-card:hover {
  transform: translateY(-3px);
}

/* ✅ 카드 헤더 스타일 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

/* ✅ 시터 이름 (왼쪽 정렬 유지) */
.sitter-name {
  flex-grow: 1;  /* 왼쪽에 고정되도록 설정 */
  margin: 0;
  font-size: 1.2rem;
  color: #492815; /* 딥 브라운 */
}

/* ✅ 위치 정보 (오른쪽 끝으로 이동) */
.location {
  background-color: #FED7C3; /* 연한 피치 */
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #492815;
  white-space: nowrap;  /* 줄 바꿈 방지 */
}

/* ✅ 요금 정보 (서비스 컬러 적용) */
.charge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #FED7C3;
}

/* ✅ 요금 라벨 */
.charge .label {
  color: #492815;  /* 딥 브라운 */
}

/* ✅ 요금 값 */
.charge .value {
  font-weight: bold;
  color: #492815;  /* 포인트 컬러 */
}

/* ✅ 데이터 없음 */
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}


</style>

