const { GoogleAuth, OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
require('dotenv').config
const { CLIENT_SECRET, CLIENT_ID, REDIRECT_URI } = process.env

const googleAuth = new GoogleAuth({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});

const oauth2Client = new OAuth2Client();

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/gmail.readonly',
});

window.location.href = authUrl;


const { tokens } = await oauth2Client.getToken(authorizationCode);


oauth2Client.setCredentials(tokens);


const gmail = google.gmail({ version: 'v1', auth: oauth2Client });


const res = await gmail.users.messages.list({ userId: 'me' });
