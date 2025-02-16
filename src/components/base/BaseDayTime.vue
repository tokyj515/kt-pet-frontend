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

    <!-- ✅ BaseModal 적용 -->
    <BaseModal :isOpen="isModalOpen" :title="`${modalData.day} 시간 설정`" @close="closeModal">
      <BaseSelect v-model="modalData.startTime" label="시작 시간" :options="hours" />
      <BaseSelect v-model="modalData.endTime" label="종료 시간" :options="hours" />
      <BaseButton @click="saveTime" class="w-full" :primary="4">저장</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const props = defineProps({
  label: String,
  modelValue: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const isModalOpen = ref(false);
const modalData = ref({ day: "", startTime: "", endTime: "" });
const modalIndex = ref(null);

// ✅ 24시간 선택 가능하도록 변경
const hours = Array.from({ length: 24 }, (_, i) => ({ label: `${i}:00`, value: `${i}:00` }));

// ✅ 모달 열기 (요일 클릭 시)
const openModal = (index) => {
  if (props.modelValue[index]) {
    modalData.value = { ...props.modelValue[index] };
    modalIndex.value = index;
    isModalOpen.value = true;
  }
};

// ✅ 시간 저장
const saveTime = () => {
  if (modalIndex.value !== null) {
    const newValues = [...props.modelValue];
    newValues[modalIndex.value] = { ...modalData.value };

    console.log("🚀 업데이트된 modelValue:", newValues); // 디버깅 로그
    emit("update:modelValue", newValues);
  }
  isModalOpen.value = false;
};

// ✅ 모달 닫기
const closeModal = () => {
  isModalOpen.value = false;
};

// ✅ modelValue 변경 감지
watch(() => props.modelValue, (newVal) => {
  if (modalIndex.value !== null) {
    modalData.value = { ...newVal[modalIndex.value] };
  }
}, { deep: true });

</script>

<style scoped>
.day-time-container {
  width: 100%;
  text-align: left;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}

.day-time-label {
  font-size: 14px;
  font-weight: bold;
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
  border-radius: 5px;
  cursor: pointer;
}

.day-btn.active {
  background: #FED7C3;
}

.edit-icon {
  cursor: pointer;
}
</style>
