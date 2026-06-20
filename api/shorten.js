export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token, X-GitHub-Repo');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST method required' });
  }

  const { code, url } = req.body;
  const token = req.headers['x-github-token'];
  const repo = req.headers['x-github-repo'];

  if (!code || !url) {
    return res.status(400).json({ error: 'Code and URL are required' });
  }

  if (code.length !== 8) {
    return res.status(400).json({ error: 'Code must be 8 characters' });
  }

  if (!/^[A-Z0-9]+$/.test(code)) {
    return res.status(400).json({ error: 'Code must be uppercase letters and numbers' });
  }

  if (!token || !repo) {
    return res.status(400).json({ error: 'GitHub Token and Repo required in headers' });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    // 1. Mevcut links.json'u al
    let fileRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/links.json`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    let data = {};
    let sha = null;

    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
      const content = Buffer.from(fileData.content, 'base64').toString('utf8');
      data = JSON.parse(content);
    }

    // 2. Yeni link ekle
    data[code] = url;

    // 3. GitHub'a gönder
    const updateRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/links.json`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Add link: ${code}`,
          content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
          sha: sha || undefined
        })
      }
    );

    if (!updateRes.ok) {
      const error = await updateRes.json();
      throw new Error(error.message || 'GitHub update failed');
    }

    res.status(200).json({
      success: true,
      code: code,
      shortUrl: `https://${process.env.VERCEL_URL || req.headers.host}/${code}`,
      url: url
    });

  } catch (error) {
    console.error('GitHub error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
