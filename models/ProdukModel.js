import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Kategori from "./KategoriModel.js";
import ProdukSatuan from "./ProdukSatuanModel.js";
import Satuan from "./SatuanModel.js";

const { DataTypes } = Sequelize;

const Produk = db.define(
  "produk",
  {
    barcode: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kategoriId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    freezeTableName: true,
  }
);

Kategori.hasMany(Produk);
Produk.belongsTo(Kategori);

Produk.belongsToMany(Satuan, { through: ProdukSatuan });
Satuan.belongsToMany(Produk, { through: ProdukSatuan });

export default Produk;
