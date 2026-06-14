import { Link } from 'react-router-dom';
import { Dumbbell, ClipboardList, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-neon-400 flex items-center justify-center text-black">
            <Dumbbell size={20} />
          </div>
          <span>AI-Fit</span>
        </Link>
        {isLoggedIn && (
          <div className="flex items-center gap-6 text-sm font-medium text-zinc-300">
            <Link to="/dashboard" className="hover:text-neon-400 transition-colors">대시보드</Link>
            <Link to="/meal/add" className="hover:text-neon-400 transition-colors">칼로리 계산</Link>
            <Link to="/exercise/recommend" className="hover:text-neon-400 transition-colors">AI 루틴</Link>
            <Link to="/exercise/routines" className="hover:text-neon-400 transition-colors">나의 루틴</Link>
            
            <div className="relative group py-5">
              <Link to="/community" className="flex items-center gap-1 hover:text-neon-400 transition-colors">
                커뮤니티
              </Link>
              
              {/* Dropdown Menu */}
              <div className="absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top translate-y-2 group-hover:translate-y-0 z-50">
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col p-2">
                  <Link 
                    to="/community/routines" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 hover:text-neon-400 transition-colors text-zinc-300"
                  >
                    <ClipboardList size={16} />
                    <span>루틴 공유</span>
                  </Link>
                  <Link 
                    to="/community/mates" 
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800 hover:text-neon-400 transition-colors text-zinc-300"
                  >
                    <UserPlus size={16} />
                    <span>운동 메이트 모집</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex items-center gap-4 text-sm font-medium">
          {isLoggedIn ? (
            <>
              <span className="text-zinc-300 font-bold hidden sm:inline-block">
                <span className="text-neon-400">{user?.ownerName || user?.username}</span>님 환영합니다!
              </span>
              <button 
                onClick={logout}
                className="px-4 py-2 rounded-md bg-neon-400 text-black hover:bg-neon-500 transition-colors font-semibold"
              >
                <span className="hidden sm:inline-block">로그아웃</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-zinc-300 hover:text-white transition-colors">로그인</Link>
              <Link to="/signup" className="px-4 py-2 rounded-md bg-neon-400 text-black hover:bg-neon-500 transition-colors font-semibold">
                시작하기
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
