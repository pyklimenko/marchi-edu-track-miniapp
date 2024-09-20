// api/google/google-auth.js
require('dotenv').config();
const { google } = require('googleapis');
const logger = require('../../utils/logger');

async function googleAuthorize() {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];

    if (!client_id || !client_secret || !redirect_uris[0]) {
        logger.error('Переменные окружения для Google API не определены');
        throw new Error('Необходимо определить CLIENT_ID, CLIENT_SECRET и REDIRECT_URIS');
    }

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (accessToken && refreshToken) {
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });
        logger.info('Авторизация Google OAuth2 успешна');
        return oAuth2Client;
    } else {
        logger.error('Токены доступа отсутствуют в переменных окружения');
        throw new Error('Токены доступа отсутствуют');
    }
}

module.exports = googleAuthorize;
