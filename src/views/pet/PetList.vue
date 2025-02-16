<template>
  <div class="container">
    <h2>내 펫 목록</h2>

    <!-- ✅ 등록된 펫이 없을 때 -->
    <div v-if="pets.length === 0" class="no-pets">
      <p>등록된 펫이 없습니다.</p>
    </div>

    <!-- ✅ 펫 카드 리스트 -->
    <div class="pet-cards">
      <div
          v-for="(pet, index) in pets"
          :key="pet.petId"
          class="pet-card"
          @click="viewPetDetail(pet.petId)"
      >
        <!-- ✅ 수정/삭제 아이콘 -->
        <div class="pet-actions">
          <i class="fa-solid fa-pen" @click.stop="openEditModal(pet)"></i>
          <i class="fa-solid fa-trash" @click.stop="openDeleteModal(pet.petId)"></i>
        </div>

        <!-- ✅ 카드 컨텐츠 (이미지 + 정보) -->
        <div class="pet-content">
          <!-- ✅ 펫 이미지 (왼쪽) -->
          <div class="pet-image">
            <img :src="pet.imageUrl || defaultImage" alt="펫 이미지" />
          </div>

          <!-- ✅ 펫 정보 (오른쪽) -->
          <div class="pet-info">
            <h3>{{ pet.name }}</h3>
            <p><strong>종류:</strong> {{ pet.petType }}</p>
            <p><strong>나이:</strong> {{ pet.age }}살</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 버튼 그룹 -->
    <div class="button-group">
      <BaseButton @click="goToPetRegister" :primary="4">펫 등록하기</BaseButton>
      <BaseButton @click="goBack" :primary="3">뒤로 가기</BaseButton>
    </div>

    <!-- ✅ 펫 수정 모달 -->
    <BaseModal :isOpen="isEditModalOpen" title="펫 정보 수정" @close="closeEditModal">
      <BaseInput v-model="editPet.name" label="이름" placeholder="펫 이름" required />
      <BaseSelect v-model="editPet.petType" label="펫 종류" :options="petOptions" required />
      <BaseSelect v-model="editPet.age" label="나이" :options="ageOptions" required />
      <BaseButton @click="updatePet" :primary="4">수정 완료</BaseButton>
    </BaseModal>

    <!-- ✅ 펫 삭제 모달 -->
    <BaseModal :isOpen="isDeleteModalOpen" title="펫 삭제" @close="closeDeleteModal">
      <p>정말 삭제하시겠습니까?</p>
      <BaseButton @click="deletePet" :primary="4">삭제</BaseButton>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import BaseButton from "@/components/base/BaseButton.vue";
import BaseInput from "@/components/base/BaseInput.vue";
import BaseSelect from "@/components/base/BaseSelect.vue";
import BaseModal from "@/components/base/BaseModal.vue";
import defaultPetImage from "@/assets/default-pet.png";
import "@fortawesome/fontawesome-free/css/all.css";

const router = useRouter();
const pets = ref([]);
const defaultImage = defaultPetImage;

// ✅ 수정 모달 관련 상태
const isEditModalOpen = ref(false);
const editPet = ref({ petId: null, name: "", petType: "", age: "" });

// ✅ 삭제 모달 관련 상태
const isDeleteModalOpen = ref(false);
const petToDelete = ref(null);

// ✅ 펫 종류 선택 옵션
const petOptions = [
  { label: "고양이", value: "고양이" },
  { label: "강아지", value: "강아지" },
];

// ✅ 나이 선택 옵션 (0~30살)
const ageOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i}살`,
  value: i,
}));

// ✅ 펫 목록 불러오기
const fetchPets = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("/pet/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    pets.value = response.data.data;
  } catch (error) {
    alert("펫 목록을 불러오는 데 실패했습니다.");
  }
};

// ✅ 펫 상세보기 이동
const viewPetDetail = (petId) => {
  router.push(`/pet/${petId}`);
};

// ✅ 수정 모달 열기
const openEditModal = (pet) => {
  editPet.value = { ...pet };
  isEditModalOpen.value = true;
};

// ✅ 수정 모달 닫기
const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// ✅ 펫 정보 수정 API 호출
const updatePet = async () => {
  try {
    const token = localStorage.getItem("token");

    const petModifyDto = {
      petId: editPet.value.petId,
      name: editPet.value.name,
      petType: editPet.value.petType,
      age: editPet.value.age,
    };

    await axios.patch("/pet/modify", petModifyDto, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("펫 정보가 수정되었습니다.");

    // ✅ **즉시 반영: pets 배열을 직접 수정**
    const petIndex = pets.value.findIndex((p) => p.petId === editPet.value.petId);
    if (petIndex !== -1) {
      pets.value[petIndex] = { ...editPet.value };
    }

    closeEditModal();
  } catch (error) {
    alert("펫 정보 수정에 실패했습니다.");
  }
};

// ✅ 삭제 모달 열기
const openDeleteModal = (petId) => {
  petToDelete.value = petId;
  isDeleteModalOpen.value = true;
};

// ✅ 삭제 모달 닫기
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  petToDelete.value = null;
};

// ✅ 펫 삭제 API 호출
const deletePet = async () => {
  if (!petToDelete.value) return;
  try {
    const token = localStorage.getItem("token");
    await axios.patch(`/pet/${petToDelete.value}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("펫이 삭제되었습니다.");
    pets.value = pets.value.filter((p) => p.petId !== petToDelete.value);
    closeDeleteModal();
  } catch (error) {
    alert("펫 삭제에 실패했습니다.");
  }
};

// ✅ 페이지 이동 함수
const goBack = () => {
  router.push("/");
};

const goToPetRegister = () => {
  router.push("/pet-register");
};

onMounted(fetchPets);
</script>

<style scoped>
.pet-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  justify-content: center;
  align-items: start;
  margin: 20px 0;
}

.pet-card {
  position: relative;
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 300px;
  display: flex;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.pet-card:hover {
  transform: scale(1.05);
}

.pet-content {
  display: flex;
  width: 100%;
}

.pet-image {
  width: 40%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.pet-info {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  padding-left: 12px;
}

.pet-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 8px;
}
</style>
