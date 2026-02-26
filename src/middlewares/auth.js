const User = require("../api/models/users");
const { verificarLlave } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization;
            const parsedToken = token.replace("Bearer ", "");

            const { id } = verificarLlave(parsedToken);
            const user = await User.findById(id);
            if (!user) {
                return res.status(401).json("No autorizado");
            }
             user.password = null;
             req.user = user;
             next();
        } else if (!req.headers.authorization) {
            return res.status(401).json("No estás autorizado");
        }
    } catch (error) {
        return res.status(400).json("No estás autorizado")
    }
}

module.exports = { isAuth }