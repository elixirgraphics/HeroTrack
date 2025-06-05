# HeroTrack Development Guide

## Quick Start (Without Node.js)

If you don't have Node.js installed, you can still test the authentication functionality:

1. **Open the authentication test page**:
   ```
   file:///path/to/HeroTrack/test-auth.html
   ```

2. **Test the login flow**:
   - Click "Sign In (Mock)" to simulate authentication
   - Check the debug log for detailed information
   - Verify that user data is stored in localStorage

## Full Development Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Installation Steps

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

## Authentication System

### Mock Authentication (Development)
- The app automatically uses mock authentication when Google OAuth is not available
- Click the login button to sign in with a demo user
- User data is stored in localStorage for persistence

### Google OAuth (Production)

#### Step 1: Create Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API or Google Identity API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - `http://localhost:3001` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
7. Copy the Client ID

#### Step 2: Configure Environment
1. Update your `.env` file:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id-here.apps.googleusercontent.com
   ```
2. Restart your development server: `npm run dev`

#### Step 3: Test Google OAuth
1. The app will automatically detect the real client ID
2. Click "Continue with Google" to test the real OAuth flow
3. Your Google profile picture should now appear properly

#### Avatar Quality
- Google avatars are automatically enhanced to 200px for better quality
- The app includes fallback handling for failed avatar loads
- Mock authentication uses a realistic demo avatar for development

## Troubleshooting Login Issues

### Common Issues:

1. **Login button doesn't work**:
   - Check browser console for errors
   - Verify localStorage is enabled
   - Try the authentication test page

2. **Google OAuth not loading**:
   - Check network connectivity
   - Verify the Google OAuth script loads in browser dev tools
   - The app will fallback to mock authentication

3. **User not persisting**:
   - Check if localStorage is enabled in your browser
   - Clear localStorage and try again: `localStorage.clear()`

### Debug Steps:

1. **Open browser developer tools** (F12)
2. **Check the Console tab** for error messages
3. **Check the Application/Storage tab** for localStorage data
4. **Use the authentication test page** for isolated testing

## Database System

### IndexedDB Storage
- Tournaments, matches, and settings are stored locally
- Data persists between browser sessions
- No internet connection required

### Data Structure:
- **Tournaments**: Tournament metadata and configuration
- **Matches**: Individual match records with results
- **Settings**: User preferences and field visibility

## Component Architecture

### Main Components:
- `App.jsx` - Main application with routing and auth
- `Login.jsx` - Authentication interface
- `Dashboard.jsx` - Tournament overview and stats
- `TournamentView.jsx` - Individual tournament management
- `MatchForm.jsx` - Quick match entry form
- `StatsView.jsx` - Performance analytics
- `Settings.jsx` - User preferences

### Utility Modules:
- `auth.js` - Authentication management
- `database.js` - IndexedDB operations
- `calculations.js` - Statistics and analytics

## Testing the App

### Manual Testing Checklist:

1. **Authentication**:
   - [ ] Login works (mock or Google)
   - [ ] User data persists after refresh
   - [ ] Logout works correctly

2. **Tournament Management**:
   - [ ] Create new tournament
   - [ ] View tournament details
   - [ ] Add matches to tournament
   - [ ] Complete tournament

3. **Match Entry**:
   - [ ] Quick match form works
   - [ ] All fields save correctly
   - [ ] Optional fields can be hidden

4. **Statistics**:
   - [ ] Win/loss calculations are correct
   - [ ] Points tracking works
   - [ ] Trends display properly

5. **Mobile Experience**:
   - [ ] Responsive design works
   - [ ] Touch targets are large enough
   - [ ] Forms work on mobile

## Common Development Tasks

### Adding New Features:
1. Create component in `src/components/`
2. Add routing in `App.jsx` if needed
3. Update database schema if required
4. Add to navigation in `Layout.jsx`

### Modifying Database:
1. Update schema in `database.js`
2. Increment `DB_VERSION` constant
3. Add migration logic in `upgrade()` function

### Styling Changes:
1. Use TailwindCSS classes
2. Add custom styles to `index.css`
3. Update `tailwind.config.js` for theme changes

## Production Deployment

### Build for Production:
```bash
npm run build
```

### Environment Variables:
- `VITE_GOOGLE_CLIENT_ID` - Google OAuth client ID
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Version number

### Deployment Checklist:
- [ ] Configure Google OAuth client ID
- [ ] Test authentication flow
- [ ] Verify offline functionality
- [ ] Test on mobile devices
- [ ] Check browser compatibility

## Browser Support

### Minimum Requirements:
- Chrome 63+
- Firefox 57+
- Safari 13+
- Edge 79+

### Required Features:
- IndexedDB support
- localStorage support
- ES6 modules
- CSS Grid and Flexbox
