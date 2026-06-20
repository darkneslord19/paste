export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-GitHub-Token, X-GitHub-Repo');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = req.headers['x-github-token'];
  const repo = req.headers['x-github-repo'];

  if (!token || !repo) {
    return res.status(400).json({ error: 'GitHub Token and Repo required in headers' });
  }

  try {
    const fileRes = await fetch(
      `https://raw.githubusercontent.com/${repo}/main/links.json`
    );

    if (!fileRes.ok) {
      return res.status(200).json({
        success: true,
        total: 0,
        links: []
      });
    }

    const data = await fileRes.json();
    const links = Object.keys(data).map(code => ({
      code: code,
      url: data[code]
    }));

    res.status(200).json({
      success: true,
      total: links.length,
      links: links
    });

  } catch (error) {
    console.error('Links error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
