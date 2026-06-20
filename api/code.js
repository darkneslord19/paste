export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  const data = global.dataStore?.[code];

  if (!data) {
    return res.status(404).json({ 
      error: 'Link not found',
      message: 'Bu kod geçersiz veya silinmiş'
    });
  }

  // Bilgi olarak JSON döndür (isteğe bağlı)
  if (req.query.format === 'json') {
    return res.status(200).json({
      code: data.code,
      name: data.name,
      url: data.url,
      createdAt: data.createdAt
    });
  }

  // Redirect to original URL
  res.redirect(302, data.url);
}
