const { generarLlave } = require("../../utils/jwt");
const User = require("../models/users");
const bcrypt = require("bcrypt");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json("error");
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json("error");
  }
};

const register = async (req, res, next) => {
  try {
    const { email, userName, password } = req.body;

    const userDuplicated = await User.findOne({ email });

    if (userDuplicated) {
      return res.status(400).json("Usuario ya existente");
    }

    const newUser = new User({
      email,
      userName,
      password
    });

    const user = await newUser.save();

    const token = generarLlave(user._id);

    return res.status(201).json({ token, userName: user.userName });

  } catch (error) {
    return res.status(400).json("error");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("Usuario no existe");
    }

    console.log(user);
    

    if (bcrypt.compareSync(password, user.password)) {
      const token = generarLlave(user._id);
      return res.status(200).json({ 
        token, 
        userName: user.userName 
      });
    }

    return res.status(400).json("Usuario o contraseña incorrectos");

} catch (error) {
    return res.status(400).json("error");
  }
};


const updateUser = async (req, res, next) => {
  try {

    const { id } = req.params;

    if (req.user._id.toString() !== id) {
        return res.status(400).json("No puedes modificar a alguien que no seas tu mismo")
    }

    const newUser = new User(req.body);
    newUser._id = id;
    const userUpdated = await User.findByIdAndUpdate(id, newUser, { new: true });

    return res.status(200).json(userUpdated);

  } catch (error) {
    return res.status(400).json("error");
  }
};

module.exports = {
  getUsers,
  getUserById,
  register,
  updateUser,
  login
};