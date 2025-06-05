// Google OAuth authentication utilities
import { enhanceGoogleAvatarUrl } from './avatar';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'demo-client-id';

let googleAuth = null;
let isGoogleAvailable = false;

export function initGoogleAuth() {
  return new Promise((resolve) => {
    console.log('🔧 Initializing Google OAuth...');
    console.log('Client ID:', GOOGLE_CLIENT_ID);
    console.log('Is demo client ID?', GOOGLE_CLIENT_ID === 'demo-client-id');

    // Check if Google OAuth is available
    if (window.google && window.google.accounts) {
      try {
        // Don't initialize with demo client ID
        if (GOOGLE_CLIENT_ID === 'demo-client-id') {
          console.warn('⚠️ Using demo client ID - Google OAuth will not work');
          console.warn('Please update VITE_GOOGLE_CLIENT_ID in your .env file');
          isGoogleAvailable = false;
        } else {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
            use_fedcm_for_prompt: false // Disable FedCM to avoid issues
          });
          isGoogleAvailable = true;
          console.log('✅ Google OAuth initialized successfully');
        }
      } catch (error) {
        console.warn('❌ Google OAuth initialization failed:', error);
        isGoogleAvailable = false;
      }
    } else {
      // Fallback for development without Google OAuth
      console.warn('⚠️ Google OAuth script not available, using mock authentication');
      console.warn('Make sure the Google OAuth script is loaded in index.html');
      isGoogleAvailable = false;
    }
    resolve();
  });
}

function handleCredentialResponse(response) {
  try {
    console.log('🔐 Processing Google OAuth response...');
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      // Ensure we get a high-quality avatar from Google
      picture: enhanceGoogleAvatarUrl(payload.picture)
    };

    console.log('✅ Google OAuth successful:', {
      name: user.name,
      email: user.email,
      avatarUrl: user.picture
    });

    localStorage.setItem('herotrack_user', JSON.stringify(user));
    window.dispatchEvent(new CustomEvent('auth-change', { detail: user }));
  } catch (error) {
    console.error('❌ Error parsing credential response:', error);
  }
}



export function signInWithGoogle() {
  if (isGoogleAvailable && window.google && window.google.accounts) {
    try {
      // Try prompt first, but with better error handling
      window.google.accounts.id.prompt((notification) => {
        console.log('🔔 Prompt notification:', notification.getMomentType());

        if (notification.isNotDisplayed()) {
          console.warn('⚠️ Prompt not displayed:', notification.getNotDisplayedReason());
          // If prompt fails, we'll rely on the button in the UI
        } else if (notification.isSkippedMoment()) {
          console.warn('⚠️ Prompt skipped:', notification.getSkippedReason());
          // If prompt is skipped, we'll rely on the button in the UI
        }
      });
    } catch (error) {
      console.error('❌ Google sign-in prompt failed:', error);
      // Don't fallback to mock auth immediately - let the user try the button
    }
  } else {
    // Mock sign-in for development
    performMockSignIn();
  }
}

// New function to render Google sign-in button
export function renderGoogleSignInButton(elementId, options = {}) {
  if (isGoogleAvailable && window.google && window.google.accounts) {
    try {
      const defaultOptions = {
        theme: 'filled_blue',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: '100%',
        ...options
      };

      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        defaultOptions
      );

      console.log('✅ Google Sign-In button rendered successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to render Google Sign-In button:', error);
      return false;
    }
  }
  return false;
}

function performMockSignIn() {
  console.log('Using mock authentication for development');
  const mockUser = {
    id: 'mock-user-123',
    email: 'demo@herotrack.com',
    name: 'Demo User',
    // Use a more realistic avatar for demo purposes
    picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format&q=80'
  };
  localStorage.setItem('herotrack_user', JSON.stringify(mockUser));

  // Dispatch the event after a small delay to simulate async behavior
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent('auth-change', { detail: mockUser }));
  }, 100);
}

export function signOut() {
  localStorage.removeItem('herotrack_user');
  if (isGoogleAvailable && window.google && window.google.accounts) {
    try {
      window.google.accounts.id.disableAutoSelect();
    } catch (error) {
      console.warn('Error disabling Google auto-select:', error);
    }
  }
  window.dispatchEvent(new CustomEvent('auth-change', { detail: null }));
}

export function getCurrentUser() {
  const userStr = localStorage.getItem('herotrack_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated() {
  return getCurrentUser() !== null;
}
