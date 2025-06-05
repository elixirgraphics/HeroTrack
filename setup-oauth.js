#!/usr/bin/env node

/**
 * Google OAuth Setup Helper for HeroTrack
 *
 * This script helps you configure Google OAuth by updating the .env file
 * with your Google OAuth Client ID.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_FILE = '.env';
const TEST_FILE = 'oauth-setup-test.html';

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function colorize(text, color) {
    return `${colors[color]}${text}${colors.reset}`;
}

function printHeader() {
    console.log(colorize('\n🚀 HeroTrack Google OAuth Setup Helper', 'cyan'));
    console.log(colorize('=====================================\n', 'cyan'));
}

function printInstructions() {
    console.log(colorize('📋 Before running this script, you need to:', 'yellow'));
    console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
    console.log('2. Create a new project or select existing one');
    console.log('3. Enable Google Identity Services API');
    console.log('4. Create OAuth 2.0 Client ID credentials');
    console.log('5. Add these authorized JavaScript origins:');
    console.log('   - http://localhost:3000');
    console.log('   - http://localhost:3001');
    console.log('6. Copy your Client ID\n');
}

function validateClientId(clientId) {
    // Basic validation for Google OAuth Client ID format
    const pattern = /^[0-9]+-[a-zA-Z0-9]+\.apps\.googleusercontent\.com$/;
    return pattern.test(clientId);
}

function updateEnvFile(clientId) {
    try {
        let envContent = '';
        
        if (fs.existsSync(ENV_FILE)) {
            envContent = fs.readFileSync(ENV_FILE, 'utf8');
        }
        
        // Update or add the Google Client ID
        const lines = envContent.split('\n');
        let updated = false;
        
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].startsWith('VITE_GOOGLE_CLIENT_ID=')) {
                lines[i] = `VITE_GOOGLE_CLIENT_ID=${clientId}`;
                updated = true;
                break;
            }
        }
        
        if (!updated) {
            lines.push(`VITE_GOOGLE_CLIENT_ID=${clientId}`);
        }
        
        // Ensure other required variables exist
        const requiredVars = {
            'VITE_APP_NAME': 'HeroTrack',
            'VITE_APP_VERSION': '1.0.0'
        };
        
        for (const [key, defaultValue] of Object.entries(requiredVars)) {
            const exists = lines.some(line => line.startsWith(`${key}=`));
            if (!exists) {
                lines.push(`${key}=${defaultValue}`);
            }
        }
        
        fs.writeFileSync(ENV_FILE, lines.join('\n'));
        return true;
    } catch (error) {
        console.error(colorize(`❌ Error updating .env file: ${error.message}`, 'red'));
        return false;
    }
}

function updateTestFile(clientId) {
    try {
        if (!fs.existsSync(TEST_FILE)) {
            console.log(colorize('⚠️ Test file not found, skipping update', 'yellow'));
            return true;
        }
        
        let content = fs.readFileSync(TEST_FILE, 'utf8');
        content = content.replace(
            /const CLIENT_ID = '[^']*';/,
            `const CLIENT_ID = '${clientId}';`
        );
        
        fs.writeFileSync(TEST_FILE, content);
        return true;
    } catch (error) {
        console.error(colorize(`❌ Error updating test file: ${error.message}`, 'red'));
        return false;
    }
}

async function promptForClientId() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise((resolve) => {
        rl.question(colorize('🔑 Enter your Google OAuth Client ID: ', 'blue'), (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function main() {
    printHeader();
    printInstructions();
    
    const clientId = await promptForClientId();
    
    if (!clientId) {
        console.log(colorize('❌ No Client ID provided. Exiting.', 'red'));
        process.exit(1);
    }
    
    if (!validateClientId(clientId)) {
        console.log(colorize('❌ Invalid Client ID format. Expected format: 123456789-abcdefg.apps.googleusercontent.com', 'red'));
        process.exit(1);
    }
    
    console.log(colorize('\n⚙️ Updating configuration files...', 'yellow'));
    
    // Update .env file
    if (updateEnvFile(clientId)) {
        console.log(colorize('✅ Updated .env file', 'green'));
    } else {
        console.log(colorize('❌ Failed to update .env file', 'red'));
        process.exit(1);
    }
    
    // Update test file
    if (updateTestFile(clientId)) {
        console.log(colorize('✅ Updated test file', 'green'));
    }
    
    console.log(colorize('\n🎉 Setup complete!', 'green'));
    console.log(colorize('\n📝 Next steps:', 'cyan'));
    console.log('1. Restart your development server: npm run dev');
    console.log('2. Open http://localhost:3001/oauth-setup-test.html to test');
    console.log('3. Try signing in with your Google account');
    console.log('4. Check the browser console for any errors\n');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error(colorize(`❌ Script failed: ${error.message}`, 'red'));
        process.exit(1);
    });
}
