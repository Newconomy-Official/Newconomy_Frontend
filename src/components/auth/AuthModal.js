import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login } = useAuth();
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState({
    email: '', password: '', name: '', nickname: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginView ? '/api/auth/login' : '/api/auth/signup';
    
    try {
      const response = await fetch(`http://localhost:8080${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (result.isSuccess) {
        if (isLoginView) {
          login(result.result); // accessToken 저장
          alert("로그인 성공!");
          onClose();
        } else {
          alert("회원가입 완료! 로그인 해주세요.");
          setIsLoginView(true);
        }
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("서버 연결에 실패했습니다.");
    }
  };

  const handleSocialLogin = (provider) => {
    // 백엔드의 OAuth2 엔드포인트로 브라우저 이동
    // 예: http://localhost:8080/oauth2/authorization/kakao
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative shadow-2xl">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-3xl font-black text-gray-900 mb-2">
          {isLoginView ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="text-gray-500 mb-8">
          {isLoginView ? '경제 학습을 다시 시작해볼까요?' : '뉴코노미와 함께 경제 전문가가 되어보세요.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="이름" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="닉네임" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={e => setFormData({...formData, nickname: e.target.value})} required />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input type="email" placeholder="이메일" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setFormData({...formData, email: e.target.value})} required />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input type="password" placeholder="비밀번호" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={e => setFormData({...formData, password: e.target.value})} required />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-indigo-700 transition-all mt-4">
            {isLoginView ? '로그인' : '회원가입'}
          </button>

          <div className="mt-6">
            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">또는 소셜 계정으로 로그인</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button 
                    onClick={() => handleSocialLogin('kakao')}
                    className="flex items-center justify-center py-3 bg-[#FEE500] text-[#191919] rounded-xl font-bold hover:opacity-90 transition-all"
                >
                        카카오 로그인
                    </button>
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        className="flex items-center justify-center py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                    >
                        구글 로그인
                    </button>
                </div>
            </div>
        </form>

        <button onClick={() => setIsLoginView(!isLoginView)} className="w-full text-center mt-6 text-indigo-600 font-medium hover:underline">
          {isLoginView ? '계정이 없으신가요? 회원가입' : '이미 계정이 있으신가요? 로그인'}
        </button>
      </div>
    </div>
  );
};

export default AuthModal;