import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Role from "./RoleModel.js";

const { DataTypes } = Sequelize;

const Permission = db.define(
  "permission",
  {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deskripsi: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

Permission.belongsToMany(Role, { through: "role_permissions" });
Role.belongsToMany(Permission, { through: "role_permissions" });

export default Permission;
