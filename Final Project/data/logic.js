const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const users = mongoCollections.users;
const likes = mongoCollections.likes;
const { ObjectId } = require("mongodb");
const bcryptjs = require("bcryptjs");
var SALT_WORK_FACTOR = 10;
mongoose.connect("mongodb://localhost/enctest");

async function get(Id) {
  if (!Id) throw "You must provide an id to search for";
  const userCollection = await users();

  var objId = 0;
  if (typeof Id == "string") {
    objId = ObjectId.createFromHexString(Id);
  } else {
    objId = Id;
  }
  const usr = await userCollection.findOne({ _id: objId });
  if (usr === null) throw "No Animals found";
  return usr;
}

async function create(
  firstname,
  lastname,
  emailId,
  gender,
  city,
  state,
  password
) {
  if (!firstname) throw "You must provide a name for your animal";
  if (
    Number.isInteger(firstname) ||
    Number.isInteger(lastname) ||
    Number.isInteger(gender) ||
    Number.isInteger(city) ||
    Number.isInteger(state)
  ) {
    throw "Please enter a valid input. Either the firstname, lastname, gender, city or state is of type number";
  }
  if (
    typeof firstname == "object" ||
    typeof lastname == "object" ||
    typeof gender == "object" ||
    typeof city == "object" ||
    typeof password == "object"
  ) {
    throw "Please enter a valid Input. Either the firstname, lastname, gender, city or state is of type Object";
  }
  if (!password) throw "No password was supplied";

  if (!validateEmail(emailId)) throw "Please Enter a valid Email I";
  const userCollection = await users();

  let hashedPass;
  bcryptjs.genSalt(15, salt => {
    bcryptjs.hash(password, salt, hash => {
      hashedPass = hash;
    });
  });

  let newUser = {
    firstname: firstname,
    lastname: lastname,
    emailId: emailId,
    gender: gender,
    city: city
  };
  hashedPass;
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add User";

  const newId = insertInfo.insertedId.toString();

  const newusr = await get(newId);
  return newusr;
}

async function checkCorrect(email, password) {
  var user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
}

async function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
