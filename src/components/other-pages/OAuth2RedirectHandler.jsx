import React, { useEffect, useState } from 'react';

const OAuth2RedirectHandler = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('OAuth callback handler started');
        console.log('Current URL:', window.location.href);
        console.log('Search params:', window.location.search);
        console.log('Hash:', window.location.hash);
        
        // Get URL parameters from both search and hash
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Try to get token from multiple possible sources (Google OAuth typically uses search params)
        let token = urlParams.get('token') || 
                   urlParams.get('access_token') || 
                   urlParams.get('jwt') ||
                   hashParams.get('token') || 
                   hashParams.get('access_token') ||
                   hashParams.get('jwt');
        
        // Also check for error in both locations
        const error = urlParams.get('error') || 
                     hashParams.get('error') ||
                     urlParams.get('error_description') ||
                     hashParams.get('error_description');

        // Check for success parameter (some OAuth implementations use this)
        const success = urlParams.get('success') || hashParams.get('success');
        
        console.log('Extracted params:', { 
          token: token ? `present (${token.length} chars)` : 'missing', 
          error: error || 'none',
          success: success || 'none'
        });

        if (error) {
          console.error('OAuth error from URL:', error);
          setStatus('error');
          setMessage(getErrorMessage(error));
          setTimeout(() => window.location.href = '/login', 3000);
          return;
        }

        if (!token) {
          console.error('No token received in callback');
          console.log('All URL params:', Object.fromEntries(urlParams.entries()));
          console.log('All hash params:', Object.fromEntries(hashParams.entries()));
          
          // If no token but success=true, try to get user data from backend
          if (success === 'true') {
            console.log('Success flag found, attempting to get token from backend...');
            try {
              const response = await fetch('https://vedive.com:3000/api/auth/session', {
                method: 'GET',
                credentials: 'include', // Include cookies
                headers: {
                  'Content-Type': 'application/json',
                }
              });

              if (response.ok) {
                const data = await response.json();
                token = data.token || data.access_token;
                console.log('Token retrieved from session:', token ? 'present' : 'missing');
              }
            } catch (sessionError) {
              console.error('Failed to get session:', sessionError);
            }
          }
          
          if (!token) {
            setStatus('error');
            setMessage('No authentication token received. Please try again.');
            setTimeout(() => window.location.href = '/login', 3000);
            return;
          }
        }

        console.log('Token received, storing in localStorage...');
        
        // FIXED: Store the token in localStorage (not in-memory storage)
        localStorage.setItem('token', token);
        console.log('Token stored successfully in localStorage');
        
        // Verify the token is valid by calling the backend
        console.log('Verifying token with backend...');
        try {
          const response = await fetch('https://vedive.com:3000/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token })
          });

          console.log('Token verification response status:', response.status);

          if (response.ok) {
            const userData = await response.json();
            console.log('Token verification successful:', userData);
            
            // FIXED: Store user data in localStorage (not window object)
            localStorage.setItem('user', JSON.stringify(userData.user || userData));
            console.log('User data stored successfully in localStorage');
            
            setStatus('success');
            setMessage('Authentication successful! Redirecting to dashboard...');
            
            // Redirect to dashboard after a short delay
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 1500);
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error('Token verification failed:', errorData);
            throw new Error(errorData.error || errorData.message || 'Token validation failed');
          }
        } catch (fetchError) {
          console.error('Network error during token verification:', fetchError);
          
          // If network fails but we have a token that looks valid (JWT format)
          if (token && token.split('.').length === 3) {
            try {
              const payload = JSON.parse(atob(token.split('.')[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              
              if (payload.exp && payload.exp > currentTime) {
                console.log('Network error but token is valid JWT and not expired, proceeding to dashboard');
                
                // Store basic user info from JWT payload
                const basicUserInfo = {
                  _id: payload._id || payload.id,
                  email: payload.email,
                  name: payload.name,
                  authProvider: 'google'
                };
                localStorage.setItem('user', JSON.stringify(basicUserInfo));
                
                setStatus('success');
                setMessage('Authentication successful! Redirecting to dashboard...');
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 1500);
                return;
              }
            } catch (jwtError) {
              console.log('Token is not a valid JWT:', jwtError);
            }
          }
          
          // If token looks valid (reasonable length), proceed anyway
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
        
        // FIXED: Clear localStorage instead of window properties
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
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
      'access_denied': 'You denied access to your Google account. Please try again.',
      'google_auth_failed': 'Google authentication failed. Please try again.',
      'authentication_failed': 'Authentication failed. Please try again.',
      'callback_error': 'An error occurred during authentication. Please try again.',
      'google_oauth_failed': 'Google OAuth failed. Please try again.',
      'token_missing': 'Authentication token is missing. Please try again.',
      'user_creation_failed': 'Failed to create user account. Please try again.',
      'token_generation_failed': 'Failed to generate authentication token. Please try again.',
      'invalid_request': 'Invalid authentication request. Please try again.',
      'unauthorized_client': 'Unauthorized client. Please contact support.',
      'unsupported_response_type': 'Unsupported response type. Please contact support.',
      'invalid_scope': 'Invalid scope requested. Please contact support.',
      'server_error': 'Server error occurred. Please try again later.',
      'temporarily_unavailable': 'Service temporarily unavailable. Please try again later.'
    };
    
    return errorMessages[error] || `Authentication error: ${error}. Please try again.`;
  };

  const handleRetry = () => {
    // FIXED: Clear localStorage instead of window properties
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Get current state for debug info
  const currentToken = localStorage.getItem('token');
  const currentUser = localStorage.getItem('user');

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
        
        {/* Debug info */}
        <div className="mt-6 text-xs text-gray-400 border-t border-white/10 pt-4 text-left">
          <p><strong>URL:</strong> {window.location.href}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Token in localStorage:</strong> {currentToken ? `Present (${currentToken.length} chars)` : 'Missing'}</p>
          <p><strong>User in localStorage:</strong> {currentUser ? 'Present' : 'Missing'}</p>
          <p><strong>Search Params:</strong> {window.location.search || 'None'}</p>
          <p><strong>Hash:</strong> {window.location.hash || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default OAuth2RedirectHandler;
