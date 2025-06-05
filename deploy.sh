#!/bin/bash

# HeroTrack Deployment Script
# This script builds the app and uploads it to your server

set -e  # Exit on any error

echo "🚀 Starting HeroTrack deployment..."

# Configuration - UPDATE THESE VALUES
SERVER_HOST="vps50140.dreamhostps.com"
SERVER_USER="ashiver"
SERVER_PATH="/elixirgraphics.com/herotrack"
SERVER_PORT="22"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if required commands exist
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command -v scp &> /dev/null; then
        print_error "scp is not installed"
        exit 1
    fi
    
    if ! command -v ssh &> /dev/null; then
        print_error "ssh is not installed"
        exit 1
    fi
}

# Build the application
build_app() {
    print_status "Installing dependencies..."
    npm install
    
    print_status "Building application..."
    npm run build
    
    if [ ! -d "dist" ]; then
        print_error "Build failed - dist directory not found"
        exit 1
    fi
    
    print_status "Build completed successfully"
}

# Test server connection
test_connection() {
    print_status "Testing server connection..."

    echo "Testing connection to $SERVER_USER@$SERVER_HOST..."
    echo "You will be prompted for your password."

    if ssh -p $SERVER_PORT -o ConnectTimeout=10 $SERVER_USER@$SERVER_HOST "echo 'Connection successful'" 2>/dev/null; then
        print_status "Server connection successful"
    else
        print_error "Cannot connect to server. Please check your credentials and network."
        exit 1
    fi
}

# Create backup of existing files
create_backup() {
    print_status "Creating backup of existing files..."

    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"

    echo "You may be prompted for your password to create backup..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        if [ -d '$SERVER_PATH' ]; then
            mkdir -p /tmp/$BACKUP_DIR
            cp -r $SERVER_PATH/* /tmp/$BACKUP_DIR/ 2>/dev/null || true
            echo 'Backup created at /tmp/$BACKUP_DIR'
        fi
    "
}

# Upload files to server
upload_files() {
    print_status "Uploading files to server..."

    echo "You may be prompted for your password multiple times during upload..."

    # Create temporary upload directory
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "mkdir -p /tmp/herotrack_upload"

    # Upload files
    scp -P $SERVER_PORT -r dist/* $SERVER_USER@$SERVER_HOST:/tmp/herotrack_upload/

    # Create target directory and move files
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        sudo mkdir -p $SERVER_PATH
        sudo rm -rf $SERVER_PATH/*
        sudo mv /tmp/herotrack_upload/* $SERVER_PATH/
        sudo chown -R www-data:www-data $SERVER_PATH 2>/dev/null || sudo chown -R \$USER:\$USER $SERVER_PATH
        sudo chmod -R 755 $SERVER_PATH
        rm -rf /tmp/herotrack_upload
    "

    print_status "Files uploaded successfully"
}

# Restart web server
restart_server() {
    print_status "Restarting web server..."

    echo "You may be prompted for your password to restart the web server..."
    ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST "
        sudo systemctl reload nginx 2>/dev/null || sudo service nginx reload 2>/dev/null || echo 'Could not restart nginx - you may need to do this manually'
    "

    print_status "Web server restart attempted"
}

# Main deployment function
deploy() {
    echo "📋 Deployment Configuration:"
    echo "   Server: $SERVER_USER@$SERVER_HOST:$SERVER_PORT"
    echo "   Path: $SERVER_PATH"
    echo ""
    
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
    
    check_dependencies
    build_app
    test_connection
    create_backup
    upload_files
    restart_server
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    echo "Your HeroTrack app should now be live at: http://$SERVER_HOST"
    echo ""
    print_warning "Don't forget to:"
    echo "  1. Configure SSL certificate if not already done"
    echo "  2. Update Google OAuth authorized origins"
    echo "  3. Test the application in your browser"
}

# Show usage if no arguments
show_usage() {
    echo "HeroTrack Deployment Script"
    echo ""
    echo "Before running this script, please update the configuration variables at the top:"
    echo "  - SERVER_HOST: Your server's domain or IP"
    echo "  - SERVER_USER: Your SSH username"
    echo "  - SERVER_PATH: Path where files should be deployed"
    echo "  - SERVER_PORT: SSH port (usually 22)"
    echo ""
    echo "Usage: ./deploy.sh [command]"
    echo ""
    echo "Commands:"
    echo "  deploy    Deploy the application (default)"
    echo "  build     Build the application only"
    echo "  test      Test server connection only"
    echo "  help      Show this help message"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "build")
        check_dependencies
        build_app
        ;;
    "test")
        test_connection
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    *)
        echo "Unknown command: $1"
        show_usage
        exit 1
        ;;
esac
