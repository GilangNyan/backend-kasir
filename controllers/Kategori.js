import Kategori from "../models/KategoriModel.js";
import { Op } from "sequelize";

export const getKategori = async (req, res) => {
  try {
    const response = await Kategori.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getKategoriById = async (req, res) => {
  try {
    const response = await Kategori.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createKategori = async (req, res) => {
  const { nama } = req.body;
  try {
    await Kategori.create({
      nama: nama,
    });
    res.status(201).json({ msg: "Kategori berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateKategori = async (req, res) => {
  const kategori = await Kategori.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!kategori)
    return res.status(404).json({ msg: "Kategori tidak ditemukan" });
  const { nama } = req.body;
  try {
    await Kategori.update(
      {
        nama: nama,
      },
      {
        where: {
          id: kategori.id,
        },
      }
    );
    res.status(200).json({ msg: "Kategori berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteKategori = async (req, res) => {
  const kategori = await Kategori.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!kategori)
    return res.status(404).json({ msg: "Kategori tidak ditemukan" });
  try {
    await Kategori.destroy({
      where: {
        id: kategori.id,
      },
    });
    res.status(200).json({ msg: "Kategori berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredKategori = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Kategori.count({
      where: {
        nama: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Kategori.findAll({
      where: {
        nama: {
          [Op.like]: "%" + search + "%",
        },
      },
      order: [[order, orderDir]],
      offset: offset,
      limit: parseInt(limit),
    });
    res.status(200).json({
      totalRows: totalRows,
      totalPage: totalPage,
      result: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
