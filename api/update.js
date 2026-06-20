export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, url, filename, extension, jsonData } = req.body;

  if (!code || code.length !== 8) {
    return res.status(400).json({ error: 'Invalid code format' });
  }

  const dataStore = global.dataStore;

  if (!dataStore || !dataStore[code]) {
    return res.status(404).json({ error: 'Link not found' });
  }

  if (url) dataStore[code].url = url;
  if (filename) dataStore[code].filename = filename;
  if (extension) dataStore[code].extension = extension;
  if (jsonData !== undefined) dataStore[code].jsonData = jsonData;
  dataStore[code].updatedAt = new Date().toISOString();

  res.status(200).json({
    success: true,
    data: dataStore[code]
  });
}
