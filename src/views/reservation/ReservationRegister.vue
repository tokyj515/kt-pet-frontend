<template>
  <div class="container">
    <h2>예약 정보 입력</h2>

    <BaseCard>
      <template #header>
        <h3>예약할 펫 선택</h3>
      </template>
      <template #body>
        <BaseSelect
            v-model="selectedPetId"
            label="예약할 펫"
            :options="petOptions"
        />
      </template>
    </BaseCard>

    <BaseCard>
      <template #header>
        <h3>예약할 시간 선택</h3>
      </template>
      <template #body>
        <table class="time-table">
          <thead>
          <tr>
            <th>요일</th>
            <th>시간</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(timeSlots, day) in groupedCareTimes" :key="day">
            <td class="day-cell">{{ day }}</td>
            <td class="time-cell">
              <BaseButton
                  v-for="hour in generateHourSlots(timeSlots)"
                  :key="hour"
                  :class="{ selected: isSelectedTime(day, hour) }"
                  @click="toggleTimeSelection(day, hour)"
              >
                {{ hour }}
              </BaseButton>
            </td>
          </tr>
          </tbody>
        </table>
      </template>
    </BaseCard>

    <div class="charge-info">
      <span>총 요금:</span>
      <strong>{{ totalCharge }} 원</strong>
    </div>

    <BaseButton @click="reserveSitter" :primary="4" class="reserve-btn">예약하기</BaseButton>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import BaseCard from "@/components/base/BaseCard.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";

const router = useRouter();
const route = useRoute();
const profile = ref(null);
const pets = ref([]);
const selectedPetId = ref(null);
const selectedTimes = ref([]);

// ✅ 시터 ID 가져오기
const sitterId = route.params.sitterId;

// ✅ 프로필 데이터 가져오기
const fetchProfile = async () => {
  if (!sitterId) {
    alert("잘못된 접근입니다.");
    router.push("/sitter-list");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:8080/sitter/profile/${sitterId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    profile.value = response.data.data;
  } catch (error) {
    console.error("🚨 프로필 불러오기 실패:", error);
    alert("프로필을 불러오지 못했습니다.");
    router.push("/sitter-list");
  }
};

// ✅ 사용자의 펫 목록 가져오기
const fetchPets = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8080/pet/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    pets.value = response.data.data || [];
  } catch (error) {
    console.error("🚨 펫 목록 불러오기 실패:", error);
  }
};

// ✅ 펫 선택 옵션
const petOptions = computed(() => {
  return pets.value.map(pet => ({
    label: `${pet.name} [${pet.petType}]`,
    value: pet.petId,
  }));
});

// ✅ 요일별 예약 가능 시간 그룹화
const groupedCareTimes = computed(() => {
  if (!profile.value?.careTimeList) return {};

  return profile.value.careTimeList
      .filter(time => time.day !== "string" && time.startTime !== "string" && time.endTime !== "string")
      .reduce((acc, time) => {
        if (!acc[time.day]) acc[time.day] = [];
        acc[time.day].push(time);
        return acc;
      }, {});
});

// ✅ 시간대를 개별 버튼으로 변환 (07:00 ~ 20:00 → 07:00, 08:00, ..., 20:00)
const generateHourSlots = (timeSlots) => {
  const hours = new Set();
  timeSlots.forEach(slot => {
    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);
    for (let i = start; i <= end; i++) {
      hours.add(`${i.toString().padStart(2, '0')}:00`);
    }
  });
  return Array.from(hours).sort();
};

// ✅ 선택한 시간 토글
const toggleTimeSelection = (day, hour) => {
  const index = selectedTimes.value.findIndex(t => t.day === day && t.startTime === hour);
  if (index === -1) {
    selectedTimes.value.push({ day, startTime: hour, endTime: hour });
  } else {
    selectedTimes.value.splice(index, 1);
  }
};

// ✅ 선택된 시간인지 확인
const isSelectedTime = (day, hour) => {
  return selectedTimes.value.some(t => t.day === day && t.startTime === hour);
};

// ✅ 총 요금 계산
const totalCharge = computed(() => {
  return selectedTimes.value.length * (profile.value?.charge || 0);
});

// ✅ 예약 요청 API 호출
const reserveSitter = async () => {
  if (!selectedPetId.value) {
    alert("예약할 펫을 선택해주세요.");
    return;
  }
  if (selectedTimes.value.length === 0) {
    alert("예약할 시간을 선택해주세요.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("http://localhost:8080/reservation/register", {
      sitterId: sitterId,
      petId: selectedPetId.value,
      careTimeDtoList: selectedTimes.value,
      totalCharge: totalCharge.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      alert("예약이 완료되었습니다!");
      router.push("/reservation/list");
    } else {
      alert(response.data.message || "예약에 실패했습니다.");
    }
  } catch (error) {
    console.error("🚨 예약 요청 실패:", error);
    alert("예약을 처리하는 중 오류가 발생했습니다.");
  }
};

// ✅ 페이지 로딩 시 데이터 가져오기
onMounted(async () => {
  await fetchProfile();
  await fetchPets();
});
</script>

<style scoped>
/* ✅ 전체 컨테이너 */
.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

/* ✅ 테이블 스타일 */
.time-table {
  width: 100%;
  border-collapse: collapse;
}

.time-table th, .time-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: center;
}

.day-cell {
  font-weight: bold;
  background-color: #FFE0B2;
}

/* ✅ 시간 선택 버튼 */
.time-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.time-cell button {
  background: #f3f3f3;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.time-cell button:hover {
  background: #ffddcc;
}

.time-cell button.selected {
  background: #ff8a65;
  color: white;
}

/* ✅ 요금 정보 */
.charge-info {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 15px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;
}

/* ✅ 예약 버튼 */
.reserve-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
