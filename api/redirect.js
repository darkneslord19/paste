export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code || code.length !== 8) {
    return res.status(400).json({ 
      error: 'Geçersiz kod formatı',
      message: 'Kod 8 haneli olmalı'
    });
  }

  // Test verisi - Gerçek veritabanına bağlanınca değişecek
  const testData = {
    'TEST1234': 'https://github.com',
    'ABC12345': 'https://raw.githubusercontent.com/...',
    'HA23ZXOD': 'https://darkneslord-d4955sgox-adminlord19-3873s-projects.vercel.app'
  };

  const url = testData[code];

  if (!url) {
    return res.status(404).json({ 
      error: 'Link bulunamadı',
      code: code,
      message: 'Bu kod geçersiz veya silinmiş'
    });
  }

  // JSON formatında istenirse
  if (req.query.format === 'json') {
    return res.status(200).json({
      code: code,
      url: url,
      createdAt: new Date().toISOString()
    });
  }

  // Normal yönlendirme
  res.redirect(302, url);
}
