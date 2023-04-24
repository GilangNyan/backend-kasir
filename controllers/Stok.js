import Produk from "../models/ProdukModel.js";
import Satuan from "../models/SatuanModel.js";
import Stok from "../models/StokModel.js";
import Supplier from "../models/SupplierModel.js";
import { Op } from "sequelize";

export const getStok = async (req, res) => {
  try {
    const response = await Stok.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getStokById = async (req, res) => {
  try {
    const response = await Stok.findOne({
      include: [Produk, Supplier, Satuan],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createStok = async (req, res) => {
  const { barcode, tipe, detail, supplier, satuan, qty, user } = req.body;
  try {
    await Stok.create({
      produkBarcode: barcode,
      tipe: tipe,
      detail: detail,
      supplierId: supplier,
      satuanId: satuan,
      qty: qty,
      userId: user,
    });
    res.status(201).json({ msg: "Stok berhasil diperbarui" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteStok = async (req, res) => {
  const stok = await Stok.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!stok) return res.status(404).json({ msg: "Stok tidak ditemukan" });
  try {
    await Stok.destroy({
      where: {
        id: stok.id,
      },
    });
    res.status(200).json({ msg: "Pembaruan stok berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredStok = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "tanggal";
  const orderDir = req.query.orderDir || "DESC";
  const associatedTable = req.query.associatedTable || null;
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Stok.count({
      include: [Produk, Supplier, Satuan],
      where: {
        produkBarcode: {
          [Op.like]: "%" + search + "%",
        },
        tipe: {
          [Op.like]: "%" + search + "%",
        },
        detail: {
          [Op.like]: "%" + search + "%",
        },
      },
    });
    const orderingTable =
      associatedTable == "produk"
        ? Produk
        : associatedTable == "satuan"
        ? Satuan
        : null;
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Stok.findAll({
      include: [Produk, Supplier, Satuan],
      where: {
        produkBarcode: {
          [Op.like]: "%" + search + "%",
        },
        tipe: {
          [Op.like]: "%" + search + "%",
        },
        detail: {
          [Op.like]: "%" + search + "%",
        },
      },
      order: [
        orderingTable != null
          ? [orderingTable, order, orderDir]
          : [order, orderDir],
      ],
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
