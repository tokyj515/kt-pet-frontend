<template>
  <div class="admin-layout">
    <!-- ✅ 헤더 -->
    <AdminHeader />

    <div class="admin-body">
      <!-- ✅ 사이드바 -->
      <AdminSidebar />

      <!-- ✅ 메인 콘텐츠 영역 (각 화면이 들어갈 곳) -->
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AdminSidebar from "@/components/admin/AdminSidebar.vue";
import AdminHeader from "@/components/admin/AdminHeader.vue";
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.admin-body {
  display: flex;
  flex: 1;
}

.admin-content {
  flex: 1;
  padding: 20px;
  background: #f9f9f9;
  overflow-y: auto;
}
</style>
