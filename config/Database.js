import { Sequelize } from "sequelize";

const db = new Sequelize("kasir_db", "root", "", {
  host: "localhost",
  dialect: "mysql",
  timezone: "Asia/Jakarta",
});

export default db;
