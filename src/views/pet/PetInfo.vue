<template>
  <div class="container">
    <h2>펫 정보</h2>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else-if="petInfo" class="pet-info-container">
      <!-- ✅ 펫 이미지 -->
      <div class="pet-image">
        <img :src="petInfo?.imageUrl || defaultImage" alt="펫 이미지" />
      </div>

      <!-- ✅ 펫 상세 정보 (가로 정렬) -->
      <div class="pet-details">
        <div class="info-row">
          <span class="label">이름</span>
          <span class="value">{{ petInfo?.name || "이름 없음" }}</span>
        </div>
        <div class="info-row">
          <span class="label">종류</span>
          <span class="value">{{ petInfo?.petType || "알 수 없음" }}</span>
        </div>
        <div class="info-row">
          <span class="label">나이</span>
          <span class="value">{{ petInfo?.age !== undefined ? petInfo.age + "살" : "알 수 없음" }}</span>
        </div>
      </div>
    </div>

    <!-- ✅ 버튼 그룹 -->
    <div class="button-group">
      <BaseButton @click="openEditModal" :primary="2">정보 수정</BaseButton>
      <BaseButton @click="goBack" :primary="3">뒤로 가기</BaseButton>
    </div>

    <!-- ✅ 펫 정보 수정 모달 -->
    <BaseModal v-if="isEditModalOpen" :isOpen="isEditModalOpen" title="펫 정보 수정" @close="closeEditModal">
      <BaseInput v-model="editPet.name" label="이름" placeholder="펫 이름" required />
      <BaseSelect v-model="editPet.petType" label="펫 종류" :options="petOptions" required />
      <BaseSelect v-model="editPet.age" label="나이" :options="ageOptions" required />
      <BaseButton @click="updatePet" :primary="4">수정 완료</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import defaultPetImage from "@/assets/default-pet.png";

const route = useRoute();
const router = useRouter();
const petInfo = ref(null);
const loading = ref(true);
const defaultImage = defaultPetImage;

// ✅ 수정 모달 관련 상태
const isEditModalOpen = ref(false);
const editPet = ref({ petId: null, name: "", petType: "", age: 0 });

// ✅ 펫 종류 선택 옵션
const petOptions = [
  { label: "고양이", value: "고양이" },
  { label: "강아지", value: "강아지" },
];

// ✅ 나이 선택 옵션 (0~30살) → `Long` 타입으로 변환
const ageOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i}살`,
  value: i, // 🔥 숫자로 변환 (Long 지원)
}));

// ✅ 펫 정보 불러오기
const fetchPetInfo = async () => {
  try {
    const petId = route.params.petId;
    if (!petId) {
      alert("잘못된 접근입니다.");
      router.push("/pet-list");
      return;
    }

    const token = localStorage.getItem("token");
    const response = await axios.get(`/pet/${petId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data?.data) {
      petInfo.value = response.data.data || {}; // ✅ 빈 객체로 초기화
      console.log(response.data);
    } else {
      throw new Error("펫 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("❌ 펫 정보를 불러오는 중 오류 발생:", error);
    alert("펫 정보를 불러오지 못했습니다.");
    router.push("/pet-list");
  } finally {
    loading.value = false;
  }
};

// ✅ 수정 모달 열기
const openEditModal = () => {
  if (petInfo.value) {
    editPet.value = {
      petId: petInfo.value.petId ,
      name: petInfo.value.name || "",
      petType: petInfo.value.petType || "고양이",
      age: petInfo.value.age !== undefined ? Number(petInfo.value.age) : 0, // 🔥 숫자로 변환
    };

    console.log("🐾 수정할 펫 정보:", editPet.value); // 디버깅 로그 추가
    isEditModalOpen.value = true;
  }
};

// ✅ 수정 모달 닫기
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// ✅ 펫 정보 수정 API 호출
const updatePet = async () => {
  if (!editPet.value.petId) {
    alert("잘못된 요청입니다. 펫 정보를 다시 확인해주세요.");
    console.error("❌ petId 값이 null입니다!", editPet.value);
    return;
  }

  try {
    const token = localStorage.getItem("token");

    const petModifyDto = {
      petId: editPet.value.petId, // ✅ Long 타입 유지
      name: editPet.value.name,
      petType: editPet.value.petType,
      age: Number(editPet.value.age), // ✅ Long 타입 변환
    };

    await axios.patch("/pet/modify", petModifyDto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("펫 정보가 수정되었습니다.");
    petInfo.value = { ...editPet.value };
    closeEditModal();
  } catch (error) {
    alert("펫 정보 수정에 실패했습니다.");
  }
};

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/pet-list");
};

onMounted(fetchPetInfo);
</script>

<style scoped>
.container {
  text-align: center;
}

/* ✅ 로딩 스타일 */
.loading {
  font-size: 18px;
  color: #666;
}

/* ✅ 펫 정보 컨테이너 */
.pet-info-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 40px;
  justify-content: center;
  margin-top: 20px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: auto;
}

/* ✅ 펫 이미지 스타일 */
.pet-image {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pet-image img {
  width: 220px;
  height: 220px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #ddd;
}

/* ✅ 펫 정보 스타일 */
.pet-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
}

/* ✅ 정보 행 가로 정렬 */
.info-row {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
}

/* ✅ 버튼 그룹 */
.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}
</style>
