import Supplier from "../models/SupplierModel.js";
import { Op } from "sequelize";

export const getSupplier = async (req, res) => {
  try {
    const response = await Supplier.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const response = await Supplier.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSupplier = async (req, res) => {
  const { nama, telepon, alamat, deskripsi } = req.body;
  try {
    await Supplier.create({
      nama: nama,
      telepon: telepon,
      alamat: alamat,
      deskripsi: deskripsi,
    });
    res.status(201).json({ msg: "Supplier berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateSupplier = async (req, res) => {
  const supplier = await Supplier.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!supplier)
    return res.status(404).json({ msg: "Supplier tidak ditemukan" });
  const { nama, telepon, alamat, deskripsi } = req.body;
  try {
    await Supplier.update(
      {
        nama: nama,
        telepon: telepon,
        alamat: alamat,
        deskripsi: deskripsi,
      },
      {
        where: {
          id: supplier.id,
        },
      }
    );
    res.status(200).json({ msg: "Supplier berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteSupplier = async (req, res) => {
  const supplier = await Supplier.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!supplier)
    return res.status(404).json({ msg: "Supplier tidak ditemukan" });
  try {
    await Supplier.destroy({
      where: {
        id: supplier.id,
      },
    });
    res.status(200).json({ msg: "Supplier berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredSupplier = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Supplier.count({
      where: {
        nama: {
          [Op.like]: "%" + search + "%",
        },
        telepon: {
          [Op.like]: "%" + search + "%",
        },
        alamat: {
          [Op.like]: "%" + search + "%",
        },
        deskripsi: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Supplier.findAll({
      where: {
        nama: {
          [Op.like]: "%" + search + "%",
        },
        telepon: {
          [Op.like]: "%" + search + "%",
        },
        alamat: {
          [Op.like]: "%" + search + "%",
        },
        deskripsi: {
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
