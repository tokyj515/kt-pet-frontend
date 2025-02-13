<template>
  <div class="container">
    <h2>내 펫 목록</h2>

    <div v-if="pets.length === 0" class="no-pets">
      <p>등록된 펫이 없습니다.</p>
    </div>

    <div class="pet-cards">
      <div v-for="(pet, index) in pets" :key="index" class="pet-card">
        <!-- ✅ 카드 우측 상단에 아이콘 배치 -->
        <div class="pet-actions">
          <i class="fa-solid fa-eye" @click="viewPetDetail(pet.id)"></i>
          <i class="fa-solid fa-pen" @click="openEditModal(pet)"></i>
          <i class="fa-solid fa-trash" @click="deletePet(pet.id)"></i>
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

    const viewPetDetail = (id) => {
      router.push(`/pet/${id}`);
    };

    const openEditModal = (pet) => {
      console.log("수정 모달 열기:", pet);
    };

    const deletePet = async (id) => {
      if (confirm("정말 삭제하시겠습니까?")) {
        try {
          await axios.delete(`/pet/delete/${id}`);
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
      deletePet,
      goBack,
      goToPetRegister,
      defaultImage,
    };
  },
};
</script>

<style scoped>
.pet-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 2열 고정 */
  gap: 20px; /* 카드 간 간격 추가 */
  justify-content: center;
  align-items: start; /* 카드들이 위쪽 정렬되도록 설정 */
}

/* ✅ 펫 카드 스타일 */
.pet-card {
  position: relative; /* 아이콘을 우측 상단 배치할 수 있도록 설정 */
  background: white;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 100%; /* grid의 열 크기를 따르게 설정 */
  box-sizing: border-box; /* padding 포함한 너비 유지 */
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
</style>
