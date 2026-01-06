import React from 'react';

const TermPopup = ({ isOpen, onClose, term, pos }) => {
  if (!isOpen || !term) return null;

  return (
    <>
      {/* 팝업 외 영역 클릭 시 닫기 위한 투명 오버레이 */}
      <div className="fixed inset-0 z-[190]" onClick={onClose} />
      
      {/* 말풍선 팝업 */}
      <div 
        className="absolute z-[200] -translate-x-1/2 -translate-y-full px-4 py-3 bg-white/90 backdrop-blur-md border border-indigo-100 shadow-xl rounded-2xl w-72 animate-in fade-in slide-in-from-bottom-2 duration-200"
        style={{ top: pos.top, left: pos.left }}
      >
        <div className="relative">
          <h4 className="text-sm font-bold text-indigo-600 mb-1">
            {term.termName}
          </h4>
          <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
            {term.briefExplanation}
          </p>
          
          {/* 말풍선 꼬리 */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/90"></div>
        </div>
      </div>
    </>
  );
};

export default TermPopup;