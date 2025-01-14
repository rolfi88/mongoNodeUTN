const jwt = require('jsonwebtoken');
require ("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authValidator = (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Recurso privado, añade el token." });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        console.error("Error al validar el token:", error);
        return res.status(403).json({ message: "Token inválido o expirado." });
    }
};

module.exports ={authValidator};