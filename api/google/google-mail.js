const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');

async function sendGmailWithRetry(to, subject, message, retries = 3) {
    const auth = await googleAuthorize();
    const gmail = google.gmail({ version: 'v1', auth });

    const email = [
        `To: ${to}`,
        'Content-Type: text/html; charset=utf-8',
        `Subject: ${subject}`,
        '',
        message
    ].join('\n');

    const encodedMessage = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const sendMail = async () => {
        try {
            const response = await gmail.users.messages.send({
                userId: 'me',
                requestBody: {
                    raw: encodedMessage
                }
            });
            console.log('Письмо отправлено:', response.data);
        } catch (error) {
            console.error('Ошибка отправки письма:', error);
            if (retries > 0) {
                console.log(`Повторная попытка отправки письма (${retries})...`);
                await sendGmailWithRetry(to, subject, message, retries - 1);
            } else {
                throw new Error('Не удалось отправить письмо после нескольких попыток');
            }
        }
    };

    await sendMail();
}

module.exports = sendGmailWithRetry;
