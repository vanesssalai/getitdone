const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');

const redirectURL = 'http://localhost:3000/api/auth/google/callback'; 

const oAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    redirectURL
);

router.get('/auth/google', (req, res) => {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    });
    res.redirect(authUrl);
});

router.get('/auth/google/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        const userInfo = await oAuth2Client.request({
            url: 'https://www.googleapis.com/oauth2/v3/userinfo'
        });

        res.redirect(`http://localhost:3000/login?token=${tokens.access_token}`);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;