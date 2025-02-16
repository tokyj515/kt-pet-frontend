<template>
  <div class="day-time-container">
    <label v-if="label" class="day-time-label">{{ label }}</label>

    <div class="day-buttons">
      <button
          v-for="(time, index) in modelValue"
          :key="index"
          :class="['day-btn', time.startTime ? 'active' : '']"
          @click="openModal(index)"
      >
        {{ time.day }}
      </button>
    </div>

    <div class="selected-times">
      <div v-for="(time, index) in modelValue.filter(t => t.startTime && t.endTime)" :key="index" class="time-display">
        <span>{{ time.day }}: {{ time.startTime }} - {{ time.endTime }}</span>
        <i class="fa-solid fa-pen edit-icon" @click="openModal(index)"></i>
      </div>
    </div>

    <!-- ✅ 시간 선택 모달 -->
    <BaseModal v-if="isModalOpen" @close="closeModal">
      <template #header>
        <h3>{{ modalData.day }} 시간 설정</h3>
      </template>
      <template #body>
        <BaseSelect v-model="modalData.startTime" label="시작 시간" :options="hours" />
        <BaseSelect v-model="modalData.endTime" label="종료 시간" :options="hours" />
      </template>
      <template #footer>
        <BaseButton @click="saveTime" :primary="4">저장</BaseButton>
        <BaseButton @click="closeModal" :primary="2">취소</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from "vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const props = defineProps({
  label: String,
  modelValue: Array, // [{ day: '월', startTime: '', endTime: '' }, ...]
});

const emit = defineEmits(["update:modelValue"]);

const isModalOpen = ref(false);
const modalData = ref({ day: "", startTime: "", endTime: "" });
let modalIndex = ref(null);

const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

// ✅ 모달 열기 (요일 클릭 시)
const openModal = (index) => {
  modalData.value = Object.assign({}, props.modelValue[index]); // ✅ 반응형 객체로 변환
  modalIndex.value = index;
  isModalOpen.value = true;
};

// ✅ 시간 저장
const saveTime = () => {
  if (modalIndex.value !== null) {
    const newValues = [...props.modelValue];
    newValues[modalIndex.value] = { ...modalData.value }; // ✅ 선택한 시간 업데이트
    emit("update:modelValue", newValues);
  }
  isModalOpen.value = false;
};

// ✅ 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};
</script>

<style scoped>
.day-time-container {
  width: 100%;
  text-align: left;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
}

.day-time-label {
  font-size: 14px;
  font-weight: bold;
  display: block;
  color: #492815;
  margin-bottom: 8px;
}

.day-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
}

.day-btn {
  padding: 8px 12px;
  border: 1px solid #ccc;
  background: #f0f0f0;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.day-btn.active {
  background: #FED7C3; /* 연한 피치 */
  border-color: #FED7C3;
  color: #492815;
}

.selected-times {
  margin-top: 10px;
}

.time-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.edit-icon {
  margin-left: 10px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color 0.3s;
}

.edit-icon:hover {
  color: #D43F00;
}
</style>
