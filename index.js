import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import SequelizeStore from "connect-session-sequelize";
import UserRoute from "./routes/UserRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import KategoriRoute from "./routes/KategoriRoute.js";
import SatuanRoute from "./routes/SatuanRoute.js";
import ProdukRoute from "./routes/ProdukRoute.js";
import RoleRoute from "./routes/RoleRoute.js";
import PermissionRoute from "./routes/PermissionRoute.js";
import CustomerRoute from "./routes/CustomerRoute.js";
import CartRoute from "./routes/CartRoute.js";
import TransaksiRoute from "./routes/TransaksiRoute.js";
import SupplierRoute from "./routes/SupplierRoute.js";
import StokRoute from "./routes/StokRoute.js";
import LaporanRoute from "./routes/LaporanRoute.js";
import ForecastingRoute from "./routes/ForecastingRoute.js";
dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db,
});

// (async () => {
//   await db.sync();
// })();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
      secure: "auto",
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173"],
  })
);
app.use(express.json());
app.use(UserRoute);
app.use(AuthRoute);
app.use(KategoriRoute);
app.use(SatuanRoute);
app.use(ProdukRoute);
app.use(RoleRoute);
app.use(PermissionRoute);
app.use(CustomerRoute);
app.use(CartRoute);
app.use(TransaksiRoute);
app.use(SupplierRoute);
app.use(StokRoute);
app.use(LaporanRoute);
app.use(ForecastingRoute);

// store.sync();

app.listen(process.env.APP_PORT, () => {
  console.log("Server up and running");
});
