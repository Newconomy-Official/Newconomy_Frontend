import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsDetail, getNewsTerms, getTermDetail } from '../../api/News';
import TermPopup from './TermPopup';

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

const NewsDetail = () => {
  const { newsId } = useParams(); // URL의 :newsId 값을 가져옴
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [terms, setTerms] = useState([]);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const contentRef = useRef(null); // 본문 영역을 참조하기 위한 변수
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 }); // 팝업 위치 상태

  useEffect(() => {
    const fetchDetail = async () => {
      const newsData = await getNewsDetail(newsId);
      const termData = await getNewsTerms(newsId);
      setNews(newsData);
      setTerms(termData);
    };
    fetchDetail();
  }, [newsId]);
  
  useEffect(() => {
    const handleContentClick = async (e) => {
      const target = e.target.closest('[data-term-id]'); 
      if (!target) {
        setIsPopupOpen(false); // 단어 외 영역 클릭 시 팝업 닫기
        return;
      }

      const termId = target.getAttribute('data-term-id');

      const rect = target.getBoundingClientRect();
      setPopupPos({
        // 단어 바로 위 중앙에 위치시키기 위한 계산
        top: rect.top + window.scrollY - 10, // 단어 위쪽으로 10px 여백
        left: rect.left + window.scrollX + (rect.width / 2)
      });
      
      if (termId) {
        // 백엔드의 단일 용어 상세 조회 API 호출
        const termDetail = await getTermDetail(termId); 

        if (termDetail) {
          setSelectedTerm(termDetail);
          setIsPopupOpen(true);
        } 
      }
    };

    // 본문 영역(contentRef)에 클릭 리스너 등록
    const currentRef = contentRef.current;
    if (currentRef) {
      currentRef.addEventListener('click', handleContentClick);
    }

    // 컴포넌트가 사라질 때 리스너 제거 (메모리 누수 방지)
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('click', handleContentClick);
      }
    };
  }, [news]); // news가 로드되어 본문이 그려진 후에 실행

  const highlightContent = (content, termList) => {
    if (!content || termList.length === 0) return content;

    let highlighted = content;
    
    const sortedTerms = [...termList].sort((a, b) => b.termName.length - a.termName.length);

    sortedTerms.forEach(term => {
      const regex = new RegExp(`(${term.termName})`, 'g');
      // 여기서 data-term-id가 정확히 들어가 있는지 확인하세요!
      highlighted = highlighted.replace(regex, `<span class="bg-yellow-200 font-bold cursor-pointer" data-term-id="${term.termId}">$1</span>`);
    });

    return highlighted;
  };

  if (!news) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 네비게이션 바 (뒤로가기 등) */}
      <nav className="p-4 border-b flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-600 font-bold">← 뒤로가기</button>
        <span className="text-sm font-bold text-indigo-600">{CATEGORIES.find(c => c.label === news.newsCategory)?.key || '경제'}</span>
      </nav>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{news.title}</h1>
        
        <div className="flex gap-4 text-gray-400 mb-10 border-b pb-4">
          <span>출처: {news.source}</span>
          <span>작성일: {new Date(news.publishedAt).toLocaleString()}</span>
        </div>

        {news.newsImgUrl && (
          <img src={news.newsImgUrl} alt="news" className="w-full rounded-3xl mb-10 shadow-lg" />
        )}

        {/* 여기에 이제 하이라이팅 로직을 입힐 예정입니다 */}
        <div 
          ref={contentRef}
          className="text-gray-800 leading-relaxed text-xl whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: highlightContent(news.fullContent, terms) }}
        />
      </article>

      {/* 팝업 컴포넌트 연결 */}
      <TermPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        term={selectedTerm} 
        pos={popupPos} 
      />
    </div>
  );
};

export default NewsDetail;