import React, { useState } from 'react';
import Header from './components/common/Header';
import NewsTab from './components/news/NewsTab';
import DictionaryTab from './components/dictionary/DictionaryTab';
import QuizTab from './components/quiz/QuizTab';
import TermOverlay from './components/common/TermOverlay';
import AuthModal from './components/auth/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SocialLoginRedirect from './pages/SocialLoginRedirect';
import NewsDetail from './components/news/NewsDetail';
import { sampleTerms } from './data/mockData';

// 실제 로직이 담긴 메인 컨텐츠 컴포넌트
const NewconomyContent = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('news');
  
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [termPosition, setTermPosition] = useState({ x: 0, y: 0 });

  const handleTermClick = (e) => {
    if (e.target.classList.contains('economic-term')) {
      const termId = parseInt(e.target.dataset.termId);
      const term = sampleTerms.find(t => t.id === termId);
      const rect = e.target.getBoundingClientRect();
      
      setSelectedTerm(term);
      setTermPosition({ x: rect.left, y: rect.bottom + 5 });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <style>{`
        .economic-term {
          background: linear-gradient(120deg, #fef3c7 0%, #fde68a 100%);
          padding: 2px 4px; border-radius: 4px; cursor: pointer; font-weight: 600; color: #92400e; transition: all 0.2s;
        }
        .economic-term:hover {
          background: linear-gradient(120deg, #fde68a 0%, #fcd34d 100%); transform: translateY(-1px);
        }
      `}</style>

      {/* 헤더에 로그인 관련 UI 추가 */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />
          
          <div className="flex items-center gap-4 ml-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 px-3 py-1 rounded-full">
                  <span className="text-indigo-700 font-bold text-sm">ID: {user.memberId}</span>
                </div>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 shadow-md transition-all active:scale-95"
              >
                로그인 / 가입
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 pt-20">
        {activeTab === 'news' && <NewsTab onTermClick={handleTermClick} />}
        {activeTab === 'dictionary' && <DictionaryTab />}
        {activeTab === 'quiz' && <QuizTab setActiveTab={setActiveTab} />}
      </main>

      <TermOverlay 
        term={selectedTerm} 
        position={termPosition} 
        onClose={() => setSelectedTerm(null)} 
      />

      {/* 로그인 모달 */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<NewconomyContent />} />
          <Route path="/news/:newsId" element={<NewsDetail />} />
          <Route path="/oauth/callback" element={<SocialLoginRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;