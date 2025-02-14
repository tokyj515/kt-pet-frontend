<template>
  <div class="container">
    <h2>펫 정보</h2>

    <div v-if="loading" class="loading">로딩 중...</div>
    <div v-else class="pet-info-container">
      <!-- ✅ 펫 이미지 -->
      <div class="pet-image">
        <img :src="petInfo.url || defaultImage" alt="펫 이미지" />
      </div>

      <!-- ✅ 펫 상세 정보 -->
      <div class="pet-details">
        <div class="info-row">
          <span class="label">이름</span>
          <span class="value">{{ petInfo.name }}</span>
        </div>
        <div class="info-row">
          <span class="label">종류</span>
          <span class="value">{{ petInfo.petType }}</span>
        </div>
        <div class="info-row">
          <span class="label">나이</span>
          <span class="value">{{ petInfo.age }}살</span>
        </div>
      </div>
    </div>

    <button @click="goBack" class="btn btn-gray">뒤로 가기</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "@/api/axios.js";
import defaultPetImage from "@/assets/default-pet.png";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const petInfo = ref({});
    const loading = ref(true);
    const defaultImage = defaultPetImage;

    const fetchPetInfo = async () => {
      try {
        const petId = route.params.petId;
        const token = localStorage.getItem("token");
        const response = await axios.get(`/pet/${petId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        petInfo.value = response.data.data;
      } catch (error) {
        alert("펫 정보를 불러오지 못했습니다.");
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push("/pet-list");
    };

    onMounted(fetchPetInfo);

    return { petInfo, loading, goBack, defaultImage };
  },
};
</script>

<style scoped>


/* ✅ 로딩 스타일 */
.loading {
  font-size: 18px;
  color: #666;
}

/* ✅ 펫 이미지 스타일 */
.pet-image img {
  width: 100%;
  max-width: 200px;
  height: auto;
  border-radius: 10px;
  border: 1px solid #ddd;
  margin-bottom: 20px;
}

/* ✅ 펫 정보 컨테이너 */
.pet-details {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  margin-bottom: 20px;
}

/* ✅ 가로 정렬 스타일 */
.info-row {
  display: flex;
  justify-content: space-between;
  width: 70%;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  font-size: 18px;
}

/* ✅ 라벨 스타일 */
.label {
  font-weight: bold;
  color: #555;
}

/* ✅ 값 스타일 */
.value {
  color: #000000;
}
</style>
