// Middleware untuk mengecek API Key
exports.cekApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  const SECRET_KEY = "posyandu-rahasia-123"; // Kamu bisa ganti ini nanti dan taruh di .env

  if (!apiKey || apiKey !== SECRET_KEY) {
    return res.status(401).json({
      status: "gagal",
      pesan: "Akses Ditolak! API Key tidak valid atau tidak ada.",
    });
  }

  // Jika kunci benar, persilakan masuk ke Controller
  next();
};
