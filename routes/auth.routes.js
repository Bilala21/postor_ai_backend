const router = require("express").Router();
const passport = require("passport");
const controller = require("../controllers/auth.controller");
const authenticate = require("../middlewares/token-validator");

router.post("/signup", controller.signUp);
router.post("/login", controller.signIn);
router.post("/forgot-password", controller.initiatePasswordResetRequest);
router.post("/verify_otp", controller.verifyOtp);
router.post("/reset_password", controller.resetPassword);

router.get("/facebook", authenticate, passport.authenticate("facebook"));
router.get(
  "/facebook/callback",
  authenticate,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (_, res) => res.redirect("/")
);

router.get("/instagram", authenticate, passport.authenticate("instagram"));

router.get(
  "/instagram/callback",
  authenticate,
  passport.authenticate("instagram", { failureRedirect: "/login" }),
  (_, res) => res.redirect("/")
);

module.exports = router;
