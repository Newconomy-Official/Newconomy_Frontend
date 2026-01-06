import React from 'react';
import { X } from 'lucide-react';

const TermOverlay = ({ term, position, onClose }) => {
  if (!term) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40" onClick={onClose} />
      <div
        className="fixed z-50 bg-white rounded-xl shadow-2xl p-6 max-w-md animate-fade-in-up"
        style={{
          left: `${Math.min(position.x, window.innerWidth - 350)}px`, // 화면 밖으로 안 나가게 조정
          top: `${position.y}px`
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-xl font-bold text-indigo-600">{term.term}</h4>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-700 leading-relaxed">{term.definition}</p>
        <div className="mt-4 pt-4 border-t">
          <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            용어 사전에서 자세히 보기 →
          </button>
        </div>
      </div>
    </>
  );
};

export default TermOverlay;