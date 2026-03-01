const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.getAllWarga = async (req, res) => {
  try {
    const data = await prisma.warga.findMany({ orderBy: { id: "desc" } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.getWargaByKk = async (req, res) => {
  try {
    const data = await prisma.warga.findMany({
      where: { nomorKkRel: req.params.nomorKK },
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.createWarga = async (req, res) => {
  try {
    const data = await prisma.warga.create({ data: req.body });
    res.status(201).json({ status: "sukses", data });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.updateWarga = async (req, res) => {
  try {
    const data = await prisma.warga.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    res.json({ status: "sukses", data });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};

exports.deleteWarga = async (req, res) => {
  try {
    await prisma.warga.delete({ where: { id: parseInt(req.params.id) } });
    res.json({
      status: "sukses",
      pesan: "Warga berhasil dihapus secara permanen",
    });
  } catch (error) {
    res.status(500).json({ status: "gagal", pesan: error.message });
  }
};
