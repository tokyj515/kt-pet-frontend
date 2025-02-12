import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js"; // ✅ Vue Router 추가

const app = createApp(App);
app.use(router); // ✅ Vue 앱에 라우터 적용
app.mount("#app");
