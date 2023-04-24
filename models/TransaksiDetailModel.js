import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Produk from "./ProdukModel.js";
import ProdukSatuan from "./ProdukSatuanModel.js";
import Transaksi from "./TransaksiModel.js";

const { DataTypes } = Sequelize;

const TransaksiDetail = db.define(
  "transaksi_detail",
  {
    transaksiFaktur: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    produkBarcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    hargaBeli: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    hargaJual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    diskonRp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    diskonPersen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    subtotal: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  { freezeTableName: true, timestamps: false }
);

TransaksiDetail.addHook("afterCreate", (cart) => {
  ProdukSatuan.decrement("stok", {
    by: cart.qty,
    where: {
      produkBarcode: cart.produkBarcode,
    },
  });
});

Transaksi.hasMany(TransaksiDetail);
TransaksiDetail.belongsTo(Transaksi);

Produk.hasMany(TransaksiDetail);
TransaksiDetail.belongsTo(Produk);

export default TransaksiDetail;
