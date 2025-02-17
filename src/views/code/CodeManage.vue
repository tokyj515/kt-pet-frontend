<template>
  <div class="code-manager-container">
    <!-- ✅ 코드 그룹 -->
    <div class="code-group">
      <div class="header">
        <h3>코드 그룹</h3>
        <div>
          <BaseButton @click="addGroup" :primary="4">+ 추가</BaseButton>
          <BaseButton @click="removeGroup" :primary="3">- 삭제</BaseButton>
        </div>
      </div>

      <table class="code-table">
        <thead>
        <tr>
          <th>그룹명</th>
          <th>그룹ID</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(group, index) in codeGroups"
            :key="index"
            @click="selectGroup(group)"
            :class="{ selected: selectedGroup === group }"
        >
          <td>{{ group.name }}</td>
          <td>{{ group.id }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 코드 상세 -->
    <div class="code-detail">
      <div class="header">
        <h3>코드 상세</h3>
        <div>
          <BaseButton @click="addDetail" :primary="4">+ 추가</BaseButton>
          <BaseButton @click="removeDetail" :primary="3">- 삭제</BaseButton>
        </div>
      </div>

      <table class="code-table">
        <thead>
        <tr>
          <th>순서</th>
          <th>코드명</th>
          <th>코드ID</th>
          <th>코드설명</th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(detail, index) in selectedGroupDetails"
            :key="index"
            @click="selectDetail(detail)"
            :class="{ selected: selectedDetail === detail }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ detail.name }}</td>
          <td>{{ detail.id }}</td>
          <td>{{ detail.description }}</td>
        </tr>
        </tbody>
      </table>

      <!-- ✅ 코드 상세 입력 폼 -->
      <div class="detail-form">
        <BaseInput v-model="detailForm.name" label="코드명" placeholder="코드명을 입력하세요" />
        <BaseInput v-model="detailForm.id" label="코드ID" placeholder="코드 ID를 입력하세요" />
        <BaseInput v-model="detailForm.description" label="코드설명" placeholder="코드 설명을 입력하세요" />
        <BaseInput v-model="detailForm.order" label="순서" type="number" min="1" />
        <BaseButton @click="saveDetail" class="save-btn">저장</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

// ✅ 코드 그룹 데이터
const codeGroups = ref([
  { name: "동물구분", id: "anmctg" },
  { name: "개 품종", id: "dogctg" },
  { name: "고양이 품종", id: "catctg" },
]);

// ✅ 코드 상세 데이터
const codeDetails = ref({
  anmctg: [{ name: "메뉴관리", id: "menu", description: "메뉴 관련 관리" }],
  dogctg: [{ name: "회원관리", id: "member", description: "회원 관련 관리" }],
  catctg: [],
});

const selectedGroup = ref(null);
const selectedDetail = ref(null);
const detailForm = ref({ name: "", id: "", description: "", order: 1 });

// ✅ 선택한 그룹의 코드 상세 목록 반환
const selectedGroupDetails = computed(() => {
  return selectedGroup.value ? codeDetails.value[selectedGroup.value.id] || [] : [];
});

// ✅ 코드 그룹 선택
const selectGroup = (group) => {
  selectedGroup.value = group;
  selectedDetail.value = null; // 코드 그룹 선택 시 코드 상세 초기화
};

// ✅ 코드 상세 선택
const selectDetail = (detail) => {
  selectedDetail.value = detail;
  detailForm.value = { ...detail, order: selectedGroupDetails.value.indexOf(detail) + 1 };
};

// ✅ 코드 그룹 추가
const addGroup = () => {
  const newGroup = { name: "새 그룹", id: `group${codeGroups.value.length + 1}` };
  codeGroups.value.push(newGroup);
  codeDetails.value[newGroup.id] = [];
};

// ✅ 코드 그룹 삭제
const removeGroup = () => {
  if (!selectedGroup.value) return;
  codeGroups.value = codeGroups.value.filter(group => group !== selectedGroup.value);
  delete codeDetails.value[selectedGroup.value.id];
  selectedGroup.value = null;
};

// ✅ 코드 상세 추가
const addDetail = () => {
  if (!selectedGroup.value) return;
  codeDetails.value[selectedGroup.value.id].push({
    name: "새 코드",
    id: `code${selectedGroupDetails.value.length + 1}`,
    description: "",
  });
};

// ✅ 코드 상세 삭제
const removeDetail = () => {
  if (!selectedGroup.value || !selectedDetail.value) return;
  codeDetails.value[selectedGroup.value.id] = selectedGroupDetails.value.filter(detail => detail !== selectedDetail.value);
  selectedDetail.value = null;
};

// ✅ 코드 상세 저장
const saveDetail = () => {
  if (!selectedGroup.value || !selectedDetail.value) return;
  const index = selectedGroupDetails.value.indexOf(selectedDetail.value);
  if (index !== -1) {
    selectedGroupDetails.value[index] = { ...detailForm.value };
  }
};
</script>

<style scoped>
.code-manager-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f9f9f9;
}

.code-group, .code-detail {
  flex: 1;
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.code-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.code-table th, .code-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.code-table tr.selected {
  background: #e0f7fa;
}

.detail-form {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.save-btn {
  align-self: flex-end;
  width: 100%;
}
</style>
