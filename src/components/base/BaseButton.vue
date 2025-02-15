<template>
  <button
      :class="[
      'btn',
      primary ? 'btn-yellow' : 'btn-secondary',
    ]"
      @click="onClick"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: true,
  },
  onClick: Function,
});
</script>

<style scoped>
/* 버튼 스타일 */
.btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  border: none;
  margin-top: 5px;
  margin-bottom: 5px;
}

.btn-yellow {
  background-color: #F6EAC2; /* 연노랑 */
  color: #492815; /* 공통 라벨 색상 */
}

.btn-yellow:hover {
  background-color: #E5D4A1; /* 약간 어두운 연노랑 */
}

.btn-secondary {
  background-color: #B0B0B0; /* 회색 */
  color: #FFFFFF;
}

.btn-secondary:hover {
  background-color: #909090; /* 어두운 회색 */
}
</style>