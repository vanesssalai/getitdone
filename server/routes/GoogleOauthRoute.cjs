const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

const redirectURL = 'http://localhost:3000/api/auth/google/callback'; // Adjust this URL as needed

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURL
);

// Generate a URL for Google OAuth consent screen
router.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });
    res.redirect(authUrl);
});

// Handle the OAuth callback
router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Get user info
        const userInfo = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        // Here, you would typically:
        // 1. Check if the user exists in your database
        // 2. If not, create a new user
        // 3. Generate a session or JWT token for the user
        // 4. Redirect to the frontend with the token

        res.redirect(`http://localhost:3000/login?token=${tokens.access_token}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;