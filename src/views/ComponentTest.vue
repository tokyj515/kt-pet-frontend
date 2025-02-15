<template>
  <div class="container">
    <h2>컴포넌트 테스트</h2>

    <BaseInput v-model="username" label="사용자 이름" placeholder="이름을 입력하세요" />
    <p>입력 값: {{ username }}</p>

    <BaseInput v-model="email" label="이메일" type="email" placeholder="이메일을 입력하세요" />
    <p>입력 값: {{ email }}</p>

    <BaseSelect v-model="selectedOption" label="옵션 선택" :options="selectOptions" />
    <p>선택된 값: {{ selectedOption }}</p>

    <BaseCheckbox v-model="checkedValue" label="약관 동의" />
    <p>체크 상태: {{ checkedValue }}</p>

    <BaseRadio v-model="selectedRadio" :options="radioOptions" />
    <p>선택된 값: {{ selectedRadio }}</p>

    <BaseChip text="테스트 칩~~~~~~~~~~~~~~" />

    <BaseButton class="mt-4">기본 버튼</BaseButton>
    <BaseButton :primary="false" class="mt-2">보조 버튼</BaseButton>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseCheckbox from "@/components/base/BaseCheckbox.vue";
import BaseRadio from "@/components/base/BaseRadio.vue";
import BaseChip from "@/components/base/BaseChip.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const username = ref("");
const email = ref("");
const checkedValue = ref(false);
const selectedRadio = ref("");
const selectedOption = ref("");

const selectOptions = [
  { label: "옵션 1", value: "1" },
  { label: "옵션 2", value: "2" },
];

const radioOptions = [
  { label: "라디오 1", value: "1" },
  { label: "라디오 2", value: "2" },
];
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  font-size: 24px;
  margin-bottom: 15px;
}

p {
  font-size: 14px;
  margin-top: 5px;
  color: #555;
}
</style>