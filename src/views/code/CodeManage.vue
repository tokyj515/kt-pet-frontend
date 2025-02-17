<template>
  <div :class="['container-color', 'code-manager-container']">
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
import { ref, computed, onMounted } from "vue";
import axios from "@/api/axios.js"; // ✅ API 호출을 위한 axios 인스턴스
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";

const codeGroups = ref([]);
const codeDetails = ref({});
const selectedGroup = ref(null);
const selectedDetail = ref(null);
const detailForm = ref({ name: "", id: "", description: "", order: 1 });

/* ✅ 코드 그룹 목록 불러오기 */
const fetchCodeGroups = async () => {
  try {
    const response = await axios.get("/code/group/list");
    codeGroups.value = response.data.data;
  } catch (error) {
    console.error("🚨 코드 그룹 불러오기 실패:", error);
  }
};

/* ✅ 선택한 코드 그룹의 상세 코드 불러오기 */
const fetchCodeDetails = async (codeGroupId) => {
  try {
    const response = await axios.get(`/code/group/${codeGroupId}`);
    codeDetails.value[codeGroupId] = response.data.data.codes || [];
  } catch (error) {
    console.error("🚨 코드 상세 불러오기 실패:", error);
  }
};

/* ✅ 코드 그룹 선택 */
const selectGroup = async (group) => {
  selectedGroup.value = group;
  selectedDetail.value = null;
  await fetchCodeDetails(group.id);
};

/* ✅ 선택한 코드 그룹의 코드 목록 */
const selectedGroupDetails = computed(() => {
  return selectedGroup.value ? codeDetails.value[selectedGroup.value.id] || [] : [];
});

/* ✅ 코드 그룹 추가 */
const addGroup = async () => {
  const newGroup = { name: "새 그룹", id: `group${Date.now()}` };
  try {
    await axios.post("/code/group", newGroup);
    fetchCodeGroups();
  } catch (error) {
    console.error("🚨 코드 그룹 추가 실패:", error);
  }
};

/* ✅ 코드 그룹 삭제 */
const removeGroup = async () => {
  if (!selectedGroup.value) return;
  try {
    await axios.post(`/code/group/delete/${selectedGroup.value.id}`);
    fetchCodeGroups();
    selectedGroup.value = null;
  } catch (error) {
    console.error("🚨 코드 그룹 삭제 실패:", error);
  }
};

/* ✅ 코드 상세 추가 */
const addDetail = async () => {
  if (!selectedGroup.value) return;
  const newCode = {
    groupId: selectedGroup.value.id,
    name: "새 코드",
    id: `code${Date.now()}`,
    description: "",
  };
  try {
    await axios.post("/code", newCode);
    fetchCodeDetails(selectedGroup.value.id);
  } catch (error) {
    console.error("🚨 코드 추가 실패:", error);
  }
};

/* ✅ 코드 상세 삭제 */
const removeDetail = async () => {
  if (!selectedDetail.value) return;
  try {
    await axios.post(`/code/delete/${selectedDetail.value.id}`);
    fetchCodeDetails(selectedGroup.value.id);
    selectedDetail.value = null;
  } catch (error) {
    console.error("🚨 코드 삭제 실패:", error);
  }
};

/* ✅ 코드 상세 저장 */
const saveDetail = async () => {
  if (!selectedDetail.value) return;
  try {
    await axios.post("/code/modify", { ...detailForm.value, groupId: selectedGroup.value.id });
    fetchCodeDetails(selectedGroup.value.id);
  } catch (error) {
    console.error("🚨 코드 수정 실패:", error);
  }
};

/* ✅ 페이지 로딩 시 코드 그룹 불러오기 */
onMounted(fetchCodeGroups);
</script>

<style scoped>
/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  width: 40%;
}

.code-manager-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin: 0 10%;
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
