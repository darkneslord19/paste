export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST gerekli' });
  }

  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL gerekli' });
  }

  // Basit test kodu
  const code = 'TEST1234';
  
  res.status(200).json({
    success: true,
    shortUrl: `https://${process.env.VERCEL_URL || 'localhost:3000'}/${code}`,
    code: code
  });
}
