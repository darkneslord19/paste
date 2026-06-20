import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  const { code } = req.query;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Geçersiz kod' });
  }

  // JSON dosyasını oku
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }

  const url = data[code];

  if (!url) {
    return res.status(404).json({ error: 'Link bulunamadı', code });
  }

  // Yönlendir
  res.redirect(302, url);
}
