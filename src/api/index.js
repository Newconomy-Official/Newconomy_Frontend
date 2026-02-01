import axios from 'axios';

console.log("환경변수 확인:", process.env.REACT_APP_API_URL);
export const BASE_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

// [Interceptor] 요청을 보내기 직전에 가로채서 헤더에 토큰을 넣음
api.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem('user'); 
    
    if (userJson) {
      const userData = JSON.parse(userJson); // 문자열을 객체로 변환
      const token = userData.accessToken;    // 객체 내의 accessToken 추출

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;