// src/utils/api-helpers.js
import logger from './logger';

export async function handleApiRequest(url, body, method = 'POST') {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (method !== 'GET' && body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (response.status === 404) {
      throw new Error('Маршрут не найден (404)');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Ошибка запроса: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    logger.info('Успешный ответ от %s: %o', url, data);
    return data;
  } catch (error) {
    logger.error('Ошибка при выполнении запроса к %s: %o', url, error);
    return null;
  }
}
