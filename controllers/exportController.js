const { google } = require("googleapis");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.exportKeSpreadsheet = async (req, res) => {
  try {
    // const auth = new google.auth.GoogleAuth({
    //   keyFile: "sheetgoogle.json",
    //   scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    // });
    let authOptions = {
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    };

    // 2. Cek apakah ini di server CapRover atau di Laptop Lokal
    if (process.env.GOOGLE_CREDENTIALS) {
      // Jika di CapRover, baca teks rahasia dari Environment Variable
      authOptions.credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    } else {
      // Jika di laptop lokal, baca dari file JSON
      authOptions.keyFile = "sheetgoogle.json"; // (Pastikan namanya sesuai dengan yang di laptopmu)
    }

    const auth = new google.auth.GoogleAuth(authOptions);
    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SPREADSHEET_ID = "1xzsDoZVkFXqYQPJs6qSpPqhkLGq6sUkAjznzb-QW3fw";

    // =================================================================
    // PROSES 1: AMBIL & SUSUN DATA KARTU KELUARGA
    // =================================================================
    const dataKK = await prisma.kartuKeluarga.findMany();

    const barisExcelKK = [
      [
        "No",
        "Nomor KK",
        "Kepala Keluarga",
        "Alamat Lengkap",
        "RT",
        "RW",
        "Dusun",
        "Desa",
        "Kecamatan",
        "Latitude",
        "Longitude",
      ],
    ];

    dataKK.forEach((kk, index) => {
      barisExcelKK.push([
        index + 1,
        kk.nomorKK || "-",
        kk.kepalaKeluarga || "-",
        kk.alamatLengkap || "-",
        kk.nomorRT || "-",
        kk.nomorRW || "-",
        kk.dusun || "-",
        kk.desa || "-",
        kk.kecamatan || "-",
        kk.latitude || "-",
        kk.longitude || "-",
      ]);
    });

    // =================================================================
    // PROSES 2: AMBIL & SUSUN DATA WARGA
    // =================================================================
    const dataWarga = await prisma.warga.findMany();

    const barisExcelWarga = [
      [
        "No",
        "Nomor KK",
        "NIK",
        "No Rekam Medis",
        "Nama Warga",
        "Tgl Lahir",
        "L/P",
        "Gol. Darah",
        "Status Keluarga",
        "Pekerjaan",
        "Pendidikan",
        "No HP",
        "Status Nikah",
        "Status Hamil",
        "No BPJS",
        "Alergi",
        "Riwayat Penyakit",
        "Disabilitas",
        "Catatan Khusus",
      ],
    ];

    dataWarga.forEach((warga, index) => {
      barisExcelWarga.push([
        index + 1,
        warga.nomorKkRel || "-",
        warga.nik || "-",
        warga.nomorRekamMedis || "-",
        warga.nama || "-",
        warga.tanggalLahir || "-",
        warga.jenisKelamin || "-",
        warga.golonganDarah || "-",
        warga.statusKeluarga || "-",
        warga.pekerjaan || "-",
        warga.pendidikan || "-",
        warga.noHp || "-",
        warga.statusPernikahan || "-",
        warga.statusKehamilan || "-",
        warga.noBPJS || "-",
        warga.alergi || "-",
        warga.riwayatPenyakit || "-",
        warga.disabilitas || "-",
        warga.catatanKhusus || "-",
      ]);
    });

    // =================================================================
    // PROSES 3: AMBIL & SUSUN DATA USER (PERAWAT, BIDAN, DLL)
    // =================================================================
    const dataUser = await prisma.user.findMany();

    const barisExcelUser = [
      [
        "No",
        "Nama Lengkap",
        "Email",
        "No Telepon",
        "Wilayah Kerja",
        "Jabatan",
        "Tgl Bergabung",
      ],
    ];

    dataUser.forEach((user, index) => {
      const tglDibuat = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("id-ID")
        : "-";

      barisExcelUser.push([
        index + 1,
        user.namaLengkap || "-",
        user.email || "-",
        user.nomorTelepon || "-",
        user.wilayahKerja || "-",
        user.jabatan || "-", // <-- Jabatan (Perawat/Bidan/Kader) akan muncul di sini
        tglDibuat,
      ]);
    });

    // =================================================================
    // PROSES 4: TULIS KE GOOGLE SHEETS MASING-MASING TAB
    // =================================================================

    // Tulis ke tab "Data KK"
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Data KK!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: barisExcelKK },
    });

    // Tulis ke tab "Data Warga"
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Data Warga!A1",
      valueInputOption: "USER_ENTERED",
      resource: { values: barisExcelWarga },
    });

    // Tulis ke tab "Data User"
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: "Data User!A1", // <-- Mengarah ke sheet baru bernama "Data User"
      valueInputOption: "USER_ENTERED",
      resource: { values: barisExcelUser },
    });

    res.status(200).json({
      status: "sukses",
      pesan:
        "Berhasil! Data KK, Warga, dan User sudah diekspor ke sheet masing-masing.",
    });
  } catch (error) {
    console.error("Gagal ekspor ke Google Sheets:", error);
    res.status(500).json({
      status: "gagal",
      pesan:
        "Gagal mengekspor data. Pastikan nama Sheet di Excel sudah benar (Data KK, Data Warga, Data User).",
    });
  }
};
