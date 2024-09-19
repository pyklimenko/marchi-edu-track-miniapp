const { google } = require('googleapis');
const googleAuthorize = require('./google-auth');

async function sendGmailWithRetry(to, subject, message, retryCount = 3) {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            await sendGmail(to, subject, message);
            return; // Если письмо успешно отправлено
        } catch (error) {
            console.error(`Попытка ${attempt} отправки письма не удалась. Ошибка:`, error);
            if (attempt === retryCount) {
                throw new Error('Письмо не отправлено после нескольких попыток');
            }
        }
    }
}

async function sendGmail(to, subject, message) {
    try {
        console.log('Пытаемся отправить письмо...');
        const startTime = new Date();  // Логирование времени начала отправки

        console.log(`Отправка на адрес: ${to}`);
        console.log(`Тема письма: ${subject}`);
        console.log('Текст сообщения:', message);

        const auth = await googleAuthorize();
        console.log('Авторизация завершена.');

        const gmail = google.gmail({ version: 'v1', auth });
        console.log('Gmail API инициализирован.');

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

        console.log('Письмо подготовлено, кодируем...');
        const encodedMessage = Buffer.from(email)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        console.log('Отправляем письмо...');

        console.log('Запрос на отправку письма инициирован...');

        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });
        
        console.log('Ответ от Gmail API получен...');

        console.log(`Операция завершена за ${new Date() - startTime} мс`);  // Время выполнения

        // Проверка статуса ответа
        if (result.status === 200) {
            console.log(`Письмо успешно отправлено: ${result.data.id}`);
        } else if (result.status === 429) {
            console.error('Превышены квоты на запросы к API. Попробуйте позже.');
            throw new Error('Превышены квоты API');
        } else {
            console.error(`Ошибка отправки письма. Статус: ${result.status}`);
        }

    } catch (error) {
        if (error.response) {
            // Логирование более подробного ответа об ошибке от Google API
            console.error('Ошибка при отправке письма:', error.response.data);
            console.error('Ошибка от Google API:', {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data
            });
        } else {
            console.error('Ошибка при отправке письма:', error.message);
        }
        throw error;
    }
}

module.exports = sendGmailWithRetry;
