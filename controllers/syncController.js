// // const { PrismaClient } = require("@prisma/client");
// // const prisma = new PrismaClient();

// // // FUNGSI UNTUK SINKRONISASI DARI HP KE SERVER (PUSH)
// // exports.syncData = async (req, res) => {
// //   // TANGKAP wilayahKerja DARI HP KADER
// //   const { kartu_keluarga, warga, wilayahKerja } = req.body;

// //   if (!wilayahKerja) {
// //     return res
// //       .status(400)
// //       .json({ status: "gagal", pesan: "Wilayah kerja Kader wajib dikirim!" });
// //   }

// //   try {
// //     // 1. SINKRONISASI KARTU KELUARGA
// //     if (kartu_keluarga && kartu_keluarga.length > 0) {
// //       for (const kk of kartu_keluarga) {
// //         const { id, is_synced, is_deleted, ...kkData } = kk;

// //         // KEAMANAN EKSTRA: Paksa kolom 'desa' menjadi wilayah kerja Kader
// //         // agar Kader tidak bisa menginput data untuk desa lain.
// //         kkData.desa = wilayahKerja;

// //         if (is_deleted === 1) {
// //           try {
// //             await prisma.kartuKeluarga.delete({
// //               where: { nomorKK: kkData.nomorKK },
// //             });
// //           } catch (e) {
// //             /* Abaikan jika sudah tidak ada di server */
// //           }
// //         } else {
// //           await prisma.kartuKeluarga.upsert({
// //             where: { nomorKK: kkData.nomorKK },
// //             update: kkData,
// //             create: kkData,
// //           });
// //         }
// //       }
// //     }

// //     // 2. SINKRONISASI DATA WARGA
// //     if (warga && warga.length > 0) {
// //       for (const w of warga) {
// //         if (!w.nomorKkRel && w.is_deleted === 0) continue;

// //         const { id, kkId, is_synced, is_deleted, ...wargaData } = w;

// //         // Validasi opsional: Kita bisa cek apakah nomorKkRel warga ini benar-benar ada di desa tersebut
// //         // Tapi asumsikan relasi nomorKK sudah dikunci di sisi HP.

// //         if (is_deleted === 1) {
// //           try {
// //             await prisma.warga.delete({ where: { nik: wargaData.nik } });
// //           } catch (e) {
// //             /* Abaikan jika sudah tidak ada di server */
// //           }
// //         } else {
// //           await prisma.warga.upsert({
// //             where: { nik: wargaData.nik },
// //             update: wargaData,
// //             create: wargaData,
// //           });
// //         }
// //       }
// //     }

// //     res.status(200).json({
// //       status: "sukses",
// //       pesan: "Sinkronisasi Offline ke Online berhasil!",
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ status: "gagal", pesan: error.message });
// //   }
// // };

// // // FUNGSI UNTUK MEMBERIKAN DATA KE HP (PULL)
// // exports.pullData = async (req, res) => {
// //   try {
// //     // TANGKAP wilayahKerja DARI HP KADER (Bisa lewat params atau body POST)
// //     const { wilayahKerja } = req.body;

// //     if (!wilayahKerja) {
// //       return res.status(400).json({
// //         status: "gagal",
// //         pesan: "Wilayah kerja Kader tidak diketahui.",
// //       });
// //     }

// //     // 1. Ambil KK HANYA YANG BERADA DI DESA KADER TERSEBUT
// //     const kk = await prisma.kartuKeluarga.findMany({
// //       where: { desa: wilayahKerja },
// //     });

// //     // 2. Ambil Warga HANYA YANG KK-NYA BERADA DI DESA KADER TERSEBUT
// //     const warga = await prisma.warga.findMany({
// //       where: {
// //         KartuKeluarga: {
// //           desa: wilayahKerja,
// //         },
// //       },
// //     });

// //     res.status(200).json({
// //       status: "sukses",
// //       kartu_keluarga: kk,
// //       warga: warga,
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ status: "gagal", pesan: error.message });
// //   }
// // };

// // exports.checkVersion = async (req, res) => {
// //   try {
// //     // Saat ini kita hardcode dulu, tapi karena kamu sudah pakai Prisma,
// //     // suatu saat nanti data ini bisa diambil dari database jika kamu buat tabel 'Settings'
// //     res.status(200).json({
// //       latestVersion: "1.0.2",
// //       minVersion: "1.0.1",
// //       updateUrl: "https://link-ke-apk-baru-atau-playstore.com", // Ganti dengan link APK kamu
// //       message:
// //         "Ada pembaruan fitur baru untuk aplikasi Posyandu. Wajib update ya, Bu Kader!",
// //     });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ status: "gagal", pesan: error.message });
// //   }
// // };

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// // FUNGSI UNTUK SINKRONISASI DARI HP KE SERVER (PUSH)
// exports.syncData = async (req, res) => {
//   // TANGKAP wilayahKerja DARI HP KADER
//   const { kartu_keluarga, warga, wilayahKerja } = req.body;

//   if (!wilayahKerja) {
//     return res
//       .status(400)
//       .json({ status: "gagal", pesan: "Wilayah kerja Kader wajib dikirim!" });
//   }

//   try {
//     // 1. SINKRONISASI KARTU KELUARGA
//     if (kartu_keluarga && kartu_keluarga.length > 0) {
//       for (const kk of kartu_keluarga) {
//         const { id, is_synced, is_deleted, ...kkDataLengkap } = kk;

//         if (is_deleted === 1) {
//           try {
//             await prisma.kartuKeluarga.delete({
//               where: { nomorKK: kkDataLengkap.nomorKK },
//             });
//           } catch (e) {
//             /* Abaikan jika sudah tidak ada di server */
//           }
//         } else {
//           // 🔥 PENYARINGAN DATA KARTU KELUARGA (AGAR TIDAK ERROR PRISMA)
//           const dataKKValid = {
//             nomorKK: kkDataLengkap.nomorKK,
//             kepalaKeluarga: kkDataLengkap.kepalaKeluarga,
//             alamatLengkap: kkDataLengkap.alamatLengkap,
//             nomorRT: kkDataLengkap.nomorRT,
//             nomorRW: kkDataLengkap.nomorRW,
//             dusun: kkDataLengkap.dusun,
//             // Paksa kolom desa sesuai wilayah kerja kader
//             desa: wilayahKerja,
//             kecamatan: kkDataLengkap.kecamatan,
//             latitude: kkDataLengkap.latitude,
//             longitude: kkDataLengkap.longitude,
//             diinputOleh: kkDataLengkap.diinputOleh,
//           };

//           await prisma.kartuKeluarga.upsert({
//             where: { nomorKK: dataKKValid.nomorKK },
//             update: dataKKValid,
//             create: dataKKValid,
//           });
//         }
//       }
//     }

//     // 2. SINKRONISASI DATA WARGA
//     if (warga && warga.length > 0) {
//       for (const w of warga) {
//         if (!w.nomorKkRel && w.is_deleted === 0) continue;

//         const { id, kkId, is_synced, is_deleted, ...wargaData } = w;

//         if (is_deleted === 1) {
//           try {
//             await prisma.warga.delete({ where: { nik: wargaData.nik } });
//           } catch (e) {
//             /* Abaikan jika sudah tidak ada di server */
//           }
//         } else {
//           await prisma.warga.upsert({
//             where: { nik: wargaData.nik },
//             update: wargaData,
//             create: wargaData,
//           });
//         }
//       }
//     }

//     res.status(200).json({
//       status: "sukses",
//       pesan: "Sinkronisasi Offline ke Online berhasil!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

// // FUNGSI UNTUK MEMBERIKAN DATA KE HP (PULL)
// exports.pullData = async (req, res) => {
//   try {
//     // TANGKAP wilayahKerja DARI HP KADER
//     const { wilayahKerja } = req.body;

//     if (!wilayahKerja) {
//       return res.status(400).json({
//         status: "gagal",
//         pesan: "Wilayah kerja Kader tidak diketahui.",
//       });
//     }

//     // 1. Ambil KK HANYA YANG BERADA DI DESA KADER TERSEBUT
//     const kk = await prisma.kartuKeluarga.findMany({
//       where: { desa: wilayahKerja },
//     });

//     // 2. Ambil Warga HANYA YANG KK-NYA BERADA DI DESA KADER TERSEBUT
//     const warga = await prisma.warga.findMany({
//       where: {
//         KartuKeluarga: {
//           desa: wilayahKerja,
//         },
//       },
//     });

//     res.status(200).json({
//       status: "sukses",
//       kartu_keluarga: kk,
//       warga: warga,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

// // FUNGSI CEK VERSI APLIKASI
// exports.checkVersion = async (req, res) => {
//   try {
//     res.status(200).json({
//       latestVersion: "1.0.2",
//       minVersion: "1.0.1",
//       updateUrl: "https://link-ke-apk-baru-atau-playstore.com",
//       message:
//         "Ada pembaruan fitur baru untuk aplikasi Posyandu. Wajib update ya, Bu Kader!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// // FUNGSI UNTUK SINKRONISASI DARI HP KE SERVER (PUSH)
// exports.syncData = async (req, res) => {
//   // TANGKAP wilayahKerja DARI HP KADER
//   const { kartu_keluarga, warga, wilayahKerja } = req.body;

//   if (!wilayahKerja) {
//     return res
//       .status(400)
//       .json({ status: "gagal", pesan: "Wilayah kerja Kader wajib dikirim!" });
//   }
//   console.log(`\n=========================================`);
//   console.log(`📥 MENERIMA SYNC DARI: ${wilayahKerja}`);
//   console.log(
//     `Jumlah KK diterima: ${kartu_keluarga ? kartu_keluarga.length : 0}`,
//   );
//   console.log(`Jumlah Warga diterima: ${warga ? warga.length : 0}`);
//   console.log(`=========================================\n`);
//   try {
//     // 1. SINKRONISASI KARTU KELUARGA
//     if (kartu_keluarga && kartu_keluarga.length > 0) {
//       for (const kk of kartu_keluarga) {
//         if (!w.KartuKeluarga?.connect?.nomorKK && w.is_deleted === 0) {
//           console.log(`❌ DITOLAK (Tanpa KK): NIK ${w.nik} - Nama: ${w.nama}`);
//           continue;
//         }
//         const { id, is_synced, is_deleted, ...kkDataLengkap } = kk;

//         if (is_deleted === 1) {
//           try {
//             await prisma.kartuKeluarga.delete({
//               where: { nomorKK: kkDataLengkap.nomorKK },
//             });
//           } catch (e) {
//             // 🎥 CCTV 3: Lacak jika Prisma yang menolak (misal duplicate NIK dll)
//             console.log(
//               `⚠️ GAGAL PRISMA (Warga NIK ${wargaData.nik}): ${err.message}`,
//             );
//             continue;
//           }
//         } else {
//           // 🔥 PENYARINGAN DATA KARTU KELUARGA (AGAR TIDAK ERROR PRISMA)
//           const dataKKValid = {
//             nomorKK: kkDataLengkap.nomorKK,
//             kepalaKeluarga: kkDataLengkap.kepalaKeluarga,
//             alamatLengkap: kkDataLengkap.alamatLengkap,
//             nomorRT: kkDataLengkap.nomorRT,
//             nomorRW: kkDataLengkap.nomorRW,
//             dusun: kkDataLengkap.dusun,
//             // Paksa kolom desa sesuai wilayah kerja kader
//             desa: wilayahKerja,
//             kecamatan: kkDataLengkap.kecamatan,
//             latitude: kkDataLengkap.latitude,
//             longitude: kkDataLengkap.longitude,
//             diinputOleh: kkDataLengkap.diinputOleh,
//           };

//           try {
//             await prisma.kartuKeluarga.upsert({
//               where: { nomorKK: dataKKValid.nomorKK },
//               update: dataKKValid,
//               create: dataKKValid,
//             });
//           } catch (err) {
//             console.log(
//               `⚠️ Gagal simpan KK: ${dataKKValid.nomorKK}`,
//               err.message,
//             );
//           }
//         }
//       }
//     }

//     // 2. SINKRONISASI DATA WARGA (SEKARANG TAHAN BANTING)
//     if (warga && warga.length > 0) {
//       for (const w of warga) {
//         if (!w.KartuKeluarga?.connect?.nomorKK && w.is_deleted === 0) continue;

//         const { id, kkId, is_synced, is_deleted, nomorKkRel, ...wargaData } = w;

//         if (is_deleted === 1) {
//           try {
//             await prisma.warga.delete({ where: { nik: wargaData.nik } });
//           } catch (e) {
//             /* Abaikan jika sudah tidak ada di server */
//           }
//         } else {
//           try {
//             await prisma.warga.upsert({
//               where: { nik: wargaData.nik },
//               update: {
//                 ...wargaData,
//                 // Pastikan format relasi disuntikkan ke update jika perlu
//                 KartuKeluarga: wargaData.KartuKeluarga,
//               },
//               create: wargaData, // wargaData dari HP sudah membawa KartuKeluarga: { connect: ... }
//             });
//           } catch (err) {
//             // 🔥 JIKA GAGAL: CATAT ERROR TAPI LANJUT KE WARGA BERIKUTNYA!
//             console.log(
//               `⚠️ Warga NIK ${wargaData.nik} gagal sinkron: ${err.message}`,
//             );
//             continue; // Lanjut ke data selanjutnya
//           }
//         }
//       }
//     }

//     res.status(200).json({
//       status: "sukses",
//       pesan: "Sinkronisasi Offline ke Online berhasil diproses!",
//     });
//   } catch (error) {
//     console.error("ERROR FATAL SYNC:", error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

// // FUNGSI UNTUK MEMBERIKAN DATA KE HP (PULL)
// exports.pullData = async (req, res) => {
//   try {
//     // TANGKAP wilayahKerja DARI HP KADER
//     const { wilayahKerja } = req.body;

//     if (!wilayahKerja) {
//       return res.status(400).json({
//         status: "gagal",
//         pesan: "Wilayah kerja Kader tidak diketahui.",
//       });
//     }

//     // 1. Ambil KK HANYA YANG BERADA DI DESA KADER TERSEBUT
//     const kk = await prisma.kartuKeluarga.findMany({
//       where: { desa: wilayahKerja },
//     });

//     // 2. Ambil Warga HANYA YANG KK-NYA BERADA DI DESA KADER TERSEBUT
//     const warga = await prisma.warga.findMany({
//       where: {
//         KartuKeluarga: {
//           desa: wilayahKerja,
//         },
//       },
//     });

//     res.status(200).json({
//       status: "sukses",
//       kartu_keluarga: kk,
//       warga: warga,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

// // FUNGSI CEK VERSI APLIKASI
// exports.checkVersion = async (req, res) => {
//   try {
//     res.status(200).json({
//       latestVersion: "1.0.2",
//       minVersion: "1.0.1",
//       updateUrl: "https://link-ke-apk-baru-atau-playstore.com",
//       message:
//         "Ada pembaruan fitur baru untuk aplikasi Posyandu. Wajib update ya, Bu Kader!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ status: "gagal", pesan: error.message });
//   }
// };

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

  console.log(`\n=========================================`);
  console.log(`📥 MENERIMA SYNC DARI: ${wilayahKerja}`);
  console.log(
    `Jumlah KK diterima: ${kartu_keluarga ? kartu_keluarga.length : 0}`,
  );
  console.log(`Jumlah Warga diterima: ${warga ? warga.length : 0}`);
  console.log(`=========================================\n`);

  try {
    // 1. SINKRONISASI KARTU KELUARGA
    if (kartu_keluarga && kartu_keluarga.length > 0) {
      for (const kk of kartu_keluarga) {
        const { id, is_synced, is_deleted, ...kkDataLengkap } = kk;

        if (is_deleted === 1) {
          try {
            await prisma.kartuKeluarga.delete({
              where: { nomorKK: kkDataLengkap.nomorKK },
            });
          } catch (e) {
            /* Abaikan jika sudah tidak ada di server */
          }
        } else {
          // 🔥 PENYARINGAN DATA KARTU KELUARGA (AGAR TIDAK ERROR PRISMA)
          const dataKKValid = {
            nomorKK: kkDataLengkap.nomorKK,
            kepalaKeluarga: kkDataLengkap.kepalaKeluarga,
            alamatLengkap: kkDataLengkap.alamatLengkap,
            nomorRT: kkDataLengkap.nomorRT,
            nomorRW: kkDataLengkap.nomorRW,
            dusun: kkDataLengkap.dusun,
            desa: wilayahKerja,
            kecamatan: kkDataLengkap.kecamatan,
            latitude: kkDataLengkap.latitude,
            longitude: kkDataLengkap.longitude,
            diinputOleh: kkDataLengkap.diinputOleh,
          };

          try {
            await prisma.kartuKeluarga.upsert({
              where: { nomorKK: dataKKValid.nomorKK },
              update: dataKKValid,
              create: dataKKValid,
            });
          } catch (err) {
            console.log(
              `⚠️ Gagal simpan KK: ${dataKKValid.nomorKK} - ${err.message}`,
            );
          }
        }
      }
    }

    // 2. SINKRONISASI DATA WARGA (SEKARANG TAHAN BANTING)
    if (warga && warga.length > 0) {
      for (const w of warga) {
        // 🎥 CCTV 2: Pengecekan 'w' yang BENAR ada di sini!
        if (!w.KartuKeluarga?.connect?.nomorKK && w.is_deleted === 0) {
          console.log(`❌ DITOLAK (Tanpa KK): NIK ${w.nik} - Nama: ${w.nama}`);
          continue;
        }

        const { id, kkId, is_synced, is_deleted, nomorKkRel, ...wargaData } = w;

        if (is_deleted === 1) {
          try {
            await prisma.warga.delete({ where: { nik: wargaData.nik } });
          } catch (e) {
            /* Abaikan jika sudah tidak ada di server */
          }
        } else {
          try {
            await prisma.warga.upsert({
              where: { nik: wargaData.nik },
              update: {
                ...wargaData,
                KartuKeluarga: wargaData.KartuKeluarga,
              },
              create: wargaData,
            });
          } catch (err) {
            // 🎥 CCTV 3: Lacak error warga
            console.log(
              `⚠️ Warga NIK ${wargaData.nik} gagal sinkron: ${err.message}`,
            );
            continue;
          }
        }
      }
    }

    res.status(200).json({
      status: "sukses",
      pesan: "Sinkronisasi Offline ke Online berhasil diproses!",
    });
  } catch (error) {
    console.error("ERROR FATAL SYNC:", error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

// FUNGSI UNTUK MEMBERIKAN DATA KE HP (PULL)
exports.pullData = async (req, res) => {
  try {
    const { wilayahKerja } = req.body;

    if (!wilayahKerja) {
      return res.status(400).json({
        status: "gagal",
        pesan: "Wilayah kerja Kader tidak diketahui.",
      });
    }

    const kk = await prisma.kartuKeluarga.findMany({
      where: { desa: wilayahKerja },
    });

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

// FUNGSI CEK VERSI APLIKASI
exports.checkVersion = async (req, res) => {
  try {
    res.status(200).json({
      latestVersion: "1.0.2",
      minVersion: "1.0.1",
      updateUrl: "https://link-ke-apk-baru-atau-playstore.com",
      message:
        "Ada pembaruan fitur baru untuk aplikasi Posyandu. Wajib update ya, Bu Kader!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
