<template>
  <aside class="admin-sidebar">
    <ul>
      <li v-for="menu in menus" :key="menu.path">
        <router-link :to="menu.path">{{ menu.label }}</router-link>
      </li>
    </ul>
  </aside>
</template>

<script setup>
const menus = [
  { label: "코드 관리", path: "/admin/codes" },
  { label: "사용자 관리", path: "/admin/users" },
  { label: "설정", path: "/admin/settings" }
];
</script>

<style scoped>
.admin-sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.admin-sidebar ul {
  list-style: none;
  padding: 0;
}

.admin-sidebar li {
  margin-bottom: 10px;
}

.admin-sidebar a {
  color: white;
  text-decoration: none;
}

.admin-sidebar a:hover {
  text-decoration: underline;
}
</style>
