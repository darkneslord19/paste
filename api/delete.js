export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'DELETE method required' });
  }

  const { code } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  const store = global.linkStore;
  
  if (store && store[code]) {
    const deleted = store[code];
    delete store[code];
    return res.status(200).json({
      success: true,
      message: 'Link deleted',
      deleted: deleted
    });
  }

  res.status(404).json({ error: 'Link not found' });
}
