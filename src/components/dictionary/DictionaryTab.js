import React, { useState, useEffect } from 'react';
import api from "../../api/index";
import { ChevronRight, Loader2, ArrowLeft, BookOpen } from 'lucide-react';

const DictionaryTab = () => {
  const [terms, setTerms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 상세 정보 관리를 위한 상태
  const [selectedTermDetail, setSelectedTermDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // 1. 전체 목록 조회 (백엔드: GET /api/term)
  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user')); // 저장된 토큰 가져오기

        const response = await api.get(`/api/term`, {
          headers: {
            'Authorization': user ? `Bearer ${user.accessToken}` : '',
          }
        });

        const result = response.data;
        
        if (result.isSuccess) {
          setTerms(result.result.terms); 
        } else {
          throw new Error(result.message);
        }
      } catch (err) {
        setError("용어 목록을 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();
  }, []);

  // 2. 단일 용어 상세 조회 (백엔드: GET /api/terms/{termId})
  const handleTermClick = async (termId) => {
    try {
      setDetailLoading(true);
      const user = JSON.parse(localStorage.getItem('user')); // 저장된 토큰 가져오기

      const response = await api.get(`api/term/${termId}`, {
        headers: {
          'Authorization': user ? `Bearer ${user.accessToken}` : '',
        }
      });

      const result = response.data;
      
      if (result.isSuccess) {
        // 백엔드 DTO: { termId, termName, detailedExplanation }
        setSelectedTermDetail(result.result);
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("상세 정보를 가져오는 데 실패했습니다.");
    } finally {
      setDetailLoading(false);
    }
  };

  const filteredTerms = terms.filter(t => 
    t.termName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- UI 화면 분기 ---

  // 로딩 화면
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-96">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <p className="text-gray-500 font-medium">경제 용어 목록을 불러오는 중입니다...</p>
    </div>
  );

  // 에러 화면
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">다시 시도</button>
    </div>
  );

  // 상세 보기 화면
  if (selectedTermDetail) {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in duration-500">
        <button 
          onClick={() => setSelectedTermDetail(null)} 
          className="group mb-6 text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          목록으로 돌아가기
        </button>
        
        <div className="bg-white rounded-3xl p-10 shadow-xl border border-indigo-50 relative overflow-hidden">
          {/* 장식용 배경 아이콘 */}
          <BookOpen className="absolute -right-8 -top-8 w-40 h-40 text-indigo-50 opacity-50" />
          
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-xs font-bold tracking-wider uppercase mb-6 inline-block">
              Term Definition
            </span>
            <h2 className="text-4xl font-black text-gray-900 mb-8 leading-tight">
              {selectedTermDetail.termName}
            </h2>
            
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-8 border-l-8 border-indigo-500">
                <p className="text-gray-700 text-xl leading-relaxed whitespace-pre-wrap">
                  {/* 핵심 수정 포인트: detailedExplanation 사용 */}
                  {selectedTermDetail.detailedExplanation}
                </p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4 italic">💡 학습 팁</h4>
              <p className="text-gray-500 text-sm">
                이 용어는 최근 금융 뉴스에서 자주 언급되는 핵심 용어입니다. 
                관련된 기사를 찾아 읽으며 실전 감각을 익혀보세요!
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 목록 화면
  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* 상세 로딩 중일 때 표시할 오버레이 */}
      {detailLoading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <span className="font-bold text-gray-700">상세 정보 로드 중...</span>
          </div>
        </div>
      )}

      <div className="mb-10 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">경제 용어 사전</h2>
        <p className="text-gray-500">총 {terms.length}개의 전문 용어를 자유롭게 학습하세요.</p>
      </div>
      
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200 mb-8 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
        <input 
            type="text" 
            placeholder="어떤 용어가 궁금하신가요?" 
            className="w-full px-6 py-4 bg-transparent outline-none text-lg"
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.length > 0 ? (
          filteredTerms.map(term => (
            <div 
              key={term.termId} 
              onClick={() => handleTermClick(term.termId)} 
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex-1">
                <h3 className="font-bold text-xl text-gray-800 group-hover:text-indigo-600 transition-colors mb-1">
                  {term.termName}
                </h3>
                <p className="text-gray-400 text-xs font-medium">CLICK TO VIEW DETAIL</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 transition-all">
                <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:text-white" />
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-gray-400">
            검색 결과가 없습니다. 다시 입력해 주세요.
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryTab;