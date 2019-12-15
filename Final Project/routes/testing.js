const express = require("express");
const router = express.Router();
const session = require("express-session");

router.get("/", async (req, res) => {
  res.render("pages/testing");
});

module.exports = router;
