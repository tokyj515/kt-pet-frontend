<template>
  <div class="base-card">
    <!-- 카드 헤더 -->
    <div v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </div>

    <!-- 카드 본문 -->
    <div class="card-body">
      <slot name="body"></slot>
    </div>

    <!-- 카드 푸터 (버튼 영역) -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<style scoped>
.base-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
  transition: transform 0.2s;
  max-width: 80%;
  margin: 0 auto;
  width: 100%;
}

.base-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 10px;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.card-body {

}

.card-footer {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
  text-align: right;
}
</style>
