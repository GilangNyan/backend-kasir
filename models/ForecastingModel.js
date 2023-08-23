import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Produk from "./ProdukModel.js";

const { DataTypes } = Sequelize;

const Forecast = db.define(
  "forecast",
  {
    periode: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    produkBarcode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    satuanId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nilai: {
      type: DataTypes.FLOAT,
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

Produk.hasMany(Forecast);
Forecast.belongsTo(Produk);

export default Forecast;
