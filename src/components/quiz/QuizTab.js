import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { generateTermQuiz, submitQuizAnswer } from '../../api/Quiz';

const QuizTab = ({ setActiveTab }) => {
  const [quizList, setQuizList] = useState([]); 
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // 정답 제출 후 '해설'을 보여주기 위한 상태
  const [currentResult, setCurrentResult] = useState(null); 
  const [submitting, setSubmitting] = useState(false);

  // 퀴즈 시작 (API 호출)
  const startQuiz = async () => {
    setLoading(true);
    const data = await generateTermQuiz();
    if (data && data.length > 0) {
      setQuizList(data);
      setCurrentIdx(0);
      setScore(0);
      setShowResults(false);
      setCurrentResult(null);
    }
    setLoading(false);
  };

  // 답안 제출 핸들러
  const handleAnswer = async (optionText) => {
    if (submitting || currentResult) return;

    const quiz = quizList[currentIdx];
    setSubmitting(true);

    // 1. 서버에 정답 제출
    const result = await submitQuizAnswer(quiz.id, optionText);
    
    if (result) {
      setCurrentResult(result);
      if (result.correct || result.isCorrect) {
        setScore(prev => prev + 1);
      }
    }
    setSubmitting(false);
  };

  // 다음 문제로 넘어가기
  const nextQuestion = () => {
    if (currentIdx < quizList.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setCurrentResult(null); // 결과창 초기화
    } else {
      setShowResults(true);
    }
  };

  // 1. 로딩 화면
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-20 shadow-lg text-center">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500 font-bold">AI가 용어 퀴즈를 생성하고 있습니다...</p>
      </div>
    );
  }

  // 2. 최종 결과 화면
  if (showResults) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-xl text-center border border-indigo-50">
        <div className="text-6xl mb-6">🏆</div>
        <h3 className="text-3xl font-bold text-gray-800 mb-2">학습 완료!</h3>
        <p className="text-lg text-gray-500 mb-8">경제 지식이 한 단계 성장했습니다.</p>
        <div className="bg-indigo-50 rounded-2xl p-6 mb-8">
          <p className="text-sm text-indigo-600 font-bold uppercase tracking-wider mb-1">Total Score</p>
          <p className="text-5xl font-black text-indigo-700">{score} / {quizList.length}</p>
        </div>
        <button 
          onClick={() => {
            setQuizList([]);
            setActiveTab('news');
          }} 
          className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          메인으로 돌아가기
        </button>
      </div>
    );
  }

  // 3. 퀴즈 진행 화면
  if (quizList.length > 0) {
    const quiz = quizList[currentIdx];
    const isSolved = !!currentResult;

    return (
      <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* 진행 바 */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-indigo-500 h-full transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / quizList.length) * 100}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
            {quiz.quizType === 'OX' ? 'O/X 퀴즈' : '객관식'}
          </span>
          <span className="text-gray-400 font-medium">{currentIdx + 1} / {quizList.length}</span>
        </div>

        <h3 className="text-2xl font-bold text-gray-800 mb-10 text-center leading-snug">
          {quiz.question}
        </h3>
        
        {/* 선택지 영역 */}
        <div className={`grid gap-4 ${quiz.quizType === 'OX' ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {quiz.quizOptionList.map((opt) => {
            const isUserChoice = currentResult?.memberAnswer === opt.optionText;
            const isCorrect = currentResult?.correctAnswer === opt.optionText;
            
            let btnStyle = "py-5 px-6 rounded-2xl font-bold text-lg border-2 transition-all shadow-sm ";
            if (!isSolved) {
              btnStyle += "bg-white border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 text-gray-700";
            } else {
              if (isCorrect) btnStyle += "bg-green-50 border-green-500 text-green-700 shadow-green-100";
              else if (isUserChoice) btnStyle += "bg-red-50 border-red-500 text-red-700 shadow-red-100";
              else btnStyle += "bg-white border-gray-50 text-gray-300 opacity-50";
            }

            return (
              <button 
                key={opt.optionOrder} 
                onClick={() => handleAnswer(opt.optionText)} 
                disabled={isSolved || submitting}
                className={btnStyle}
              >
                {opt.optionText}
              </button>
            );
          })}
        </div>

        {/* 정답 확인 후 해설창 */}
        {isSolved && (
          <div className="mt-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center gap-2 mb-2 font-bold">
              {currentResult.correct || currentResult.isCorrect ? "✅ 정답입니다!" : "🧐 아쉬워요!"}
            </div>
            <p className="text-indigo-900 text-sm leading-relaxed mb-6">{currentResult.explanation}</p>
            <button 
              onClick={nextQuestion}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
            >
              {currentIdx === quizList.length - 1 ? "결과 보기" : "다음 문제"}
            </button>
          </div>
        )}
      </div>
    );
  }

  // 4. 메인 선택 화면 (초기 상태)
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-gray-800 mb-3">🎯 경제 용어 퀴즈</h2>
        <p className="text-gray-500">지금까지 학습한 용어들을 복습해보세요.</p>
      </div>

      <div 
        onClick={startQuiz}
        className="group relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 shadow-2xl cursor-pointer overflow-hidden transition-all hover:-translate-y-1"
      >
        <div className="relative z-10 text-white">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 backdrop-blur-md">
            🚀
          </div>
          <h3 className="text-3xl font-bold mb-3">퀴즈 챌린지 시작</h3>
          <p className="text-indigo-100 mb-8 opacity-80">다양한 유형의 퀴즈로 실력을 테스트합니다.</p>
          <div className="flex items-center gap-2 font-bold text-lg">
            도전하기 <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {/* 장식용 배경 원 */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default QuizTab;