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

export const submitQuizAnswer = async (quizId, memberAnswer) => {
  try {
    // DTO 구조에 맞춰 { memberAnswer: "선택한답" } 전달
    const response = await api.post(`/api/quiz/${quizId}/submit`, {
      memberAnswer: memberAnswer
    });
    return response.data.result; // SubmitResultDTO 반환
  } catch (error) {
    console.error("퀴즈 제출 실패:", error);
    return null;
  }
};