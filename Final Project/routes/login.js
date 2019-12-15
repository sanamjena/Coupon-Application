let express = require("express");
let info = require("../data/logic");
let router = express.Router();
let bcryptjs = require("bcryptjs");
let session = require("express-session");
let user = info.getall;

// router.get("/", async(req, res) => {
//     // try {
//     //     if (req.session.userId) {
//     //         return res.redirect("/login");
//     //     } else {
//     //         return res.render("pages/index", { title: "Login" });
//     //     }
//     // } catch (e) {
//     //     res.status(404).json({ error: e.message });
//     // }
// });
router.get("/", async(req, res) => {
    res.render("pages/login");
});

router.getAll(id) {
  if (!id) throw "You must provide an id to search for";
  const animalCollection = await animals();
  const all_animals = await animalCollection.find({}).toArray();

  if (all_animals === null) throw "None found";

  // return animal;
  console.log(all_animals);
}


router.post("/login", async(req, res) => {
    //console.log(req.body.username);

    let username = req.body.username;
    let pass = req.body.password;
    let flag;
    let passed;
    for (var i = 0; i < user.length; i++) {
        if (username === user.emailId) {
            info.authenticate(username, pass);
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