# 🔐 Google OAuth Setup Guide for HeroTrack

This guide will help you set up real Google OAuth authentication so your users' Google profile pictures (avatars) import properly.

## 🚀 Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
node setup-oauth.js
```

### Option 2: Manual Setup
1. Update your `.env` file with your Google OAuth Client ID
2. Restart the development server
3. Test using the OAuth test page

## 📋 Detailed Instructions

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click the project dropdown at the top
   - Create new project: "HeroTrack" or select existing

3. **Enable Google Identity Services API**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Identity Services API"
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. **Configure OAuth Consent Screen** (if first time)
   - Go to "APIs & Services" → "OAuth consent screen"
   - Choose "External" user type
   - Fill in app name: "HeroTrack"
   - Add your email as developer contact
   - Save and continue

2. **Create OAuth Client ID**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: **Web application**
   - Name: "HeroTrack Web Client"

3. **Add Authorized JavaScript Origins**
   ```
   http://localhost:3000
   http://localhost:3001
   ```
   (Add your production domain later)

4. **Copy Client ID**
   - Format: `123456789-abcdefg.apps.googleusercontent.com`

### Step 3: Configure Your Application

#### Automated Configuration
```bash
node setup-oauth.js
```

#### Manual Configuration
1. **Update `.env` file:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id-here.apps.googleusercontent.com
   VITE_APP_NAME=HeroTrack
   VITE_APP_VERSION=1.0.0
   ```

2. **Restart development server:**
   ```bash
   npm run dev
   ```

### Step 4: Test Your Setup

1. **Open the OAuth test page:**
   ```
   http://localhost:3001/oauth-setup-test.html
   ```

2. **Check status indicators:**
   - ✅ Google Script: Should show "Google script loaded"
   - ✅ Client ID: Should show "Client ID configured"
   - ✅ OAuth Ready: Should show "OAuth ready"

3. **Test authentication:**
   - Click "Test Google Sign-In"
   - Complete Google OAuth flow
   - Verify your profile picture appears

4. **Test main application:**
   - Go to: `http://localhost:3001`
   - Click "Continue with Google"
   - Your real Google avatar should now appear!

## 🔧 Troubleshooting

### Common Issues

**❌ "Google script failed to load"**
- Check internet connection
- Verify the Google OAuth script is in `index.html`
- Try refreshing the page

**❌ "Client ID configured" shows warning**
- Make sure you copied the full Client ID
- Check for extra spaces or characters
- Verify the format: `*.apps.googleusercontent.com`

**❌ "OAuth initialization failed"**
- Verify your domain is in authorized JavaScript origins
- Check browser console for detailed errors
- Make sure you're using `http://localhost:3001` (not `https`)

**❌ Sign-in popup doesn't appear**
- Check if popup blockers are enabled
- Try in incognito/private browsing mode
- Verify the Client ID is correct

**❌ "Invalid client" error**
- Double-check your Client ID
- Ensure the project has Google Identity Services enabled
- Verify authorized origins include your current domain

### Debug Information

**Check browser console for:**
- `🔧 Initializing Google OAuth...`
- `✅ Google OAuth initialized successfully`
- `🔐 Processing Google OAuth response...`
- `✅ Google OAuth successful:`

**Verify in Network tab:**
- Google OAuth script loads successfully
- No CORS errors

## 🎯 Expected Results

After successful setup:

1. **Development Mode:**
   - Real Google OAuth instead of mock authentication
   - Your actual Google profile picture appears
   - User data includes real Google account information

2. **Avatar Quality:**
   - High-resolution profile pictures (200px)
   - Automatic fallback for failed loads
   - Smooth loading transitions

3. **User Experience:**
   - Single-click Google sign-in
   - Persistent authentication
   - Proper sign-out functionality

## 🚀 Production Deployment

When deploying to production:

1. **Add production domain to authorized origins:**
   ```
   https://yourdomain.com
   ```

2. **Update environment variables:**
   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

3. **Test thoroughly:**
   - OAuth flow works on production domain
   - Avatars load correctly
   - No console errors

## 📞 Need Help?

If you encounter issues:

1. Check the OAuth test page: `http://localhost:3001/oauth-setup-test.html`
2. Review browser console for error messages
3. Verify your Google Cloud Console configuration
4. Test with a different Google account

The application will automatically fall back to mock authentication if Google OAuth fails, so your app will always work even during setup.
