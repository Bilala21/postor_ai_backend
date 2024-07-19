require("dotenv/config");
const jwt = require("jsonwebtoken");

const { User } = require("../models");
const { handleErrorResponse } = require("../utils/helpers");
const { JWT_SECRET_KEY } = require("../utils/constants");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
module.exports = async (req, res, next) => {
  try {
    const tokenString = req.header("Authorization");
    if (!tokenString) {
      return handleErrorResponse(res, 401, "Authorization required");
    }

    const token = tokenString.split(" ")[1];
    if (!token) return handleErrorResponse(res, 401, "Unauthorized Access");

    const tokenUser = jwt.verify(token, JWT_SECRET_KEY);
    if (!tokenUser) return handleErrorResponse(res, 401, "Unauthorized Access");

    const user = await User.findOne({
      where: { id: tokenUser.id },
      raw: true,
    });
    if (!user)
      return handleErrorResponse(res, 401, "This User has been deleted");

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: err.message, success: false });
  }
};
