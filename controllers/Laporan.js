import Customer from "../models/CustomerModel.js";
import Transaksi from "../models/TransaksiModel.js";
import User from "../models/UserModel.js";
import TransaksiDetail from "../models/TransaksiDetailModel.js";
import { Op, Sequelize } from "sequelize";
import Produk from "../models/ProdukModel.js";
import Satuan from "../models/SatuanModel.js";

export const getLaporanHarian = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "faktur";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  const tanggal = req.query.tanggal || "2023-06-01";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const response = await Transaksi.findAndCountAll({
      attributes: {
        include: [
          [
            Sequelize.literal(
              `(SELECT SUM(hargaBeli * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            ),
            "modal",
          ],
          [
            Sequelize.literal(
              `(SELECT SUM(hargaJual * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            ),
            "jual",
          ],
          [
            Sequelize.literal(
              `(SELECT SUM(diskonRp * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            ),
            "diskonRp",
          ],
          [
            Sequelize.literal(
              `(SELECT SUM(subtotal) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            ),
            "total",
          ],
        ],
      },
      include: [Customer, User],
      where: {
        tanggal: tanggal,
        faktur: {
          [Op.like]: "%" + search + "%",
        },
      },
      order: [[order, orderDir]],
      offset: offset,
      limit: parseInt(limit),
    });
    const totalPage = Math.ceil(response.count / limit);
    const selectedDateFaktur = await Transaksi.findAll({
      attributes: ["faktur"],
      where: {
        tanggal: tanggal,
      },
    });
    const listFaktur = selectedDateFaktur.map((transaksi) => transaksi.faktur);
    const totalled = await TransaksiDetail.findOne({
      attributes: [
        [Sequelize.fn("sum", Sequelize.literal("hargaBeli * qty")), "modal"],
        [Sequelize.fn("sum", Sequelize.literal("hargaJual * qty")), "jual"],
        [Sequelize.fn("sum", Sequelize.literal("diskonRp * qty")), "diskonRp"],
        [Sequelize.fn("sum", Sequelize.literal("subtotal")), "total"],
      ],
      where: {
        transaksiFaktur: {
          [Op.in]: listFaktur,
        },
      },
    });
    res.status(200).json({
      totalRows: response.count,
      totalPage: totalPage,
      result: response.rows,
      totalledValue: totalled,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLaporanBulanan = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "tanggal";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  const bulan = req.query.bulan || "2023-07";
  let offset = (parseInt(page) - 1) * parseInt(limit);

  const selectedBulan = new Date(bulan);
  const tanggalAwal = new Date(
    selectedBulan.getFullYear(),
    selectedBulan.getMonth(),
    1
  );
  const tanggalAkhir = new Date(
    selectedBulan.getFullYear(),
    selectedBulan.getMonth() + 1,
    0
  );
  try {
    const response = await Transaksi.findAndCountAll({
      attributes: [
        "tanggal",
        [Sequelize.fn("count", Sequelize.col("faktur")), "jumlahFaktur"],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(hargaBeli * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "modal",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(hargaJual * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "penjualan",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(diskonRp * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "diskonRp",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(subtotal) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "subtotal",
        ],
      ],
      where: {
        tanggal: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
      group: "tanggal",
      order: [[order, orderDir]],
      offset: offset,
      limit: parseInt(limit),
    });
    const totalPage = Math.ceil(response.count.length / limit);
    const selectedMonthFaktur = await Transaksi.findAll({
      attributes: ["faktur"],
      where: {
        tanggal: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
    });
    const listFaktur = selectedMonthFaktur.map((transaksi) => transaksi.faktur);
    const totalled = await TransaksiDetail.findOne({
      attributes: [
        [
          Sequelize.fn("count", Sequelize.literal("DISTINCT(transaksiFaktur)")),
          "faktur",
        ],
        [Sequelize.fn("sum", Sequelize.literal("hargaBeli * qty")), "modal"],
        [Sequelize.fn("sum", Sequelize.literal("hargaJual * qty")), "jual"],
        [Sequelize.fn("sum", Sequelize.literal("diskonRp * qty")), "diskonRp"],
        [Sequelize.fn("sum", Sequelize.literal("subtotal")), "total"],
      ],
      where: {
        transaksiFaktur: {
          [Op.in]: listFaktur,
        },
      },
    });
    res.status(200).json({
      totalRows: response.count.length,
      totalPage: totalPage,
      result: response.rows,
      totalledValue: totalled,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLaporanTahunan = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "tanggal";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  const tahun = req.query.tahun || "2023";
  let offset = (parseInt(page) - 1) * parseInt(limit);

  const tanggalAwal = new Date(tahun, 0, 1);
  const tanggalAkhir = new Date(tahun, 11, 31);

  try {
    const response = await Transaksi.findAndCountAll({
      attributes: [
        [Sequelize.fn("month", Sequelize.col("tanggal")), "bulan"],
        [Sequelize.fn("count", Sequelize.col("faktur")), "jumlahFaktur"],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(hargaBeli * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "modal",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(hargaJual * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "penjualan",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(diskonRp * qty) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "diskonRp",
        ],
        [
          Sequelize.fn(
            "sum",
            Sequelize.literal(
              `(SELECT SUM(subtotal) FROM transaksi_detail AS transaksiDetail WHERE transaksiDetail.transaksiFaktur = transaksi.faktur)`
            )
          ),
          "subtotal",
        ],
      ],
      where: {
        tanggal: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
      group: [Sequelize.fn("month", Sequelize.col("tanggal"))],
      order: [[order, orderDir]],
      offset: offset,
      limit: parseInt(limit),
    });
    const totalPage = Math.ceil(response.count.length / limit);
    const selectedYearFaktur = await Transaksi.findAll({
      attributes: ["faktur"],
      where: {
        tanggal: {
          [Op.between]: [tanggalAwal, tanggalAkhir],
        },
      },
    });
    const listFaktur = selectedYearFaktur.map((transaksi) => transaksi.faktur);
    const totalled = await TransaksiDetail.findOne({
      attributes: [
        [
          Sequelize.fn("count", Sequelize.literal("DISTINCT(transaksiFaktur)")),
          "faktur",
        ],
        [Sequelize.fn("sum", Sequelize.literal("hargaBeli * qty")), "modal"],
        [Sequelize.fn("sum", Sequelize.literal("hargaJual * qty")), "jual"],
        [Sequelize.fn("sum", Sequelize.literal("diskonRp * qty")), "diskonRp"],
        [Sequelize.fn("sum", Sequelize.literal("subtotal")), "total"],
      ],
      where: {
        transaksiFaktur: {
          [Op.in]: listFaktur,
        },
      },
    });

    res.status(200).json({
      totalRows: response.count.length,
      totalPage: totalPage,
      result: response.rows,
      totalledValue: totalled,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getLaporanPerProduk = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "DESC";
  const search = req.query.search || "";
  const produk = req.query.produk;
  const awal = req.query.awal || "2015-01-01";
  const akhir = req.query.akhir || new Date().toISOString().split("T")[0];
  let offset = (parseInt(page) - 1) * parseInt(limit);

  const whereProduk = {
    produkBarcode: produk,
  };

  try {
    const response = await TransaksiDetail.findAndCountAll({
      include: [
        {
          model: Transaksi,
          attributes: ["tanggal"],
          where: {
            tanggal: {
              [Op.between]: [awal, akhir],
            },
          },
        },
        {
          model: Produk,
          attributes: ["nama"],
          include: [
            {
              model: Satuan,
              attributes: ["nama"],
            },
          ],
        },
      ],
      order: Sequelize.literal(
        "(SELECT tanggal FROM transaksi WHERE faktur = transaksi_detail.transaksiFaktur) DESC"
      ),
      where: produk !== "" ? whereProduk : {},
      offset: offset,
      limit: parseInt(limit),
    });

    const totalPage = Math.ceil(response.count / limit);

    res.status(200).json({
      totalRows: response.count,
      totalPage: totalPage,
      result: response.rows,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
