const router = require("express").Router();
const authenticate = require("../middlewares/token-validator");
const email = require("./email.routes");
const auth = require("./auth.routes");
const post = require("./post.routes");
const users = require("./users.routes");

router.use("/emails", authenticate, email);
router.use("/posts", authenticate, post);
router.use("/users", authenticate, users);
router.use("/auth", auth);

module.exports = router;
