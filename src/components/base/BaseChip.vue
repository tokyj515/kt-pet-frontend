<template>
  <span class="chip">{{ text }}</span>
</template>

<script setup>
defineProps({
  text: String,
});
</script>

<style scoped>
.chip {
  display: inline-block;
  padding: 6px 12px;
  background-color: #F6EAC2; /* 연노랑 */
  color: #492815; /* 공통 라벨 색상 */
  border-radius: 16px;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  transition: background-color 0.3s;
}

.chip:hover {
  background-color: #FED7C3; /* 살구 */
}
</style>
