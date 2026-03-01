// Lokasi: controllers/authController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// 1. FUNGSI REGISTER (DAFTAR AKUN BARU)
exports.register = async (req, res) => {
  try {
    const {
      namaLengkap,
      email,
      nomorTelepon,
      wilayahKerja,
      jabatan,
      password,
    } = req.body;

    // Cek apakah email sudah pernah dipakai
    const emailSudahAda = await prisma.user.findUnique({ where: { email } });
    if (emailSudahAda) {
      return res
        .status(400)
        .json({ status: "gagal", pesan: "Email sudah terdaftar!" });
    }

    // Sandikan (Hash) password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Simpan ke database
    const userBaru = await prisma.user.create({
      data: {
        namaLengkap,
        email,
        nomorTelepon,
        wilayahKerja,
        jabatan,
        password: hashedPassword, // Simpan password yang sudah disandikan
      },
    });

    res.status(201).json({ status: "sukses", pesan: "Akun berhasil dibuat!" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", pesan: "Terjadi kesalahan pada server" });
  }
};

// 2. FUNGSI LOGIN (MASUK)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ status: "gagal", pesan: "Email tidak ditemukan!" });
    }

    // Cocokkan password yang diketik dengan yang ada di database
    const passwordCocok = await bcrypt.compare(password, user.password);
    if (!passwordCocok) {
      return res
        .status(401)
        .json({ status: "gagal", pesan: "Password salah!" });
    }

    // Hapus password dari data yang akan dikirim balik ke HP (demi keamanan)
    const { password: pwd, ...dataUserAman } = user;

    res.status(200).json({
      status: "sukses",
      pesan: "Login berhasil!",
      user: dataUserAman, // Data ini yang akan disimpan di AsyncStorage HP
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", pesan: "Terjadi kesalahan pada server" });
  }
};
exports.uploadFoto = async (req, res) => {
  try {
    const { email, fotoBase64 } = req.body;

    // Cari user berdasarkan email dan update fotonya
    const userUpdate = await prisma.user.update({
      where: { email: email },
      data: { fotoProfil: fotoBase64 },
    });

    // Hapus password agar aman saat dikirim balik ke HP
    const { password, ...dataAman } = userUpdate;

    res.status(200).json({
      status: "sukses",
      pesan: "Foto profil berhasil diperbarui!",
      user: dataAman,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", pesan: "Gagal menyimpan foto ke database." });
  }
};
