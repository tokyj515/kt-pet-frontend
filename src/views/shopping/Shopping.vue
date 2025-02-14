<template>
  <div class="container">
    <h3>쇼핑몰입니다</h3>
    <button @click="goBack" class="btn btn-gray">뒤로 가기</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router"; // ✅ 라우터 가져오기

export default {
  name: "Shopping",
  setup() {
    const router = useRouter();

    // ✅ 뒤로 가기 함수 (메인 페이지로 이동)
    const goBack = () => {
      router.push("/"); // ✅ "/" 경로로 이동
    };

    return { goBack };
  }
};
</script>
