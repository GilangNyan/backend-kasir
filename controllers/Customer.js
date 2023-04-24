import Customer from "../models/CustomerModel.js";
import { Op } from "sequelize";

export const getCustomer = async (req, res) => {
  try {
    const response = await Customer.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const response = await Customer.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createCustomer = async (req, res) => {
  const { nama, email, telepon, alamat } = req.body;
  try {
    await Customer.create({
      nama: nama,
      email: email,
      telepon: telepon,
      alamat: alamat,
    });
    res.status(201).json({ msg: "Customer berhasil ditambahkan" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: error.message });
  }
};

export const updateCustomer = async (req, res) => {
  const customer = await Customer.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!customer)
    return res.status(404).json({ msg: "Customer tidak ditemukan" });
  const { nama, email, telepon, alamat } = req.body;
  try {
    await Customer.update(
      {
        nama: nama,
        email: email,
        telepon: telepon,
        alamat: alamat,
      },
      {
        where: {
          id: customer.id,
        },
      }
    );
    res.status(200).json({ msg: "Customer berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteCustomer = async (req, res) => {
  const customer = await Customer.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!customer)
    return res.status(404).json({ msg: "Customer tidak ditemukan" });
  try {
    await Customer.destroy({
      where: {
        id: customer.id,
      },
    });
    res.status(200).json({ msg: "Customer berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredCustomer = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await Customer.count({
      where: {
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            telepon: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            alamat: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await Customer.findAll({
      where: {
        [Op.or]: [
          {
            nama: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            telepon: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            alamat: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
      order: [[order, orderDir]],
      offset: offset,
      limit: parseInt(limit),
    });
    res.status(200).json({
      totalRows: totalRows,
      totalPage: totalPage,
      result: response,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
