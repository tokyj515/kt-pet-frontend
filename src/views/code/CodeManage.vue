<template>
  <div class="code-manager-container">
    <!-- ✅ 코드 그룹 -->
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
            :key="group.id"
            @click="selectGroup(group)"
            :class="{ selected: selectedGroup?.id === group.id }"
        >
          <td>{{ group.name }}</td>
          <td>{{ group.id }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- ✅ 코드 상세 -->
    <div v-if="selectedGroup" :class="['code-detail', { visible: selectedGroup }]">
      <div class="header">
        <h3>{{ selectedGroup.name }} - 코드 리스트</h3>
        <div>
          <BaseButton @click="openCodeModal" :primary="4">+ 추가</BaseButton>
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
            :key="detail.codeId"
            @click="selectDetail(detail)"
            :class="{ selected: selectedDetail?.codeId === detail.codeId }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ detail.name }}</td>
          <td>{{ detail.codeId }}</td>
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

    <!-- ✅ 코드 추가 모달 -->
    <BaseModal :isOpen="isCodeModalOpen" title="코드 추가" @close="closeCodeModal">
      <BaseInput v-model="newCodeName" label="코드명" placeholder="코드명을 입력하세요" />
      <BaseInput v-model="newCodeDescription" label="코드설명" placeholder="코드 설명을 입력하세요" />
      <BaseButton @click="saveCode" class="w-full" :primary="4">저장</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "@/api/axios.js";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseModal from "@/components/base/BaseModal.vue";

const codeGroups = ref([]);
const codeDetails = ref({});
const selectedGroup = ref(null);
const selectedDetail = ref(null);

const newGroupName = ref("");
const isGroupModalOpen = ref(false);

const newCodeName = ref("");
const newCodeDescription = ref("");
const isCodeModalOpen = ref(false);

/* ✅ 코드 그룹 목록 불러오기 */
const fetchCodeGroups = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/code/group/list", {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("🚀 그룹 목록 응답 데이터:", response.data);

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
    const token = localStorage.getItem("token");
    const response = await axios.get(`/code/group/${codeGroupId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(`🚀 ${codeGroupId} 그룹 코드 응답 데이터:`, response.data);

    codeDetails.value[codeGroupId] = response.data.data?.codes?.map(code => ({
      codeId: code.codeId,
      name: code.name,
      description: code.description,
    })) || [];
  } catch (error) {
    console.error("🚨 코드 상세 불러오기 실패:", error);
  }
};


/* ✅ 코드 그룹 선택 (선택 시 자동으로 코드 리스트 불러오기) */
const selectGroup = async (group) => {
  if (!group) return;
  selectedGroup.value = group;
  selectedDetail.value = null;

  console.log("📌 선택된 그룹:", group);

  // ✅ 그룹 선택 시 해당 그룹의 코드 리스트 불러오기
  await fetchCodeDetails(group.id);
};

/* ✅ 선택한 코드 그룹의 코드 목록 (computed 활용) */
const selectedGroupDetails = computed(() => {
  return selectedGroup.value ? codeDetails.value[selectedGroup.value.id] || [] : [];
});

/* ✅ 코드 상세 선택 */
const selectDetail = (detail) => {
  selectedDetail.value = detail;
};

/* ✅ 코드 그룹 추가 */
const openGroupModal = () => {
  newGroupName.value = "";
  isGroupModalOpen.value = true;
};

const closeGroupModal = () => {
  isGroupModalOpen.value = false;
};

const saveGroup = async () => {
  if (!newGroupName.value.trim()) {
    alert("그룹명을 입력하세요.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("/code/group", { name: newGroupName.value }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      alert("그룹이 추가되었습니다.");
      closeGroupModal();
      await fetchCodeGroups();
    }
  } catch (error) {
    console.error("🚨 코드 그룹 추가 실패:", error);
  }
};

/* ✅ 코드 추가 */
const openCodeModal = () => {
  newCodeName.value = "";
  newCodeDescription.value = "";
  isCodeModalOpen.value = true;
};

const closeCodeModal = () => {
  isCodeModalOpen.value = false;
};

const saveCode = async () => {
  if (!selectedGroup.value) {
    alert("코드 그룹을 먼저 선택하세요.");
    return;
  }
  if (!newCodeName.value.trim()) {
    alert("코드명을 입력하세요.");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post("/code", {
      codeGroupId: selectedGroup.value.id,
      name: newCodeName.value,
      description: newCodeDescription.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      alert("코드가 추가되었습니다.");
      closeCodeModal();
      fetchCodeDetails(selectedGroup.value.id);
    }
  } catch (error) {
    console.error("🚨 코드 추가 실패:", error);
  }
};

const removeGroup = async () => {
  if (!selectedGroup.value) {
    alert("삭제할 코드 그룹을 선택하세요.");
    return;
  }

  const confirmDelete = confirm("정말 해당 코드 그룹과 포함된 코드를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  const token = localStorage.getItem("token");
  const groupId = selectedGroup.value.id;
  const codesToDelete = codeDetails.value[groupId] || [];

  try {
    // ✅ 1. 해당 그룹 내 코드 먼저 삭제
    for (const code of codesToDelete) {
      await axios.post(`/code/delete/${code.codeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // ✅ 2. 그룹 삭제
    const response = await axios.post(`/code/group/delete/${groupId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      alert("코드 그룹과 포함된 코드가 삭제되었습니다.");
      selectedGroup.value = null;
      fetchCodeGroups();
    }
  } catch (error) {
    console.error("🚨 코드 그룹 삭제 실패:", error);
  }
};


const removeDetail = async () => {
  if (!selectedDetail.value) {
    alert("삭제할 코드를 선택하세요.");
    return;
  }

  const confirmDelete = confirm("정말 해당 코드를 삭제하시겠습니까?");
  if (!confirmDelete) return;

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`/code/delete/${selectedDetail.value.codeId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.code === 200) {
      alert("코드가 삭제되었습니다.");
      selectedDetail.value = null;
      fetchCodeDetails(selectedGroup.value.id);
    }
  } catch (error) {
    console.error("🚨 코드 삭제 실패:", error);
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

.code-group, .code-detail {
  flex: 1; /* 🔥 두 개의 영역을 동일한 크기로 설정 */
  background: white;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 600px;
  height: 100%;
}

.code-detail {
  visibility: hidden; /* 🔥 초기에 보이지 않게 설정 */
}

.code-detail.visible {
  visibility: visible; /* 🔥 그룹 선택 시 보이도록 변경 */
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
