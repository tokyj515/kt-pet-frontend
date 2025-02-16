<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>{{ title }}</h3>
      <slot />
      <BaseButton @click="close" class="w-full" :primary="3">닫기</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";
import BaseButton from "@/components/base/BaseButton.vue";

// ✅ Props 설정
const props = defineProps({
  isOpen: Boolean,
  title: String,
});

// ✅ Emit 설정 (닫기 버튼 클릭 시 부모에게 이벤트 전달)
const emit = defineEmits(["close"]);

// ✅ 모달 닫기 함수
const close = () => {
  emit("close");
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  width: 400px;
  max-width: 90%;
  text-align: center;
}
</style>
