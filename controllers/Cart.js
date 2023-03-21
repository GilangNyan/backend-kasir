import Cart from "../models/CartModel.js";
import Produk from "../models/ProdukModel.js";
import Satuan from "../models/SatuanModel.js";

export const getCart = async (req, res) => {
  try {
    const response = await Cart.findAll({
      include: [
        {
          model: Produk,
          include: [Satuan],
        },
      ],
      where: {
        userId: req.query.userId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCartById = async (req, res) => {
  try {
    const response = await Cart.findOne({
      include: [Produk],
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCartByBarcode = async (req, res) => {
  try {
    const response = await Cart.findOne({
      where: {
        produkBarcode: req.params.barcode,
        userId: req.query.userId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addItemsToCart = async (req, res) => {
  const { barcode, hargaBeli, hargaJual, qty, diskonRp, diskonPersen, userId } =
    req.body;
  let disPersen = hargaBeli * (diskonPersen / 100);
  try {
    await Cart.create({
      produkBarcode: barcode,
      hargaBeli: hargaBeli,
      hargaJual: hargaJual,
      qty: qty,
      diskonRp: diskonRp,
      diskonPersen: diskonPersen,
      subtotal: (hargaJual - diskonRp - disPersen) * qty,
      userId: userId,
    });
    res.status(201).json({ msg: "Barang berhasil ditambahkan ke cart" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateItemsQtyOnCart = async (req, res) => {
  const items = await Cart.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!items) return res.status(404).json({ msg: "Barang tidak ditemukan" });
  const { qty } = req.body;
  try {
    await Cart.update(
      {
        qty: qty,
        subtotal: items.hargaJual * qty,
      },
      {
        where: {
          id: items.id,
        },
      }
    );
    res.status(200).json({ msg: "Kuantitas barang berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateItemsQtyWithDir = async (req, res) => {
  const items = await Cart.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!items) return res.status(404).json({ msg: "Barang tidak ditemukan" });
  const { qty, dir } = req.body;
  try {
    let totalQty = dir === "plus" ? items.qty + qty : items.qty - qty;
    await Cart.update(
      {
        qty: totalQty,
        subtotal: items.hargaJual * totalQty,
      },
      {
        where: {
          id: items.id,
        },
      }
    );
    res.status(200).json({ msg: "Kuantitas barang berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateItemsDiskonOnCart = async (req, res) => {
  const items = await Cart.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!items) return res.status(404).json({ msg: "Barang tidak ditemukan" });
  const { diskonRp, diskonPersen } = req.body;
  try {
    await Cart.update(
      {
        diskonRp: diskonRp,
        diskonPersen: diskonPersen,
        subtotal: (items.hargaJual - diskonRp - diskonPersen) * items.qty,
      },
      {
        where: {
          id: items.id,
        },
      }
    );
    res.status(200).json({ msg: "Diskon barang berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const removeItemsFromCart = async (req, res) => {
  const items = await Cart.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!items) return res.status(404).json({ msg: "Barang tidak ditemukan" });
  try {
    await Cart.destroy({
      where: {
        id: items.id,
      },
    });
    res.status(200).json({ msg: "Barang berhasil dihapus dari cart" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
