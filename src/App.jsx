import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Login from './components/auth/Login';
import Home from './pages/Home';
import CreateMeeting from './pages/CreateMeeting';
import FindMeeting from './pages/FindMeeting';
import Dashboard from './pages/Dashboard';
import MeetingDetail from './pages/MeetingDetail';
import Layout from './components/layout/Layout';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  if (!currentUser.emailVerified) {
    return <Navigate to="/verify-email" />;
  }
  return children ? children : <Outlet />;
}

// Main App Component
function AppContent() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateMeeting />} />
            <Route path="/find" element={<FindMeeting />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/meeting/:meetingId" element={<MeetingDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

// Root App Component
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;