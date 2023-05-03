const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const expressSession = require("express-session");

const app = express();

const port = process.env.PORT || 3000;

// TODO change <user:pass> to credentials attached
const dbUrl = `mongodb+srv://<user:pass>@prf-cluster.utwxpu3.mongodb.net/test`;

mongoose.connect(dbUrl);

mongoose.connection.on("connected", () => {
  console.log("mongo connected");
});

mongoose.connection.on("error", (error) => {
  console.log("mongo error: ", error);
});

require("./item.model");
require("./user.model");

const userModel = mongoose.model("user");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({}));

const whiteList = ["http://localhost:4200"];

app.use(
  cors({
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("CORS Error, address: " + origin));
      }
    },
  })
);

passport.use(
  "local",
  new localStrategy(function (username, password, done) {
    userModel
      .findOne({ username: username })
      .then(function (user) {
        if (!user) return done("User not found", null);

        user.comparePasswords(password, function (error, isMatch) {
          if (error) return done(error, false);

          if (!isMatch) return done("Password not matching", false);

          return done(null, user);
        });
      })
      .catch((e) => {
        return done("Error querying user", null);
      });
  })
);

passport.serializeUser(function (user, done) {
  if (!user) return done("Login failed", null);
  return done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (!user) return done("Login failed", null);

  return done(null, user);
});

app.use(expressSession({ secret: "prf2023", resave: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  res.send({ message: "Hello World" });
});

app.use("/", require("./routes"));
app.use("/secondary", require("./routes"));

app.use((req, res, next) => {
  console.log("This error handler runs as last resort");
  res.status(404).send("The requested resource cannot be found");
});

app.listen(3000, () => {
  console.log("The server is running");
});
