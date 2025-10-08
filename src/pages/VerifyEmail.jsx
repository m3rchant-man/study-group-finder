import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function VerifyEmail() {
  const { currentUser, sendVerificationEmail, logout, reloadUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleResend = async () => {
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await sendVerificationEmail(currentUser);
      setMessage('A new verification email has been sent.');
    } catch {
      setError('Failed to send verification email.');
    }
    setLoading(false);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      setError('Failed to log out.');
    }
  };

  const handleCheckVerification = async () => {
    setVerifyLoading(true);
    setError('');
    setMessage('');
    try {
      await reloadUser();
      // After reloading user data, a page refresh will re-evaluate the email verification status.
      // If the email is verified, the useEffect hook will redirect to the home page.
      // If not, the user will remain on this page.
      window.location.reload();
    } catch {
      setError("Failed to check verification status. Please try again.");
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A verification link has been sent to <strong>{currentUser?.email}</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Please check your inbox and click the link to activate your account.
          </p>
        </div>
        
        {message && <div className="text-green-600 text-sm">{message}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="mt-6 space-y-4">
          <button
            onClick={handleCheckVerification}
            disabled={verifyLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {verifyLoading ? 'Checking...' : "I've Verified My Email"}
          </button>
          <button
            onClick={handleResend}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </div>
        
        <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
                Incorrect email?{' '}
                <button onClick={handleLogout} className="font-medium text-indigo-600 hover:text-indigo-500">
                    Log out and use a different email
                </button>
            </p>
        </div>
      </div>
    </div>
  );
}
