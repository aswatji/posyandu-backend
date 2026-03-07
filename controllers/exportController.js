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
    const SPREADSHEET_ID = "1xzsDoZVkFXqYQPJs6qSpPqhkLGq6sUkAjznzb-QW3fw";

    const semuaTabel = Prisma.dmmf.datamodel.models;
    const tabelYangDiekspor = ["KartuKeluarga", "Warga", "User"];

    // --- FITUR BARU 1: BLACKLIST KOLOM ---
    // Tambahkan nama kolom yang TIDAK BOLEH ikut diekspor ke Excel
    const kolomBlacklist = [
      "password",
      "foto",
      "avatar",
      "image",
      "file",
      "token",
      "fotoProfil",
    ];

    const infoSpreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheetYangSudahAda = infoSpreadsheet.data.sheets.map((s) =>
      s.properties.title.toLowerCase().trim(),
    );

    for (const tabel of semuaTabel) {
      if (!tabelYangDiekspor.includes(tabel.name)) continue;

      const namaModel = tabel.name;
      const namaSheet = "Data " + namaModel;
      const namaDelegate =
        namaModel.charAt(0).toLowerCase() + namaModel.slice(1);
      const namaSheetKecil = namaSheet.toLowerCase().trim();

      console.log(`\nMemproses tabel: ${namaModel}...`);

      if (!sheetYangSudahAda.includes(namaSheetKecil)) {
        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            resource: {
              requests: [{ addSheet: { properties: { title: namaSheet } } }],
            },
          });
          sheetYangSudahAda.push(namaSheetKecil);
        } catch (errSheet) {
          console.log(
            `- Info: Sheet "${namaSheet}" sudah ada, melangkah ke proses data...`,
          );
        }
      }

      await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: namaSheet,
      });

      // --- PERBAIKAN HEADER: Filter kolom menggunakan Blacklist ---
      const kolomDatabase = tabel.fields.filter((field) => {
        const namaKolomKecil = field.name.toLowerCase();
        // Hanya ambil field scalar DAN namanya tidak ada di dalam kolomBlacklist
        return (
          field.kind === "scalar" && !kolomBlacklist.includes(namaKolomKecil)
        );
      });

      const headerKolom = ["No", ...kolomDatabase.map((field) => field.name)];

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${namaSheet}!A1`,
        valueInputOption: "USER_ENTERED",
        resource: { values: [headerKolom] },
      });

      const ukuranCicilan = 5000;
      let barisKe = 0;
      let masihAdaData = true;

      while (masihAdaData) {
        const dataBatch = await prisma[namaDelegate].findMany({
          take: ukuranCicilan,
          skip: barisKe,
        });

        if (dataBatch.length === 0) {
          masihAdaData = false;
          console.log(
            `✅ Selesai! Total ${barisKe} baris diekspor ke "${namaSheet}".`,
          );
          break;
        }

        const barisExcel = dataBatch.map((item, index) => {
          const barisIni = [barisKe + index + 1];

          kolomDatabase.forEach((field) => {
            let nilai = item[field.name];

            if (nilai instanceof Date) {
              const tgl = String(nilai.getDate()).padStart(2, "0");
              const bln = String(nilai.getMonth() + 1).padStart(2, "0");
              const thn = nilai.getFullYear();
              const jam = String(nilai.getHours()).padStart(2, "0");
              const mnt = String(nilai.getMinutes()).padStart(2, "0");

              // Tanda petik tunggal (') memaksa Google Sheets membacanya sebagai teks rapi
              nilai = `'${tgl}/${bln}/${thn} ${jam}:${mnt}`;
            }
            // --- FITUR BARU 2: PEMOTONG TEKS (TRUNCATE) ---
            // Jika datanya adalah teks dan panjangnya melebihi 45.000 karakter, potong!
            if (typeof nilai === "string" && nilai.length > 45000) {
              nilai =
                nilai.substring(0, 45000) +
                " ...[DATA TERLALU PANJANG, TERPOTONG OLEH SISTEM]";
            }

            barisIni.push(nilai !== null && nilai !== undefined ? nilai : "-");
          });

          return barisIni;
        });

        await sheets.spreadsheets.values.append({
          spreadsheetId: SPREADSHEET_ID,
          range: `${namaSheet}!A1`,
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          resource: { values: barisExcel },
        });

        barisKe += dataBatch.length;
        console.log(`- Mengirim cicilan... (Total terkirim: ${barisKe} baris)`);
      }
    }

    res.status(200).json({
      status: "sukses",
      pesan:
        "Berhasil! Ekspor otomatis semua data skala besar selesai tanpa kendala.",
    });
  } catch (error) {
    console.error("❌ Gagal melakukan ekspor data:", error);
    res.status(500).json({
      status: "gagal",
      pesan: "Gagal mengekspor data. Silakan cek log server untuk detailnya.",
    });
  }
};
