const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const users = mongoCollections.users;
const likes = mongoCollections.likes;
const { ObjectId } = require("mongodb");
const bcryptjs = require("bcryptjs");

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

async function getall() {
  const userCollection = await users();
  const animal = await userCollection.find({}).toArray();

  return animal;
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
  if (!firstname) throw "You must provide a name.";
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
  if (!password) throw "No password was given.";

  if (!validateEmail(emailId)) throw "Please Enter a valid Email I";
  const userCollection = await users();

  let hashedPass = bcryptjs.genSalt(15, salt => {
    bcryptjs.hash(password, salt, hash => {
      hashedPass = hash;
    });
  });

  let newUser = {
    firstname: firstname,
    lastname: lastname,
    emailId: emailId,
    gender: gender,
    city: city,
    password: hashedPass
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add User";

  const newId = insertInfo.insertedId.toString();

  const newusr = await get(newId);
  return newusr;
}

async function authenticate(emailId, password) {
  let count = 0;
  for (var res = 0; res < info.length; res++) {
    if (get[Id].username == username) {
      mongoCollections.findOne(emailId);
      let response = await bcryptjs.compare(password, get[Id].hashedPassword);
      // use a mongo DB generated hashed password
      if (response) {
        return res;
      }
    }
  }
  return -1;
}

async function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

module.exports = {
  validateEmail,
  get,
  create,
  authenticate,
  getall
};

async function main() {
  try {
    var ct = await create(
      "sanam",
      "Jena",
      "sanamsritam@gmail.com",
      "male",
      "Hoboken",
      "new Jersey",
      "IdontKnow"
    );
    console.log(ct);
  } catch (e) {
    console.log(e);
  }
}

main();
