#!/usr/bin/env node

/**
 * Spotify Token Generator
 * Run this script to get your refresh token for the Spotify API
 * 
 * Usage: node scripts/get-spotify-token.js
 */

import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log('🎵 Spotify Token Generator for sattiyans.com\n');
  
  const clientId = await askQuestion('Enter your Spotify Client ID: ');
  const clientSecret = await askQuestion('Enter your Spotify Client Secret: ');
  
  console.log('\n📋 Follow these steps:');
  console.log('1. Open this URL in your browser:');
  console.log(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing,user-read-playback-state`);
  console.log('\n2. Log in to Spotify and authorize the app');
  console.log('3. Copy the "code" parameter from the redirect URL');
  console.log('4. Paste it below\n');
  
  const authCode = await askQuestion('Enter the authorization code: ');
  
  try {
    // Exchange code for tokens
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authCode,
        redirect_uri: 'http://localhost:3000/callback',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('\n✅ Success! Your tokens:');
    console.log('Access Token:', data.access_token);
    console.log('Refresh Token:', data.refresh_token);
    console.log('\n📝 Add these to your .env file:');
    console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  rl.close();
}

main().catch(console.error);
