export default function handler(req, res) {
  const { code } = req.query;
  
  // Test için
  res.status(200).json({
    message: "API çalışıyor!",
    code: code,
    time: new Date().toISOString()
  });
}
