import Kategori from "../models/KategoriModel.js";
import Produk from "../models/ProdukModel.js";
import { Op } from "sequelize";
import Satuan from "../models/SatuanModel.js";
import ProdukSatuan from "../models/ProdukSatuanModel.js";

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
  const associatedTable = req.query.associatedTable || null;
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
    const orderingTable =
      associatedTable == "kategori"
        ? Kategori
        : associatedTable == "satuan"
        ? Satuan
        : null;
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

export const createProduk = async (req, res) => {
  const { barcode, nama, kategori, satuan, beli, jual, stok } = req.body;
  try {
    await Produk.create({
      barcode: barcode,
      nama: nama,
      kategoriId: kategori,
    });
    await ProdukSatuan.create({
      hargaBeli: beli,
      hargaJual: jual,
      stok: stok,
      produkBarcode: barcode,
      satuanId: satuan,
    });
    res.status(201).json({ msg: "Produk berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateProduk = async (req, res) => {
  const produk = await Produk.findOne({
    where: {
      barcode: req.params.barcode,
    },
  });
  if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });
  const { barcode, nama, kategori, satuan, beli, jual, stok } = req.body;
  try {
    await Produk.update(
      {
        nama: nama,
        kategoriId: kategori,
      },
      {
        where: {
          barcode: produk.barcode,
        },
      }
    );
    await ProdukSatuan.update(
      {
        hargaBeli: beli,
        hargaJual: jual,
        stok: stok,
      },
      {
        where: {
          produkBarcode: barcode,
          satuanId: satuan,
        },
      }
    );
    res.status(200).json({ msg: "Produk berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteProduk = async (req, res) => {
  const produk = await Produk.findOne({
    where: {
      barcode: req.params.barcode,
    },
  });
  if (!produk) return res.status(404).json({ msg: "Produk tidak ditemukan" });
  try {
    await ProdukSatuan.destroy({
      where: {
        produkBarcode: produk.barcode,
      },
    });
    await Produk.destroy({
      where: {
        barcode: produk.barcode,
      },
    });
    res.status(200).json({ msg: "Produk berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
