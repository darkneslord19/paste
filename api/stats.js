export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const dataStore = global.dataStore || {};
  const links = Object.values(dataStore);

  const stats = {
    totalLinks: links.length,
    totalRedirects: links.reduce((acc, link) => acc + (link.redirects || 0), 0),
    recentLinks: links.slice(0, 10).map(link => ({
      code: link.code,
      filename: link.filename,
      createdAt: link.createdAt
    })),
    topExtensions: getTopExtensions(links)
  };

  res.status(200).json({
    success: true,
    stats
  });
}

function getTopExtensions(links) {
  const extCount = {};
  links.forEach(link => {
    const ext = link.extension || 'unknown';
    extCount[ext] = (extCount[ext] || 0) + 1;
  });
  
  return Object.entries(extCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ext, count]) => ({ extension: ext, count }));
}
