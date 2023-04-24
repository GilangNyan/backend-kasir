import Transaksi from "../models/TransaksiModel.js";
import { Op } from "sequelize";
import Cart from "../models/CartModel.js";
import TransaksiDetail from "../models/TransaksiDetailModel.js";
import { response } from "express";

export const getTransaksi = async (req, res) => {
  try {
    const response = await Transaksi.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getTransaksiById = async (req, res) => {
  try {
    const response = await Transaksi.findOne({
      where: {
        faktur: req.params.faktur,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createTransaksi = async (req, res) => {
  // Format tanggal
  const d = new Date();
  let tanggal = d.toJSON().slice(0, 10);
  let noFaktur = 0;
  // Mencari nomor faktur paling tinggi hari ini
  let maxFaktur = await Transaksi.max("faktur", {
    where: {
      tanggal: {
        [Op.like]: tanggal,
      },
    },
  });

  if (maxFaktur == null) {
    noFaktur = 1;
  } else {
    let numFaktur = maxFaktur.slice(11, 15);
    noFaktur = parseInt(numFaktur) + 1;
  }

  // Membuat format faktur transaksi
  let faktur =
    "J" +
    tanggal.slice(0, 4) +
    tanggal.slice(5, 7) +
    tanggal.slice(8, 10) +
    String(noFaktur).padStart(4, "0");

  // Memasukkan Form Body ke Variabel
  const { user, customer, diskonRp, diskonPersen, totalBruto, bayar, catatan } =
    req.body;
  let disPersen = (totalBruto * diskonPersen) / 100;
  let totalNetto = totalBruto - diskonRp - disPersen;
  try {
    await Transaksi.create({
      faktur: faktur,
      userId: user,
      customerId: customer,
      diskonRp: diskonRp,
      diskonPersen: diskonPersen,
      totalBruto: totalBruto,
      totalNetto: totalNetto,
      bayar: bayar,
      kembali: bayar - totalNetto,
      catatan: catatan,
    });
    // Ambil Data Dari Cart
    const allCart = await Cart.findAll({
      attributes: [
        "produkBarcode",
        "hargaBeli",
        "hargaJual",
        "qty",
        "diskonRp",
        "diskonPersen",
        "subtotal",
      ],
      where: {
        userId: user,
      },
      raw: true,
    });
    const arrCart = allCart.map((v) => ({ ...v, transaksiFaktur: faktur }));

    // Masukkan array  ke DB TransaksiDetail
    await TransaksiDetail.bulkCreate(arrCart, {
      validate: true,
      individualHooks: true,
    });

    // Hapus isi cart
    await Cart.destroy({
      where: {
        userId: user,
      },
    });
    res.status(201).json({ msg: "Transaksi Berhasil Disimpan" });
  } catch (error) {
    res.status(400).json({ msg: error });
  }
};
