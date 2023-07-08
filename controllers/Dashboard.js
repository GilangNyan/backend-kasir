import TransaksiDetail from "../models/TransaksiDetailModel.js";
import Transaksi from "../models/TransaksiModel.js";
import { Op, Sequelize } from "sequelize";

export const getInsight = async (req, res) => {
  const awal = req.query.awal || "2015-01-01";
  const akhir = req.query.akhir || new Date().toISOString().split("T")[0];
  const rentang = req.query.rentang || "thismonth";
  let periode = "";
  let laluAwal = new Date(awal);
  let laluAkhir = new Date(akhir);
  if (rentang === "today" || rentang === "yesterday") {
    laluAwal.setDate(laluAwal.getDate() - 1);
    laluAkhir.setDate(laluAkhir.getDate() - 1);
    periode = "hari";
  } else if (rentang === "thisweek" || rentang === "lastweek") {
    laluAwal.setDate(laluAwal.getDate() - 7 - 6);
    laluAkhir.setDate(laluAkhir.getDate() - 7);
    periode = "minggu";
  } else if (rentang === "thismonth" || rentang === "lastmonth") {
    laluAwal = new Date(laluAwal.getFullYear(), laluAwal.getMonth() - 1, 1);
    laluAkhir = new Date(laluAkhir.getFullYear(), laluAkhir.getMonth(), 0);
    periode = "bulan";
  } else if (rentang === "thisyear" || rentang === "lastyear") {
    laluAwal = new Date(laluAwal.getFullYear() - 1, 0, 1);
    laluAkhir = new Date(laluAkhir.getFullYear() - 1, 11, 31);
    periode = "tahun";
  }
  try {
    const response = await TransaksiDetail.findOne({
      attributes: [
        [Sequelize.fn("sum", Sequelize.literal("hargaBeli * qty")), "modal"],
        [Sequelize.fn("sum", Sequelize.literal("hargaJual * qty")), "jual"],
        [Sequelize.fn("sum", Sequelize.literal("subtotal")), "total"],
        [Sequelize.fn("sum", Sequelize.col("qty")), "terjual"],
      ],
      include: [
        {
          model: Transaksi,
          attributes: [
            "tanggal",
            [Sequelize.fn("sum", Sequelize.col("transaksi.diskonRp")), "disRp"],
            [
              Sequelize.fn("sum", Sequelize.col("transaksi.diskonPersen")),
              "disPersen",
            ],
          ],
          where: {
            tanggal: {
              [Op.between]: [awal, akhir],
            },
          },
        },
      ],
      raw: true,
      nest: true,
    });
    const response2 = await TransaksiDetail.findOne({
      attributes: [
        [Sequelize.fn("sum", Sequelize.literal("hargaBeli * qty")), "modal"],
        [Sequelize.fn("sum", Sequelize.literal("hargaJual * qty")), "jual"],
        [Sequelize.fn("sum", Sequelize.literal("subtotal")), "total"],
        [Sequelize.fn("sum", Sequelize.col("qty")), "terjual"],
      ],
      include: [
        {
          model: Transaksi,
          attributes: ["tanggal"],
          where: {
            tanggal: {
              [Op.between]: [laluAwal, laluAkhir],
            },
          },
        },
      ],
      raw: true,
      nest: true,
    });
    const totalPenjualan = parseInt(response.total);
    const totalProfit = parseInt(response.total - response.modal);
    const totalTerjual = parseInt(response.terjual);
    const totalPenjualanLalu = parseInt(response2.total);
    const totalProfitLalu = parseInt(response2.total - response2.modal);
    const totalTerjualLalu = parseInt(response2.terjual);
    res.status(200).json({
      totalPenjualan: totalPenjualan != null ? totalPenjualan : 0,
      totalProfit: totalProfit != null ? totalProfit : 0,
      totalTerjual: totalTerjual != null ? totalTerjual : 0,
      totalPenjualanLalu: totalPenjualanLalu != null ? totalPenjualanLalu : 0,
      totalProfitLalu: totalProfitLalu != null ? totalProfitLalu : 0,
      totalTerjualLalu: totalTerjualLalu != null ? totalTerjualLalu : 0,
      namaPeriode: periode,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
