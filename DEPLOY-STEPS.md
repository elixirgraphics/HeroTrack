# Step-by-Step Deployment Guide

## Quick Deployment (5 minutes)

### Step 1: Prepare Your Application
```bash
# In your HeroTrack directory
npm install
npm run build
```

### Step 2: Configure Deployment Script
1. Open `deploy.sh` in a text editor
2. Update these lines at the top:
   ```bash
   SERVER_HOST="your-server.com"        # Your domain or IP
   SERVER_USER="your-username"          # Your SSH username
   SERVER_PATH="/var/www/herotrack"     # Where to deploy
   SERVER_PORT="22"                     # SSH port (usually 22)
   ```

### Step 3: Run Deployment
```bash
./deploy.sh
```

The script will:
- ✅ Build your app
- ✅ Test server connection
- ✅ Create backup of existing files
- ✅ Upload new files
- ✅ Restart web server

## Manual Deployment (if you prefer)

### Step 1: Build
```bash
npm run build
```

### Step 2: Upload Files
```bash
# Replace with your actual server details
scp -r dist/* username@your-server.com:/var/www/herotrack/
```

### Step 3: Set Permissions
```bash
ssh username@your-server.com
sudo chown -R www-data:www-data /var/www/herotrack
sudo chmod -R 755 /var/www/herotrack
sudo systemctl reload nginx
```

## Alternative: Use SFTP Client

If you prefer a GUI:

1. **Build the app**: `npm run build`
2. **Use an SFTP client** like:
   - FileZilla (free)
   - WinSCP (Windows)
   - Cyberduck (Mac)
3. **Upload contents of `dist/` folder** to your web directory
4. **Set proper permissions** via SSH

## Environment Variables

Create `.env.production` file:
```
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
VITE_APP_NAME=HeroTrack
VITE_APP_VERSION=1.0.0
```

Then build with: `npm run build`

## Nginx Configuration

If you need to set up Nginx, create `/etc/nginx/sites-available/herotrack`:

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

Enable it:
```bash
sudo ln -s /etc/nginx/sites-available/herotrack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL Certificate (Recommended)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Troubleshooting

### Permission Issues
```bash
sudo chown -R www-data:www-data /var/www/herotrack
sudo chmod -R 755 /var/www/herotrack
```

### Nginx Not Working
```bash
sudo nginx -t                    # Test configuration
sudo systemctl status nginx     # Check status
sudo systemctl restart nginx    # Restart if needed
```

### Google OAuth Issues
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Add your domain to "Authorized JavaScript origins"
3. Update your `.env` file with the correct client ID

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Google OAuth configured for your domain
- [ ] Proper file permissions set
- [ ] Firewall configured (ports 80, 443, 22)
- [ ] Regular backups scheduled

## Need Help?

If you run into issues:
1. Check the deployment script output for errors
2. Verify your server credentials
3. Test SSH connection: `ssh username@your-server.com`
4. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
