import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export default function handler(req, res) {
  let data = {};
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }

  const links = Object.keys(data).map(code => ({
    code: code,
    url: data[code]
  }));

  res.status(200).json({
    success: true,
    total: links.length,
    links: links
  });
}
