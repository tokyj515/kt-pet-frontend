<template>
  <div class="select-container">
    <label v-if="label" class="select-label">{{ label }}</label>
    <select
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
        class="select-field"
    >
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  options: Array,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.select-container {
  width: 100%;
  padding: 10px;
}

.select-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #492815; /* 변경된 입력 필드 라벨 색상 */
}

.select-field {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #F6EAC2; /* 연노랑 */
  background-color: white;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.3s, box-shadow 0.3s;
}

.select-field:focus {
  border-color: #C6DBDA; /* 민트 */
  box-shadow: 0 0 5px rgba(198, 219, 218, 0.5);
}
</style>
