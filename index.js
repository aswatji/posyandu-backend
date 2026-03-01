const express = require("express");
const cors = require("cors");

// Import Routes
const kkRoute = require("./routes/kkRoute");
const wargaRoute = require("./routes/wargaRoute");
const syncRoute = require("./routes/syncRoute");
const authRoute = require("./routes/authRoute");

const app = express();

// Middleware Bawaan Express
app.use(cors());
app.use(express.json({ limit: "50mb" })); // Agar bisa terima data banyak

// Daftarkan Routes Utama
app.use("/api/kk", kkRoute);
app.use("/api/warga", wargaRoute);
app.use("/api/sync", syncRoute);
app.use("/api/auth", authRoute);

// Route Default untuk tes server
app.get("/", (req, res) => {
  res.send("🚀 Server Backend Posyandu (MVC) Menyala dengan Aman!");
});

// Jalankan Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server Backend Posyandu berjalan di Port ${PORT}`);
});
