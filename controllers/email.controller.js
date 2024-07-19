const db = require("../models");
const Email = db.Email;

const addEmail = async (req, res) => {
  let info = {
    email: req.body.email,
  };

  const email = await Email.create(info);
  res.status(200).send(email);
};

const getAllEmails = async (req, res) => {
  let emails = await Email.findAll({});
  res.status(200).send(emails);
};

module.exports = {
  addEmail,
  getAllEmails,
};
