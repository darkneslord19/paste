import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  try {
    // 1. data.json'u oku
    let data = {};
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf8');
      data = JSON.parse(fileContent);
    }

    const url = data[code];

    if (!url) {
      return res.status(404).json({ 
        error: 'Link not found',
        code: code,
        message: 'Bu kod geçersiz veya silinmiş'
      });
    }

    // JSON formatında istenirse
    if (req.query.format === 'json') {
      return res.status(200).json({
        code: code,
        url: url,
        message: 'URL bulundu'
      });
    }

    // Normal yönlendirme
    res.redirect(302, url);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
