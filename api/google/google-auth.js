const { google } = require('googleapis');

async function googleAuthorize() {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];

    console.log('Тут была проверка переменных окружения.');

    console.log('Пытаемся авторизоваться в Google...');

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    console.log('Проверка токенов:');
    console.log('Access Token:', !!accessToken);
    console.log('Refresh Token:', !!refreshToken);

    try {
        if (accessToken && refreshToken) {
            console.log('Устанавливаем токены...');
            oAuth2Client.setCredentials({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            console.log('Токены успешно установлены.');
            return oAuth2Client;
        } else {
            console.error('Токены отсутствуют в переменных окружения');
            // throw new Error('Токены отсутствуют в переменных окружения');
        }
    } catch (error) {
        console.error('Произошла ошибка при авторизации');
        if (error.response) {
            console.error('Ошибка при авторизации:', error.response.data);
            console.error('Ошибка от Google API:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        } else {
            console.error('Ошибка при авторизации:', error.message);
        }
        // throw error;
    }
}

module.exports = googleAuthorize;
