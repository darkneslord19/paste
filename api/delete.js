export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token, X-GitHub-Repo');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'DELETE method required' });
  }

  const { code } = req.body;
  const token = req.headers['x-github-token'];
  const repo = req.headers['x-github-repo'];

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  if (!token || !repo) {
    return res.status(400).json({ error: 'GitHub Token and Repo required in headers' });
  }

  try {
    // 1. Mevcut links.json'u al
    const fileRes = await fetch(
      `https://api.github.com/repos/${repo}/contents/links.json`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!fileRes.ok) {
      return res.status(404).json({ error: 'Link not found' });
    }

    const fileData = await fileRes.json();
    const sha = fileData.sha;
    const content = Buffer.from(fileData.content, 'base64').toString('utf8');
    const data = JSON.parse(content);

    if (!data[code]) {
      return res.status(404).json({ error: 'Link not found' });
    }

    // 2. Linki sil
    delete data[code];

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
          message: `Delete link: ${code}`,
          content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64'),
          sha: sha
        })
      }
    );

    if (!updateRes.ok) {
      throw new Error('GitHub update failed');
    }

    res.status(200).json({
      success: true,
      message: `Link ${code} deleted`
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
