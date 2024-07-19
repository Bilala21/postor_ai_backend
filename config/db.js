const { Sequelize } = require("sequelize");

const config = require("./config");
const { NODE_ENV } = require("../utils/constants");

const dbConnection = () => new Sequelize(config[NODE_ENV]);

module.exports = dbConnection;
