import React from 'react';
import { Newspaper, BookOpen, Trophy } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'news', label: '뉴스', icon: Newspaper },
    { id: 'dictionary', label: '용어 사전', icon: BookOpen },
    { id: 'quiz', label: '퀴즈', icon: Trophy },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">💰 경제 학습 플랫폼</h1>
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;