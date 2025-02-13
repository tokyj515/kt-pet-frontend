<template>
  <div class="container">
    <h2>내 펫 목록</h2>

    <div v-if="pets.length === 0" class="no-pets">
      <p>등록된 펫이 없습니다.</p>
    </div>

    <div class="pet-cards">
      <div v-for="(pet, index) in pets" :key="pet.petId" class="pet-card">
        <!-- ✅ 카드 우측 상단에 아이콘 배치 -->
        <div class="pet-actions">
          <i class="fa-solid fa-eye" @click="viewPetDetail(pet.petId)"></i>
          <i class="fa-solid fa-pen" @click="openEditModal(pet)"></i>
          <i class="fa-solid fa-trash" @click="deletePet(pet.petId)"></i>
        </div>

        <!-- ✅ 왼쪽: 펫 이미지 -->
        <div class="pet-image">
          <img :src="pet.imageUrl || defaultImage" alt="펫 이미지" />
        </div>

        <!-- ✅ 오른쪽: 펫 정보 -->
        <div class="pet-info">
          <h3>{{ pet.name }}</h3>
          <p><strong>종류:</strong> {{ pet.petType }}</p>
          <p><strong>나이:</strong> {{ pet.age }}살</p>
        </div>
      </div>
    </div>

    <button @click="goToPetRegister" class="btn btn-pink">펫 등록하기</button>
    <button @click="goBack" class="btn btn-gray">뒤로 가기</button>

    <!-- ✅ 수정 모달 -->
    <div v-if="isEditModalOpen" class="modal">
      <div class="modal-content">
        <h3>펫 정보 수정</h3>

        <input v-model="editPet.name" type="text" placeholder="펫 이름" class="input-field" />

        <select v-model="editPet.petType" class="input-field">
          <option value="고양이">고양이</option>
          <option value="강아지">강아지</option>
        </select>

        <select v-model="editPet.age" class="input-field">
          <option v-for="i in 31" :key="i" :value="i-1">{{ i-1 }}살</option>
        </select>

        <button @click="updatePet" class="btn btn-pink">수정 완료</button>
        <button @click="closeEditModal" class="btn btn-gray">취소</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "@/api/axios.js";
import defaultPetImage from "@/assets/default-pet.png";
import "@fortawesome/fontawesome-free/css/all.css";

export default {
  setup() {
    const router = useRouter();
    const pets = ref([]);
    const defaultImage = defaultPetImage;
    const isEditModalOpen = ref(false);
    const editPet = ref({ petId: null, name: "", petType: "", age: "" });

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

    const viewPetDetail = (petId) => {
      router.push(`/pet/${petId}`);
    };

    const openEditModal = (pet) => {
      editPet.value = { ...pet }; // 선택한 펫 정보 저장
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
    };

    const updatePet = async () => {
      try {
        const token = localStorage.getItem("token");

        // ✅ PetModifyDto의 구조를 맞춰서 요청 데이터 생성
        const petModifyDto = {
          petId: editPet.value.petId,
          name: editPet.value.name,
          petType: editPet.value.petType,
          age: editPet.value.age,
        };

        // ✅ API 호출 (PATCH 요청)
        await axios.patch("/pet/modify", petModifyDto, {
          headers: { Authorization: `Bearer ${token}` },
        });

        alert("펫 정보가 수정되었습니다.");
        closeEditModal();
        fetchPets(); // ✅ 최신 정보 반영
      } catch (error) {
        alert("펫 정보 수정에 실패했습니다.");
      }
    };


    const deletePet = async (petId) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        try {
          await axios.delete(`/pet/delete/${petId}`);
          alert("펫이 삭제되었습니다.");
          fetchPets();
        } catch (error) {
          alert("펫 삭제에 실패했습니다.");
        }
      }
    };

    const goBack = () => {
      router.push("/");
    };

    const goToPetRegister = () => {
      router.push("/pet-register");
    };

    onMounted(fetchPets);

    return {
      pets,
      viewPetDetail,
      openEditModal,
      closeEditModal,
      updatePet,
      deletePet,
      goBack,
      goToPetRegister,
      defaultImage,
      isEditModalOpen,
      editPet,
    };
  },
};
</script>

<style scoped>
.pet-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 고정 */
  gap: 20px;
  justify-content: center;
  align-items: start;
}

/* ✅ 펫 카드 스타일 */
.pet-card {
  position: relative;
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%;
  box-sizing: border-box;
}

/* ✅ 아이콘을 카드 우측 상단에 배치 */
.pet-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
}

/* ✅ 아이콘 스타일 */
.pet-actions i {
  font-size: 14px;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.pet-actions i:hover {
  color: #008b8b;
}

/* ✅ 모달 스타일 */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
}

/* ✅ 입력 필드 스타일 */
.input-field {
  display: block;
  width: 80%;
  padding: 10px;
  margin: 10px auto;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}
</style>
