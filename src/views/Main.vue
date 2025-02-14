<template>
  <div class="container">
    <h2>MY PET</h2>

    <!-- 프로필 이동 버튼 -->
    <button @click="goToProfile" class="btn btn-mint">내 프로필 보기</button>

    <!-- 펫 목록 이동 버튼 -->
    <button @click="goToPetList" class="btn btn-pink">내 펫 목록 보기</button>

    <!-- 쇼핑몰 이동 버튼 -->
    <button @click="goToShopping" class="btn btn-orange">쇼핑몰</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const goToProfile = () => {
      router.push("/profile");
    };

    const goToPetList = () => {
      router.push("/pet-list");
    };

    const goToShopping = () => {
      router.push("/shopping");
    };

    const goToSitterProfile = () => {
      router.push("/sitter-profile");
    };


    return { goToProfile, goToPetList, goToShopping };
  },
};
</script>

<style scoped>

</style>
