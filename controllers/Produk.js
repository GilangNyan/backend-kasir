import Kategori from "../models/KategoriModel.js";
import Produk from "../models/ProdukModel.js";
import { Op } from "sequelize";
import Satuan from "../models/SatuanModel.js";

export const getProduk = async (req, res) => {
  try {
    const response = await Produk.findAll({ include: [Kategori, Satuan] });
    res.status(200).json(response);
  } catch (error) {
    res.status(200).json({ msg: error.message });
  }
};

export const getProdukById = async (req, res) => {
  try {
    const response = await Produk.findOne({
      where: {
        barcode: req.params.barcode,
      },
      include: [Kategori, Satuan],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getFilteredProduk = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "barcode";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Produk.count({
      where: {
        [Op.or]: [
          {
            barcode: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Produk.findAll({
      include: [Kategori, Satuan],
      where: {
        [Op.or]: [
          {
            barcode: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
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
