const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// FUNGSI UNTUK SINKRONISASI DARI HP KE SERVER (PUSH)
exports.syncData = async (req, res) => {
  // TANGKAP wilayahKerja DARI HP KADER
  const { kartu_keluarga, warga, wilayahKerja } = req.body;

  if (!wilayahKerja) {
    return res
      .status(400)
      .json({ status: "gagal", pesan: "Wilayah kerja Kader wajib dikirim!" });
  }

  try {
    // 1. SINKRONISASI KARTU KELUARGA
    if (kartu_keluarga && kartu_keluarga.length > 0) {
      for (const kk of kartu_keluarga) {
        const { id, is_synced, is_deleted, ...kkData } = kk;

        // KEAMANAN EKSTRA: Paksa kolom 'desa' menjadi wilayah kerja Kader
        // agar Kader tidak bisa menginput data untuk desa lain.
        kkData.desa = wilayahKerja;

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

        // Validasi opsional: Kita bisa cek apakah nomorKkRel warga ini benar-benar ada di desa tersebut
        // Tapi asumsikan relasi nomorKK sudah dikunci di sisi HP.

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
    // TANGKAP wilayahKerja DARI HP KADER (Bisa lewat params atau body POST)
    const { wilayahKerja } = req.body;

    if (!wilayahKerja) {
      return res.status(400).json({
        status: "gagal",
        pesan: "Wilayah kerja Kader tidak diketahui.",
      });
    }

    // 1. Ambil KK HANYA YANG BERADA DI DESA KADER TERSEBUT
    const kk = await prisma.kartuKeluarga.findMany({
      where: { desa: wilayahKerja },
    });

    // 2. Ambil Warga HANYA YANG KK-NYA BERADA DI DESA KADER TERSEBUT
    const warga = await prisma.warga.findMany({
      where: {
        KartuKeluarga: {
          desa: wilayahKerja,
        },
      },
    });

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

exports.checkVersion = async (req, res) => {
  try {
    // Saat ini kita hardcode dulu, tapi karena kamu sudah pakai Prisma,
    // suatu saat nanti data ini bisa diambil dari database jika kamu buat tabel 'Settings'
    res.status(200).json({
      latestVersion: "1.0.2",
      minVersion: "1.0.1",
      updateUrl: "https://link-ke-apk-baru-atau-playstore.com", // Ganti dengan link APK kamu
      message:
        "Ada pembaruan fitur baru untuk aplikasi Posyandu. Wajib update ya, Bu Kader!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
