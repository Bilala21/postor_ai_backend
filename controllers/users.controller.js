const { api } = require("../utils/helpers");
const { User } = require("../models");

/**
 * PATCH /:id Update User
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function updateUser(req, res) {
  return api(res, async () => {
    const user = await User.findOne({
      where: { id: req.params.id },
      attributes: { exclude: ["password", "created_at", "updated_at"] },
      raw: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user exists with this account" });
    }
    await User.update(req.body, {
      where: { id: req.params.id },
    });
    return res.json({
      success: true,
      data: { ...user, ...req.body },
    });
  });
}

module.exports = {
  updateUser,
};
