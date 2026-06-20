export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  if (global.dataStore && global.dataStore[code]) {
    const deleted = global.dataStore[code];
    delete global.dataStore[code];
    res.status(200).json({ 
      success: true, 
      message: 'Link deleted successfully',
      deleted: deleted
    });
  } else {
    res.status(404).json({ error: 'Link not found' });
  }
}
