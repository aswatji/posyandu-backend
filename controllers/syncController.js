const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.syncData = async (req, res) => {
  const { kartu_keluarga, warga } = req.body;

  try {
    // 1. SINKRONISASI KARTU KELUARGA
    if (kartu_keluarga && kartu_keluarga.length > 0) {
      for (const kk of kartu_keluarga) {
        const { id, is_synced, is_deleted, ...kkData } = kk;

        if (is_deleted === 1) {
          try {
            await prisma.kartuKeluarga.delete({
              where: { nomorKK: kkData.nomorKK },
            });
          } catch (e) {
            /* Abaikan jika sudah tidak ada di server */
          }
        } else {
          await prisma.kartuKeluarga.upsert({
            where: { nomorKK: kkData.nomorKK },
            update: kkData,
            create: kkData,
          });
        }
      }
    }

    // 2. SINKRONISASI DATA WARGA
    if (warga && warga.length > 0) {
      for (const w of warga) {
        if (!w.nomorKkRel && w.is_deleted === 0) continue;

        const { id, kkId, is_synced, is_deleted, ...wargaData } = w;

        if (is_deleted === 1) {
          try {
            await prisma.warga.delete({ where: { nik: wargaData.nik } });
          } catch (e) {
            /* Abaikan jika sudah tidak ada di server */
          }
        } else {
          await prisma.warga.upsert({
            where: { nik: wargaData.nik },
            update: wargaData,
            create: wargaData,
          });
        }
      }
    }

    res.status(200).json({
      status: "sukses",
      pesan: "Sinkronisasi Offline ke Online berhasil!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

// FUNGSI UNTUK MEMBERIKAN DATA KE HP (PULL)
exports.pullData = async (req, res) => {
  try {
    const kk = await prisma.kartuKeluarga.findMany();
    const warga = await prisma.warga.findMany();

    res.status(200).json({
      status: "sukses",
      kartu_keluarga: kk,
      warga: warga,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
