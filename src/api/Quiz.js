import api from './index';

export const generateQuiz = async (newsId) => {
  try {
    const response = await api.post(`/api/quiz/generate/${newsId}`);
    return response.data.result; // List<QuizGenerateResponseDTO> 반환
  } catch (error) {
    console.error("퀴즈 생성 실패:", error);
    return [];
  }
};