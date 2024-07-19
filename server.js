require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const { print } = require("./utils/helpers");
const dbConnection = require("./config/db");
require("./config/passport-config");
const router = require("./routes");
const {
  PORT,
  SESSION_SECRET = "your_random_session_secret",
} = require("./utils/constants");

const establishDBConnection = async () => {
  try {
    await dbConnection().authenticate();
    print("Database Connection has been established successfully.");
  } catch (err) {
    print("ERR", err);
  }
};

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

establishDBConnection();

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
