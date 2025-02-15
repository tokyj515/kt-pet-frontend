<template>
  <div class="checkbox-container">
    <label v-if="label" class="checkbox-group-label">{{ label }}</label>
    <div class="checkbox-group">
      <label v-for="option in options" :key="option.value" class="checkbox-label">
        <input
            type="checkbox"
            :value="option.value"
            :checked="modelValue.includes(option.value)"
            @change="toggleCheckbox(option.value)"
            class="checkbox"
        />
        {{ option.label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: String,
  options: Array,
  modelValue: Array, // 체크박스 선택 값을 배열로 받음
});

const emit = defineEmits(["update:modelValue"]);

const toggleCheckbox = (value) => {
  const newValue = props.modelValue.includes(value)
      ? props.modelValue.filter((v) => v !== value)
      : [...props.modelValue, value];
  emit("update:modelValue", newValue);
};
</script>

<style scoped>
.checkbox-container {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.checkbox-group-label {
  font-size: 14px;
  font-weight: bold;
  color: #492815; /* 공통 라벨 색상 */
  margin-bottom: 10px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #492815; /* 공통 라벨 색상 */
}

.checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid #F6EAC2; /* 연노랑 */
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none; /* 기본 스타일 제거 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox:checked {
  background-color: #C6DBDA; /* 민트 */
  border-color: #C6DBDA;
}
</style>
