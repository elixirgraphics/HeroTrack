#!/bin/bash

# Simple HeroTrack Deployment Script
# This version is designed for password-based SSH authentication

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 HeroTrack Simple Deployment${NC}"
echo "=================================="

# Get server details from user
echo ""
echo "Please enter your server details:"
read -p "Server hostname or IP: " SERVER_HOST
read -p "SSH username: " SERVER_USER
read -p "SSH port (press Enter for 22): " SERVER_PORT
SERVER_PORT=${SERVER_PORT:-22}
read -p "Deployment path (press Enter for /var/www/herotrack): " SERVER_PATH
SERVER_PATH=${SERVER_PATH:-/var/www/herotrack}

echo ""
echo -e "${YELLOW}Configuration:${NC}"
echo "Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
echo "Path: $SERVER_PATH"
echo ""

read -p "Continue with deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

# Step 1: Build the application
echo ""
echo -e "${GREEN}Step 1: Building application...${NC}"
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: package.json not found. Are you in the HeroTrack directory?${NC}"
    exit 1
fi

npm install
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}Error: Build failed - dist directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Build completed${NC}"

# Step 2: Test connection
echo ""
echo -e "${GREEN}Step 2: Testing server connection...${NC}"
echo "You will be prompted for your password."

if ! ssh -p $SERVER_PORT -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo 'Connection test successful'"; then
    echo -e "${RED}Error: Cannot connect to server${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Connection successful${NC}"

# Step 3: Upload files
echo ""
echo -e "${GREEN}Step 3: Uploading files...${NC}"
echo "You may be prompted for your password again."

# Create a tarball for faster upload
echo "Creating archive..."
cd dist
tar -czf ../herotrack-deploy.tar.gz *
cd ..

echo "Uploading archive..."
scp -P $SERVER_PORT herotrack-deploy.tar.gz $SERVER_USER@$SERVER_HOST:/tmp/

echo "Extracting files on server..."
ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    # Create backup if directory exists
    if [ -d '$SERVER_PATH' ]; then
        sudo cp -r $SERVER_PATH /tmp/herotrack-backup-\$(date +%Y%m%d_%H%M%S) 2>/dev/null || true
    fi
    
    # Create target directory
    sudo mkdir -p $SERVER_PATH
    
    # Extract files
    cd /tmp
    tar -xzf herotrack-deploy.tar.gz
    
    # Move files to target directory
    sudo rm -rf $SERVER_PATH/*
    sudo mv * $SERVER_PATH/ 2>/dev/null || true
    
    # Set permissions
    sudo chown -R www-data:www-data $SERVER_PATH 2>/dev/null || sudo chown -R \$USER:\$USER $SERVER_PATH
    sudo chmod -R 755 $SERVER_PATH
    
    # Cleanup
    rm -f /tmp/herotrack-deploy.tar.gz
"

# Cleanup local archive
rm -f herotrack-deploy.tar.gz

echo -e "${GREEN}✓ Files uploaded successfully${NC}"

# Step 4: Restart web server
echo ""
echo -e "${GREEN}Step 4: Restarting web server...${NC}"

ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
    if sudo systemctl reload nginx 2>/dev/null; then
        echo 'Nginx reloaded successfully'
    elif sudo service nginx reload 2>/dev/null; then
        echo 'Nginx reloaded successfully'
    else
        echo 'Could not reload nginx automatically - please restart manually'
    fi
"

echo ""
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo "Your HeroTrack app should now be available at:"
echo "http://$SERVER_HOST"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test your application in a web browser"
echo "2. Set up SSL certificate if not already configured"
echo "3. Update Google OAuth settings with your domain"
echo ""
echo -e "${YELLOW}If you encounter issues:${NC}"
echo "- Check nginx configuration: sudo nginx -t"
echo "- View nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- Verify file permissions in $SERVER_PATH"
