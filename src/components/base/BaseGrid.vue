<template>
  <div class="grid-container">
    <div v-for="(item, index) in items" :key="index" class="grid-row">
      <span class="label">{{ item.label }}</span>
      <span class="value">{{ item.value }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* ✅ 전체 컨테이너 */
.grid-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 10px;
}

/* ✅ 개별 행 스타일 */
.grid-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  //border-bottom: 1px solid #fed7c3; /* 연한 피치 */
  padding-bottom: 8px;
}

.grid-row:last-child {
  border-bottom: none; /* 마지막 항목은 구분선 제거 */
}

/* ✅ 라벨 스타일 */
.label {
  color: #492815; /* 딥 브라운 */
  font-weight: bold;
}

/* ✅ 값 스타일 */
.value {
  color: #492815;
  //font-weight: bold;
  text-align: right;
}
</style>
