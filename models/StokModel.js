import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Produk from "./ProdukModel.js";
import Supplier from "./SupplierModel.js";
import Satuan from "./SatuanModel.js";
import User from "./UserModel.js";
import ProdukSatuan from "./ProdukSatuanModel.js";

const { DataTypes } = Sequelize;

const Stok = db.define(
  "stok",
  {
    produkBarcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    tipe: {
      type: DataTypes.ENUM,
      values: ["in", "out"],
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    detail: {
      type: DataTypes.TEXT,
      defaultValue: null,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    satuanId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
        isNumeric: true,
      },
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  { freezeTableName: true }
);

Stok.addHook("afterCreate", (barang) => {
  if (barang.tipe == "in") {
    ProdukSatuan.increment("stok", {
      by: barang.qty,
      where: {
        produkBarcode: barang.produkBarcode,
        satuanId: barang.satuanId,
      },
    });
  } else if (barang.tipe == "out") {
    ProdukSatuan.decrement("stok", {
      by: barang.qty,
      where: {
        produkBarcode: barang.produkBarcode,
        satuanId: barang.satuanId,
      },
    });
  }
});

Produk.hasMany(Stok);
Stok.belongsTo(Produk);

Supplier.hasMany(Stok);
Stok.belongsTo(Supplier);

Satuan.hasMany(Stok);
Stok.belongsTo(Satuan);

User.hasMany(Stok);
Stok.belongsTo(User);

export default Stok;
