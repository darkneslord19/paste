export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST method required' });
  }

  const { url, name } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // 8 haneli kod oluştur
  const code = generateCode();
  
  // Geçici olarak global'de sakla (production'da veritabanı kullan)
  if (!global.linkStore) {
    global.linkStore = {};
  }
  global.linkStore[code] = {
    code,
    url,
    name: name || 'İsimsiz',
    createdAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    code: code,
    shortUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/${code}`,
    data: global.linkStore[code]
  });
}

function generateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
