import React, { useState } from 'react';

const NewsQuiz = ({ quizList }) => {
  const [userAnswers, setUserAnswers] = useState({}); // { quizId: selectedOption }
  const [showExplanations, setShowExplanations] = useState({}); // { quizId: boolean }

  const handleOptionClick = (quizId, optionText, isCorrect) => {
    if (showExplanations[quizId]) return; // 이미 정답 확인했으면 클릭 불가

    setUserAnswers(prev => ({ ...prev, [quizId]: optionText }));
    setShowExplanations(prev => ({ ...prev, [quizId]: true }));
  };

  if (!quizList || quizList.length === 0) return null;

  return (
    <div className="mt-20 border-t pt-12 pb-20">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <span className="text-3xl">📝</span> AI가 생성한 핵심 체크 퀴즈
      </h3>

      <div className="space-y-10">
        {quizList.map((quiz, index) => (
          <div key={quiz.id} className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
                {index + 1}
              </span>
              <p className="text-lg font-semibold text-gray-800 pt-1">{quiz.question}</p>
            </div>

            {/* 선택지 영역 */}
            <div className="grid grid-cols-1 gap-3 ml-12">
              {quiz.quizOptionList.map((option) => {
                const isSelected = userAnswers[quiz.id] === option.optionText;
                const isCorrect = option.isCorrect;
                const revealed = showExplanations[quiz.id];

                let btnClass = "p-4 rounded-xl border-2 transition-all text-left font-medium ";
                if (!revealed) {
                  btnClass += "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50";
                } else {
                  if (isCorrect) btnClass += "bg-green-50 border-green-500 text-green-700";
                  else if (isSelected) btnClass += "bg-red-50 border-red-500 text-red-700";
                  else btnClass += "bg-white border-gray-100 text-gray-400";
                }

                return (
                  <button
                    key={option.optionOrder}
                    onClick={() => handleOptionClick(quiz.id, option.optionText, isCorrect)}
                    className={btnClass}
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.optionText}</span>
                      {revealed && isCorrect && <span className="text-xl">✅</span>}
                      {revealed && isSelected && !isCorrect && <span className="text-xl">❌</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 해설 영역 */}
            {showExplanations[quiz.id] && (
              <div className="mt-6 ml-12 p-5 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-indigo-900 leading-relaxed">
                  <span className="font-bold mr-2">💡 해설:</span>
                  {quiz.explanation}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsQuiz;