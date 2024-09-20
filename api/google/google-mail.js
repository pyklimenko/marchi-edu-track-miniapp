// api/google/google-mail.js
const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');
const logger = require('../../utils/logger');

async function sendGmailWithRetry(to, subject, message, retryCount = 3) {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            await sendGmail(to, subject, message);
            return;
        } catch (error) {
            logger.error('Попытка %d отправки письма не удалась: %o', attempt, error);
            if (attempt === retryCount) {
                logger.error('Письмо не отправлено после %d попыток', retryCount);
                throw new Error('Письмо не отправлено после нескольких попыток');
            }
        }
    }
}

async function sendGmail(to, subject, message) {
    try {
        const startTime = new Date();
        logger.info('Отправка письма на: %s', to);

        const auth = await googleAuthorize();
        const gmail = google.gmail({ version: 'v1', auth });

        const subjectBase64 = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;
        const email = [
            `To: ${to}`,
            `Subject: ${subjectBase64}`,
            'MIME-Version: 1.0',
            'Content-Type: text/plain; charset="UTF-8"',
            'Content-Transfer-Encoding: 7bit',
            '',
            message,
        ].join('\n');

        const encodedMessage = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        const duration = new Date() - startTime;
        logger.info('Письмо успешно отправлено на %s за %d мс. ID сообщения: %s', to, duration, result.data.id);

    } catch (error) {
        logger.error('Ошибка отправки письма на %s: %o', to, error);
        throw error;
    }
}

module.exports = sendGmailWithRetry;
