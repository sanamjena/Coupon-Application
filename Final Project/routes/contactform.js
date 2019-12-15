const express = require("express");
const router = express.Router();
const session = require("express-session");

router.get("/", async (req, res) => {
  res.render("pages/contactform");
});

module.exports = router;
