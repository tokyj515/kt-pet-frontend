<template>
  <div class="chip-container">
    <label v-if="label" class="chip-group-label">{{ label }}</label>
    <div class="chip-group">
      <span v-for="(chip, index) in chips" :key="index" class="chip">
        {{ chip }}
        <button v-if="removable" class="chip-close" @click="$emit('remove-chip', chip)">×</button>
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  chips: Array,
  removable: { type: Boolean, default: false } // 🔥 X 버튼 표시 여부 (기본값: false)
});

defineEmits(["remove-chip"]);
</script>

<style scoped>
.chip-container {
  width: 100%;
  text-align: left;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 10px;
}

.chip-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip-group-label {
  font-size: 14px;
  font-weight: bold;
  color: #492815; /* 공통 라벨 색상 */
  margin-bottom: 10px;
}

.chip {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: #F6EAC2; /* 연노랑 */
  color: #492815; /* 공통 라벨 색상 */
  border-radius: 16px;
  font-size: 14px;
  text-align: center;
  transition: background-color 0.3s;
}

.chip:hover {
  background-color: #C6DBDA; /* 살구 */
}

/* ❌ X 버튼 스타일 */
.chip-close {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: bold;
  color: #492815;
  cursor: pointer;
}

.chip-close:hover {
  color: #D43F00;
}
</style>
