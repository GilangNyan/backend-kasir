import User from "../models/UserModel.js";
import argon2 from "argon2";

export const logIn = async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Password salah" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.fullname;
  const email = user.email;
  const username = user.username;
  const userImage = user.user_image;
  const roleId = user.roleId;
  res.status(200).json({ uuid, name, email, username, userImage, roleId });
};

export const me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Harap Log In ke akun Anda" });
  }
  const user = await User.findOne({
    attributes: [
      "id",
      "uuid",
      "email",
      "username",
      "fullname",
      "user_image",
      "roleId",
    ],
    where: {
      uuid: req.session.userId,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logOut = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat Log Out" });
    res.status(200).json({ msg: "Anda telah log Out" });
  });
};
