const session = require("express-session");
const express = require("express");
const router = express.Router();
const loginRoute = require("./login");
const logoutRoute = require("./logout");

const constructorMethod = app => {
  app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true
    })
  );
  app.use(async function(req, response, next) {
    const auth = req.session.valid
      ? "(Authenticated User)"
      : "(Non-Authenticated User)";
    const responseString = `${new Date().toUTCString()}: ${req.method} ${
      req.originalUrl
    } ${auth}`;
    console.log(responseString);
    next();
  });

  //app.use("/private", privateRoute);
  app.use("/login", loginRoute);
  app.use("/logout", logoutRoute);
  app.use("/", loginRoute);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "NO SUCH PAGES FOUND" });
  });
};

module.exports = constructorMethod;
