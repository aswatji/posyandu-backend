const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// ========================================================
// 1. SIMPAN ATAU PERBARUI DATA KELUARGA (UPSERT)
// ========================================================
const upsertDataKeluarga = async (req, res) => {
  try {
    // 🔥 PERBAIKAN DI SINI:
    // Pisahkan nomorKkRel dan namaKepalaKeluarga agar tidak ikut tersimpan ke dataLingkungan
    const { nomorKkRel, namaKepalaKeluarga, ...dataLingkungan } = req.body;

    // Validasi dasar
    if (!nomorKkRel) {
      return res.status(400).json({
        status: "gagal",
        pesan: "Nomor KK Relasi (nomorKkRel) wajib diisi!",
      });
    }

    // Pastikan KK Induknya ada di database
    const cekKk = await prisma.kartuKeluarga.findUnique({
      where: { nomorKK: nomorKkRel },
    });

    if (!cekKk) {
      return res.status(404).json({
        status: "gagal",
        pesan: "Kartu Keluarga Induk tidak ditemukan di server!",
      });
    }

    // Gunakan UPSERT: Jika belum ada di-Create, jika sudah ada di-Update
    const result = await prisma.dataKeluarga.upsert({
      where: { nomorKkRel: nomorKkRel },
      update: {
        ...dataLingkungan,
        jmlTotal: Number(dataLingkungan.jmlTotal) || 0,
        jmlLansia: Number(dataLingkungan.jmlLansia) || 0,
        jmlDewasa: Number(dataLingkungan.jmlDewasa) || 0,
        jmlRemaja: Number(dataLingkungan.jmlRemaja) || 0,
        jmlBalita: Number(dataLingkungan.jmlBalita) || 0,
        jmlBayi: Number(dataLingkungan.jmlBayi) || 0,
        jmlNifas: Number(dataLingkungan.jmlNifas) || 0,
        jmlBumil: Number(dataLingkungan.jmlBumil) || 0,
      },
      create: {
        nomorKkRel: nomorKkRel,
        ...dataLingkungan,
        jmlTotal: Number(dataLingkungan.jmlTotal) || 0,
        jmlLansia: Number(dataLingkungan.jmlLansia) || 0,
        jmlDewasa: Number(dataLingkungan.jmlDewasa) || 0,
        jmlRemaja: Number(dataLingkungan.jmlRemaja) || 0,
        jmlBalita: Number(dataLingkungan.jmlBalita) || 0,
        jmlBayi: Number(dataLingkungan.jmlBayi) || 0,
        jmlNifas: Number(dataLingkungan.jmlNifas) || 0,
        jmlBumil: Number(dataLingkungan.jmlBumil) || 0,
      },
    });

    return res.status(200).json({
      status: "sukses",
      pesan: "Data Lingkungan Keluarga berhasil disimpan!",
      data: result,
    });
  } catch (error) {
    console.error("Error Upsert Data Keluarga:", error);
    return res
      .status(500)
      .json({ status: "error", pesan: "Terjadi kesalahan pada server." });
  }
};

// ========================================================
// 2. AMBIL DATA KELUARGA BERDASARKAN NOMOR KK
// ========================================================
const getDataKeluargaByKK = async (req, res) => {
  try {
    const { nomorKkRel } = req.params;

    const data = await prisma.dataKeluarga.findUnique({
      where: { nomorKkRel: nomorKkRel },
    });

    if (!data) {
      return res.status(404).json({
        status: "gagal",
        pesan: "Data lingkungan keluarga belum diisi.",
      });
    }

    return res.status(200).json({
      status: "sukses",
      data: data,
    });
  } catch (error) {
    console.error("Error Get Data Keluarga:", error);
    return res
      .status(500)
      .json({ status: "error", pesan: "Terjadi kesalahan pada server." });
  }
};

module.exports = {
  upsertDataKeluarga,
  getDataKeluargaByKK,
};
