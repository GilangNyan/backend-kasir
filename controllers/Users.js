import User from "../models/UserModel.js";
import argon2 from "argon2";
import { Op } from "sequelize";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "email", "username", "fullname", "user_image"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "email", "username", "fullname", "user_image"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const { email, username, fullname, password, confPassword, roleId } =
    req.body;
  if (password != confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok!" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      email: email,
      username: username,
      fullname: fullname,
      password: hashPassword,
      roleId: roleId,
    });
    res.status(201).json({ msg: "Register berhasil!" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const { email, username, fullname, password, confPassword, roleId } =
    req.body;
  let hashPassword;
  if (password === "" || password === null) {
    hashPassword = user.password;
  } else {
    hashPassword = await argon2.hash(password);
  }
  if (password != confPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok!" });
  try {
    await User.update(
      {
        email: email,
        username: username,
        fullname: fullname,
        password: hashPassword,
        roleId: roleId,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    res.status(200).json({ msg: "Data pengguna berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "Pengguna berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const getFilteredUser = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.perPage || 10;
  const order = req.query.orderBy || "id";
  const orderDir = req.query.orderDir || "ASC";
  const search = req.query.search || "";
  let offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const totalRows = await User.count({
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            fullname: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      },
    });
    const totalPage = Math.ceil(totalRows / limit);
    const response = await User.findAll({
      attributes: ["uuid", "email", "username", "fullname", "user_image"],
      where: {
        [Op.or]: [
          {
            username: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            email: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            fullname: {
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
