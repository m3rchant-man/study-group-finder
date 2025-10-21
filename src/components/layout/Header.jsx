import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Plus, Search, LogOut } from 'lucide-react';

/**
 * Header component for the application.
 *
 * Displays the application title, navigation links, and user-specific actions
 * like logout and welcome message.
 */
export default function Header() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <h1 className="text-xl font-bold text-gray-900">
              <Link to="/">Study Group Finder</Link>
            </h1>
            <nav className="flex space-x-4">
              <Link
                to="/dashboard"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Calendar className="w-4 h-4 mr-1" />
                My Meetings
              </Link>
            </nav>
          </div>

          {currentUser && (
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">
                Welcome, {currentUser.displayName || currentUser.email.split('@')[0]}!
              </p>
              <Link
                to="/create"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Plus className="w-4 h-4 mr-1" />
                Create Meeting
              </Link>
              <Link
                to="/find"
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <Search className="w-4 h-4 mr-1" />
                Find Meetings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

