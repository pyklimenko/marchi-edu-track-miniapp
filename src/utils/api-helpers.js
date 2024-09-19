export async function handleApiRequest(url, body, method = 'POST') {
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error('Ошибка запроса');
      return await response.json();
    } catch (error) {
      console.error('Ошибка при выполнении запроса', error);
      return null;
    }
  }
  