export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const dataStore = global.dataStore || {};
  const links = Object.values(dataStore).sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  res.status(200).json({
    success: true,
    total: links.length,
    links
  });
}
