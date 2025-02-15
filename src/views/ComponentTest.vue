<template>
  <div class="container">
    <h2>컴포넌트 테스트</h2>

    <BaseInput v-model="username" label="사용자 이름" placeholder="이름을 입력하세요" />
    <p>입력 값: {{ username }}</p>

    <BaseInput v-model="email" label="이메일" type="email" placeholder="이메일을 입력하세요" />
    <p>입력 값: {{ email }}</p>

    <BaseSelect v-model="selectedOption" label="옵션 선택" :options="selectOptions" />
    <p>선택된 값: {{ selectedOption }}</p>

    <BaseCheckbox v-model="selectedCheckboxes" label="체크박스 선택 중" :options="checkboxOptions" />
    <p>선택된 체크박스 값: {{ selectedCheckboxes }}</p>

    <BaseRadio v-model="selectedRadio" label="라디오 선택 중"  :options="radioOptions" />
    <p>선택된 값: {{ selectedRadio }}</p>

    <BaseChip :chips="chipList" label="선택된 칩" @remove-chip="removeChip" />
    <p>선택된 칩: {{ chipList }}</p>


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
const selectedCheckboxes = ref([]);
const chipList = ref(["칩 1", "칩 2", "칩 3"]);

const selectOptions = [
  { label: "옵션 1", value: "1" },
  { label: "옵션 2", value: "2" },
];

const radioOptions = [
  { label: "라디오 1", value: "1" },
  { label: "라디오 2", value: "2" },
];

const checkboxOptions = [
  { label: "체크박스 1", value: "1" },
  { label: "체크박스 2", value: "2" },
  { label: "체크박스 3", value: "3" },
];

const removeChip = (chip) => {
  chipList.value = chipList.value.filter(c => c !== chip);
};
</script>

<style scoped>

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