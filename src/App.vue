<script setup>
import Navbar from './components/Navbar.vue'; // ✅ 네비바 컴포넌트 추가
</script>

<template>
  <div>
    <Navbar /> <!-- ✅ 네비게이션 바 추가 -->
    <router-view /> <!-- ✅ 현재 페이지를 렌더링하는 필수 태그 -->
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
