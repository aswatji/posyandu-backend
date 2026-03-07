// const { google } = require("googleapis");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

// exports.exportKeSpreadsheet = async (req, res) => {
//   try {
//     let authOptions = {
//       scopes: ["https://www.googleapis.com/auth/spreadsheets"],
//     };

//     if (process.env.GOOGLE_CREDENTIALS) {
//       authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
//     } else {
//       authOptions.keyFile = "sheetgoogle.json";
//     }

//     const auth = new google.auth.GoogleAuth(authOptions);
//     const client = await auth.getClient();
//     const sheets = google.sheets({ version: "v4", auth: client });

//     const SPREADSHEET_ID = "1xzsDoZVkFXqYQPJs6qSpPqhkLGq6sUkAjznzb-QW3fw";

//     // =================================================================
//     // PROSES 1: AMBIL & SUSUN DATA KARTU KELUARGA
//     // =================================================================
//     const dataKK = await prisma.kartuKeluarga.findMany();

//     const barisExcelKK = [
//       [
//         "No",
//         "Nomor KK",
//         "Kepala Keluarga",
//         "Alamat Lengkap",
//         "RT",
//         "RW",
//         "Dusun",
//         "Desa",
//         "Kecamatan",
//         "Latitude",
//         "Longitude",
//         "Diinput Oleh",
//         "Tgl Dibuat",
//         "Terakhir Diedit", // <-- KOLOM BARU
//       ],
//     ];

//     dataKK.forEach((kk, index) => {
//       barisExcelKK.push([
//         index + 1,
//         kk.nomorKK || "-",
//         kk.kepalaKeluarga || "-",
//         kk.alamatLengkap || "-",
//         kk.nomorRT || "-",
//         kk.nomorRW || "-",
//         kk.dusun || "-",
//         kk.desa || "-",
//         kk.kecamatan || "-",
//         kk.latitude || "-",
//         kk.longitude || "-",
//         kk.diinputOleh || "-", // <-- DATA BARU
//         kk.createdAt ? new Date(kk.createdAt).toLocaleDateString("id-ID") : "-",
//         kk.updatedAt ? new Date(kk.updatedAt).toLocaleDateString("id-ID") : "-",
//       ]);
//     });

//     // =================================================================
//     // PROSES 2: AMBIL & SUSUN DATA WARGA
//     // =================================================================
//     const dataWarga = await prisma.warga.findMany();

//     const barisExcelWarga = [
//       [
//         "No",
//         "Nomor KK",
//         "NIK",
//         "No Rekam Medis",
//         "Nama Warga",
//         "Tgl Lahir",
//         "L/P",
//         "Gol. Darah",
//         "Status Keluarga",
//         "Pekerjaan",
//         "Pendidikan",
//         "No HP",
//         "Status Nikah",
//         "Status Hamil",
//         "No BPJS",
//         "Alergi",
//         "Riwayat Penyakit",
//         "Disabilitas",
//         "Catatan Khusus",
//         "Diinput Oleh",
//         "Tgl Dibuat",
//         "Terakhir Diedit", // <-- KOLOM BARU
//       ],
//     ];

//     dataWarga.forEach((warga, index) => {
//       barisExcelWarga.push([
//         index + 1,
//         warga.nomorKkRel || "-",
//         warga.nik || "-",
//         warga.nomorRekamMedis || "-",
//         warga.nama || "-",
//         warga.tanggalLahir || "-",
//         warga.jenisKelamin || "-",
//         warga.golonganDarah || "-",
//         warga.statusKeluarga || "-",
//         warga.pekerjaan || "-",
//         warga.pendidikan || "-",
//         warga.noHp || "-",
//         warga.statusPernikahan || "-",
//         warga.statusKehamilan || "-",
//         warga.noBPJS || "-",
//         warga.alergi || "-",
//         warga.riwayatPenyakit || "-",
//         warga.disabilitas || "-",
//         warga.catatanKhusus || "-",
//         warga.diinputOleh || "-", // <-- DATA BARU
//         warga.createdAt
//           ? new Date(warga.createdAt).toLocaleDateString("id-ID")
//           : "-",
//         warga.updatedAt
//           ? new Date(warga.updatedAt).toLocaleDateString("id-ID")
//           : "-",
//       ]);
//     });

//     // =================================================================
//     // PROSES 3: AMBIL & SUSUN DATA USER
//     // =================================================================
//     const dataUser = await prisma.user.findMany();

//     const barisExcelUser = [
//       [
//         "No",
//         "Nama Lengkap",
//         "Email",
//         "No Telepon",
//         "Wilayah Kerja",
//         "Jabatan",
//         "Tgl Bergabung",
//         "Terakhir Update Profil", // <-- KOLOM BARU
//       ],
//     ];

//     dataUser.forEach((user, index) => {
//       barisExcelUser.push([
//         index + 1,
//         user.namaLengkap || "-",
//         user.email || "-",
//         user.nomorTelepon || "-",
//         user.wilayahKerja || "-",
//         user.jabatan || "-",
//         user.createdAt
//           ? new Date(user.createdAt).toLocaleDateString("id-ID")
//           : "-",
//         user.updatedAt
//           ? new Date(user.updatedAt).toLocaleDateString("id-ID")
//           : "-", // <-- DATA BARU
//       ]);
//     });

//     // =================================================================
//     // PROSES 4: TULIS KE GOOGLE SHEETS
//     // =================================================================
//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Data KK!A1",
//       valueInputOption: "USER_ENTERED",
//       resource: { values: barisExcelKK },
//     });

//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Data Warga!A1",
//       valueInputOption: "USER_ENTERED",
//       resource: { values: barisExcelWarga },
//     });

//     await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: "Data User!A1",
//       valueInputOption: "USER_ENTERED",
//       resource: { values: barisExcelUser },
//     });

//     res.status(200).json({
//       status: "sukses",
//       pesan:
//         "Berhasil! Data lengkap dengan jejak audit sudah diekspor ke Excel.",
//     });
//   } catch (error) {
//     console.error("Gagal ekspor ke Google Sheets:", error);
//     res.status(500).json({
//       status: "gagal",
//       pesan: "Gagal mengekspor data. Cek log server.",
//     });
//   }
// };

const { google } = require("googleapis");
const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

exports.exportKeSpreadsheetFullOtomatis = async (req, res) => {
  try {
    // =================================================================
    // 1. OTENTIKASI GOOGLE API
    // =================================================================
    let authOptions = {
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    };

    if (process.env.GOOGLE_CREDENTIALS) {
      authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
      authOptions.keyFile = "sheetgoogle.json";
    }

    const auth = new google.auth.GoogleAuth(authOptions);
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Ganti SPREADSHEET_ID ini sesuai dengan ID file Google Sheets tujuan
    const SPREADSHEET_ID = "1xzsDoZVkFXqYQPJs6qSpPqhkLGq6sUkAjznzb-QW3fw";

    // =================================================================
    // 2. PERSIAPAN SISTEM DINAMIS (BACA DATABASE)
    // =================================================================
    const semuaTabel = Prisma.dmmf.datamodel.models; // Baca semua struktur tabel dari Prisma

    // WHITELIST: Daftar nama tabel (Model) di database yang dizinkan untuk diekspor.
    // Tambahkan nama tabel baru di sini jika database Anda berkembang.
    const tabelYangDiekspor = ["KartuKeluarga", "Warga", "User"];

    // Ambil info nama-nama sheet yang sudah ada di Excel saat ini
    const infoSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetYangSudahAda = infoSpreadsheet.data.sheets.map(
      (s) => s.properties.title,
    );

    // =================================================================
    // 3. MESIN UTAMA: LOOPING TABEL & CHUNKING (PENCICILAN DATA)
    // =================================================================
    for (const tabel of semuaTabel) {
      // Lewati tabel jika namanya tidak ada di dalam Whitelist
      if (!tabelYangDiekspor.includes(tabel.name)) continue;

      const namaModel = tabel.name; // Contoh: "Warga"
      const namaSheet = "Data " + namaModel; // Menjadi: "Data Warga"
      // Format pemanggilan Prisma (huruf awal kecil), contoh: prisma.warga
      const namaDelegate =
        namaModel.charAt(0).toLowerCase() + namaModel.slice(1);

      console.log(`\nMemproses tabel: ${namaModel}...`);

      // --- A. Buat Sheet Baru Jika Belum Ada ---
      if (!sheetYangSudahAda.includes(namaSheet)) {
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          resource: {
            requests: [{ addSheet: { properties: { title: namaSheet } } }],
          },
        });
        sheetYangSudahAda.push(namaSheet); // Catat agar tidak dibuat ganda
      }

      // --- B. Kuras/Bersihkan Data Lama di Sheet ---
      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: namaSheet,
      });

      // --- C. Susun & Tulis Header Secara Otomatis ---
      // Ambil field biasa (scalar), abaikan field relasi antar tabel
      const kolomDatabase = tabel.fields.filter(
        (field) => field.kind === "scalar",
      );
      // Baris pertama berisi "No" dan nama-nama kolom dari database
      const headerKolom = ["No", ...kolomDatabase.map((field) => field.name)];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${namaSheet}!A1`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [headerKolom] },
      });

      // --- D. Proses Chunking (Mencicil Ekspor per 5.000 Baris) ---
      const ukuranCicilan = 5000;
      let barisKe = 0;
      let masihAdaData = true;

      while (masihAdaData) {
        // Tarik data dari database sesuai limit (take) dan offset (skip)
        const dataBatch = await prisma[namaDelegate].findMany({
          take: ukuranCicilan,
          skip: barisKe,
        });

        // Jika gudang sudah kosong, hentikan perulangan (while)
        if (dataBatch.length === 0) {
          masihAdaData = false;
          console.log(
            `✅ Selesai! Total ${barisKe} baris diekspor ke ${namaSheet}.`,
          );
          break;
        }

        // Format data mentah dari database menjadi format baris Excel
        const barisExcel = dataBatch.map((item, index) => {
          const barisIni = [barisKe + index + 1]; // Nomor urut berlanjut otomatis

          kolomDatabase.forEach((field) => {
            let nilai = item[field.name];

            // Konversi tanggal ke format Indonesia
            if (nilai instanceof Date) {
              nilai = nilai.toLocaleDateString("id-ID");
            }

            // Masukkan nilai. Jika kosong/null, ganti dengan tanda "-"
            barisIni.push(nilai !== null && nilai !== undefined ? nilai : "-");
          });

          return barisIni;
        });

        // Tempelkan (Append) data batch ini ke baris kosong paling bawah di Excel
        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${namaSheet}!A1`,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          resource: { values: barisExcel },
        });

        barisKe += ukuranCicilan;
        console.log(`- Mengirim cicilan... (Total terkirim: ${barisKe} baris)`);
      }
    }

    // =================================================================
    // 4. RESPON BERHASIL KE FRONTEND
    // =================================================================
    res.status(200).json({
      status: "sukses",
      pesan: "Berhasil! Ekspor otomatis semua data skala besar selesai.",
    });
  } catch (error) {
    console.error("Gagal melakukan ekspor data:", error);
    res.status(500).json({
      status: "gagal",
      pesan: "Gagal mengekspor data. Silakan cek log server.",
    });
  }
};
