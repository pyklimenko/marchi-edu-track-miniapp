export async function handleApiRequest(url, body, method = 'POST') {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    // Проверка на 404 ошибку
    if (response.status === 404) {
      throw new Error('Маршрут не найден (404)');
    }

    if (!response.ok) throw new Error('Ошибка запроса');
    return await response.json();
  } catch (error) {
    console.error('Ошибка при выполнении запроса', error);
    return null;
  }
}
