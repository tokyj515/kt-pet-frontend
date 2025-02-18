<template>
  <button :class="['btn', buttonClass, 'w-full']" @click="onClick">
    <slot />
  </button>
</template>

<script setup>
import { computed } from "vue";

// ✅ Props 선언
const props = defineProps({
  primary: Number, // primary 값 (1, 2, 3, 4)
});

// ✅ emit 선언 (이벤트 정의)
const emit = defineEmits(["click"]);


const buttonClass = computed(() => {
  switch (props.primary) {  // ✅ props.primary로 접근
    case 1:
      return "btn-yellow";
    case 2:
      return "btn-peach";
    case 3:
      return "btn-blue";
    case 4:
      return "btn-mint";
    default:
      return "btn-gray";
  }
});


// ✅ 버튼 클릭 핸들러
const onClick = () => {
  emit("click");
};

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



/* 🟡 연노랑 버튼 */
.btn-yellow {
  background-color: #F6EAC2;
  color: #492815;
}

.btn-yellow:hover {
  background-color: #E5D4A1;
}

/* 🩶 회색 버튼 */
.btn-gray {
  background-color: #B0B0B0;
  color: #FFFFFF;
}

.btn-gray:hover {
  background-color: #909090;
}

/* 🍑 살구색 버튼 */
.btn-peach {
  background-color: #FED7C3;
  color: #492815;
}

.btn-peach:hover {
  background-color: #F5B89E;
}

/* 🌿 연한 민트색 버튼 */
.btn-mint {
  background-color: #C6DBDA;
  color: #492815;
}

.btn-mint:hover {
  background-color: #A5C5C4;
}
</style>
