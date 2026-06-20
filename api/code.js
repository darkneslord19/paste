export default async function handler(req, res) {
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

  // JSON verisi varsa göster
  if (req.query.format === 'json' || data.jsonData) {
    return res.status(200).json({
      code: data.code,
      filename: data.filename,
      extension: data.extension,
      url: data.url,
      jsonData: data.jsonData,
      createdAt: data.createdAt
    });
  }

  // Redirect to original URL
  res.redirect(302, data.url);
}
