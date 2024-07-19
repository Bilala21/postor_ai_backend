const router = require("express").Router();
const emailController = require("../controllers/email.controller");

router.post("/addEmail", emailController.addEmail);
router.get("/getAllEmails", emailController.getAllEmails);

module.exports = router;
