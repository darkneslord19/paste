export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'PUT method required' });
  }

  const { code, url, name } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  const store = global.linkStore;
  
  if (!store || !store[code]) {
    return res.status(404).json({ error: 'Link not found' });
  }

  if (url) store[code].url = url;
  if (name) store[code].name = name;
  store[code].updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    data: store[code]
  });
}
