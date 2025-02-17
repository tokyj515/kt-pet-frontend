<template>
  <div class="container">
    <h2>예약 정보 입력</h2>

    <!-- ✅ 펫 선택 -->
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

    <!-- ✅ 예약할 시간 선택 -->
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
                {{ formatTime(hour) }}
              </BaseButton>
            </td>
          </tr>
          </tbody>
        </table>
      </template>
    </BaseCard>

    <!-- ✅ 총 요금 표시 -->
    <div class="charge-info">
      <span>총 요금:</span>
      <strong>{{ totalCharge }} 원</strong>
    </div>

    <!-- ✅ 예약 버튼 -->
    <BaseButton @click="onPaymentAndReserve" :primary="4" class="reserve-btn">예약하기</BaseButton>
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

// ✅ 시간대를 개별 버튼으로 변환 (07:00 → 07시 형태)
const generateHourSlots = (timeSlots) => {
  const hours = new Set();
  timeSlots.forEach(slot => {
    const start = parseInt(slot.startTime.split(":")[0]);
    const end = parseInt(slot.endTime.split(":")[0]);
    for (let i = start; i <= end; i++) {
      hours.add(i); // ✅ 정수값만 저장하여 formatTime 적용
    }
  });
  return Array.from(hours).sort();
};

// ✅ 시간 포맷 변경 함수 (07시 형태)
const formatTime = (hour) => {
  return `${hour.toString().padStart(2, '0')}시`;
};

// ✅ 선택한 시간 토글
const toggleTimeSelection = (day, hour) => {
  const formattedHour = formatTime(hour); // ✅ 선택할 때도 포맷 적용
  const index = selectedTimes.value.findIndex(t => t.day === day && t.startTime === formattedHour);
  if (index === -1) {
    selectedTimes.value.push({ day, startTime: formattedHour, endTime: formattedHour });
  } else {
    selectedTimes.value.splice(index, 1);
  }
};

// ✅ 선택된 시간인지 확인
const isSelectedTime = (day, hour) => {
  return selectedTimes.value.some(t => t.day === day && t.startTime === formatTime(hour));
};

// ✅ 총 요금 계산
const totalCharge = computed(() => {
  return selectedTimes.value.length * (profile.value?.charge || 0);
});

// ✅ 결제 및 예약 진행 함수
const onPaymentAndReserve = () => {
  if (!selectedPetId.value) {
    alert("예약할 펫을 선택해주세요.");
    return;
  }
  if (selectedTimes.value.length === 0) {
    alert("예약할 시간을 선택해주세요.");
    return;
  }

  /* 1. 가맹점 식별하기 */
  const { IMP } = window;
  IMP.init('imp48126247'); // 고객사 식별 코드 (실제 코드 입력 필요)

  /* 2. 결제 데이터 정의하기 */
  const data = {
    pg: 'uplus', // PG사
    pay_method: 'card', // 결제수단
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
    amount: totalCharge.value, // 총 결제 금액 (totalCharge 사용)
    name: '펫시터 예약 결제', // 주문명
    buyer_name: localStorage.getItem("username") || "이름 없음", // 구매자 이름
    buyer_tel: "01012341234", // 구매자 전화번호 (실제 사용자 정보 필요)
    buyer_email: localStorage.getItem("email") || "이메일 없음", // 구매자 이메일
    buyer_addr: "주소 없음", // 주소 정보 필요 시 설정
    buyer_postcode: "00000" // 우편번호 정보 필요 시 설정
  };

  /* 3. 결제 창 호출 및 콜백 */
  IMP.request_pay(data, (response) => {
    const { success, merchant_uid, error_msg } = response;

    if (success) {
      alert("결제가 완료되었습니다.");
      console.log("✅ 결제 성공 응답:", response);

      // 결제 성공 후 예약 요청 진행
      reserveSitter(merchant_uid);
    } else {
      alert(`결제 실패: ${error_msg}`);
    }
  });
};

// ✅ 예약 요청 API 호출 (결제 성공 후 실행)
const reserveSitter = async (merchantUid) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post("http://localhost:8080/reservation/register", {
      sitterId: sitterId,
      petId: selectedPetId.value,
      careTimeDtoList: selectedTimes.value,
      totalCharge: totalCharge.value,
      paymentId: merchantUid, // 결제 성공 시 받은 merchant_uid 저장
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


// // ✅ 예약 요청 API 호출
// const reserveSitter = async () => {
//   if (!selectedPetId.value) {
//     alert("예약할 펫을 선택해주세요.");
//     return;
//   }
//   if (selectedTimes.value.length === 0) {
//     alert("예약할 시간을 선택해주세요.");
//     return;
//   }
//
//   try {
//     const token = localStorage.getItem("token");
//     const response = await axios.post("http://localhost:8080/reservation/register", {
//       sitterId: sitterId,
//       petId: selectedPetId.value,
//       careTimeDtoList: selectedTimes.value,
//       totalCharge: totalCharge.value,
//     }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//
//     if (response.data.code === 200) {
//       alert("예약이 완료되었습니다!");
//       router.push("/reservation/list");
//     } else {
//       alert(response.data.message || "예약에 실패했습니다.");
//     }
//   } catch (error) {
//     console.error("🚨 예약 요청 실패:", error);
//     alert("예약을 처리하는 중 오류가 발생했습니다.");
//   }
// };

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

.time-cell {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  padding: 5px 0;
}

.time-cell button {
  background: #f9f9f9;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #ddd;
  cursor: pointer;
  transition: all 0.2s;
  max-width: 60px;
  font-size: 14px;
  font-weight: bold;
  color: #555555;
}

.time-cell button:hover {
  background: #ffddcc;
}

.time-cell button.selected {
  background: #ff8a65;
  color: white;
}

.charge-info {
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 15px;
}

.reserve-btn {
  margin-top: 20px;
  width: 100%;
}
</style>
