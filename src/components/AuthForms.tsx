import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface AuthFormsProps {
  onSuccess: () => void;
  initialMode?: 'signup' | 'signin';
}

export const AuthForms: React.FC<AuthFormsProps> = ({ 
  onSuccess, 
  initialMode = 'signin' 
}) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [showModal, setShowModal] = useState(true);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Password confirmation check for signup
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const url = isSignUp ? '/api/auth/signup' : '/api/auth/signin';
    const body = isSignUp 
      ? { fullName, username, email, password } 
      : { email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        if (isSignUp) {
          toast.success('Successfully registered! You can now sign in.', {
            duration: 1000,
            position: 'top-center',
          });
          setIsClosing(true);
          setTimeout(() => {
            setShowModal(false);
            onSuccess();
            setIsClosing(false);
          }, 1000);
        } else {
          toast.success('Successfully logged into your account!', {
            duration: 1000,
            position: 'top-center',
          });
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          setIsClosing(true);
          setTimeout(() => {
            setShowModal(false);
            onSuccess();
            setIsClosing(false);
          }, 1000);
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      onSuccess();
      setIsClosing(false);
    }, 1000);
  };

  // Loader component
  const ClosingLoader = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
    </div>
  );

  // If modal is closing, show loader
  if (isClosing) {
    return <ClosingLoader />;
  }

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
              disabled={loading}
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                </>
              )}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  className="w-full p-2 border rounded"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {isSignUp && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full p-2 border rounded"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`w-full text-white py-2 rounded ${
                  loading
                    ? 'bg-red-300 cursor-not-allowed' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </button>
            </form>
            <p className="mt-4 text-center">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                className="text-red-500 hover:underline"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  // Reset password fields when switching modes
                  setPassword('');
                  setConfirmPassword('');
                }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};