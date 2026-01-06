import React from 'react';

const TermModal = ({ isOpen, onClose, term }) => {
  if (!isOpen || !term) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-indigo-600">
              🔍 {term.termName}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
          </div>
          <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 max-h-60 overflow-y-auto">
            {term.briefExplanation}
          </div>
          <button 
            onClick={onClose}
            className="w-full mt-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermModal;