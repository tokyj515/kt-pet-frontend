<template>
  <div class="checkbox-container">
    <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', $event.target.checked)"
        class="checkbox"
    />
    <label class="checkbox-label">{{ label }}</label>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: Boolean, // 부모에서 전달받는 값
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
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

.checkbox-label {
  font-size: 14px;
  font-weight: bold;
  color: #492815; /* 공통 라벨 색상 */
}
</style>
