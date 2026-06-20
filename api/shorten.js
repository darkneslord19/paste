export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, name } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
    
    const code = generateUniqueCode();
    
    const data = {
      code: code,
      url: url,
      name: name || 'unnamed',
      createdAt: new Date().toISOString(),
      shortUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/${code}`
    };

    if (!global.dataStore) {
      global.dataStore = {};
    }
    global.dataStore[code] = data;

    res.status(200).json({
      success: true,
      shortUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/${code}`,
      code: code,
      data
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL provided' });
  }
}

function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  do {
    code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (global.dataStore && global.dataStore[code]);
  
  return code;
}
