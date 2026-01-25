import axios from 'axios';

const api = axios.create({
  baseURL: 'http://43.200.52.142:8080', // 백엔드 주소
});

export const getNewsList = async (category, page = 0) => {
  try {
    const params = {
      page: page,
      size: 12
    };

    if (category && category !== 'MAIN') {
      params.newsCategory = category;
    }

    // category가 있으면 쿼리 스트링으로 전달
    const response = await api.get('/api/news', {params});
    // ApiResponse<NewsListViewDTO> 구조이므로 data.result.newsDTOList 접근
    return response.data.result.newsDTOList;
  } catch (error) {
    console.error("뉴스 목록 조회 실패:", error);
    return [];
  }
};

export const getNewsDetail = async (newsId) => {
  try {
    const response = await api.get(`/api/news/${newsId}`);
    return response.data.result; // SingleNewsViewDTO 반환
  } catch (error) {
    console.error("뉴스 상세 조회 실패:", error);
    return null;
  }
};

export const getNewsTerms = async (newsId) => {
  try {
    const response = await api.get(`/api/news/${newsId}/term`);
    return response.data.result.terms; // List<SingleTermResultDTO> 반환
  } catch (error) {
    console.error("뉴스 용어 목록 조회 실패:", error);
    return [];
  }
};

export const getTermDetail = async (termId) => {
  try {
    const token = localStorage.getItem('token');
    console.log(`📡 서버에 용어 상세 조회 요청 중: /api/terms/${termId}`);

    const response = await api.get(`/api/term/${termId}/brief`, {
      headers: {
        Authorization: `Bearer ${token}` // 헤더에 토큰 추가
      }
    }); // 엔드포인트에 맞춰 수정

    console.log("📦 서버 전체 응답:", response.data);

    return response.data.result; // SingleTermDTO 반환
  } catch (error) {
    console.error("용어 상세 조회 실패:", error);
    return null;
  }
};

export const generateTermByLlm = async (newsId) => {
  try {
    // 백그라운드에서 생성을 시작하라는 POST 요청
    const response = await axios.post(`/api/news/${newsId}/generateTerm`);
    return response.data;
  } catch (error) {
    console.error("용어 생성 요청 중 오류 발생:", error);
    throw error;
  }
};