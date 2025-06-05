# HeroTrack Deployment Guide

## Overview
HeroTrack is a client-side React application that requires no backend server. It uses IndexedDB for local storage and Google OAuth for authentication.

## Prerequisites
- Domain name (for production)
- Server with Docker (for Docker deployment) OR
- Static hosting service account (Netlify, Vercel, etc.)

## Deployment Options

### Option 1: Static Hosting (Recommended)

#### Netlify
1. Build the app: `npm run build`
2. Drag `dist/` folder to Netlify
3. Configure environment variables:
   - `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `VITE_APP_NAME`: HeroTrack
   - `VITE_APP_VERSION`: 1.0.0

#### Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Configure environment variables in Vercel dashboard

### Option 2: Docker Deployment

#### Quick Start
```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t herotrack .
docker run -p 80:80 herotrack
```

#### Production Setup
1. **Configure environment variables**:
   Create `.env.production`:
   ```
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   VITE_APP_NAME=HeroTrack
   VITE_APP_VERSION=1.0.0
   ```

2. **Build with environment**:
   ```bash
   docker build --build-arg ENV_FILE=.env.production -t herotrack .
   ```

3. **Run with SSL** (recommended):
   - Update `docker-compose.yml` with your domain
   - Uncomment certbot service
   - Run: `docker-compose up -d`

### Option 3: Traditional Server

#### Requirements
- Ubuntu/CentOS server
- Nginx
- SSL certificate (Let's Encrypt)

#### Setup Steps
1. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install nginx certbot python3-certbot-nginx -y
   ```

2. **Build and upload**:
   ```bash
   npm run build
   scp -r dist/* user@server:/var/www/herotrack/
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/herotrack;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable SSL**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## Google OAuth Configuration

### Development
- Add `http://localhost:3000` to authorized origins

### Production
- Add your production domain to authorized origins
- Update `VITE_GOOGLE_CLIENT_ID` environment variable

## Environment Variables

Required for production:
- `VITE_GOOGLE_CLIENT_ID`: Google OAuth client ID
- `VITE_APP_NAME`: Application name (default: HeroTrack)
- `VITE_APP_VERSION`: Version number (default: 1.0.0)

## Security Considerations

1. **HTTPS**: Always use HTTPS in production
2. **CSP Headers**: Configure Content Security Policy
3. **OAuth Origins**: Restrict to your domain only
4. **Environment Variables**: Never commit real credentials

## Monitoring

### Health Check
The app serves a static `index.html` at the root path.

### Logs
- Docker: `docker logs herotrack`
- Nginx: `/var/log/nginx/access.log`

## Troubleshooting

### Common Issues
1. **Blank page**: Check browser console for errors
2. **OAuth not working**: Verify client ID and authorized origins
3. **Routes not working**: Ensure server handles SPA routing

### Debug Steps
1. Check browser developer tools
2. Verify environment variables
3. Test OAuth configuration
4. Check server logs

## Backup

Since HeroTrack uses IndexedDB (client-side storage):
- No server-side backup needed
- Users' data is stored locally in their browsers
- Consider implementing export/import features for user data portability
