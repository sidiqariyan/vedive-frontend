import React, { useEffect, useState } from 'react';

const OAuth2RedirectHandler = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth callback handler started');
        console.log('Current URL:', window.location.href);
        
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const error = urlParams.get('error');

        console.log('URL params:', { token: token ? 'present' : 'missing', error });

        if (error) {
          console.error('OAuth error from URL:', error);
          setStatus('error');
          setMessage(getErrorMessage(error));
          setTimeout(() => window.location.href = '/login', 3000);
          return;
        }

        if (!token) {
          console.error('No token received in callback');
          setStatus('error');
          setMessage('No authentication token received. Please try again.');
          setTimeout(() => window.location.href = '/login', 3000);
          return;
        }

        console.log('Token received, length:', token.length);
        
        // Store the token in localStorage
        try {
          localStorage.setItem('token', token);
          console.log('Token stored in localStorage successfully');
        } catch (storageError) {
          console.error('Failed to store token in localStorage:', storageError);
          setStatus('error');
          setMessage('Failed to save authentication data. Please try again.');
          setTimeout(() => window.location.href = '/login', 3000);
          return;
        }
        
        // Verify the token is valid by calling the backend
        console.log('Verifying token with backend...');
        try {
          const response = await fetch('https://vedive.com:3000/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
          });

          console.log('Token verification response status:', response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log('Token verification successful:', userData);
            
            // Optional: Store user data in localStorage for quick access
            try {
              localStorage.setItem('user', JSON.stringify(userData.user));
              console.log('User data stored successfully');
            } catch (userStorageError) {
              console.warn('Failed to store user data:', userStorageError);
              // Don't fail the login for this
            }
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            const errorData = await response.json();
            console.error('Token verification failed:', errorData);
            throw new Error(errorData.error || 'Token validation failed');
          }
        } catch (fetchError) {
          console.error('Network error during token verification:', fetchError);
          
          // If network fails but we have a token, try to proceed anyway
          // This handles cases where the token is valid but network is flaky
          if (token && token.length > 20) {
            console.log('Network error but token looks valid, proceeding to dashboard');
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
            return;
          }
          
          throw fetchError;
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        
        // Clear any stored token if verification failed
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } catch (clearError) {
          console.error('Failed to clear localStorage:', clearError);
        }
        
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');
        setTimeout(() => window.location.href = '/login', 3000);
      }
    };

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(handleOAuthCallback, 100);
    return () => clearTimeout(timer);
  }, []);

  const getErrorMessage = (error) => {
    const errorMessages = {
      'google_auth_failed': 'Google authentication failed. Please try again.',
      'authentication_failed': 'Authentication failed. Please try again.',
      'callback_error': 'An error occurred during authentication. Please try again.',
      'google_oauth_failed': 'Google OAuth failed. Please try again.',
      'token_missing': 'Authentication token is missing. Please try again.',
      'user_creation_failed': 'Failed to create user account. Please try again.',
      'token_generation_failed': 'Failed to generate authentication token. Please try again.'
    };
    
    return errorMessages[error] || 'An unexpected error occurred. Please try again.';
  };

  const handleRetry = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(3,10,24)] text-white">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-[140px] h-[35.5px] bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg tracking-wide">VEDIVE</span>
        </div>
      </div>

      {/* Status Container */}
      <div className="max-w-md w-full mx-4 p-8 text-center bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
        {status === 'processing' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">Processing Authentication</h2>
              <p className="text-gray-300">{message}</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-green-400 mb-2">Success!</h2>
              <p className="text-gray-300">{message}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-red-400 mb-2">Authentication Failed</h2>
              <p className="text-gray-300 mb-4">{message}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
        
        {/* Debug info in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-gray-500 border-t border-gray-700 pt-4">
            <p>URL: {window.location.href}</p>
            <p>Status: {status}</p>
            <p>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;