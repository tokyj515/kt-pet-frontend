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

    <!-- ✅ 돌봄 가능 동물 선택 -->
    <div class="input-group">
      <label>돌봄 가능 동물</label>
      <div class="pet-selection">
        <select v-model="selectedPet" class="input-field full-width" @change="addPet">
          <option value="" disabled>동물을 선택하세요</option>
          <option v-for="pet in petTypes" :key="pet" :value="pet">{{ pet }}</option>
        </select>
        <div class="chip-container">
          <span v-for="(pet, index) in sitterData.carePetList" :key="index" class="chip">
            {{ pet }}
            <i class="fa-solid fa-xmark" @click="removePet(index)"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ 돌봄 가능 시간 설정 -->
    <div class="input-group">
      <label>돌봄 가능 시간</label>
      <div class="care-time-container">
        <div class="day-buttons">
          <button v-for="(time, index) in sitterData.careTimeList" :key="index"
                  :class="['day-btn', time.startTime ? 'active' : '']"
                  @click="openModal(time, index)">
            {{ time.day }}
          </button>
        </div>
        <div class="time-chips">
          <span v-for="(time, index) in sitterData.careTimeList.filter(t => t.startTime && t.endTime)"
               :key="index" 
               class="time-chip"
               @click="openModal(time, index)">
            {{ time.day }} {{ time.startTime }}~{{ time.endTime }}
            <i class="fa-solid fa-pen"></i>
          </span>
        </div>
      </div>
    </div>

    <!-- ✅ 모달 시간 선택 -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h3>{{ modalData.day }} 시간 설정</h3>
        <div class="time-selectors">
          <label>시작 시간</label>
          <select v-model="modalData.startTime" class="input-field">
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
          <label>종료 시간</label>
          <select v-model="modalData.endTime" class="input-field">
            <option v-for="hour in hours" :key="hour" :value="hour">{{ hour }}</option>
          </select>
        </div>
        <button class="btn btn-mint" @click="saveTime">저장</button>
        <button class="btn btn-gray" @click="closeModal">취소</button>
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

export default {
  setup() {
    const locations = ["서울", "경기", "부산", "대구", "광주", "대전", "울산", "제주"];
    const petTypes = ["강아지", "고양이", "토끼", "새", "기타"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    const sitterData = ref({
      location: "",
      charge: "",
      carePetList: [],
      careTimeList: ["월", "화", "수", "목", "금", "토", "일"].map(day => ({
        day,
        startTime: "",
        endTime: ""
      })),
    });

    const selectedPet = ref("");
    const isModalOpen = ref(false);
    const modalData = ref({ day: "", startTime: "", endTime: "" });
    let modalIndex = ref(null);

    const addPet = () => {
      if (selectedPet.value && !sitterData.value.carePetList.includes(selectedPet.value)) {
        sitterData.value.carePetList.push(selectedPet.value);
      }
      selectedPet.value = "";
    };

    const removePet = (index) => {
      sitterData.value.carePetList.splice(index, 1);
    };

    const openModal = (time, index) => {
      modalData.value = { ...time };
      modalIndex.value = index;
      isModalOpen.value = true;
    };

    const saveTime = () => {
      sitterData.value.careTimeList[modalIndex.value] = { ...modalData.value };
      isModalOpen.value = false;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    return {
      sitterData,
      locations,
      petTypes,
      selectedPet,
      addPet,
      removePet,
      hours,
      isModalOpen,
      modalData,
      openModal,
      saveTime,
      closeModal,
    };
  },
};
</script>

<style scoped>
.input-group {
  display: flex;
  flex-direction: row;
  gap: 10px;
}

.day-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.day-btn {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
}

.day-btn.active {
  background: #8DA9FF;  /* 파란색으로 변경 */
  border-color: #8DA9FF;
  color: white;
}

.selected-times {
  margin-top: 10px;
}

.time-display {
  cursor: pointer;
  padding: 5px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  border-radius: 5px;
}

.pet-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.pet-selection select {
  width: 100%;
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 0;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  background-color: #FFB6C1;  /* 연핑크색 */
  color: white;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
}

.chip i {
  margin-left: 6px;
  cursor: pointer;
  font-size: 12px;
}

.chip i:hover {
  opacity: 0.7;
}

.care-time-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.time-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.time-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-chip:hover {
  background-color: #eeeeee;
}

.time-chip i {
  margin-left: 6px;
  font-size: 12px;
  color: #666;
}
</style>
