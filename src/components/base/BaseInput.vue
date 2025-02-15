<template>
  <div class="input-container">
    <label v-if="label" class="input-label">{{ label }}</label>
    <input
        :type="type"
        :placeholder="placeholder"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="input-field"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  type: {
    type: String,
    default: "text",
  },
  placeholder: String,
  modelValue: String,
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.input-container {
  width: 100%;
  text-align: left;
  background-color: white;
  padding: 10px;
  border-radius: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: #492815;
}

.input-field {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 5px;
  border: 2px solid #F6EAC2; /* 연노랑 */
  background-color: white;
  font-size: 16px;
  color: #333;
  outline: none;
  transition: border 0.3s, box-shadow 0.3s;
}

.input-field:focus {
  border-color: #C6DBDA; /* 민트 */
  box-shadow: 0 0 5px rgba(198, 219, 218, 0.5);
}
</style>
