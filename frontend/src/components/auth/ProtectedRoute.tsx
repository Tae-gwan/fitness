import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // 로딩 중일 때는 아무것도 보여주지 않거나, 스피너를 보여줄 수 있습니다.
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    // 원래 가려고 했던 페이지 정보를 state로 넘겨주면, 로그인 후 원래 페이지로 보낼 수 있습니다.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 로그인 된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
};

export default ProtectedRoute;
