import React, { useEffect, useState } from 'react';
import { getNewsList } from '../../api/News';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { key: '경제', label: 'MAIN' },
  { key: '금융', label: 'FINANCE' },
  { key: '증권', label: 'STOCK' },
  { key: '산업/재계', label: 'INDUSTRY' },
  { key: '중기/벤처', label: 'VENTURE' },
  { key: '부동산', label: 'REAL_ESTATE' },
  { key: '글로벌 경제', label: 'GLOBAL_ECONOMY' },
  { key: '생활경제', label: 'LIFE' },
  { key: '일반', label: 'NORMAL' }
];

const NewsTab = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('MAIN');
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 (0부터 시작)

  const navigate = useNavigate();

  const handleNewsClick = async (newsId) => {
    navigate(`/news/${newsId}`);
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const data = await getNewsList(currentCategory, currentPage);
      setNewsList(data || []);
      setLoading(false);

      window.scrollTo(0, 0);
    };
    fetchNews();
  }, [currentCategory, currentPage]);

  const handleCategoryChange = (catKey) => {
    setCurrentCategory(catKey);
    setCurrentPage(0);
  };

  if (loading) return <div className="p-10 text-center">뉴스를 불러오는 중...</div>;

  const pageNumbers = [0, 1, 2, 3, 4];

  return (
    <div className="max-w-7xl mx-auto">
      {/* 1. 카테고리 탭 */}
      <div className="flex overflow-x-auto pb-4 gap-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => handleCategoryChange(cat.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all
              ${currentCategory === cat.key 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {cat.key}
          </button>
        ))}
      </div>

      {/* 2. 뉴스 카드 리스트 */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {newsList.map((news) => (
            <div 
              key={news.newsId} 
              onClick={() => handleNewsClick(news.newsId)}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
            >
              <div className="flex flex-col h-full">
                <span className="text-xs font-bold text-indigo-500 mb-3">
                  {CATEGORIES.find(c => c.key === currentCategory)?.key || '경제'}
                </span>
                <h3 className="text-lg font-bold text-gray-900 leading-snug mb-4 group-hover:text-indigo-600 transition-colors">
                  {news.title}
                </h3>
                <div className="mt-auto flex justify-between items-center text-sm text-gray-400">
                  <span className="truncate max-w-[150px]">{news.originalUrl}</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. 숫자 페이지네이션 UI */}
      <div className="flex justify-center items-center gap-2 mt-12 mb-20">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
        >
          &lt;
        </button>

        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setCurrentPage(num)}
            className={`w-10 h-10 rounded-lg border font-bold transition-all
              ${currentPage === num 
                ? 'bg-indigo-600 text-white border-indigo-600' 
                : 'bg-white text-gray-600 hover:border-indigo-400'}`}
          >
            {num + 1} {/* 화면에는 1부터 표시 */}
          </button>
        ))}

        <button 
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={newsList.length < 10} // 가져온 데이터가 10개 미만이면 다음 페이지 없음으로 간주
          className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30"
        >
          &gt;
        </button>
      </div>

      {!loading && newsList.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
          <p className="text-gray-400">해당 카테고리의 뉴스가 아직 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default NewsTab;