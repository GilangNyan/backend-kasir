import Permission from "../models/PermissionModel.js";

export const getPermissions = async (req, res) => {
  try {
    const response = await Permission.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPermissionById = async (req, res) => {
  try {
    const response = await Permission.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPermission = async (req, res) => {
  const { nama, deskripsi } = req.body;
  try {
    await Permission.create({
      nama: nama,
      deskripsi: deskripsi,
    });
    res.status(201).json({ msg: "Permission berhasil ditambahkan" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updatePermission = async (req, res) => {
  const permission = await Permission.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!permission)
    return res.status(404).json({ msg: "Permission tidak ditemukan" });
  const { nama, deskripsi } = req.body;
  try {
    await Permission.update(
      {
        nama: nama,
        deskripsi: deskripsi,
      },
      {
        where: {
          id: permission.id,
        },
      }
    );
    res.status(200).json({ msg: "Permission berhasil diubah" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deletePermission = async (req, res) => {
  const permission = await Permission.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!permission)
    return res.status(404).json({ msg: "Permission tidak ditemukan" });
  try {
    await Permission.destroy({
      where: {
        id: permission.id,
      },
    });
    res.status(200).json({ msg: "Permission berhasil dihapus" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
