<template>
  <div class="multi-select">
    <label v-if="label" class="label">{{ label }}</label>

    <!-- ✅ 선택된 값 표시 -->
    <div class="selected-values">
      <span
          v-for="(selected, index) in selectedValues"
          :key="index"
          class="selected-item"
      >
        {{ selected.label }}
        <button @click="removeItem(index)" class="remove-btn">✕</button>
      </span>
    </div>

    <!-- ✅ 드롭다운 버튼 -->
    <div class="dropdown">
      <button class="dropdown-btn" @click="toggleDropdown">
        {{ selectedValues.length > 0 ? "선택 변경" : "선택하기" }}
      </button>

      <div v-if="isOpen" class="dropdown-content">
        <div
            v-for="option in options"
            :key="option.value"
            class="dropdown-item"
            :class="{ selected: isSelected(option) }"
            @click="toggleSelect(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: Array, // ✅ v-model 바인딩 (선택된 값들)
  options: Array, // ✅ 옵션 리스트 [{label: "", value: ""}]
  label: String, // ✅ 라벨 텍스트
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false); // ✅ 드롭다운 상태

// ✅ 선택된 값
const selectedValues = computed(() => props.modelValue || []);

// ✅ 선택 여부 확인
const isSelected = (option) => {
  return selectedValues.value.some((item) => item.value === option.value);
};

// ✅ 선택/제거 토글
const toggleSelect = (option) => {
  let newValue = [...selectedValues.value];
  if (isSelected(option)) {
    newValue = newValue.filter((item) => item.value !== option.value);
  } else {
    newValue.push(option);
  }
  emit("update:modelValue", newValue);
};

// ✅ 선택된 항목 제거
const removeItem = (index) => {
  let newValue = [...selectedValues.value];
  newValue.splice(index, 1);
  emit("update:modelValue", newValue);
};

// ✅ 드롭다운 열기/닫기
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.multi-select {
  position: relative;
  width: 100%;
}

/* ✅ 라벨 스타일 */
.label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
  color: #492815;
  font-weight: bold;
}

/* ✅ 선택된 값 스타일 */
.selected-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
}

.selected-item {
  display: flex;
  align-items: center;
  background: #fed7c3;
  color: #492815;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 14px;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 14px;
  margin-left: 6px;
  cursor: pointer;
}

/* ✅ 드롭다운 스타일 */
.dropdown {
  position: relative;
}

.dropdown-btn {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
  text-align: center;
}

.dropdown-content {
  position: absolute;
  width: 100%;
  background: white;
  border: 1px solid #ccc;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.dropdown-item {
  padding: 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f4f4f4;
}

.selected {
  background: #fed7c3;
}
</style>
