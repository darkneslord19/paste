export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token, X-GitHub-Repo');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { code } = req.query;
  const token = req.headers['x-github-token'];
  const repo = req.headers['x-github-repo'];

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  if (!token || !repo) {
    return res.status(400).json({ error: 'GitHub Token and Repo required in headers' });
  }

  try {
    // GitHub'dan links.json'u al
    const fileRes = await fetch(
      `https://raw.githubusercontent.com/${repo}/main/links.json`
    );

    if (!fileRes.ok) {
      return res.status(404).json({ 
        error: 'Link not found',
        code: code,
        message: 'Bu kod geçersiz veya silinmiş'
      });
    }

    const data = await fileRes.json();
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
      try {
        const response = await fetch(url);
        const jsonData = await response.json();
        return res.status(200).json(jsonData);
      } catch {
        return res.status(200).json({
          code: code,
          url: url,
          message: 'URL kaydedildi, içerik çekilemedi'
        });
      }
    }

    // Normal yönlendirme
    res.redirect(302, url);

  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
