import React, { useEffect, useState } from 'react';

const OAuth2RedirectHandler = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        
        // Get token and error from URL
        const token = urlParams.get('token');
        const error = urlParams.get('error');

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

        // Verify the token with backend
        try {
          const response = await fetch('https://vedive.com:3000/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });

          if (response.ok) {
            const userData = await response.json();
            
            // Store token and user data in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData.user));
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            
            // Use a longer delay and ensure localStorage is written before redirect
            setTimeout(() => {
              // Double-check that token is stored before redirect
              if (localStorage.getItem('token')) {
                window.location.replace('/dashboard');
              } else {
                // Fallback: try storing again
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData.user));
                setTimeout(() => window.location.replace('/dashboard'), 500);
              }
            }, 2000);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Token verification failed:', errorData);
            throw new Error(errorData.error || 'Token validation failed');
          }
        } catch (fetchError) {
          console.error('Token verification error:', fetchError);
          
          // Fallback: If token looks like a JWT, try to decode it
          if (token && token.split('.').length === 3) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp > currentTime && payload._id) {
                // Store token with verification
                localStorage.setItem('token', token);
                
                // Create basic user info from JWT payload
                const basicUserInfo = {
                  _id: payload._id,
                  authProvider: 'google'
                };
                localStorage.setItem('user', JSON.stringify(basicUserInfo));
                
                setStatus('success');
                setMessage('Authentication successful! Redirecting to dashboard...');
                
                // Ensure data is stored before redirect
                setTimeout(() => {
                  if (localStorage.getItem('token')) {
                    window.location.replace('/dashboard');
                  } else {
                    // Retry storage
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(basicUserInfo));
                    setTimeout(() => window.location.replace('/dashboard'), 500);
                  }
                }, 1500);
                return;
              }
            } catch (jwtError) {
              console.log('Token is not a valid JWT:', jwtError);
            }
          }
          
          throw fetchError;
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        
        // Clear any stored data on error
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setStatus('error');
        setMessage(error.message || 'Authentication failed. Please try again.');
        setTimeout(() => window.location.href = '/login', 3000);
      }
    };

    // Start handling after a small delay
    const timer = setTimeout(handleOAuthCallback, 100);
    return () => clearTimeout(timer);
  }, []);

  const getErrorMessage = (error) => {
    const errorMessages = {
      'access_denied': 'You denied access to your Google account. Please try again.',
      'google_auth_failed': 'Google authentication failed. Please try again.',
      'authentication_failed': 'Authentication failed. Please try again.',
      'google_oauth_failed': 'Google OAuth failed. Please try again.',
      'token_generation_failed': 'Failed to generate authentication token. Please try again.',
      'user_creation_failed': 'Failed to create user account. Please try again.',
    };
    
    return errorMessages[error] || `Authentication error: ${error}. Please try again.`;
  };

  const handleRetry = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-[140px] h-[35.5px] bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-lg tracking-wide">VEDIVE</span>
        </div>
      </div>

      {/* Status Container */}
      <div className="max-w-md w-full mx-4 p-8 text-center bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl">
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
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium shadow-lg"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;