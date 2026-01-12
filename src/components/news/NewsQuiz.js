import React, { useState } from 'react';
import { submitQuizAnswer } from '../../api/Quiz';

const NewsQuiz = ({ quizList }) => {
  const [results, setResults] = useState({}); // { quizId: SubmitResultDTO }
  const [submitting, setSubmitting] = useState({}); // 로딩 상태 관리

  // 로그인 여부 확인 (LocalStorage 기반)
  const isLoggedIn = !!localStorage.getItem('user');

  const handleOptionClick = async (quizId, optionText, quiz) => {
    // 이미 풀었거나 제출 중이면 중복 호출 방지
    if (results[quizId] || submitting[quizId]) return;

    // 1. 로그인 상태인 경우: 서버에 제출 및 저장
    if (isLoggedIn) {
      setSubmitting(prev => ({ ...prev, [quizId]: true }));
      const resultData = await submitQuizAnswer(quizId, optionText);
      if (resultData) {
        setResults(prev => ({ ...prev, [quizId]: resultData }));
      }
      setSubmitting(prev => ({ ...prev, [quizId]: false }));
    }
    // 2. 비로그인 상태인 경우: 프론트엔드에서 즉시 정답 확인 (저장 X)
    else {
      // 서버 응답 DTO와 동일한 구조를 가짜(Mock)로 생성
      const isCorrect = quiz.correctAnswer === optionText;
      const mockResult = {
        quizId: quiz.id,
        correct: isCorrect,  
        correctAnswer: quiz.correctAnswer,
        memberAnswer: optionText,
        explanation: quiz.explanation,
        isGuest: true // 비로그인 표시 (선택사항)
      };
      setResults(prev => ({ ...prev, [quizId]: mockResult }));
    }
  };

  if (!quizList || quizList.length === 0) return null;

return (
    <div className="mt-20 border-t pt-12 pb-20">
      <div className="flex justify-between items-end mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-8">📝 AI 핵심 체크 퀴즈</h3>
        {!isLoggedIn && (
            <span className="text-sm text-amber-600 font-medium bg-amber-50 px-3 py-1 rounded-full">
              💡 로그인하면 퀴즈 기록을 저장할 수 있어요!
            </span>
          )}
        </div>

      <div className="space-y-10">
        {quizList.map((quiz, index) => {
          const result = results[quiz.id]; // 해당 퀴즈의 제출 결과
          const isSolved = !!result;       // 풀었는지 여부

          let options = quiz.quizOptionList || [];
          if (options.length === 0 && quiz.quizType === 'OX') {
            options = [
              { optionText: 'O', optionOrder: 1 },
              { optionText: 'X', optionOrder: 2 }
            ];
          }

          return (
            <div key={quiz.id} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                  {index + 1}
                </span>
                <p className="text-lg font-semibold text-gray-800 pt-1">
                  [{quiz.quizType}] {quiz.question}
                </p>
              </div>

              {/* O/X 퀴즈일 경우 가로 배열, 다지선다일 경우 세로 배열 */}
              <div className={`grid gap-3 ml-12 ${quiz.quizType === 'OX' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {options.map((option) => {
                  const isCorrectAnswer = isSolved && (result.correctAnswer === option.optionText);
                  const isUserSelection = isSolved && (result.memberAnswer === option.optionText);

                  let btnClass = "p-4 rounded-xl border-2 transition-all text-center font-bold ";

                  if (!isSolved) {
                    btnClass += "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                  } else {
                    // 정답인 경우 (초록색)
                    if (isCorrectAnswer) btnClass += "bg-green-100 border-green-500 text-green-700";
                    // 틀린 답을 선택한 경우 (빨간색)
                    else if (isUserSelection && !result.isCorrect) btnClass += "bg-red-100 border-red-500 text-red-700";
                    // 나머지
                    else btnClass += "bg-white border-gray-100 text-gray-300";
                  }

                  return (
                    <button
                      key={option.optionOrder}
                      onClick={() => handleOptionClick(quiz.id, option.optionText, quiz)}
                      disabled={isSolved}
                      className={btnClass}
                    >
                      <span className="text-xl">{option.optionText}</span>
                    </button>
                  );
                })}
              </div>

              {/* 결과 및 해설 영역 (서버에서 받은 데이터 기반) */}
              {isSolved && (
                <div className="mt-6 ml-12 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 mb-2">
                    {/* 📍 result.isCorrect가 확실히 true일 때만 '정답' 문구를 띄움 */}
                    {result.correct === true ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🎉</span>
                        <span className="text-green-600 font-bold text-lg">
                          정답입니다!
                          </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🧐</span>
                        <span className="text-red-600 font-bold text-lg">
                          아쉬워요! (정답: {result.correctAnswer})
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-indigo-900 leading-relaxed text-sm">
                    <span className="font-bold mr-2">💡 해설:</span>
                    {result.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsQuiz;