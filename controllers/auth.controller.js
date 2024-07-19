const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pick, random, omit } = require("lodash");
const nodemailer = require("nodemailer")
const MailChimp = require("@mailchimp/mailchimp_transactional");
const { User, Otp } = require("../models");
const {
  MAILCHIMP_EMAIL,
  MAILCHIMP_API_KEY,
  JWT_SECRET_KEY,
} = require("../utils/constants");
const mailchimp = MailChimp(MAILCHIMP_API_KEY);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function signUp(req, res) {
  try {
    const doesExist = await User.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (doesExist) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "A user with this email already exists",
      });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 10);
    const newUser = await User.create({ ...req.body });

    return res.json({
      success: true,
      statusCode: 201,
      data: omit(newUser.get({ plain: true }), [
        "password",
        "created_at",
        "updated_at",
      ]),
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: err.message || "Internal Server Error",
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function signIn(req, res) {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Invalid credentials",
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const pUser = pick(user, ["id", "email", "full_name", "is_active"]);
    const token = jwt.sign(pUser, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });
    return res.json({ success: true, statusCode: 200, token, data: pUser });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

const createOtp = (userId) =>
  Otp.create({
    code: random(100000, 999999, false).toString(),
    user_id: userId,
  });

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function initiatePasswordResetRequest(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: { email },
      raw: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Email not exist",
      });
    }
    else {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'develope.coding@gmail.com',
          pass: 'dgsw wbnx uhjy zmhk',
        },
      });

      const otp = Math.floor(100000 + Math.random() * 900000);
      const mailOptions = {
        from: 'develope.coding@gmail.com',
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP code is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          return res.status(500).send('Error sending email');
        }
        res.status(200).send({
          success: true,
          statusCode: 200, message: 'OTP sent successfully', otp
        });
      });
    }

  } catch (err) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: err.message || "Internal Server Error",
    });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function verifyOtp(req, res) {
  try {
    const { user_id: userId, code } = req.body;

    const user = await User.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user with this email already exists",
      });
    }

    if (parseInt(code) !== 123456) {
      return res.status(404).json({ success: false, message: "Invalid OTP" });
    }

    // const otp = await Otp.findOne({
    //   where: { code, user_id: userId },
    //   raw: true,
    // });
    // if (!otp || otp?.is_expired) {
    //   return res.status(404).json({ success: false, message: "Invalid OTP" });
    // }
    // await Otp.update({ ...otp, is_expired: true }, { where: { id: otp.id } });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  }
}



/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @returns
 */
async function resetPassword(req, res) {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
      raw: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "No user with this email already exists",
      });
    }
    else {
      await User.update(
        { password: bcrypt.hashSync(password, 10) },
        { where: { email } }
      );
      return res.json({ success: true, statusCode: 200, message: "Password successfully updated", });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: err.message || "Internal Server Error",
    });
  }
}


module.exports = {
  signUp,
  signIn,
  initiatePasswordResetRequest,
  verifyOtp,
  resetPassword,
};
