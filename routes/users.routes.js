const router = require("express").Router();
const controller = require("../controllers/users.controller");

router.patch("/:id", controller.updateUser);

module.exports = router;
