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
    if (!response.ok) throw new Error('Ошибка запроса');
    return await response.json();
  } catch (error) {
    console.error('Ошибка при выполнении запроса', error);
    return null;
  }
}
