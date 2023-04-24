import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Customer from "./CustomerModel.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Transaksi = db.define(
  "transaksi",
  {
    faktur: {
      type: DataTypes.STRING,
      primaryKey: true,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    tanggal: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },
    diskonRp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    diskonPersen: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalBruto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    totalNetto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    kembali: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    catatan: {
      type: DataTypes.TEXT,
    },
  },
  { freezeTableName: true }
);

User.hasMany(Transaksi);
Transaksi.belongsTo(User);

Customer.hasMany(Transaksi);
Transaksi.belongsTo(Customer);

export default Transaksi;
