import Role from "../models/RoleModel.js";

export const getRole = async (req, res) => {
  try {
    const response = await Role.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const response = await Role.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createRole = async (req, res) => {
  const { nama, deskripsi } = req.body;
  try {
    await Role.create({
      nama: nama,
      deskripsi: deskripsi,
    });
    res.status(201).json({ msg: "Role berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateRole = async (req, res) => {
  const role = await Role.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!role) return res.status(404).json({ msg: "Role tidak ditemukan" });
  const { nama, deskripsi } = req.body;
  try {
    await Role.update(
      {
        nama: nama,
        deskripsi: deskripsi,
      },
      {
        where: {
          id: role.id,
        },
      }
    );
    res.status(200).json({ msg: "Role berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteRole = async (req, res) => {
  const role = await Role.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!role) return res.status(404).json({ msg: "Role tidak ditemukan" });
  try {
    await Role.destroy({
      where: {
        id: role.id,
      },
    });
    res.status(200).json({ msg: "Role berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
