const { google } = require('googleapis');

async function testGoogleAuthorization() {
    const client_id = process.env.CLIENT_ID;
    const client_secret = process.env.CLIENT_SECRET;
    const redirect_uris = [process.env.REDIRECT_URIS];

    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

    if (accessToken && refreshToken) {
        oAuth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        console.log('Токены успешно установлены.');
        console.log('Авторизация прошла успешно!');
    } else {
        console.error('Токены отсутствуют в переменных окружения');
    }
}

testGoogleAuthorization().catch(console.error);
