import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, url } = req.body;

  if (!code || !url) {
    return res.status(400).json({ error: 'Code and URL required' });
  }

  // JSON dosyasını oku
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }

  // Linki kaydet
  data[code] = url;
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.status(200).json({
    success: true,
    shortUrl: `https://${process.env.VERCEL_URL}/${code}`,
    code: code
  });
}
