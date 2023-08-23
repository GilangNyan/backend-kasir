import Transaksi from "../models/TransaksiModel.js";
import TransaksiDetail from "../models/TransaksiDetailModel.js";
import Forecast from "../models/ForecastingModel.js";
import { Op, Sequelize } from "sequelize";
import Produk from "../models/ProdukModel.js";

export const getForecast = async (req, res) => {
  const produk = req.query.produk || "0070001";
  const periode = req.query.periode || 3;
  const hasilForecast = [];
  const currentDate = new Date();
  const latestMonth = currentDate.getMonth();
  const latestYear = currentDate.getFullYear();

  try {
    const response = await TransaksiDetail.findAll({
      attributes: [
        [Sequelize.fn("YEAR", Sequelize.col("Transaksi.tanggal")), "tahun"],
        [Sequelize.fn("MONTH", Sequelize.col("Transaksi.tanggal")), "bulan"],
        [Sequelize.fn("SUM", Sequelize.col("qty")), "terjual"],
      ],
      where: {
        produkBarcode: produk,
      },
      include: [
        {
          model: Transaksi,
          attributes: [],
          where: {
            [Op.and]: [
              {
                tanggal: {
                  [Op.gte]: new Date("2022-01-01"),
                },
              },
              {
                tanggal: {
                  [Op.lt]: new Date(latestYear, latestMonth, 1),
                },
              },
            ],
          },
        },
      ],
      group: ["tahun", "bulan"],
      order: [
        ["tahun", "ASC"],
        ["bulan", "ASC"],
      ],
      raw: true,
      nest: true,
    });
    // Mengisi Periode Kosong
    const fullPeriode = isiBulanKosong(response);

    // Forecast
    const totalData = fullPeriode.length;
    for (let i = periode; i < totalData; i++) {
      const awal = i - periode;
      const akhir = i - 1;

      const rataRata = await hitungRataRata(fullPeriode, awal, akhir);
      hasilForecast.push({
        tahun: fullPeriode[i].tahun,
        bulan: fullPeriode[i].bulan,
        forecast: rataRata,
      });
    }
    // Forecast Bulan Selanjutnya
    const dataTerakhir = fullPeriode.length - 1;
    const bulanLalu =
      fullPeriode[dataTerakhir].tahun + "-" + fullPeriode[dataTerakhir].bulan;
    let bulanDepan = getBulanSelanjutnya(bulanLalu);
    let forecastDepan = forecastBulanDepan(fullPeriode, periode);
    bulanDepan = { ...bulanDepan, ...forecastDepan };
    fullPeriode.push(bulanDepan);

    // Gabungkan data aktual dan forecast
    const dataGabung = fullPeriode.map((aktual) => {
      const forecast = hasilForecast.find(
        (forecast) =>
          forecast.tahun === aktual.tahun && forecast.bulan === aktual.bulan
      );
      return { ...aktual, ...forecast };
    });

    // Hitung Error
    const forecastError = hitungError(dataGabung);

    // Gabungkan semua data
    const dataGabung2 = dataGabung.map((aktual) => {
      const error = forecastError.find(
        (error) => aktual.tahun === error.tahun && aktual.bulan === error.bulan
      );
      return { ...aktual, ...error };
    });

    // Matriks Evaluasi
    const dataGabung2Copy = dataGabung2.slice();
    const evaluasi = matriksEvaluasi(dataGabung2Copy, periode);

    res.status(200).json({
      result: dataGabung2,
      evaluasi: evaluasi,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

async function hitungRataRata(data, awal, akhir) {
  let totalTerjual = 0;

  for (let j = awal; j <= akhir; j++) {
    totalTerjual += parseInt(data[j].terjual);
  }

  return totalTerjual / (akhir - awal + 1);
}

function getBulanSelanjutnya(tanggal) {
  const [tahun, bulan] = tanggal.split("-");
  const tanggalDepan = new Date(tahun, bulan - 1);
  tanggalDepan.setMonth(tanggalDepan.getMonth() + 1);
  const tahunDepan = tanggalDepan.getFullYear();
  const bulanDepan = tanggalDepan.getMonth() + 1;
  return {
    tahun: tahunDepan,
    bulan: bulanDepan,
  };
}

function forecastBulanDepan(forecast, periode) {
  const dataTerakhir = forecast.slice(-periode);
  const sum = dataTerakhir.reduce((accumulator, object) => {
    return accumulator + parseInt(object.terjual);
  }, 0);
  return { forecast: sum / dataTerakhir.length };
}

function hitungError(data) {
  let errorArr = [];
  for (let i = 0; i < data.length; i++) {
    if (!data[i].terjual || !data[i].forecast) {
      errorArr.push({
        tahun: data[i].tahun,
        bulan: data[i].bulan,
        error: "-",
        error2: "-",
        errorAbs: "-",
        errorAbsPersen: "-",
      });
    } else {
      let error = parseInt(data[i].terjual) - data[i].forecast;
      let error2 = Math.pow(error, 2);
      let errorAbs = Math.abs(error);
      let errorAbsPersen = (errorAbs / parseInt(data[i].terjual)) * 100;
      errorArr.push({
        tahun: data[i].tahun,
        bulan: data[i].bulan,
        error: error,
        error2: error2,
        errorAbs: errorAbs,
        errorAbsPersen: errorAbsPersen,
      });
    }
  }
  return errorArr;
}

function matriksEvaluasi(data, periode) {
  let arrData = data;
  arrData.splice(0, periode);
  arrData.pop();
  const sumError2 = arrData.reduce((accumulator, object) => {
    return accumulator + object.error2;
  }, 0);
  const sumErrorAbs = arrData.reduce((accumulator, object) => {
    return accumulator + object.errorAbs;
  }, 0);
  const sumErrorAbsPersen = arrData.reduce((accumulator, object) => {
    return accumulator + object.errorAbsPersen;
  }, 0);

  let mse = sumError2 / arrData.length;
  let rmse = Math.sqrt(mse);
  let mae = sumErrorAbs / arrData.length;
  let mape = sumErrorAbsPersen / arrData.length;

  return {
    mse: mse,
    rmse: rmse,
    mae: mae,
    mape: mape,
  };
}

function generateBulan(awal, akhir) {
  let tanggal = [];
  let tahunAwal = awal.tahun;
  let bulanAwal = awal.bulan;
  let tahunAkhir = akhir.tahun;
  let bulanAkhir = akhir.bulan;
  for (let i = tahunAwal; i <= tahunAkhir; i++) {
    for (let j = bulanAwal; j <= 12; j++) {
      tanggal.push({
        tahun: i,
        bulan: j,
      });
      if (i >= tahunAkhir && j >= bulanAkhir) break;
    }
    bulanAwal = 1;
  }
  return tanggal;
}

function isiBulanKosong(data) {
  const dataAwal = data[0];
  const dataAkhir = data[data.length - 1];

  const semuaBulan = generateBulan(dataAwal, dataAkhir);
  let dataHasil = [];

  for (const genBulan of semuaBulan) {
    let ada = true;
    for (const item of data) {
      let tahun = item.tahun;
      let bulan = item.bulan;
      if (genBulan.tahun === tahun && genBulan.bulan === bulan) {
        ada = true;
        dataHasil.push(item);
        break;
      } else {
        ada = false;
      }
    }
    if (!ada) {
      dataHasil.push({
        tahun: genBulan.tahun,
        bulan: genBulan.bulan,
        terjual: 0,
      });
    }
  }
  return dataHasil;
}

export const simpanForecast = async (req, res) => {
  const { periode, barcode, satuan, nilai } = req.body;
  try {
    await Forecast.findOne({
      where: {
        periode: periode,
        produkBarcode: barcode,
        satuanId: satuan,
      },
    }).then((data) => {
      if (data) {
        Forecast.update(
          {
            periode: periode,
            produkBarcode: barcode,
            satuanId: satuan,
            nilai: nilai,
          },
          {
            where: {
              id: data.id,
            },
          }
        );
      } else {
        Forecast.create({
          periode: periode,
          produkBarcode: barcode,
          satuanId: satuan,
          nilai: nilai,
        });
      }
    });
    res.status(201).json({ msg: "Hasil Forecast Berhasil Disimpan" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRekapForecast = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "nilai";
  const orderDir = req.query.orderDir || "DESC";
  const search = req.query.search || "";
  const periode = req.query.periode;
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const response = await Forecast.findAndCountAll({
      where: {
        periode: periode,
      },
      include: [Produk],
      order: [[order, orderDir]],
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

export const getTopForecast = async (req, res) => {
  const periode = req.query.periode;
  try {
    const response = await Forecast.findAll({
      where: {
        periode: periode,
      },
      include: [Produk],
      order: [["nilai", "DESC"]],
      offset: 0,
      limit: 10,
    });
    res.status(200).json({
      result: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
