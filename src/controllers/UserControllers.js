const User = require("../models/UserModel.js");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { userSchemaValidator } = require("../validators/userValidators.js");
const jwt = require("jsonwebtoken");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const registerUser = async (req, res) => {

  try {
    const { firstName, lastName, email, password } = req.body;

    const validateResult = userSchemaValidator.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validateResult.success) {
      return res.status(400).json({
        message: "Datos de entrada inválidos",
        errors: validateResult.error.errors,
      });
    }

    const validateData = validateResult.data;

    const existeUsuario = await User.findOne({ email: validateData.email });

    if (existeUsuario) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(validateData.password, 10);

    const newUser = new User({
      firstName: validateData.firstName,
      lastName: validateData.lastName,
      email: validateData.email,
      password: hashedPassword,
    });

    await newUser.save();

    res.redirect("/api/tasks");
    
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Datos de entrada inválidos", errors: error.errors });
    } else if (error.name === "MongoServerError" && error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Usuario ya existente. Elige otro email por favor." });
    }
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Datos incompletos, completar usuario y contraseña" });
    }

    const validateData = userSchemaValidator
      .partial()
      .parse({ email, password });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).message({ message: "Usuario no encontrado" });
    }

    const isValidPassword = await bcrypt.compare(
      validateData.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    //JWT
    const payload = { id: user._id, name: user.name, email: user.email };
    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token);
    res.cookie("user", JSON.stringify(user));

    res.redirect("/api/tasks");
    
  } catch (error) {
    if (error.name === "ZodError") {
      return res
        .status(400)
        .json({ message: "Datos de entrada inválidos", errors: error.errors });
    }

    res.status(500).json({ message: "Error interno del servidor", error });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Usuario actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ error: "El ID proporcionado no es válido." });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    res.json({
      mensaje: "Usuario eliminado exitosamente",
      data: deletedUser,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
};
