<template>
  <div class="code-manager-container">
    <!-- ✅ 코드 그룹 (세로 길게) -->
    <div class="code-group">
      <div class="header">
        <h3>코드 그룹</h3>
        <div>
          <BaseButton @click="openGroupModal" :primary="4">+ 추가</BaseButton>
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
            v-for="(group, index) in codeGroups || []"
            :key="index"
            @click="selectGroup(group)"
            :class="{ selected: selectedGroup?.id === group.id }"
        >
          <td>{{ group.name }}</td>
          <td>{{ group.id }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 코드 상세 (그룹 선택 시만 표시) -->
    <div v-if="selectedGroup" class="code-detail">
      <div class="header">
        <h3>{{ selectedGroup.name }} - 코드 리스트</h3>
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
            v-for="(detail, index) in selectedGroupDetails || []"
            :key="index"
            @click="selectDetail(detail)"
            :class="{ selected: selectedDetail?.id === detail.id }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ detail.name }}</td>
          <td>{{ detail.id }}</td>
          <td>{{ detail.description }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 코드 그룹 추가 모달 -->
    <BaseModal :isOpen="isGroupModalOpen" title="코드 그룹 추가" @close="closeGroupModal">
      <BaseInput v-model="newGroupName" label="그룹명" placeholder="그룹명을 입력하세요" />
      <BaseButton @click="saveGroup" class="w-full" :primary="4">저장</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/api/axios.js"; // ✅ API 호출을 위한 axios 인스턴스
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";

const codeGroups = ref([]);
const codeDetails = ref({});
const selectedGroup = ref(null);
const selectedDetail = ref(null);
const newGroupName = ref("");
const isGroupModalOpen = ref(false);

/* ✅ 코드 그룹 목록 불러오기 */
const fetchCodeGroups = async () => {
  try {
    const response = await axios.get("/code/group/list");
    console.log("✅ API 응답 데이터:", response.data);

    if (response.data.code === 200 && Array.isArray(response.data.data)) {
      codeGroups.value = response.data.data.map(group => ({
        id: group.codeGroupId,
        name: group.name,
      }));
    } else {
      console.error("🚨 API 응답 데이터 형식 오류:", response.data);
      codeGroups.value = [];
    }
  } catch (error) {
    console.error("🚨 코드 그룹 불러오기 실패:", error);
    codeGroups.value = [];
  }
};

/* ✅ 선택한 코드 그룹의 상세 코드 불러오기 */
const fetchCodeDetails = async (codeGroupId) => {
  if (!codeGroupId) return;
  try {
    const response = await axios.get(`/code/group/${codeGroupId}`);
    codeDetails.value[codeGroupId] = response.data.data?.codes || [];
  } catch (error) {
    console.error("🚨 코드 상세 불러오기 실패:", error);
  }
};

/* ✅ 코드 그룹 선택 */
const selectGroup = async (group) => {
  if (!group) return;
  selectedGroup.value = group;
  selectedDetail.value = null;
  await fetchCodeDetails(group.id);
};

/* ✅ 선택한 코드 그룹의 코드 목록 */
const selectedGroupDetails = computed(() => {
  return selectedGroup.value ? codeDetails.value[selectedGroup.value.id] || [] : [];
});

/* ✅ 코드 그룹 추가 모달 열기 */
const openGroupModal = () => {
  newGroupName.value = "";
  isGroupModalOpen.value = true;
};

/* ✅ 코드 그룹 추가 모달 닫기 */
const closeGroupModal = () => {
  isGroupModalOpen.value = false;
};

/* ✅ 코드 그룹 추가 */
const saveGroup = async () => {
  if (!newGroupName.value.trim()) {
    alert("그룹명을 입력하세요.");
    return;
  }

  try {
    const response = await axios.post("/code/group", { name: newGroupName.value });

    if (response.data.code === 200) {
      alert("그룹이 추가되었습니다.");
      closeGroupModal();
      await fetchCodeGroups();
    } else {
      alert("그룹 추가 실패: " + response.data.message);
    }
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

/* ✅ 페이지 로딩 시 코드 그룹 불러오기 */
onMounted(fetchCodeGroups);
</script>

<style scoped>
.code-manager-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  margin: 0 10%;
  background: #f9f9f9;
  align-items: flex-start;
}

.code-group {
  flex: 0.5;
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 600px !important;
  height: 100%;
  overflow-y: auto;
}

.code-detail {
  flex: 0.5;
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
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
</style>
