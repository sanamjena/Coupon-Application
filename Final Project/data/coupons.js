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

async function create(product) {
  if (!product) throw "No product was given.";
  if (typeof product !== "string") throw `${product} is not a string.`;
  const couponCollection = await coupons();
  //likes: an array of user ID's that have liked the coupon
  //dislikes: an array of user ID's that have disliked the coupon
  //rating: # of likes / # of likes + # of dislikes **RATING WILL BE DISPLAYED ON A SCALE FROM 0 - 10**
  //comments: an array of objects with fields of User ID and the comment itself
  let newCoupon = {
    product: product,
    likes: [],
    dislikes: [],
    rating: 0,
    comments: []
  };
  const insertInfo = await couponCollection.insertOne(newCoupon);
  if (insertInfo.insertedCount === 0)
    throw "The coupon was unable to be added.";
  const newId = insertInfo.insertedId;
  return await get(newId);
}

async function rating(coupon_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  const targetCoupon = await get(coupon_id);
  let rating =
    10 *
    (
      targetCoupon["likes"].length /
      (targetCoupon["likes"].length + targetCoupon["dislikes"].length)
    ).toFixed(1);
  const updatedInfo = await couponCollection.updateOne(
    { _id: coupon_id },
    { $set: { rating: rating } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return targetCoupon;
}

async function addLike(coupon_id, user_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  if (!user_id) throw "No user ID was given.";
  const couponCollection = await coupons();
  const updatedInfo = await couponCollection.insert(
    { _id: coupon_id },
    { $push: { likes: user_id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return await get(coupon_id);
}

async function addDislike(coupon_id, user_id) {
  if (!coupon_id) throw "No coupon ID was given.";
  if (!user_id) throw "No user ID was given.";
  const couponCollection = await coupons();
  const updatedInfo = await couponCollection.insert(
    { _id: coupon_id },
    { $push: { dislikes: user_id } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw "The coupon was unable to be updated.";
  return await get(coupon_id);
}

module.exports = {
  get,
  create,
  rating,
  addLike,
  addDislike
};
