export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url, filename, extension, jsonData } = req.body;

  if (!url || !filename) {
    return res.status(400).json({ error: 'URL and filename are required' });
  }

  try {
    new URL(url);
    
    const code = generateUniqueCode();
    
    const data = {
      id: code,
      code: code,
      url,
      filename,
      extension: extension || getExtensionFromUrl(url),
      jsonData: jsonData || null,
      createdAt: new Date().toISOString(),
      shortUrl: `${process.env.VERCEL_URL || 'localhost:3000'}/${code}`
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

function getExtensionFromUrl(url) {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const extension = pathname.split('.').pop();
    return extension || 'unknown';
  } catch {
    return 'unknown';
  }
}
