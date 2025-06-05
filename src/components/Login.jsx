import React, { useState, useEffect, useRef } from 'react';
import { signInWithGoogle, renderGoogleSignInButton } from '../utils/auth';
import { Trophy, Target, BarChart3 } from 'lucide-react';

function Login() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showGoogleButton, setShowGoogleButton] = useState(false);
  const googleButtonRef = useRef(null);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      console.log('Attempting to sign in...');
      await signInWithGoogle();

      // Show Google button as fallback after a short delay
      setTimeout(() => {
        setShowGoogleButton(true);
      }, 2000);
    } catch (error) {
      console.error('Sign in error:', error);
      setShowGoogleButton(true);
    } finally {
      // Reset loading state after a delay
      setTimeout(() => setIsSigningIn(false), 3000);
    }
  };

  // Render Google button when it becomes visible
  useEffect(() => {
    if (showGoogleButton && googleButtonRef.current) {
      const success = renderGoogleSignInButton('google-signin-button', {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular'
      });

      if (!success) {
        console.log('Google button rendering failed, keeping custom button');
        setShowGoogleButton(false);
      }
    }
  }, [showGoogleButton]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HeroTrack</h1>
          <p className="text-gray-600">Track your Heroclix tournament performance</p>
        </div>

        {/* Features */}
        <div className="card mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Target className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Fast Match Logging</h3>
                <p className="text-sm text-gray-600">Quick entry between tournament rounds</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <BarChart3 className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Performance Analytics</h3>
                <p className="text-sm text-gray-600">Track wins, points, and trends over time</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Trophy className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Tournament History</h3>
                <p className="text-sm text-gray-600">Review past tournaments and matches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign In Button */}
        <div className="text-center">
          {/* Custom Sign In Button */}
          {!showGoogleButton && (
            <button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="btn-primary w-full mobile-touch flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningIn ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          )}

          {/* Google-rendered Sign In Button */}
          {showGoogleButton && (
            <div className="space-y-3">
              <div
                id="google-signin-button"
                ref={googleButtonRef}
                className="w-full"
              ></div>
              <p className="text-xs text-gray-600">
                ↑ Use the Google button above to sign in
              </p>
            </div>
          )}

          <div className="mt-4 space-y-2">
            <p className="text-xs text-gray-500">
              Your data is stored locally on your device for offline access
            </p>
            {!showGoogleButton && (
              <p className="text-xs text-blue-600">
                Demo mode: Click to sign in with a demo account
              </p>
            )}
            {showGoogleButton && (
              <p className="text-xs text-green-600">
                ✅ Google OAuth is ready - use the button above
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
