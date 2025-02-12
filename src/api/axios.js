import axios from "axios";

const API_URL = "http://localhost:8080"; // 백엔드 서버 주소

const instance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 요청 인터셉터: JWT가 있으면 자동으로 추가
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log("📌 현재 localStorage의 Token:", token); // ✅ 디버깅 로그 추가

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Authorization 헤더 추가됨:", config.headers.Authorization);
    } else {
        console.log("❌ JWT 토큰이 존재하지 않음.");
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
