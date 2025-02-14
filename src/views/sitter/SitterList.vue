<template>
  <div class="container">
    <h2>펫시터 목록</h2>

    <!-- 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <!-- 펫시터 목록 -->
    <div v-else class="sitter-list">
      <div v-for="sitter in sitters" :key="sitter.sitterId" class="card">
        <div class="card-header">
          <h3>{{ sitter.name }}</h3>
          <span class="location">{{ sitter.location }}</span>
        </div>

        <div class="card-body">
          <!-- 돌봄 가능 동물 -->
          <div class="care-pets">
            <h4>돌봄 가능 동물</h4>
            <div class="chips">
              <span v-for="(pet, index) in filterValidPets(sitter.carePetList)" 
                    :key="index" 
                    class="chip">
                {{ pet.petType }}
              </span>
            </div>
          </div>

          <!-- 돌봄 가능 시간 -->
          <div class="care-times">
            <h4>돌봄 가능 시간</h4>
            <div class="time-list">
              <div v-for="(time, index) in filterValidTimes(sitter.careTimeList)" 
                   :key="index" 
                   class="time-item">
                <span class="day">{{ time.day }}</span>
                <span>{{ time.startTime }} - {{ time.endTime }}</span>
              </div>
            </div>
          </div>

          <!-- 요금 정보 -->
          <div class="charge">
            <span class="label">시간당</span>
            <span class="value">{{ sitter.charge }}원</span>
          </div>
        </div>

        <!-- 카드 하단 버튼 -->
        <div class="card-footer">
          <button class="btn btn-primary" @click="viewDetail(sitter.sitterId)">
            상세 보기
          </button>
        </div>
      </div>
    </div>

    <!-- 데이터가 없는 경우 -->
    <div v-if="!loading && sitters.length === 0" class="no-data">
      <p>등록된 펫시터가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const sitters = ref([]);
const loading = ref(true);

// 펫시터 목록 조회
const fetchSitters = async () => {
  try {
    const token = localStorage.getItem('token');  // 토큰 가져오기
    const response = await axios.get('http://localhost:8080/sitter/profile/list', {
      headers: {
        'Authorization': `Bearer ${token}`  // Authorization 헤더 추가
      }
    });
    sitters.value = response.data.data;
  } catch (error) {
    console.error('펫시터 목록 조회 실패:', error);
    alert('펫시터 목록을 불러오는데 실패했습니다.');
  } finally {
    loading.value = false;
  }
};

// 유효한 돌봄 동물 필터링
const filterValidPets = (pets) => {
  return pets.filter(pet => pet.petType !== 'string');
};

// 유효한 돌봄 시간 필터링
const filterValidTimes = (times) => {
  return times.filter(time => 
    time.day !== 'string' && 
    time.startTime !== 'string' && 
    time.endTime !== 'string'
  );
};

// 상세 페이지로 이동
const viewDetail = (sitterId) => {
  router.push(`/sitter/profile/${sitterId}`);
};

onMounted(fetchSitters);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.sitter-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.2s;
  max-width: 70%;  /* 카드 최대 너비 제한 */
  margin: 0 auto;    /* 카드 중앙 정렬 */
  width: 100%;       /* 모바일에서 전체 너비 사용 */
}

.card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #2c3e50;
}

.location {
  background-color: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #666;
}

.card-body {
  padding: 0 10px;
}

.care-pets, .care-times {
  margin-bottom: 20px;
}

h4 {
  font-size: 1rem;
  color: #666;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

h4::before {
  content: "•";
  color: #007AFF;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: #007AFF;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
}

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

.charge {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
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

.card-footer {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  text-align: right;
}

.btn-primary {
  background-color: #007AFF;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  border: none;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.loading, .no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 480px) {
  .container {
    padding: 15px;
  }

  .card {
    padding: 16px;
    max-width: 100%;  /* 모바일에서는 컨테이너 전체 너비 사용 */
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
