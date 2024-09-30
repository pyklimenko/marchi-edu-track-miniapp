// api/google/google-auth.js
require('dotenv').config();
const { google } = require('googleapis');
const logger = require('../logger');

async function googleAuthorize() {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];
  
    if (!client_id || !client_secret || !redirect_uris[0]) {
      logger.error('Переменные окружения для Google API не определены');
      throw new Error('Необходимо определить CLIENT_ID, CLIENT_SECRET и REDIRECT_URIS');
    }
  
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;
  
    if (refreshToken) {
      oAuth2Client.setCredentials({
        refresh_token: refreshToken,
      });
  
      try {
        // Обновляем токен доступа
        await oAuth2Client.getAccessToken();
        logger.info('Авторизация Google OAuth2 успешна');
        return oAuth2Client;
      } catch (error) {
        logger.error('Ошибка при обновлении токена доступа: %o', error);
        throw new Error('Не удалось обновить токен доступа');
      }
    } else {
      logger.error('Токен обновления отсутствует в переменных окружения');
      throw new Error('Токен обновления отсутствует');
    }
  }
  

module.exports = googleAuthorize;
