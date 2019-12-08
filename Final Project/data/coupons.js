const mongoCollections = require("../config/mongoCollections");
const MongoClient = require("mongodb").MongoClient;
const coupons = mongoCollections.coupons;
const users = mongoCollections.users;
const { ObjectId } = require(mongodb);

async function get(id) {
  if (!id) throw "No ID was given.";
  const couponCollection = await coupons();
  const target_coupon = await couponCollection.findOne({ _id: id });
  if (target_coupon === null) throw `There's no coupon with the ID: ${id}.`;
  return target_coupon;
}

async function create(likes ) {
  if (!name) throw "No name was given.";
  if (typeof name !== "string") throw `${name} is not a string.`;
  if (!animalType) throw "No animal type was given.";
  if (typeof animalType !== "string") throw `${animalType} is not a string.`;
  const animalCollection = await animals();
  let newAnimal = {
    name: name,
    animalType: animalType,
    likes: [],
    posts: []
  };
  const insertInfo = await animalCollection.insertOne(newAnimal);
  if (insertInfo.insertedCount === 0)
    throw "The animal was unable to be added.";
  const newId = insertInfo.insertedId;
  return await get(newId);
}
