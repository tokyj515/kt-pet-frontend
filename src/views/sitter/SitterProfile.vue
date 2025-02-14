<template>
  <div class="container">
    <h2>시터 프로필</h2>

    <!-- ✅ 데이터 로딩 중 -->
    <div v-if="loading" class="loading">
      <p>로딩 중...</p>
    </div>

    <template v-else-if="profile">
      <!-- 기본 정보 섹션 -->
      <div class="section">
        <h3>기본 정보</h3>
        <div class="profile-row">
          <span class="label">이름</span>
          <span class="value">{{ profile.name || '-' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">이메일</span>
          <span class="value">{{ profile.email || '-' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">전화번호</span>
          <span class="value">{{ profile.phone || '미등록' }}</span>
        </div>
      </div>

      <!-- 시터 정보 섹션 -->
      <div class="section">
        <h3>시터 정보</h3>
        <div class="profile-row">
          <span class="label">활동 지역</span>
          <span class="value">{{ profile.location || '-' }}</span>
        </div>
        <div class="profile-row">
          <span class="label">시간당 요금</span>
          <span class="value">{{ profile.charge ? `${profile.charge}원` : '-' }}</span>
        </div>
      </div>

      <!-- 돌봄 가능 동물 섹션 -->
      <div class="section">
        <h3>돌봄 가능 동물</h3>
        <div class="chips-container">
          <span v-for="(pet, index) in validCarePetList" 
                :key="index" 
                class="chip">
            {{ pet.petType }}
          </span>
        </div>
      </div>

      <!-- 돌봄 가능 시간 섹션 -->
      <div class="section">
        <h3>돌봄 가능 시간</h3>
        <div class="time-slots">
          <div v-for="(time, index) in validCareTimeList" 
               :key="index" 
               class="time-slot">
            <span class="day">{{ time.day }}</span>
            <span class="time">{{ formatTime(time.startTime) }} - {{ formatTime(time.endTime) }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- ✅ 데이터가 없는 경우 -->
    <div v-else class="no-data">
      <p>프로필 정보가 없습니다.</p>
    </div>

    <!-- ✅ 뒤로가기 버튼 -->
    <!-- <div class="back-button-container">
      <button class="back-button" @click="goToMain">
        <i class="fa-solid fa-arrow-left"></i> 메인으로
      </button>
    </div> -->
    <button @click="goBack" class="btn btn-gray">뒤로 가기</button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();
const profile = ref({});
const loading = ref(true);

const fetchProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:8080/sitter/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    // API 응답에서 data 객체 추출
    profile.value = response.data.data;
  } catch (error) {
    console.error("🚨 프로필 불러오기 실패:", error);
    alert(error.response?.data?.message || "프로필을 불러오지 못했습니다.");
  } finally {
    loading.value = false;
  }
};

// 시간 포맷 함수 추가
const formatTime = (time) => {
  if (!time || time === 'string') return '';
  return time;
};

// 유효한 시간 데이터만 필터링하는 computed 속성
const validCareTimeList = computed(() => {
  return profile.value?.careTimeList?.filter(time => 
    time.day !== 'string' && 
    time.startTime !== 'string' && 
    time.endTime !== 'string'
  ) || [];
});

// 유효한 반려동물 데이터만 필터링하는 computed 속성
const validCarePetList = computed(() => {
  return profile.value?.carePetList?.filter(pet => 
    pet.petType !== 'string'
  ) || [];
});

// 메인 페이지로 이동하는 함수
const goBack = () => {
  router.push('/');
};

// 컴포넌트 마운트 시 API 호출
onMounted(fetchProfile);
</script>

<style scoped>
.section {
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  max-width: 400px;  /* 섹션 너비 제한 */
  margin-left: auto; /* 섹션 중앙 정렬 */
  margin-right: auto;
}

.section:last-child {
  margin-bottom: 0;  /* 마지막 섹션은 아래 마진 제거 */
}

h3 {
  color: #2c3e50;
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #007AFF;
  display: inline-block;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  font-size: 16px;
}

.label {
  color: #666;
  font-weight: 500;
}

.value {
  color: #2c3e50;
  font-weight: 500;
}

.chips-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  background: #007AFF;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
}

.time-slots {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.time-slot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.day {
  font-weight: 600;
  color: #2c3e50;
}

.time {
  color: #666;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #666;
}

@media (max-width: 480px) {
  .container {
    margin: 20px auto;
  }
  
  .profile-row {
    flex-direction: column;
    gap: 4px;
  }
  
  .time-slot {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
