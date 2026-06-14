import { Link } from 'react-router-dom';
import { Dumbbell, Activity, Utensils, Brain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function LandingPage() {
  const { isLoggedIn } = useAuth();

  // 이미 로그인된 상태라면 대시보드로 이동
  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-black text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neon-400/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="container mx-auto px-4 z-10 flex flex-col items-center text-center max-w-4xl py-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-neon-400 text-sm mb-8 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-500"></span>
          </span>
          AI 피트니스 솔루션, AI-Fit
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          당신만의 완벽한 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-400 to-green-300">
            피트니스 파트너
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-2xl leading-relaxed">
          AI가 분석해주는 맞춤형 식단과 운동 루틴.
          더 스마트하게 건강을 관리하고 목표를 달성하세요.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto">
          <Link 
            to="/signup" 
            className="px-8 py-4 rounded-xl bg-neon-400 text-black font-bold text-lg hover:bg-neon-500 transition-all hover:scale-105 shadow-[0_0_20px_rgba(74,222,128,0.3)] flex items-center justify-center gap-2"
          >
            무료로 시작하기
            <Dumbbell size={20} />
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-all flex items-center justify-center"
          >
            로그인
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-left hover:border-neon-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-neon-400/10 flex items-center justify-center text-neon-400 mb-4">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">AI 맞춤 루틴</h3>
            <p className="text-zinc-400">당신의 체형과 목표에 맞춘 최적의 운동 루틴을 AI가 설계합니다.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-left hover:border-neon-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-neon-400/10 flex items-center justify-center text-neon-400 mb-4">
              <Utensils size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">스마트 식단 관리</h3>
            <p className="text-zinc-400">칼로리와 매크로 영양소를 고려한 체계적인 식단 관리를 시작하세요.</p>
          </div>
          
          <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm text-left hover:border-neon-400/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-neon-400/10 flex items-center justify-center text-neon-400 mb-4">
              <Activity size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">실시간 성장 기록</h3>
            <p className="text-zinc-400">매일의 변화를 기록하고 시각화된 데이터로 동기를 부여받으세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
