import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'DELETE required' });
  }

  const { code } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Geçersiz kod' });
  }

  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }

  if (!data[code]) {
    return res.status(404).json({ error: 'Link bulunamadı' });
  }

  delete data[code];
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

  res.status(200).json({ success: true, message: 'Silindi' });
}
