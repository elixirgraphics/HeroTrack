# HeroTrack - Heroclix Tournament Tracker

A modern, responsive web application for tracking Heroclix tournament performance. Built with React, TailwindCSS, and IndexedDB for offline-first functionality.

## Features

### ✅ Core Features
- **Tournament Management**: Create and manage tournaments with customizable rounds
- **Fast Match Logging**: Quick entry optimized for mobile use between rounds
- **Performance Analytics**: Win/loss tracking, points analysis, and trend visualization
- **Tournament History**: Collapsible tournament list with detailed match breakdowns
- **User Settings**: Customizable field visibility and preferences

### 🎯 Key Capabilities
- **Mobile-First Design**: Large touch targets and responsive layout
- **Offline Storage**: Uses IndexedDB for local data storage
- **Google Authentication**: Secure login with Google OAuth
- **Real-time Statistics**: Automatic calculation of win rates and performance metrics
- **Image Upload**: Team screenshot support for match records

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with custom components
- **Database**: IndexedDB with IDB wrapper
- **Authentication**: Google OAuth 2.0
- **Icons**: Lucide React
- **Charts**: Chart.js with React wrapper

## Getting Started

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern web browser with IndexedDB support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HeroTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   For Google OAuth (optional):
   - Get a client ID from [Google Cloud Console](https://console.developers.google.com/)
   - Update `VITE_GOOGLE_CLIENT_ID` in `.env`

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

### Development Mode
The app includes mock authentication for development. You can sign in with a demo user without configuring Google OAuth.

## Usage

### Creating a Tournament
1. Click "New Tournament" on the dashboard
2. Enter tournament name, date, and number of rounds
3. Start adding matches as you play

### Adding Matches
1. Open a tournament and click "Add Match"
2. Select win/loss/draw result
3. Enter points scored and opponent points
4. Optionally add opponent name, map, and notes
5. Upload team screenshot if desired

### Viewing Statistics
- Dashboard shows overall performance metrics
- Statistics page provides detailed analytics and trends
- Tournament history shows past performance

### Customizing Settings
- Toggle visibility of optional fields
- Set default tournament rounds
- Manage user preferences

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Login.jsx        # Authentication
│   ├── Layout.jsx       # Navigation layout
│   ├── TournamentView.jsx # Tournament details
│   ├── MatchForm.jsx    # Match entry form
│   ├── StatsView.jsx    # Performance analytics
│   └── Settings.jsx     # User settings
├── utils/              # Utility functions
│   ├── database.js     # IndexedDB operations
│   ├── auth.js         # Authentication helpers
│   └── calculations.js # Statistics calculations
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Data Storage

HeroTrack uses IndexedDB for local storage with three main stores:

- **Tournaments**: Tournament metadata and settings
- **Matches**: Individual match records with results and details
- **Settings**: User preferences and configuration

All data is stored locally on the user's device for offline access.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Future Enhancements

- [ ] PDF/CSV export functionality
- [ ] Cloud backup and sync
- [ ] Advanced analytics and charts
- [ ] Team builder integration
- [ ] Tournament sharing features
- [ ] Offline-first PWA capabilities

## License

MIT License - see LICENSE file for details

## Support

For issues and feature requests, please use the GitHub issue tracker.
