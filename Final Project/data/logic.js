const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const users = mongoCollections.users;
const likes = mongoCollections.likes;
const { ObjectId } = require("mongodb");

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

async function create(firstname, lastname, emailId, gender, city, state) {
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
    typeof emailId == "object" ||
    typeof gender == "object" ||
    typeof city == "object"
  ) {
    throw "Please enter a valid Input. Either the firstname, lastname, gender, city or state is of type Object";
  }

  const userCollection = await users();

  let newUser = {
    firstname: firstname,
    lastname: lastname,
    emailId: emailId,
    gender: gender,
    city: city
  };

  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add User";

  const newId = insertInfo.insertedId.toString();

  const newusr = await get(newId);
  return newusr;
}
