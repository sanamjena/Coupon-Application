let express = require("express");
let info = require("../data");
let router = express.Router();
let bcryptjs = require("bcryptjs");
let session = require("express-session");
let users = info.users;

router.get("/", async (req, res) => {
  try {
    if (req.session.userId) {
      return res.redirect("/login");
    } else {
      return res.render("pages/login", { title: "Login" });
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  let username = req.body.username;
  let pass = req.body.password;
  let flag;
  let passed;
  for (var i = 0; i < users.info.length; i++) {
    if (username == users.emailId) {
      mongoCollections.findOne(emailId);
      passed = await bcryptjs.compare(pass, emailId.hashedPassword);
      flag = i;
    }
  }
  if (passed) {
    req.session.user = users.info[flag];
    req.session.valid = true;
    req.session.setUser = users.info[flag]._id + 1;
    req.session.AuthCookie = req.sessionID;
    return res.status(200).redirect("../private");
  } else {
    res.status(401).render("pages/login", {
      error: "Invalid Username & Password combination"
    });
  }
});

module.exports = router;
