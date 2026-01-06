import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SocialLoginRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const processed = useRef(false); // StrictMode로 인해 두 번 실행되는 것 방지

  useEffect(() => {
    if (processed.current) return;

    const params = new URLSearchParams(location.search);
    const accessToken = params.get('token');
    const memberId = params.get('memberId');

    if (accessToken) {
      processed.current = true;
      console.log("인증 정보 감지! 홈으로 이동을 시작합니다.");

      login({ accessToken, memberId });

      setTimeout(() => {
        window.location.assign("/"); 
      }, 100);
    } else {
      console.error("인증 실패: 토큰이 없습니다.");
      navigate('/', { replace: true });
    }
  }, [location, login, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="mt-6 text-xl font-bold text-gray-900">로그인 인증 완료!</h2>
        <p className="mt-2 text-gray-500">메인 화면으로 안전하게 이동하고 있습니다...</p>
      </div>
    </div>
  );
};

export default SocialLoginRedirect;