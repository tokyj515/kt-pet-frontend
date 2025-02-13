<template>
  <div class="container">
    <h2>내 펫 목록</h2>

    <div v-if="pets.length === 0" class="no-pets">
      <p>등록된 펫이 없습니다.</p>
      <router-link to="/pet-register">
        <button class="btn btn-pink">펫 등록하기</button>
      </router-link>
    </div>

    <div v-else class="pet-cards">
      <div v-for="(pet, index) in pets" :key="index" class="pet-card">
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


<!--    <button @click="goToPetList" class="btn btn-pink">내 펫 목록 보기</button>-->
    <button @click="goToPetRegister" class="btn btn-pink">펫 등록하기</button>

    <button @click="goBack" class="btn back-btn">뒤로 가기</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "@/api/axios";
import { useRouter } from "vue-router";

// ✅ assets에서 기본 이미지 가져오기
import defaultPetImage from "@/assets/default-pet.png";

export default {
  setup() {
    const pets = ref([]);
    const router = useRouter();
    const defaultImage = defaultPetImage; // 기본 이미지 (없을 경우)

    // ✅ 펫 리스트 조회 API 호출
    const fetchPetList = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/pet/list", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("✅ 펫 목록 조회 성공:", response.data);
        pets.value = response.data.data;
      } catch (error) {
        console.error("❌ 펫 목록 조회 실패:", error.response?.data || error.message);
        alert("펫 목록을 불러오지 못했습니다.");
      }
    };

    // ✅ 뒤로 가기
    const goBack = () => {
      router.push("/");
    };

    // ✅ 펫 등록 페이지로 이동
    const goToPetRegister = () => {
      router.push("/pet-register");
    };

    onMounted(fetchPetList);

    return { pets, goBack, goToPetRegister, defaultImage };
  },
};
</script>

<style scoped>
.pet-list-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* ✅ 카드 레이아웃 (이미지 + 정보) */
.pet-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  text-align: left;
  gap: 30px; /* 이미지와 정보 간격 */
}

/* ✅ 왼쪽: 정사각형 이미지 */
.pet-image img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 10px; /* 둥글게 */
  border: 1px solid #ddd;
}

/* ✅ 오른쪽: 펫 정보 */
.pet-info {
  flex: 1;
}


/* ✅ 등록된 펫이 없을 때 */
.no-pets {
  margin-top: 20px;
  font-size: 14px;
  color: #666;
}
</style>
