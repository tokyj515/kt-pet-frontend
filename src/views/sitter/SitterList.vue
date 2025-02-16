<template>
  <div class="container">
    <h2>펫시터 목록</h2>

    <!-- ✅ 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- ✅ 펫시터 목록 -->
    <div v-else class="sitter-list">
      <BaseCard v-for="sitter in sitters" :key="sitter.sitterId">
        <template #header>
          <div class="card-header">
            <h3>{{ sitter.name }}</h3>
            <span class="location">{{ sitter.location || "위치 정보 없음" }}</span>
          </div>
        </template>

        <template #body>
          <!-- 돌봄 가능 동물 -->
          <div class="care-pets">
            <h4>돌봄 가능 동물</h4>
            <BaseChip :chips="filterValidPets(sitter.carePetList).map(pet => pet.petType)" />
          </div>


          <!-- 돌봄 가능 시간 -->
          <div class="care-times">
            <h4>돌봄 가능 시간</h4>
            <div class="time-list">
              <div v-for="(time, index) in filterValidTimes(sitter.careTimeList)" :key="index" class="time-item">
                <span class="day">{{ time.day }}</span>
                <span>{{ time.startTime }} - {{ time.endTime }}</span>
              </div>
            </div>
          </div>

          <!-- 요금 정보 -->
          <div class="charge">
            <span class="label">시간당</span>
            <span class="value">{{ sitter.charge ? `${sitter.charge}원` : "미등록" }}</span>
          </div>
        </template>

        <template #footer>
          <BaseButton @click="viewDetail(sitter.sitterId)" :primary="4">상세 보기</BaseButton>
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

/* ✅ 카드 헤더 스타일 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: #2c3e50;
}

.location {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

/* ✅ 돌봄 가능 시간 */
.time-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.time-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  font-size: 0.9rem;
}

.day {
  font-weight: 600;
  color: #2c3e50;
}

/* ✅ 요금 정보 */
.charge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.charge .label {
  color: #666;
  font-size: 0.95rem;
}

.charge .value {
  font-weight: 600;
  color: #007AFF;
  font-size: 1.1rem;
}

/* ✅ 데이터 없음 */
.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  .time-item {
    flex-direction: column;
    gap: 4px;
  }

  .charge {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
