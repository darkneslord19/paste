export default function handler(req, res) {
  res.status(200).json({
    success: true,
    links: [
      { code: 'TEST1234', url: 'https://example.com', name: 'Test' }
    ]
  });
}
