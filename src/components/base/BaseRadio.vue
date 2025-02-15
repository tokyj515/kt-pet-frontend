<template>
  <div class="radio-container">
    <label v-for="option in options" :key="option.value" class="radio-label">
      <input
          type="radio"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
          class="radio-input"
      />
      {{ option.label }}
    </label>
  </div>
</template>

<script setup>
defineProps({
  options: Array,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.radio-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 10px;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: bold;
  color: #492815; /* 공통 라벨 색상 */
}

.radio-input {
  width: 18px;
  height: 18px;
  border: 2px solid #F6EAC2; /* 연노랑 */
  border-radius: 50%;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  appearance: none; /* 기본 스타일 제거 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-input:checked {
  background-color: #C6DBDA; /* 민트 */
  border-color: #C6DBDA;
}
</style>