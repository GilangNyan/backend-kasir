import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Produk from "./ProdukModel.js";
import Supplier from "./SupplierModel.js";
import Satuan from "./SatuanModel.js";
import User from "./UserModel.js";

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

Produk.hasMany(Stok);
Stok.belongsTo(Produk);

Supplier.hasMany(Stok);
Stok.belongsTo(Supplier);

Satuan.hasMany(Stok);
Stok.belongsTo(Satuan);

User.hasMany(Stok);
Stok.belongsTo(User);

export default Stok;
