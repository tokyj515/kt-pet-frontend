<template>
  <div class="container">
    <h2>쇼핑몰입니다</h2>
    <BaseButton @click="goBack" :primary="3">뒤로 가기</BaseButton>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import BaseButton from "@/components/base/BaseButton.vue"; // ✅ 라우터 가져오기

export default {
  name: "Shopping",
  components: {BaseButton},
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
