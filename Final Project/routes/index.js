const session = require("express-session");
const express = require("express");
const router = express.Router();
const loginRoute = require("./login");
const logoutRoute = require("./logout");
const home = require("./home");
const contactform = require("./contactform");
const walgreens = require("./walgreens");
const contact = require("./contact");
const testing = require("./testing");
const category = require("./category");
const macys = require("./macys");

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
  app.use("/", testing);
  app.use("/login", loginRoute);
  app.use("/logout", logoutRoute);
  app.use("/contactus", contactform);
  app.use("/walgreens", walgreens);
  app.use("/contact", contact);
  app.use("/category", category);
  app.use("/macys", macys);

  // app.use("/contact", contact);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "NO SUCH PAGES FOUND" });
  });
};

module.exports = constructorMethod;
