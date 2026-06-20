import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST method required' });
  }

  const { code, url } = req.body;

  if (!code || !url) {
    return res.status(400).json({ error: 'Code and URL are required' });
  }

  if (code.length !== 8) {
    return res.status(400).json({ error: 'Code must be 8 characters' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // 1. Mevcut verileri oku
    let data = {};
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileContent);
    }

    // 2. Yeni link ekle
    data[code] = url;

    // 3. Dosyaya kaydet
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

    res.status(200).json({
      success: true,
      code: code,
      shortUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/${code}`,
      url: url
    });

  } catch (error) {
    console.error('File error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
