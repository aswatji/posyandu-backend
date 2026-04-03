const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllDataForAdmin = async (req, res) => {
  try {
    // 1. Tangkap filter dari URL (misal Admin cuma mau lihat Torobulu: ?desa=Torobulu)
    const { desa } = req.query;

    // 2. Siapkan kondisi filter
    let filterKondisi = { is_deleted: 0 }; // Jangan tampilkan yang sudah dihapus
    if (desa) {
      filterKondisi.KartuKeluarga = {
        desa: { contains: desa, mode: "insensitive" }, // Ini sama dengan ILIKE '%torobulu%'
      };
    }

    // 3. Tarik data Warga + JOIN otomatis dengan KartuKeluarga
    const semuaWarga = await prisma.warga.findMany({
      where: filterKondisi,
      include: {
        KartuKeluarga: true, // 🔥 Keajaiban Prisma: Otomatis menggabungkan data KK!
      },
      orderBy: {
        createdAt: "desc", // Urutkan dari yang paling baru diinput
      },
    });

    // 4. Rapikan datanya agar Web/Excel tinggal menampilkan saja
    const dataRapi = semuaWarga.map((w) => ({
      id_warga: w.id,
      nik: w.nik,
      nama_lengkap: w.nama,
      jenis_kelamin: w.jenisKelamin,
      status_keluarga: w.statusKeluarga,
      nomor_kk: w.KartuKeluarga?.nomorKK || "Tidak Ada KK",
      kepala_keluarga: w.KartuKeluarga?.kepalaKeluarga || "-",
      desa: w.KartuKeluarga?.desa || "Tanpa Desa",
      dusun: w.KartuKeluarga?.dusun || "-",
      rt_rw: `${w.KartuKeluarga?.nomorRT || "-"}/${w.KartuKeluarga?.nomorRW || "-"}`,
      kader_penginput: w.diinputOleh || "Anonim",
      tanggal_input: w.createdAt,
    }));

    // 5. Kirim ke Web Admin
    res.status(200).json({
      status: "sukses",
      total_data: dataRapi.length,
      data: dataRapi,
    });
  } catch (error) {
    console.error("Gagal tarik data admin:", error);
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
