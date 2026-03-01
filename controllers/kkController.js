const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllKK = async (req, res) => {
  try {
    const data = await prisma.kartuKeluarga.findMany({
      include: { _count: { select: { Warga: true } } },
      orderBy: { id: "desc" },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.getKKById = async (req, res) => {
  try {
    const data = await prisma.kartuKeluarga.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!data) return res.status(404).json({ pesan: "KK tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.createKK = async (req, res) => {
  try {
    const data = await prisma.kartuKeluarga.create({ data: req.body });
    res.status(201).json({ status: "sukses", data });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.updateKK = async (req, res) => {
  try {
    const data = await prisma.kartuKeluarga.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json({ status: "sukses", data });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.deleteKK = async (req, res) => {
  try {
    await prisma.kartuKeluarga.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({
      status: "sukses",
      pesan: "KK berhasil dihapus secara permanen",
    });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
