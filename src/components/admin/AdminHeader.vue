<template>
  <header class="admin-header">
    <h2>관리자 페이지</h2>
    <BaseButton @click="logout" class="logout-btn">로그아웃</BaseButton>
  </header>
</template>

<script setup>
import BaseButton from "@/components/base/BaseButton.vue";

const logout = () => {
  alert("로그아웃되었습니다.");
  // 추가적인 로그아웃 로직 필요
};
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: #34495e;
  color: white;
}

.logout-btn {
  background: #e74c3c;
  color: white;
}
</style>
