<template>
  <div class="container">
    <h2>펫 등록</h2>
    <form @submit.prevent="registerPet">
      <!-- ✅ 이름 입력 (한 줄 배치) -->
      <div class="input-group">
        <label for="name">이름</label>
        <input type="text" id="name" v-model="name" placeholder="펫 이름" class="input-field" required />
      </div>

      <!-- ✅ 펫 종류 선택 (한 줄 배치) -->
      <div class="input-group">
        <label for="petType">펫 종류</label>
        <select id="petType" v-model="petType" class="input-field" required>
          <option value="고양이">고양이</option>
          <option value="강아지">강아지</option>
        </select>
      </div>

      <!-- ✅ 나이 선택 (한 줄 배치) -->
      <div class="input-group">
        <label for="age">나이</label>
        <select id="age" v-model="age" class="input-field" required>
          <option v-for="i in 31" :key="i" :value="i-1">{{ i-1 }}살</option>
        </select>
      </div>

      <!-- 등록 버튼 -->
      <button type="submit" class="btn btn-pink">등록하기</button>
    </form>
    <button @click="goBack" class="btn btn-pink">취소</button>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "@/api/axios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const name = ref("");
    const petType = ref("고양이"); // 기본값
    const age = ref(0);
    const router = useRouter();

    // ✅ 펫 등록 API 호출
    const registerPet = async () => {
      try {
        const token = localStorage.getItem("token");

        const requestData = {
          name: name.value,
          petType: petType.value,
          age: age.value,
        };

        console.log("📤 요청 데이터:", JSON.stringify(requestData)); // ✅ 로그 확인

        const response = await axios.post("/pet/register", requestData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ API 응답:", response.data);
        alert("펫 등록 성공!");
        router.push("/profile");
      } catch (error) {
        console.error("❌ 펫 등록 실패:", error.response?.data || error.message);
        alert("펫 등록 실패: " + (error.response?.data?.message || "알 수 없는 오류"));
      }
    };



    // ✅ 취소 버튼 클릭 시 프로필 페이지로 이동
    const goBack = () => {
      router.push("/profile");
    };

    return { name, petType, age, registerPet, goBack };
  },
};
</script>

<style scoped>
.pet-register-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* ✅ 입력 필드와 라벨을 같은 줄에 배치 */
.input-group {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 요소 간 간격 유지 */
  margin-bottom: 10px;
}

/* ✅ 레이블 스타일 */
.input-group label {
  flex: 1; /* 레이블이 일정한 비율로 차지 */
  text-align: left;
  font-size: 14px;
  font-weight: bold;
  margin-right: 10px;
}

/* ✅ 입력 필드와 셀렉트 박스 스타일 */
.input-group input,
.input-group select {
  flex: 2; /* 입력 필드가 더 넓게 차지 */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

/* ✅ 펫 관련 버튼 스타일 */
button.pet-btn {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: #FACCD9; /* ✅ 기본 연한 핑크 */
  color: black;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  box-sizing: border-box;
}

button.pet-btn:hover {
  background-color: #FE80A2; /* ✅ 호버 시 진한 핑크 */
}
</style>
