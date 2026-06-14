import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/ui/Navbar';
import Dashboard from '@/pages/Dashboard';
import LandingPage from '@/pages/LandingPage';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import AddMeal from '@/pages/AddMeal';
import RecommendationPage from '@/pages/RecommendationPage';
import RoutinePage from '@/pages/RoutinePage';
import PlaceholderPage from '@/pages/Placeholder';
import { RoutineProvider } from '@/context/RoutineContext';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <RoutineProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Navbar />
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot" element={<ForgotPassword />} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/meal/add" element={<ProtectedRoute><AddMeal /></ProtectedRoute>} />
              <Route path="/exercise/recommend" element={<ProtectedRoute><RecommendationPage /></ProtectedRoute>} />
              <Route path="/exercise/routines" element={<ProtectedRoute><RoutinePage /></ProtectedRoute>} />
              <Route path="/community" element={<ProtectedRoute><PlaceholderPage title="커뮤니티" /></ProtectedRoute>} />
              <Route path="/community/routines" element={<ProtectedRoute><PlaceholderPage title="루틴 공유" /></ProtectedRoute>} />
              <Route path="/community/mates" element={<ProtectedRoute><PlaceholderPage title="운동 메이트" /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </RoutineProvider>
    </AuthProvider>
  );
}

export default App;
