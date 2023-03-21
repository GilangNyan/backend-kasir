import Satuan from "../models/SatuanModel.js";
import { Op } from "sequelize";

export const getSatuan = async (req, res) => {
  try {
    const response = await Satuan.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSatuanById = async (req, res) => {
  try {
    const response = await Satuan.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSatuan = async (req, res) => {
  const { nama } = req.body;
  try {
    await Satuan.create({
      nama: nama,
    });
    res.status(201).json({ msg: "Satuan berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateSatuan = async (req, res) => {
  const satuan = await Satuan.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!satuan) return res.status(404).json({ msg: "Satuan tidak ditemukan" });
  const { nama } = req.body;
  try {
    await Satuan.update(
      {
        nama: nama,
      },
      {
        where: {
          id: satuan.id,
        },
      }
    );
    res.status(200).json({ msg: "Satuan berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteSatuan = async (req, res) => {
  const satuan = await Satuan.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!satuan) return res.status(404).json({ msg: "Satuan tidak ditemukan" });
  try {
    await Satuan.destroy({
      where: {
        id: satuan.id,
      },
    });
    res.status(200).json({ msg: "Satuan berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredSatuan = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Satuan.count({
      where: {
        nama: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Satuan.findAll({
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
