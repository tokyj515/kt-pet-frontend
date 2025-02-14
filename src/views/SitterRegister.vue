<template>
  <div class="container">
    <h2>펫시터 등록</h2>

    <!-- ✅ 위치 선택 -->
    <div class="input-group">
      <label>위치</label>
      <select v-model="sitterData.location" class="input-field">
        <option value="" disabled>지역을 선택하세요</option>
        <option v-for="location in locations" :key="location" :value="location">
          {{ location }}
        </option>
      </select>
    </div>

    <!-- ✅ 요금 입력 -->
    <div class="input-group">
      <label>요금</label>
      <input v-model="sitterData.charge" type="text" placeholder="요금을 입력하세요" class="input-field" />
    </div>

    <!-- ✅ 돌봄 가능 펫 종류 -->
    <div class="input-group">
      <label>돌봄 종류</label>
      <div class="flex-container">
        <select v-model="selectedPetType" class="input-field small-input">
          <option value="" disabled>펫 종류를 선택하세요</option>
          <option v-for="pet in petTypes" :key="pet" :value="pet">{{ pet }}</option>
        </select>
        <button @click="addPetType" class="btn btn-gray small-btn">추가</button>
      </div>
    </div>

    <!-- ✅ 선택된 펫 리스트 -->
    <div class="input-group">
      <label>선택된 펫</label>
      <div class="selected-list">
        <span v-for="(pet, index) in sitterData.carePetList" :key="index" class="selected-item">
          {{ pet.petType }}
          <i class="fa-solid fa-xmark" @click="removePetType(index)"></i>
        </span>
      </div>
    </div>

    <!-- ✅ 돌봄 가능 시간 설정 -->
    <div class="input-group time-container">
      <div class="time-header">
        <label>돌봄 가능 시간</label>
        <div class="all-select">
          <input type="checkbox" v-model="allDaysSelected" @change="toggleAllDays" />
          <span>전체 선택</span>
        </div>
      </div>

      <div class="time-list">
        <div v-for="(day, index) in days" :key="index" class="time-row">
          <!-- 요일 & 체크박스 -->
          <div class="day-checkbox">
            <input type="checkbox" v-model="selectedDays[index]" @change="updateTimeSelection(index)" />
            <span class="day-label">{{ day }}</span>
          </div>

          <!-- 시간 선택 (요일 체크 시 활성화) -->
          <div class="time-inputs">
            <select v-model="sitterData.careTimeList[index].startTime" class="input-field time-select"
                    :disabled="!selectedDays[index]">
              <option disabled value="">시작 시간</option>
              <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
            <span>~</span>
            <select v-model="sitterData.careTimeList[index].endTime" class="input-field time-select"
                    :disabled="!selectedDays[index]">
              <option disabled value="">종료 시간</option>
              <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 등록 버튼 -->
    <div class="button-group">
      <button @click="registerSitter" class="btn btn-blue">시터 등록하기</button>
    </div>
  </div>
</template>


<script>
import { ref } from "vue";
import axios from "@/api/axios.js";

export default {
  setup() {
    const locations = ["서울", "경기", "부산", "대구", "광주", "대전", "울산", "제주"];
    const petTypes = ["강아지", "고양이", "토끼", "새", "기타"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const selectedPetType = ref("");
    const selectedDays = ref(new Array(7).fill(false));
    const allDaysSelected = ref(false);

    const sitterData = ref({
      location: "",
      charge: "",
      carePetList: [],
      careTimeList: ["월", "화", "수", "목", "금", "토", "일"].map(day => ({
        day,
        startTime: "",
        endTime: "",
      })),
    });

    // ✅ 펫 타입 추가
    const addPetType = () => {
      if (selectedPetType.value && !sitterData.value.carePetList.some(p => p.petType === selectedPetType.value)) {
        sitterData.value.carePetList.push({ petType: selectedPetType.value });
        selectedPetType.value = "";
      }
    };

    // ✅ 펫 타입 제거
    const removePetType = (index) => {
      sitterData.value.carePetList.splice(index, 1);
    };

    // ✅ 전체 요일 선택/해제
    const toggleAllDays = () => {
      allDaysSelected.value = !allDaysSelected.value;
      selectedDays.value = selectedDays.value.map(() => allDaysSelected.value);
    };

    // ✅ 특정 요일 선택 시 업데이트
    const updateTimeSelection = (index) => {
      if (!selectedDays.value[index]) {
        sitterData.value.careTimeList[index].startTime = "";
        sitterData.value.careTimeList[index].endTime = "";
      }
    };

    // ✅ 펫시터 등록
    const registerSitter = async () => {
      try {
        const token = localStorage.getItem("token");

        // 사용자가 체크한 요일만 필터링
        const filteredTimeList = sitterData.value.careTimeList.filter((_, i) => selectedDays.value[i]);

        const requestData = {
          ...sitterData.value,
          careTimeList: filteredTimeList,
        };

        await axios.post("/sitter/register", requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("펫시터 등록이 완료되었습니다!");
      } catch (error) {
        console.error("❌ 등록 실패:", error.response?.data || error.message);
        alert("펫시터 등록에 실패했습니다.");
      }
    };

    // ✅ 폼 초기화
    const resetForm = () => {
      sitterData.value = {
        location: "",
        charge: "",
        carePetList: [],
        careTimeList: sitterData.value.careTimeList.map(t => ({ ...t, startTime: "", endTime: "" })),
      };
      selectedDays.value.fill(false);
      allDaysSelected.value = false;
    };

    return {
      sitterData,
      locations,
      petTypes,
      selectedPetType,
      selectedDays,
      allDaysSelected,
      hours,
      addPetType,
      removePetType,
      toggleAllDays,
      updateTimeSelection,
      registerSitter,
      resetForm,
    };
  },
};
</script>

<style scoped>
/* ✅ 전체 컨테이너 스타일 */
.container {
  max-width: 500px;
  margin: auto;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* ✅ 입력 그룹 정렬 */
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.input-group label {
  font-weight: bold;
  text-align: left;
  width: 100px;
}

/* ✅ 가로 정렬 */
.flex-container {
  display: flex;
  gap: 10px;
}

/* ✅ 작은 입력 필드 */
.small-input {
  width: 200px;
}

/* ✅ 작은 버튼 */
.small-btn {
  padding: 8px 15px;
}

/* ✅ 선택된 펫 리스트 */
.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 10px;
}

.selected-item {
  background: #40e0d0;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* ✅ 돌봄 가능 시간 컨테이너 */
.time-container {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

/* ✅ 전체 선택 헤더 */
.time-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
}

/* ✅ 체크박스 & 요일 */
.day-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ✅ 시간 선택 행 */
.time-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

/* ✅ 시간 선택 입력 필드 */
.time-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-select {
  width: 45%;
  padding: 5px;
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
