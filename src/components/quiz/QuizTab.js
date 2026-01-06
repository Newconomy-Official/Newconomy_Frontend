import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { sampleQuizzes } from '../../data/mockData';

const QuizTab = () => {
  const [quizMode, setQuizMode] = useState(null); // 'ox' or 'multiple'
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const startQuiz = (type) => {
    setQuizMode(type);
    setCurrentQuiz(0);
    setScore(0);
    setShowResults(false);
  };

  const submitAnswer = (answer) => {
    const quizData = sampleQuizzes[quizMode];
    if (answer === quizData[currentQuiz].answer) {
        setScore(score + 1);
    }

    if (currentQuiz < quizData.length - 1) {
      setCurrentQuiz(currentQuiz + 1);
    } else {
      setShowResults(true);
    }
  };

  // 1. 결과 화면
  if (showResults) {
     const total = sampleQuizzes[quizMode].length;
     return (
        <div className="bg-white rounded-xl p-8 shadow-lg text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">퀴즈 완료!</h3>
            <p className="text-4xl font-bold text-indigo-600 mb-8">{score} / {total} 정답</p>
            <button onClick={() => setQuizMode(null)} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg">다른 퀴즈 풀기</button>
        </div>
     );
  }

  // 2. 퀴즈 진행 화면
  if (quizMode) {
    const quizData = sampleQuizzes[quizMode];
    const question = quizData[currentQuiz];

    return (
        <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">{quizMode === 'ox' ? 'O/X 퀴즈' : '4지선다'} ({currentQuiz + 1}/{quizData.length})</h3>
            <p className="text-xl font-medium mb-8 text-center">{question.question}</p>
            
            {quizMode === 'ox' ? (
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => submitAnswer(true)} className="py-8 bg-green-500 text-white rounded-xl text-3xl font-bold">⭕</button>
                    <button onClick={() => submitAnswer(false)} className="py-8 bg-red-500 text-white rounded-xl text-3xl font-bold">❌</button>
                </div>
            ) : (
                <div className="grid gap-3">
                    {question.options.map((opt, idx) => (
                        <button key={idx} onClick={() => submitAnswer(idx)} className="p-4 border-2 rounded-xl text-left hover:bg-purple-50">{idx + 1}. {opt}</button>
                    ))}
                </div>
            )}
        </div>
    );
  }

  // 3. 메인 선택 화면
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎯 경제 용어 퀴즈</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div onClick={() => startQuiz('ox')} className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-8 shadow-lg cursor-pointer text-white">
          <h3 className="text-2xl font-bold mb-3">O/X 퀴즈</h3>
          <p>맞으면 O, 틀리면 X!</p>
        </div>
        <div onClick={() => startQuiz('multiple')} className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-8 shadow-lg cursor-pointer text-white">
          <h3 className="text-2xl font-bold mb-3">4지선다 퀴즈</h3>
          <p>정답을 맞춰보세요!</p>
        </div>
      </div>
    </div>
  );
};

export default QuizTab;